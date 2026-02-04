"""
DoppelDown ML Client Integration
Provides easy integration with the doppeldown Next.js application.
"""

import requests
import json
from typing import List, Dict, Optional
from dataclasses import dataclass
import os

@dataclass
class ThreatScore:
    """Threat scoring result."""
    domain: str
    brand_name: str
    threat_score: float
    risk_level: str
    is_threat: bool
    confidence: float
    detected_techniques: List[str]
    recommendations: List[str]


class DoppelDownMLClient:
    """Client for integrating ML threat detection with doppeldown."""
    
    def __init__(self, api_url: str = None, api_key: str = None):
        self.api_url = api_url or os.environ.get("ML_API_URL", "http://localhost:8000")
        self.api_key = api_key or os.environ.get("ML_API_KEY")
        self.session = requests.Session()
        
        if self.api_key:
            self.session.headers.update({"Authorization": f"Bearer {self.api_key}"})
    
    def health_check(self) -> Dict:
        """Check if ML API is healthy."""
        try:
            response = self.session.get(f"{self.api_url}/health")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def score_domain(self, domain: str, brand_name: str) -> Optional[ThreatScore]:
        """Score a domain for brand impersonation."""
        try:
            response = self.session.post(
                f"{self.api_url}/score/domain",
                json={"domain": domain, "brand_name": brand_name}
            )
            response.raise_for_status()
            data = response.json()
            return ThreatScore(**data)
        except Exception as e:
            print(f"Error scoring domain: {e}")
            return None
    
    def score_social_profile(self, username: str, platform: str, 
                            brand_name: str) -> Optional[ThreatScore]:
        """Score a social media profile for brand impersonation."""
        try:
            response = self.session.post(
                f"{self.api_url}/score/social",
                json={
                    "username": username,
                    "platform": platform,
                    "brand_name": brand_name
                }
            )
            response.raise_for_status()
            data = response.json()
            return ThreatScore(**data)
        except Exception as e:
            print(f"Error scoring social profile: {e}")
            return None
    
    def score_domains_batch(self, domains: List[str], 
                           brand_name: str) -> List[ThreatScore]:
        """Score multiple domains in batch."""
        try:
            response = self.session.post(
                f"{self.api_url}/score/domain/batch",
                json={"domains": domains, "brand_name": brand_name}
            )
            response.raise_for_status()
            data = response.json()
            return [ThreatScore(**r) for r in data["results"]]
        except Exception as e:
            print(f"Error in batch scoring: {e}")
            return []
    
    def score_social_batch(self, profiles: List[Dict], 
                          brand_name: str) -> List[ThreatScore]:
        """Score multiple social profiles in batch."""
        try:
            response = self.session.post(
                f"{self.api_url}/score/social/batch",
                json={"profiles": profiles, "brand_name": brand_name}
            )
            response.raise_for_status()
            data = response.json()
            return [ThreatScore(**r) for r in data["results"]]
        except Exception as e:
            print(f"Error in batch social scoring: {e}")
            return []


# Integration helpers for doppeldown

class DoppelDownIntegration:
    """Helpers for integrating ML scoring into doppeldown scans."""
    
    def __init__(self, ml_client: DoppelDownMLClient = None):
        self.ml_client = ml_client or DoppelDownMLClient()
    
    def enhance_domain_scan(self, domains: List[str], brand_name: str) -> Dict:
        """
        Enhance domain scan results with ML threat scoring.
        
        Returns dict with:
        - ml_scores: List of ThreatScore objects
        - high_risk_domains: Domains with high threat scores
        - summary: Statistics about the scan
        """
        scores = self.ml_client.score_domains_batch(domains, brand_name)
        
        high_risk = [s for s in scores if s.is_threat]
        critical = [s for s in scores if s.risk_level == "critical"]
        
        return {
            "ml_scores": scores,
            "high_risk_domains": high_risk,
            "critical_threats": critical,
            "summary": {
                "total_scanned": len(scores),
                "threats_detected": len(high_risk),
                "critical_threats": len(critical),
                "avg_threat_score": sum(s.threat_score for s in scores) / len(scores) if scores else 0
            }
        }
    
    def enhance_social_scan(self, profiles: List[Dict], brand_name: str) -> Dict:
        """
        Enhance social media scan with ML threat scoring.
        
        profiles should be list of dicts with 'username' and 'platform' keys.
        """
        scores = self.ml_client.score_social_batch(profiles, brand_name)
        
        high_risk = [s for s in scores if s.is_threat]
        
        return {
            "ml_scores": scores,
            "high_risk_profiles": high_risk,
            "summary": {
                "total_scanned": len(scores),
                "threats_detected": len(high_risk),
                "avg_threat_score": sum(s.threat_score for s in scores) / len(scores) if scores else 0
            }
        }
    
    def generate_ml_report(self, domain_scores: List[ThreatScore],
                          social_scores: List[ThreatScore] = None) -> Dict:
        """Generate a comprehensive ML-based threat report."""
        report = {
            "generated_at": datetime.now().isoformat(),
            "domain_analysis": self._analyze_scores(domain_scores),
            "top_threats": sorted(
                domain_scores, 
                key=lambda x: x.threat_score, 
                reverse=True
            )[:10],
            "techniques_detected": self._aggregate_techniques(domain_scores),
            "recommendations": self._generate_recommendations(domain_scores)
        }
        
        if social_scores:
            report["social_analysis"] = self._analyze_scores(social_scores)
            report["social_techniques"] = self._aggregate_techniques(social_scores)
        
        return report
    
    def _analyze_scores(self, scores: List[ThreatScore]) -> Dict:
        """Analyze a list of threat scores."""
        if not scores:
            return {}
        
        risk_levels = {}
        for s in scores:
            risk_levels[s.risk_level] = risk_levels.get(s.risk_level, 0) + 1
        
        return {
            "total": len(scores),
            "threats": sum(1 for s in scores if s.is_threat),
            "risk_distribution": risk_levels,
            "avg_score": sum(s.threat_score for s in scores) / len(scores),
            "max_score": max(s.threat_score for s in scores),
            "min_score": min(s.threat_score for s in scores)
        }
    
    def _aggregate_techniques(self, scores: List[ThreatScore]) -> Dict[str, int]:
        """Aggregate detected techniques across all scores."""
        techniques = {}
        for s in scores:
            for t in s.detected_techniques:
                techniques[t] = techniques.get(t, 0) + 1
        return techniques
    
    def _generate_recommendations(self, scores: List[ThreatScore]) -> List[str]:
        """Generate overall recommendations based on threat analysis."""
        recommendations = []
        
        critical = [s for s in scores if s.risk_level == "critical"]
        high = [s for s in scores if s.risk_level == "high"]
        
        if critical:
            recommendations.append(
                f"URGENT: {len(critical)} critical threats detected requiring immediate action"
            )
        
        if high:
            recommendations.append(
                f"HIGH PRIORITY: {len(high)} high-risk domains identified for takedown"
            )
        
        # Check for specific techniques
        all_techniques = set()
        for s in scores:
            all_techniques.update(s.detected_techniques)
        
        if 'homoglyph' in all_techniques:
            recommendations.append(
                "Homoglyph attacks detected - users should be warned about visual spoofing"
            )
        
        if 'suspicious_tld' in all_techniques:
            recommendations.append(
                "Multiple suspicious TLDs detected - consider defensive domain registration"
            )
        
        return recommendations


# Example usage
if __name__ == "__main__":
    # Initialize client
    client = DoppelDownMLClient()
    
    # Check health
    health = client.health_check()
    print(f"ML API Health: {health}")
    
    # Score a domain
    result = client.score_domain("g00gle-security.com", "google")
    if result:
        print(f"\nDomain Score:")
        print(f"  Threat Score: {result.threat_score}")
        print(f"  Risk Level: {result.risk_level}")
        print(f"  Recommendations: {result.recommendations}")
    
    # Batch score domains
    domains = [
        "google.com",
        "g00gle.com",
        "google-security.com",
        "googIe.com",
        "secure-google-login.com"
    ]
    
    print("\n=== Batch Domain Scoring ===")
    results = client.score_domains_batch(domains, "google")
    for r in results:
        print(f"{r.domain}: {r.risk_level} ({r.threat_score:.3f})")
