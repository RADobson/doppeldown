"""
Real-time threat scoring system for domain and social media threats.
Provides fast inference and scoring API for doppeldown integration.
"""

import numpy as np
import json
import time
import hashlib
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import logging
from functools import lru_cache
import re

from dataset_generator import BrandImpersonationDataset
from threat_detection_model import (
    AutoencoderThreatModel, 
    IsolationForestThreatModel,
    EnsembleThreatModel,
    DetectionResult
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class RealTimeScore:
    """Real-time threat scoring result."""
    domain: str
    brand_name: str
    threat_score: float
    risk_level: str  # low, medium, high, critical
    is_threat: bool
    confidence: float
    detected_techniques: List[str]
    feature_vector: Dict[str, float]
    scan_duration_ms: float
    timestamp: str
    model_version: str
    recommendations: List[str]


class FeatureExtractor:
    """Extract features from domains and social media profiles in real-time."""
    
    def __init__(self):
        self.dataset_gen = BrandImpersonationDataset()
        self._cache = {}
    
    def extract_domain_features(self, domain: str, brand_name: str) -> Dict[str, float]:
        """Extract features from a domain name."""
        # Normalize domain
        domain = domain.lower().strip()
        if domain.startswith(('http://', 'https://')):
            domain = domain.split('://', 1)[1]
        if '/' in domain:
            domain = domain.split('/')[0]
        
        # Parse domain parts
        parts = domain.split('.')
        
        # Extract subdomain, main domain, TLD
        if len(parts) >= 3 and parts[0] in ['www', 'mail', 'login', 'secure', 'app']:
            subdomain = parts[0]
            main_domain = parts[1]
            tld = '.'.join(parts[2:])
        elif len(parts) >= 2:
            subdomain = ''
            main_domain = parts[0]
            tld = '.'.join(parts[1:])
        else:
            subdomain = ''
            main_domain = domain
            tld = ''
        
        brand_lower = brand_name.lower().strip()
        
        # Calculate features
        features = {
            'domain_length': float(len(domain)),
            'subdomain_length': float(len(subdomain)),
            'main_domain_length': float(len(main_domain)),
            'tld_length': float(len(tld)),
            'has_www': 1.0 if 'www' in domain else 0.0,
            'has_https': 0.0,  # Would need URL for this
            'hyphen_count': float(domain.count('-')),
            'dot_count': float(domain.count('.')),
            'digit_count': float(sum(c.isdigit() for c in domain)),
            'special_char_count': float(sum(not c.isalnum() and c not in '.-' for c in domain)),
            
            # Brand similarity
            'brand_in_domain': 1.0 if brand_lower in domain else 0.0,
            'levenshtein_distance': float(self._levenshtein_distance(main_domain, brand_lower)),
            'jaro_winkler': float(self._jaro_winkler(main_domain, brand_lower)),
            'length_ratio': float(len(main_domain)) / max(len(brand_lower), 1),
            
            # Phishing indicators
            'suspicious_tld': 1.0 if tld in self.dataset_gen.SUSPICIOUS_TLDS else 0.0,
            'trusted_tld': 1.0 if tld in self.dataset_gen.TRUSTED_TLDS else 0.0,
            'has_phishing_keyword': 1.0 if any(kw in domain for kw in self.dataset_gen.PHISHING_KEYWORDS) else 0.0,
            'phishing_keyword_count': float(sum(kw in domain for kw in self.dataset_gen.PHISHING_KEYWORDS)),
            
            # Entropy and character analysis
            'char_entropy': float(self._calculate_entropy(main_domain)),
            'consonant_vowel_ratio': float(self._consonant_vowel_ratio(main_domain)),
            
            # Homoglyph detection
            'has_homoglyph': 1.0 if self._contains_homoglyph(domain) else 0.0,
            'homoglyph_count': float(self._count_homoglyphs(domain)),
            
            # Pattern analysis
            'max_char_repetition': float(self._max_char_repetition(domain)),
            'consecutive_digits': float(self._consecutive_digits(domain)),
        }
        
        return features
    
    def extract_social_features(self, username: str, platform: str, 
                               brand_name: str) -> Dict[str, float]:
        """Extract features from social media username/profile."""
        username = username.lower().strip()
        brand_lower = brand_name.lower().strip()
        
        # Remove @ if present
        if username.startswith('@'):
            username = username[1:]
        
        features = {
            'username_length': float(len(username)),
            'platform_encoded': float(self._encode_platform(platform)),
            
            # Brand similarity
            'brand_in_username': 1.0 if brand_lower in username else 0.0,
            'levenshtein_distance': float(self._levenshtein_distance(username, brand_lower)),
            'jaro_winkler': float(self._jaro_winkler(username, brand_lower)),
            'length_ratio': float(len(username)) / max(len(brand_lower), 1),
            
            # Character features
            'digit_count': float(sum(c.isdigit() for c in username)),
            'special_char_count': float(sum(not c.isalnum() for c in username)),
            'underscore_count': float(username.count('_')),
            'dot_count': float(username.count('.')),
            
            # Impersonation indicators
            'has_official_suffix': 1.0 if any(s in username for s in ['official', 'real', 'verified']) else 0.0,
            'has_underscore_prefix': 1.0 if username.startswith('_') else 0.0,
            'has_number_suffix': 1.0 if username[-1:].isdigit() else 0.0,
            'is_exact_brand': 1.0 if username == brand_lower else 0.0,
            
            # Entropy
            'char_entropy': float(self._calculate_entropy(username)),
            
            # Pattern detection
            'max_char_repetition': float(self._max_char_repetition(username)),
            'has_homoglyph': 1.0 if self._contains_homoglyph(username) else 0.0,
        }
        
        return features
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance."""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    def _jaro_winkler(self, s1: str, s2: str) -> float:
        """Calculate Jaro-Winkler similarity."""
        if s1 == s2:
            return 1.0
        
        len1, len2 = len(s1), len(s2)
        match_distance = max(len1, len2) // 2 - 1
        
        s1_matches = [False] * len1
        s2_matches = [False] * len2
        matches = 0
        
        for i in range(len1):
            start = max(0, i - match_distance)
            end = min(i + match_distance + 1, len2)
            for j in range(start, end):
                if not s2_matches[j] and s1[i] == s2[j]:
                    s1_matches[i] = s2_matches[j] = True
                    matches += 1
                    break
        
        if matches == 0:
            return 0.0
        
        k = 0
        transpositions = 0
        for i in range(len1):
            if s1_matches[i]:
                while not s2_matches[k]:
                    k += 1
                if s1[i] != s2[k]:
                    transpositions += 1
                k += 1
        
        jaro = ((matches / len1) + (matches / len2) + 
                ((matches - transpositions / 2) / matches)) / 3
        
        prefix_len = sum(1 for i in range(min(4, len1, len2)) if s1[i] == s2[i])
        return jaro + (0.1 * prefix_len * (1 - jaro))
    
    def _calculate_entropy(self, s: str) -> float:
        """Calculate Shannon entropy."""
        if not s:
            return 0.0
        from math import log2
        prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
        return -sum(p * log2(p) for p in prob)
    
    def _consonant_vowel_ratio(self, s: str) -> float:
        """Calculate consonant to vowel ratio."""
        vowels = set('aeiouAEIOU')
        consonants = vowel_count = 0
        for c in s:
            if c.isalpha():
                if c in vowels:
                    vowel_count += 1
                else:
                    consonants += 1
        if vowel_count == 0:
            return float('inf') if consonants > 0 else 0.0
        return consonants / vowel_count
    
    def _contains_homoglyph(self, s: str) -> bool:
        """Check if string contains homoglyphs."""
        for char in s:
            for homoglyphs in self.dataset_gen.HOMOGLYPHS.values():
                if char in homoglyphs:
                    return True
        return False
    
    def _count_homoglyphs(self, s: str) -> int:
        """Count homoglyphs in string."""
        count = 0
        for char in s:
            for homoglyphs in self.dataset_gen.HOMOGLYPHS.values():
                if char in homoglyphs:
                    count += 1
        return count
    
    def _max_char_repetition(self, s: str) -> int:
        """Find maximum consecutive character repetition."""
        if not s:
            return 0
        max_rep = current_rep = 1
        for i in range(1, len(s)):
            if s[i] == s[i-1]:
                current_rep += 1
                max_rep = max(max_rep, current_rep)
            else:
                current_rep = 1
        return max_rep
    
    def _consecutive_digits(self, s: str) -> int:
        """Count maximum consecutive digits."""
        max_digits = current_digits = 0
        for c in s:
            if c.isdigit():
                current_digits += 1
                max_digits = max(max_digits, current_digits)
            else:
                current_digits = 0
        return max_digits
    
    def _encode_platform(self, platform: str) -> int:
        """Encode platform as integer."""
        platforms = {
            'twitter': 1, 'x': 1, 'facebook': 2, 'instagram': 3,
            'linkedin': 4, 'tiktok': 5, 'youtube': 6, 'telegram': 7,
            'discord': 8, 'reddit': 9, 'pinterest': 10
        }
        return platforms.get(platform.lower(), 0)


class RealTimeThreatScorer:
    """Real-time threat scoring for domains and social media."""
    
    # Risk level thresholds
    RISK_THRESHOLDS = {
        'low': 0.3,
        'medium': 0.6,
        'high': 0.8,
        'critical': 0.95
    }
    
    def __init__(self, model_path: Optional[str] = None, 
                 use_ensemble: bool = True):
        self.feature_extractor = FeatureExtractor()
        self.model_path = model_path
        self.use_ensemble = use_ensemble
        self.models = {}
        self.model_version = "1.0.0"
        
        if model_path:
            self.load_models(model_path)
        else:
            # Initialize with default models
            self._init_default_models()
    
    def _init_default_models(self):
        """Initialize default models if no model path provided."""
        from dataset_generator import BrandImpersonationDataset
        
        logger.info("Initializing default models...")
        generator = BrandImpersonationDataset(random_seed=42)
        dataset = generator.generate_dataset(n_samples=3000, impersonation_ratio=0.3)
        
        # Prepare data
        X = np.array([list(s.features.values()) for s in dataset])
        y = np.array([s.label for s in dataset])
        X_legitimate = X[y == 0]
        
        # Train autoencoder
        autoencoder = AutoencoderThreatModel(input_dim=X.shape[1])
        autoencoder.train(X_legitimate, epochs=30, batch_size=32)
        self.models['autoencoder'] = autoencoder
        
        # Train isolation forest
        iso_forest = IsolationForestThreatModel(contamination=0.3)
        iso_forest.train(X)
        self.models['isolation_forest'] = iso_forest
        
        logger.info("Default models initialized")
    
    def load_models(self, model_path: str):
        """Load trained models from disk."""
        import os
        
        logger.info(f"Loading models from {model_path}")
        
        # Load autoencoder
        autoencoder_path = os.path.join(model_path, 'autoencoder')
        if os.path.exists(autoencoder_path):
            autoencoder = AutoencoderThreatModel()
            autoencoder.load(autoencoder_path)
            self.models['autoencoder'] = autoencoder
            logger.info("Loaded autoencoder model")
        
        # Load isolation forest
        iso_path = os.path.join(model_path, 'isolation_forest')
        if os.path.exists(iso_path):
            iso_forest = IsolationForestThreatModel()
            iso_forest.load(iso_path)
            self.models['isolation_forest'] = iso_forest
            logger.info("Loaded isolation forest model")
    
    def score_domain(self, domain: str, brand_name: str) -> RealTimeScore:
        """Score a domain for brand impersonation risk."""
        start_time = time.time()
        
        # Extract features
        features = self.feature_extractor.extract_domain_features(domain, brand_name)
        
        # Get predictions from models
        predictions = []
        for name, model in self.models.items():
            try:
                pred = model.predict(features, brand_name)
                predictions.append(pred)
            except Exception as e:
                logger.warning(f"Model {name} failed: {e}")
        
        # Aggregate predictions
        if predictions:
            avg_score = np.mean([p.threat_score for p in predictions])
            avg_confidence = np.mean([p.confidence for p in predictions])
            is_threat = sum(1 for p in predictions if p.is_threat) >= len(predictions) / 2
            
            # Collect techniques
            all_techniques = set()
            for p in predictions:
                if p.technique:
                    all_techniques.update(p.technique.split(','))
            techniques = sorted(all_techniques)
        else:
            avg_score = 0.0
            avg_confidence = 0.0
            is_threat = False
            techniques = []
        
        # Determine risk level
        risk_level = self._get_risk_level(avg_score)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            domain, brand_name, techniques, avg_score, risk_level
        )
        
        scan_duration_ms = (time.time() - start_time) * 1000
        
        return RealTimeScore(
            domain=domain,
            brand_name=brand_name,
            threat_score=float(avg_score),
            risk_level=risk_level,
            is_threat=is_threat,
            confidence=float(avg_confidence),
            detected_techniques=techniques,
            feature_vector=features,
            scan_duration_ms=scan_duration_ms,
            timestamp=datetime.utcnow().isoformat(),
            model_version=self.model_version,
            recommendations=recommendations
        )
    
    def score_social_profile(self, username: str, platform: str, 
                            brand_name: str) -> RealTimeScore:
        """Score a social media profile for brand impersonation risk."""
        start_time = time.time()
        
        # Extract features
        features = self.feature_extractor.extract_social_features(
            username, platform, brand_name
        )
        
        # Use domain scoring with social features
        # Create a pseudo-domain for scoring
        pseudo_domain = f"{username}.{platform}.social"
        
        # Map social features to domain-like features for model compatibility
        domain_features = self._map_social_to_domain_features(features, username, brand_name)
        
        # Get predictions
        predictions = []
        for name, model in self.models.items():
            try:
                pred = model.predict(domain_features, brand_name)
                predictions.append(pred)
            except Exception as e:
                logger.warning(f"Model {name} failed: {e}")
        
        # Aggregate
        if predictions:
            avg_score = np.mean([p.threat_score for p in predictions])
            avg_confidence = np.mean([p.confidence for p in predictions])
            is_threat = sum(1 for p in predictions if p.is_threat) >= len(predictions) / 2
            techniques = [f"social_{t}" for t in self._detect_social_techniques(features)]
        else:
            avg_score = 0.0
            avg_confidence = 0.0
            is_threat = False
            techniques = []
        
        # Adjust score based on social-specific factors
        social_adjustment = self._calculate_social_adjustment(features)
        adjusted_score = min(1.0, avg_score + social_adjustment)
        
        risk_level = self._get_risk_level(adjusted_score)
        recommendations = self._generate_social_recommendations(
            username, platform, brand_name, techniques, adjusted_score
        )
        
        scan_duration_ms = (time.time() - start_time) * 1000
        
        return RealTimeScore(
            domain=f"{platform}:@{username}",
            brand_name=brand_name,
            threat_score=float(adjusted_score),
            risk_level=risk_level,
            is_threat=is_threat or adjusted_score > 0.7,
            confidence=float(avg_confidence),
            detected_techniques=techniques,
            feature_vector=features,
            scan_duration_ms=scan_duration_ms,
            timestamp=datetime.utcnow().isoformat(),
            model_version=self.model_version,
            recommendations=recommendations
        )
    
    def _map_social_to_domain_features(self, social_features: Dict, 
                                      username: str, brand_name: str) -> Dict:
        """Map social media features to domain-like features."""
        return {
            'domain_length': social_features['username_length'],
            'subdomain_length': 0.0,
            'main_domain_length': social_features['username_length'],
            'tld_length': 0.0,
            'has_www': 0.0,
            'has_https': 0.0,
            'hyphen_count': 0.0,
            'dot_count': social_features['dot_count'],
            'digit_count': social_features['digit_count'],
            'special_char_count': social_features['special_char_count'],
            'brand_in_domain': social_features['brand_in_username'],
            'levenshtein_distance': social_features['levenshtein_distance'],
            'jaro_winkler': social_features['jaro_winkler'],
            'length_ratio': social_features['length_ratio'],
            'suspicious_tld': 0.0,
            'trusted_tld': 0.0,
            'has_phishing_keyword': social_features['has_official_suffix'],
            'phishing_keyword_count': social_features['has_official_suffix'],
            'char_entropy': social_features['char_entropy'],
            'consonant_vowel_ratio': 1.0,
            'has_homoglyph': social_features['has_homoglyph'],
            'homoglyph_count': 1.0 if social_features['has_homoglyph'] else 0.0,
            'max_char_repetition': social_features['max_char_repetition'],
            'consecutive_digits': 1.0 if social_features['has_number_suffix'] else 0.0,
        }
    
    def _detect_social_techniques(self, features: Dict) -> List[str]:
        """Detect impersonation techniques in social profiles."""
        techniques = []
        
        if features.get('is_exact_brand', 0) and features.get('has_number_suffix', 0):
            techniques.append('exact_brand_with_number')
        
        if features.get('has_official_suffix', 0):
            techniques.append('fake_official_suffix')
        
        if features.get('has_underscore_prefix', 0):
            techniques.append('underscore_prefix')
        
        if features.get('levenshtein_distance', 10) <= 2 and features.get('levenshtein_distance', 0) > 0:
            techniques.append('username_typo')
        
        if features.get('jaro_winkler', 0) > 0.9 and features.get('jaro_winkler', 0) < 1.0:
            techniques.append('near_exact_match')
        
        return techniques
    
    def _calculate_social_adjustment(self, features: Dict) -> float:
        """Calculate score adjustment based on social-specific factors."""
        adjustment = 0.0
        
        if features.get('is_exact_brand', 0):
            adjustment += 0.3
        
        if features.get('has_official_suffix', 0):
            adjustment += 0.2
        
        if features.get('has_number_suffix', 0) and features.get('brand_in_username', 0):
            adjustment += 0.15
        
        return min(adjustment, 0.5)  # Cap at 0.5
    
    def _get_risk_level(self, score: float) -> str:
        """Determine risk level from score."""
        if score >= self.RISK_THRESHOLDS['critical']:
            return 'critical'
        elif score >= self.RISK_THRESHOLDS['high']:
            return 'high'
        elif score >= self.RISK_THRESHOLDS['medium']:
            return 'medium'
        else:
            return 'low'
    
    def _generate_recommendations(self, domain: str, brand_name: str,
                                 techniques: List[str], score: float,
                                 risk_level: str) -> List[str]:
        """Generate recommendations based on threat assessment."""
        recommendations = []
        
        if risk_level == 'critical':
            recommendations.append(f"IMMEDIATE ACTION: High-confidence impersonation detected for {brand_name}")
            recommendations.append("Initiate domain takedown process immediately")
        elif risk_level == 'high':
            recommendations.append(f"HIGH PRIORITY: Likely impersonation of {brand_name}")
            recommendations.append("Collect evidence and prepare takedown documentation")
        elif risk_level == 'medium':
            recommendations.append(f"MEDIUM PRIORITY: Suspicious domain requires manual review")
            recommendations.append("Verify domain ownership and content")
        
        if 'homoglyph' in techniques:
            recommendations.append("Domain uses homoglyph characters - visual spoofing attack")
        
        if 'suspicious_tld' in techniques:
            recommendations.append("Domain uses TLD commonly associated with phishing")
        
        if 'combo_squatting' in techniques:
            recommendations.append("Combo-squatting technique detected - brand name combined with misleading terms")
        
        if 'typosquatting' in techniques:
            recommendations.append("Typosquatting technique detected - likely typo-based attack")
        
        return recommendations
    
    def _generate_social_recommendations(self, username: str, platform: str,
                                        brand_name: str, techniques: List[str],
                                        score: float) -> List[str]:
        """Generate recommendations for social media threats."""
        recommendations = []
        
        if score > 0.8:
            recommendations.append(f"CRITICAL: Likely impersonation on {platform} - report immediately")
        elif score > 0.5:
            recommendations.append(f"SUSPICIOUS: Review {platform} account for potential impersonation")
        
        if 'exact_brand_with_number' in techniques:
            recommendations.append(f"Account uses brand name with numeric suffix - common impersonation pattern")
        
        if 'fake_official_suffix' in techniques:
            recommendations.append("Account claims to be 'official' - verify through official channels")
        
        recommendations.append(f"Check if @{username} on {platform} is verified/official")
        
        return recommendations
    
    def batch_score_domains(self, domains: List[str], 
                           brand_name: str) -> List[RealTimeScore]:
        """Score multiple domains efficiently."""
        results = []
        for domain in domains:
            results.append(self.score_domain(domain, brand_name))
        return results
    
    def batch_score_social_profiles(self, profiles: List[Tuple[str, str]], 
                                   brand_name: str) -> List[RealTimeScore]:
        """Score multiple social media profiles."""
        results = []
        for username, platform in profiles:
            results.append(self.score_social_profile(username, platform, brand_name))
        return results


if __name__ == '__main__':
    # Example usage
    print("Initializing Real-Time Threat Scorer...")
    scorer = RealTimeThreatScorer()
    
    # Test domain scoring
    test_domains = [
        ("google.com", "google"),
        ("g00gle.com", "google"),
        ("googIe.com", "google"),
        ("google-security.com", "google"),
        ("secure-google-login.com", "google"),
        ("gooogle.com", "google"),
        ("microsoft.com", "microsoft"),
        ("micr0soft.com", "microsoft"),
        ("amaz0n-security.com", "amazon"),
    ]
    
    print("\n=== Domain Scoring Results ===")
    for domain, brand in test_domains:
        result = scorer.score_domain(domain, brand)
        print(f"\n{domain} (protecting {brand}):")
        print(f"  Threat Score: {result.threat_score:.3f}")
        print(f"  Risk Level: {result.risk_level.upper()}")
        print(f"  Is Threat: {result.is_threat}")
        print(f"  Techniques: {', '.join(result.detected_techniques) if result.detected_techniques else 'None'}")
        print(f"  Scan Time: {result.scan_duration_ms:.2f}ms")
    
    # Test social media scoring
    test_social = [
        ("google", "twitter", "google"),
        ("google123", "twitter", "google"),
        ("google_official", "instagram", "google"),
        ("gooogle", "facebook", "google"),
        ("_google", "tiktok", "google"),
    ]
    
    print("\n=== Social Media Scoring Results ===")
    for username, platform, brand in test_social:
        result = scorer.score_social_profile(username, platform, brand)
        print(f"\n{platform}:@{username} (protecting {brand}):")
        print(f"  Threat Score: {result.threat_score:.3f}")
        print(f"  Risk Level: {result.risk_level.upper()}")
        print(f"  Is Threat: {result.is_threat}")
        print(f"  Recommendations: {result.recommendations}")
