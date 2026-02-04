"""
NLP Integration Module for DoppelDown
Integrates advanced NLP threat detection with existing ML pipeline.
"""

import numpy as np
from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass
import logging

# Import existing ML components
from threat_detection_model import ThreatDetectionModel, DetectionResult
from realtime_scorer import RealTimeThreatScorer, RealTimeScore

# Import new NLP components
from nlp_analyzer import NLPAnalyzer, analyze_text
from contextual_threat_scorer import (
    ContextualThreatScorer, 
    ContextualThreatAssessment,
    score_domain_threat,
    score_email_threat
)
from brand_impersonation_nlp import (
    BrandImpersonationDetector,
    BrandImpersonationResult,
    detect_impersonation
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class IntegratedThreatResult:
    """Combined threat detection result from ML and NLP."""
    # Source information
    source: str
    source_type: str  # domain, email, social, webpage
    brand_name: str
    
    # Combined scores
    overall_threat_score: float
    ml_threat_score: float
    nlp_threat_score: float
    contextual_threat_score: float
    impersonation_score: float
    
    # Analysis results
    ml_result: Optional[DetectionResult]
    nlp_analysis: Optional[Dict[str, Any]]
    contextual_assessment: Optional[ContextualThreatAssessment]
    impersonation_result: Optional[BrandImpersonationResult]
    
    # Combined indicators
    threat_categories: List[str]
    detected_techniques: List[str]
    risk_level: str
    confidence: float
    
    # Recommendations
    recommended_actions: List[str]
    monitoring_priority: str
    
    # Metadata
    processing_time_ms: float
    model_versions: Dict[str, str]


class NLPIntegratedThreatDetector:
    """
    Integrated threat detector combining ML, NLP, and contextual analysis.
    
    This class provides a unified interface for threat detection that leverages:
    1. Traditional ML models (autoencoder, isolation forest)
    2. Advanced NLP analysis (entities, sentiment, linguistics)
    3. Contextual threat scoring
    4. Brand impersonation detection
    """
    
    # Score combination weights
    SCORE_WEIGHTS = {
        'ml': 0.30,
        'nlp': 0.25,
        'contextual': 0.25,
        'impersonation': 0.20
    }
    
    def __init__(
        self,
        ml_model_path: Optional[str] = None,
        enable_nlp: bool = True,
        enable_contextual: bool = True,
        enable_impersonation: bool = True,
        spacy_model: str = "en_core_web_sm"
    ):
        """
        Initialize integrated threat detector.
        
        Args:
            ml_model_path: Path to trained ML models
            enable_nlp: Enable NLP analysis
            enable_contextual: Enable contextual scoring
            enable_impersonation: Enable brand impersonation detection
            spacy_model: spaCy model name
        """
        self.enable_nlp = enable_nlp
        self.enable_contextual = enable_contextual
        self.enable_impersonation = enable_impersonation
        
        # Initialize ML scorer
        self.ml_scorer = RealTimeThreatScorer(model_path=ml_model_path)
        
        # Initialize NLP components
        self.nlp_analyzer = None
        self.contextual_scorer = None
        self.impersonation_detector = None
        
        if enable_nlp:
            try:
                self.nlp_analyzer = NLPAnalyzer(spacy_model=spacy_model)
                logger.info("NLP Analyzer initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize NLP Analyzer: {e}")
                self.enable_nlp = False
        
        if enable_contextual:
            try:
                self.contextual_scorer = ContextualThreatScorer()
                logger.info("Contextual Threat Scorer initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Contextual Scorer: {e}")
                self.enable_contextual = False
        
        if enable_impersonation:
            try:
                self.impersonation_detector = BrandImpersonationDetector()
                logger.info("Brand Impersonation Detector initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Impersonation Detector: {e}")
                self.enable_impersonation = False
        
        logger.info("NLP Integrated Threat Detector initialized")
    
    def detect_domain_threat(
        self,
        domain: str,
        brand_name: str,
        page_content: Optional[str] = None,
        page_title: Optional[str] = None,
        historical_data: Optional[Dict] = None
    ) -> IntegratedThreatResult:
        """
        Detect threat in domain with full NLP analysis.
        
        Args:
            domain: Domain to analyze
            brand_name: Brand being protected
            page_content: HTML/text content of page
            page_title: Page title
            historical_data: Historical detection data
            
        Returns:
            IntegratedThreatResult with combined analysis
        """
        import time
        start_time = time.time()
        
        # Step 1: ML-based scoring
        ml_score = self.ml_scorer.score_domain(domain, brand_name)
        ml_threat_score = ml_score.threat_score
        
        # Step 2: NLP Analysis
        nlp_analysis = None
        nlp_threat_score = 0.0
        if self.enable_nlp and page_content:
            try:
                nlp_analysis = self.nlp_analyzer.analyze_webpage_content(
                    page_title or "",
                    page_content,
                    "",
                    [brand_name]
                )
                nlp_threat_score = nlp_analysis.get('impersonation_score', 0.0)
            except Exception as e:
                logger.warning(f"NLP analysis failed: {e}")
        
        # Step 3: Contextual Scoring
        contextual_assessment = None
        contextual_threat_score = 0.0
        if self.enable_contextual:
            try:
                contextual_assessment = self.contextual_scorer.score_domain_threat(
                    domain=domain,
                    brand_name=brand_name,
                    base_threat_score=ml_threat_score,
                    page_content=page_content,
                    page_title=page_title,
                    historical_data=historical_data
                )
                contextual_threat_score = contextual_assessment.overall_score
            except Exception as e:
                logger.warning(f"Contextual scoring failed: {e}")
        
        # Step 4: Impersonation Detection
        impersonation_result = None
        impersonation_score = 0.0
        if self.enable_impersonation:
            try:
                impersonation_result = self.impersonation_detector.detect(
                    text=domain,
                    brand_name=brand_name,
                    content_type="domain",
                    brand_voice_samples=None
                )
                impersonation_score = impersonation_result.risk_score
            except Exception as e:
                logger.warning(f"Impersonation detection failed: {e}")
        
        # Step 5: Combine scores
        overall_score = self._combine_scores(
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score
        )
        
        # Step 6: Extract combined indicators
        threat_categories = self._extract_threat_categories(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        detected_techniques = self._extract_detected_techniques(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        # Step 7: Determine risk level
        risk_level = self._determine_risk_level(overall_score, detected_techniques)
        
        # Step 8: Generate recommendations
        recommendations = self._generate_recommendations(
            domain, brand_name, risk_level, threat_categories, detected_techniques
        )
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        return IntegratedThreatResult(
            source=domain,
            source_type="domain",
            brand_name=brand_name,
            overall_threat_score=overall_score,
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score,
            ml_result=ml_score,
            nlp_analysis=nlp_analysis,
            contextual_assessment=contextual_assessment,
            impersonation_result=impersonation_result,
            threat_categories=threat_categories,
            detected_techniques=detected_techniques,
            risk_level=risk_level,
            confidence=self._calculate_confidence(ml_score, nlp_analysis, impersonation_result),
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(risk_level),
            processing_time_ms=processing_time,
            model_versions={
                'ml': '1.0.0',
                'nlp': '2.0.0',
                'contextual': '2.0.0',
                'impersonation': '1.0.0'
            }
        )
    
    def detect_email_threat(
        self,
        subject: str,
        body: str,
        sender: str,
        brand_name: str,
        headers: Optional[Dict] = None
    ) -> IntegratedThreatResult:
        """
        Detect threat in email with full NLP analysis.
        
        Args:
            subject: Email subject
            body: Email body
            sender: Sender email address
            brand_name: Brand being protected
            headers: Email headers
            
        Returns:
            IntegratedThreatResult with combined analysis
        """
        import time
        start_time = time.time()
        
        # Step 1: ML-based scoring (using sender domain)
        sender_domain = sender.split('@')[1] if '@' in sender else sender
        ml_score = self.ml_scorer.score_domain(sender_domain, brand_name)
        ml_threat_score = ml_score.threat_score
        
        # Step 2: NLP Analysis
        nlp_analysis = None
        nlp_threat_score = 0.0
        if self.enable_nlp:
            try:
                nlp_analysis = self.nlp_analyzer.analyze_email(
                    subject, body, sender, [brand_name]
                )
                # Use threat assessment from email analysis
                threat_assessment = nlp_analysis.get('threat_assessment', {})
                nlp_threat_score = threat_assessment.get('threat_score', 0.0)
            except Exception as e:
                logger.warning(f"NLP analysis failed: {e}")
        
        # Step 3: Contextual Scoring
        contextual_assessment = None
        contextual_threat_score = 0.0
        if self.enable_contextual:
            try:
                contextual_assessment = self.contextual_scorer.score_email_threat(
                    subject=subject,
                    body=body,
                    sender=sender,
                    brand_name=brand_name,
                    base_threat_score=ml_threat_score,
                    headers=headers
                )
                contextual_threat_score = contextual_assessment.overall_score
            except Exception as e:
                logger.warning(f"Contextual scoring failed: {e}")
        
        # Step 4: Impersonation Detection
        impersonation_result = None
        impersonation_score = 0.0
        if self.enable_impersonation:
            try:
                # Analyze sender
                impersonation_result = self.impersonation_detector.detect(
                    text=sender,
                    brand_name=brand_name,
                    content_type="email"
                )
                impersonation_score = impersonation_result.risk_score
                
                # Also analyze content
                content_result = self.impersonation_detector.detect(
                    text=f"{subject}\n{body[:1000]}",
                    brand_name=brand_name,
                    content_type="email"
                )
                impersonation_score = max(impersonation_score, content_result.risk_score)
            except Exception as e:
                logger.warning(f"Impersonation detection failed: {e}")
        
        # Step 5-8: Combine and generate results (same as domain detection)
        overall_score = self._combine_scores(
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score
        )
        
        threat_categories = self._extract_threat_categories(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        detected_techniques = self._extract_detected_techniques(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        risk_level = self._determine_risk_level(overall_score, detected_techniques)
        
        recommendations = self._generate_recommendations(
            sender, brand_name, risk_level, threat_categories, detected_techniques
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        return IntegratedThreatResult(
            source=sender,
            source_type="email",
            brand_name=brand_name,
            overall_threat_score=overall_score,
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score,
            ml_result=ml_score,
            nlp_analysis=nlp_analysis,
            contextual_assessment=contextual_assessment,
            impersonation_result=impersonation_result,
            threat_categories=threat_categories,
            detected_techniques=detected_techniques,
            risk_level=risk_level,
            confidence=self._calculate_confidence(ml_score, nlp_analysis, impersonation_result),
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(risk_level),
            processing_time_ms=processing_time,
            model_versions={
                'ml': '1.0.0',
                'nlp': '2.0.0',
                'contextual': '2.0.0',
                'impersonation': '1.0.0'
            }
        )
    
    def detect_social_threat(
        self,
        username: str,
        platform: str,
        content: str,
        brand_name: str,
        profile_data: Optional[Dict] = None
    ) -> IntegratedThreatResult:
        """
        Detect threat in social media profile/content.
        
        Args:
            username: Social media username
            platform: Platform name
            content: Post/content text
            brand_name: Brand being protected
            profile_data: Additional profile information
            
        Returns:
            IntegratedThreatResult with combined analysis
        """
        import time
        start_time = time.time()
        
        # Step 1: ML-based scoring
        ml_score = self.ml_scorer.score_social_profile(username, platform, brand_name)
        ml_threat_score = ml_score.threat_score
        
        # Step 2: NLP Analysis
        nlp_analysis = None
        nlp_threat_score = 0.0
        if self.enable_nlp and content:
            try:
                nlp_analysis = self.nlp_analyzer.analyze_text(content, [brand_name])
                nlp_threat_score = nlp_analysis.get('summary', {}).get('risk_level') == 'high' and 0.8 or 0.3
            except Exception as e:
                logger.warning(f"NLP analysis failed: {e}")
        
        # Step 3: Contextual Scoring
        contextual_assessment = None
        contextual_threat_score = 0.0
        if self.enable_contextual:
            try:
                contextual_assessment = self.contextual_scorer.score_social_media_threat(
                    username=username,
                    platform=platform,
                    content=content,
                    brand_name=brand_name,
                    base_threat_score=ml_threat_score,
                    profile_data=profile_data
                )
                contextual_threat_score = contextual_assessment.overall_score
            except Exception as e:
                logger.warning(f"Contextual scoring failed: {e}")
        
        # Step 4: Impersonation Detection
        impersonation_result = None
        impersonation_score = 0.0
        if self.enable_impersonation:
            try:
                impersonation_result = self.impersonation_detector.detect(
                    text=username,
                    brand_name=brand_name,
                    content_type="social"
                )
                impersonation_score = impersonation_result.risk_score
            except Exception as e:
                logger.warning(f"Impersonation detection failed: {e}")
        
        # Combine and generate results
        overall_score = self._combine_scores(
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score
        )
        
        threat_categories = self._extract_threat_categories(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        detected_techniques = self._extract_detected_techniques(
            ml_score, nlp_analysis, contextual_assessment, impersonation_result
        )
        
        risk_level = self._determine_risk_level(overall_score, detected_techniques)
        
        recommendations = self._generate_recommendations(
            f"{platform}:@{username}", brand_name, risk_level, threat_categories, detected_techniques
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        return IntegratedThreatResult(
            source=f"{platform}:@{username}",
            source_type="social",
            brand_name=brand_name,
            overall_threat_score=overall_score,
            ml_threat_score=ml_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_threat_score=contextual_threat_score,
            impersonation_score=impersonation_score,
            ml_result=ml_score,
            nlp_analysis=nlp_analysis,
            contextual_assessment=contextual_assessment,
            impersonation_result=impersonation_result,
            threat_categories=threat_categories,
            detected_techniques=detected_techniques,
            risk_level=risk_level,
            confidence=self._calculate_confidence(ml_score, nlp_analysis, impersonation_result),
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(risk_level),
            processing_time_ms=processing_time,
            model_versions={
                'ml': '1.0.0',
                'nlp': '2.0.0',
                'contextual': '2.0.0',
                'impersonation': '1.0.0'
            }
        )
    
    def _combine_scores(
        self,
        ml_threat_score: float,
        nlp_threat_score: float,
        contextual_threat_score: float,
        impersonation_score: float
    ) -> float:
        """Combine individual threat scores."""
        scores = {
            'ml': ml_threat_score,
            'nlp': nlp_threat_score,
            'contextual': contextual_threat_score,
            'impersonation': impersonation_score
        }
        
        # Weighted combination
        combined = sum(
            scores[key] * self.SCORE_WEIGHTS[key]
            for key in scores
        )
        
        # Boost score if multiple indicators agree
        high_score_count = sum(1 for s in scores.values() if s > 0.7)
        if high_score_count >= 2:
            combined = min(combined * 1.1, 1.0)
        
        return combined
    
    def _extract_threat_categories(
        self,
        ml_result: RealTimeScore,
        nlp_analysis: Optional[Dict],
        contextual_assessment: Optional[ContextualThreatAssessment],
        impersonation_result: Optional[BrandImpersonationResult]
    ) -> List[str]:
        """Extract threat categories from all analyses."""
        categories = set()
        
        # From ML result
        if ml_result and ml_result.is_threat:
            categories.add('ml_anomaly')
        
        # From NLP analysis
        if nlp_analysis:
            risk_factors = nlp_analysis.get('summary', {}).get('risk_factors', [])
            categories.update(risk_factors)
        
        # From contextual assessment
        if contextual_assessment:
            for category, score in contextual_assessment.category_scores.items():
                if score > 0.5:
                    categories.add(category.value)
        
        # From impersonation result
        if impersonation_result and impersonation_result.is_impersonation:
            categories.add('brand_impersonation')
        
        return list(categories)
    
    def _extract_detected_techniques(
        self,
        ml_result: RealTimeScore,
        nlp_analysis: Optional[Dict],
        contextual_assessment: Optional[ContextualThreatAssessment],
        impersonation_result: Optional[BrandImpersonationResult]
    ) -> List[str]:
        """Extract detected techniques from all analyses."""
        techniques = []
        
        # From ML result
        if ml_result and ml_result.detected_techniques:
            techniques.extend(ml_result.detected_techniques)
        
        # From impersonation result
        if impersonation_result and impersonation_result.detected_techniques:
            for tech in impersonation_result.detected_techniques:
                techniques.append(tech.technique.value)
        
        # From contextual assessment
        if contextual_assessment:
            for indicator in contextual_assessment.indicators:
                techniques.append(indicator.indicator_type)
        
        return list(set(techniques))
    
    def _determine_risk_level(
        self, 
        overall_score: float, 
        detected_techniques: List[str]
    ) -> str:
        """Determine risk level from score and techniques."""
        critical_techniques = ['homograph', 'homoglyph', 'spoofed_sender']
        
        if overall_score >= 0.90 or any(t in critical_techniques for t in detected_techniques):
            return "critical"
        elif overall_score >= 0.75:
            return "high"
        elif overall_score >= 0.50:
            return "medium"
        elif overall_score >= 0.25:
            return "low"
        else:
            return "minimal"
    
    def _calculate_confidence(
        self,
        ml_result: RealTimeScore,
        nlp_analysis: Optional[Dict],
        impersonation_result: Optional[BrandImpersonationResult]
    ) -> float:
        """Calculate overall confidence."""
        confidences = []
        
        if ml_result:
            confidences.append(ml_result.confidence)
        
        if nlp_analysis:
            sentiment_conf = nlp_analysis.get('sentiment', {}).get('confidence', 0.5)
            confidences.append(sentiment_conf)
        
        if impersonation_result:
            confidences.append(impersonation_result.overall_confidence)
        
        if not confidences:
            return 0.5
        
        return sum(confidences) / len(confidences)
    
    def _generate_recommendations(
        self,
        source: str,
        brand_name: str,
        risk_level: str,
        threat_categories: List[str],
        detected_techniques: List[str]
    ) -> List[str]:
        """Generate recommendations based on analysis."""
        recommendations = []
        
        if risk_level == "critical":
            recommendations.append(
                f"CRITICAL: Immediate action required for {source}"
            )
            recommendations.append(f"High-confidence threat targeting {brand_name}")
            recommendations.append("Initiate takedown process immediately")
        
        elif risk_level == "high":
            recommendations.append(
                f"HIGH PRIORITY: Likely threat from {source}"
            )
            recommendations.append("Collect evidence and prepare takedown")
        
        elif risk_level == "medium":
            recommendations.append(
                f"MEDIUM PRIORITY: Suspicious activity from {source}"
            )
            recommendations.append("Monitor and verify")
        
        # Category-specific recommendations
        if 'brand_impersonation' in threat_categories:
            recommendations.append(f"Brand impersonation of {brand_name} detected")
        
        if 'phishing' in threat_categories:
            recommendations.append("Phishing indicators present")
        
        # Technique-specific recommendations
        if 'homograph' in detected_techniques or 'homoglyph' in detected_techniques:
            recommendations.append("Visual spoofing technique detected - check for unicode characters")
        
        if 'typosquatting' in detected_techniques:
            recommendations.append("Typosquatting targets user typing errors")
        
        return recommendations
    
    def _determine_monitoring_priority(self, risk_level: str) -> str:
        """Determine monitoring priority."""
        priorities = {
            "critical": "immediate",
            "high": "high",
            "medium": "normal",
            "low": "low",
            "minimal": "none"
        }
        return priorities.get(risk_level, "normal")


# Convenience functions
def detect_threat(
    source: str,
    source_type: str,
    brand_name: str,
    **kwargs
) -> IntegratedThreatResult:
    """
    Quick threat detection function.
    
    Args:
        source: Domain, email, or social handle
        source_type: 'domain', 'email', or 'social'
        brand_name: Brand to protect
        **kwargs: Additional arguments for specific source types
        
    Returns:
        IntegratedThreatResult
    """
    detector = NLPIntegratedThreatDetector()
    
    if source_type == "domain":
        return detector.detect_domain_threat(
            domain=source,
            brand_name=brand_name,
            page_content=kwargs.get('page_content'),
            page_title=kwargs.get('page_title')
        )
    elif source_type == "email":
        return detector.detect_email_threat(
            subject=kwargs.get('subject', ''),
            body=kwargs.get('body', ''),
            sender=source,
            brand_name=brand_name
        )
    elif source_type == "social":
        return detector.detect_social_threat(
            username=source,
            platform=kwargs.get('platform', 'unknown'),
            content=kwargs.get('content', ''),
            brand_name=brand_name
        )
    else:
        raise ValueError(f"Unknown source_type: {source_type}")


if __name__ == '__main__':
    # Example usage
    print("=== NLP Integrated Threat Detection Demo ===\n")
    
    detector = NLPIntegratedThreatDetector()
    
    # Test domain detection
    test_content = """
    Welcome to Apple ID Verification
    
    Dear Customer,
    
    We have detected suspicious activity on your Apple ID. Your account has been 
    temporarily suspended. You must verify your account immediately to prevent 
    permanent suspension.
    
    Please login here: http://appleid-verify-secure.com/login
    
    Failure to respond within 24 hours will result in account termination.
    
    Sincerely,
    Apple Security Team
    """
    
    print("Testing domain detection...")
    result = detector.detect_domain_threat(
        domain="appleid-verify-secure.com",
        brand_name="apple",
        page_content=test_content
    )
    
    print(f"\nSource: {result.source}")
    print(f"Brand: {result.brand_name}")
    print(f"Overall Threat Score: {result.overall_threat_score:.3f}")
    print(f"ML Score: {result.ml_threat_score:.3f}")
    print(f"NLP Score: {result.nlp_threat_score:.3f}")
    print(f"Contextual Score: {result.contextual_threat_score:.3f}")
    print(f"Impersonation Score: {result.impersonation_score:.3f}")
    print(f"Risk Level: {result.risk_level.upper()}")
    print(f"Confidence: {result.confidence:.3f}")
    print(f"Processing Time: {result.processing_time_ms:.2f}ms")
    
    print(f"\nDetected Techniques: {result.detected_techniques[:5]}")
    print(f"\nRecommended Actions:")
    for action in result.recommended_actions:
        print(f"  - {action}")
