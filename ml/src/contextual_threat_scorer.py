"""
Contextual Threat Scoring Module for DoppelDown
Combines NLP analysis with traditional threat indicators for comprehensive scoring.
"""

import numpy as np
from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging

from nlp_analyzer import (
    NLPAnalyzer, NLPEntityRecognizer, NLPSentimentAnalyzer, LinguisticAnalyzer,
    ThreatCategory, Entity, SentimentResult, LinguisticFeatures
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ThreatSeverity(Enum):
    """Threat severity levels."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MINIMAL = "minimal"


@dataclass
class ContextualFactor:
    """A contextual factor influencing threat score."""
    name: str
    weight: float
    score: float
    evidence: List[str] = field(default_factory=list)
    confidence: float = 0.0


@dataclass
class ThreatIndicator:
    """Individual threat indicator."""
    category: ThreatCategory
    indicator_type: str
    description: str
    confidence: float
    evidence: str
    severity: str


@dataclass
class ContextualThreatAssessment:
    """Complete contextual threat assessment."""
    # Basic info
    source: str  # domain, email, social media, etc.
    brand_name: str
    timestamp: str
    
    # Scores
    overall_score: float  # 0-1
    base_threat_score: float  # From traditional ML models
    nlp_threat_score: float  # From NLP analysis
    contextual_score: float  # Combined contextual factors
    
    # Components
    severity: ThreatSeverity
    category_scores: Dict[ThreatCategory, float]
    indicators: List[ThreatIndicator]
    contextual_factors: List[ContextualFactor]
    
    # NLP Details
    entity_analysis: Dict[str, Any]
    sentiment_analysis: Dict[str, Any]
    linguistic_analysis: Dict[str, Any]
    
    # Recommendations
    recommended_actions: List[str]
    monitoring_priority: str
    
    # Confidence
    confidence: float
    model_version: str = "2.0.0"


class ContextualThreatScorer:
    """
    Advanced contextual threat scorer that combines:
    - Traditional ML-based threat detection
    - NLP analysis (entities, sentiment, linguistics)
    - Contextual factors (timing, patterns, history)
    - Brand-specific risk profiles
    """
    
    # Category weights for threat calculation
    CATEGORY_WEIGHTS = {
        ThreatCategory.PHISHING: 0.25,
        ThreatCategory.BRAND_IMPERSONATION: 0.20,
        ThreatCategory.SUSPICIOUS_URL: 0.15,
        ThreatCategory.URGENCY_MANIPULATION: 0.12,
        ThreatCategory.CREDENTIAL_HARVESTING: 0.15,
        ThreatCategory.FINANCIAL_FRAUD: 0.08,
        ThreatCategory.MALWARE_DISTRIBUTION: 0.03,
        ThreatCategory.SOCIAL_ENGINEERING: 0.02,
    }
    
    # Contextual factor weights
    CONTEXTUAL_WEIGHTS = {
        'urgency_tactics': 0.15,
        'emotional_manipulation': 0.12,
        'authority_impersonation': 0.14,
        'credential_requests': 0.18,
        'language_quality': 0.08,
        'brand_consistency': 0.13,
        'historical_pattern': 0.10,
        'timing_anomaly': 0.10,
    }
    
    # Thresholds for severity levels
    SEVERITY_THRESHOLDS = {
        ThreatSeverity.CRITICAL: 0.90,
        ThreatSeverity.HIGH: 0.75,
        ThreatSeverity.MEDIUM: 0.50,
        ThreatSeverity.LOW: 0.25,
        ThreatSeverity.MINIMAL: 0.0,
    }
    
    def __init__(self, nlp_analyzer: Optional[NLPAnalyzer] = None):
        self.nlp_analyzer = nlp_analyzer or NLPAnalyzer()
        self.entity_recognizer = NLPEntityRecognizer()
        self.sentiment_analyzer = NLPSentimentAnalyzer()
        self.linguistic_analyzer = LinguisticAnalyzer()
        
        # Historical pattern tracking
        self.brand_risk_profiles: Dict[str, Dict] = {}
        self.detection_history: List[Dict] = []
        
        logger.info("Contextual Threat Scorer initialized")
    
    def score_domain_threat(
        self,
        domain: str,
        brand_name: str,
        base_threat_score: float,
        page_content: Optional[str] = None,
        page_title: Optional[str] = None,
        historical_data: Optional[Dict] = None
    ) -> ContextualThreatAssessment:
        """
        Calculate contextual threat score for a domain.
        
        Args:
            domain: The domain to assess
            brand_name: Brand being protected
            base_threat_score: Score from traditional ML model (0-1)
            page_content: HTML/text content of the page
            page_title: Title of the page
            historical_data: Historical detection data
            
        Returns:
            ContextualThreatAssessment with comprehensive scoring
        """
        timestamp = datetime.utcnow().isoformat()
        
        # Step 1: NLP Analysis
        nlp_results = self._analyze_content(
            domain, page_content, page_title, brand_name
        )
        
        # Step 2: Calculate NLP threat score
        nlp_threat_score = self._calculate_nlp_threat_score(nlp_results)
        
        # Step 3: Calculate contextual factors
        contextual_factors = self._calculate_contextual_factors(
            domain, brand_name, nlp_results, historical_data
        )
        contextual_score = self._aggregate_contextual_scores(contextual_factors)
        
        # Step 4: Combine scores
        overall_score = self._combine_scores(
            base_threat_score, nlp_threat_score, contextual_score
        )
        
        # Step 5: Determine category scores
        category_scores = self._calculate_category_scores(
            nlp_results, contextual_factors
        )
        
        # Step 6: Extract indicators
        indicators = self._extract_threat_indicators(nlp_results, contextual_factors)
        
        # Step 7: Determine severity and recommendations
        severity = self._determine_severity(overall_score, indicators)
        recommendations = self._generate_recommendations(
            domain, brand_name, severity, indicators, category_scores
        )
        
        # Step 8: Calculate confidence
        confidence = self._calculate_confidence(
            base_threat_score, nlp_results, contextual_factors
        )
        
        assessment = ContextualThreatAssessment(
            source=domain,
            brand_name=brand_name,
            timestamp=timestamp,
            overall_score=overall_score,
            base_threat_score=base_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_score=contextual_score,
            severity=severity,
            category_scores=category_scores,
            indicators=indicators,
            contextual_factors=contextual_factors,
            entity_analysis=nlp_results.get('entities', {}),
            sentiment_analysis=nlp_results.get('sentiment', {}),
            linguistic_analysis=nlp_results.get('linguistic', {}),
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(severity, overall_score),
            confidence=confidence
        )
        
        # Store in history
        self._update_history(assessment)
        
        return assessment
    
    def score_email_threat(
        self,
        subject: str,
        body: str,
        sender: str,
        brand_name: str,
        base_threat_score: float = 0.0,
        headers: Optional[Dict] = None
    ) -> ContextualThreatAssessment:
        """Calculate contextual threat score for an email."""
        timestamp = datetime.utcnow().isoformat()
        
        # Analyze email
        email_analysis = self.nlp_analyzer.analyze_email(
            subject, body, sender, [brand_name]
        )
        
        # Extract NLP results
        nlp_results = {
            'entities': email_analysis['full_analysis']['entities'],
            'sentiment': email_analysis['full_analysis']['sentiment'],
            'linguistic': email_analysis['full_analysis']['linguistic'],
            'summary': email_analysis['full_analysis']['summary']
        }
        
        # Calculate scores
        nlp_threat_score = self._calculate_nlp_threat_score(nlp_results)
        
        # Email-specific contextual factors
        contextual_factors = self._calculate_email_contextual_factors(
            sender, subject, body, headers, email_analysis
        )
        contextual_score = self._aggregate_contextual_scores(contextual_factors)
        
        # Combine scores
        overall_score = self._combine_scores(
            base_threat_score, nlp_threat_score, contextual_score,
            email_weight=1.2  # Emails often higher risk
        )
        
        # Determine categories and indicators
        category_scores = self._calculate_category_scores(nlp_results, contextual_factors)
        indicators = self._extract_email_threat_indicators(email_analysis, contextual_factors)
        
        severity = self._determine_severity(overall_score, indicators)
        recommendations = self._generate_email_recommendations(
            sender, subject, severity, indicators
        )
        
        return ContextualThreatAssessment(
            source=sender,
            brand_name=brand_name,
            timestamp=timestamp,
            overall_score=overall_score,
            base_threat_score=base_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_score=contextual_score,
            severity=severity,
            category_scores=category_scores,
            indicators=indicators,
            contextual_factors=contextual_factors,
            entity_analysis=nlp_results['entities'],
            sentiment_analysis=nlp_results['sentiment'],
            linguistic_analysis=nlp_results['linguistic'],
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(severity, overall_score),
            confidence=self._calculate_confidence(base_threat_score, nlp_results, contextual_factors)
        )
    
    def score_social_media_threat(
        self,
        username: str,
        platform: str,
        content: str,
        brand_name: str,
        base_threat_score: float = 0.0,
        profile_data: Optional[Dict] = None
    ) -> ContextualThreatAssessment:
        """Calculate contextual threat score for social media content."""
        timestamp = datetime.utcnow().isoformat()
        
        # Analyze content
        nlp_results = self.nlp_analyzer.analyze_text(content, [brand_name])
        
        # Calculate scores
        nlp_threat_score = self._calculate_nlp_threat_score(nlp_results)
        
        # Social media-specific factors
        contextual_factors = self._calculate_social_contextual_factors(
            username, platform, content, profile_data, nlp_results
        )
        contextual_score = self._aggregate_contextual_scores(contextual_factors)
        
        # Combine scores
        overall_score = self._combine_scores(
            base_threat_score, nlp_threat_score, contextual_score
        )
        
        category_scores = self._calculate_category_scores(nlp_results, contextual_factors)
        indicators = self._extract_social_threat_indicators(
            username, platform, nlp_results, contextual_factors
        )
        
        severity = self._determine_severity(overall_score, indicators)
        recommendations = self._generate_social_recommendations(
            username, platform, brand_name, severity, indicators
        )
        
        return ContextualThreatAssessment(
            source=f"{platform}:@{username}",
            brand_name=brand_name,
            timestamp=timestamp,
            overall_score=overall_score,
            base_threat_score=base_threat_score,
            nlp_threat_score=nlp_threat_score,
            contextual_score=contextual_score,
            severity=severity,
            category_scores=category_scores,
            indicators=indicators,
            contextual_factors=contextual_factors,
            entity_analysis=nlp_results['entities'],
            sentiment_analysis=nlp_results['sentiment'],
            linguistic_analysis=nlp_results['linguistic'],
            recommended_actions=recommendations,
            monitoring_priority=self._determine_monitoring_priority(severity, overall_score),
            confidence=self._calculate_confidence(base_threat_score, nlp_results, contextual_factors)
        )
    
    def _analyze_content(
        self,
        domain: str,
        content: Optional[str],
        title: Optional[str],
        brand_name: str
    ) -> Dict[str, Any]:
        """Analyze content using NLP."""
        if content:
            return self.nlp_analyzer.analyze_webpage_content(
                title or "",
                content,
                "",
                [brand_name]
            )
        else:
            # Analyze just the domain
            return self.nlp_analyzer.analyze_text(domain, [brand_name])
    
    def _calculate_nlp_threat_score(self, nlp_results: Dict) -> float:
        """Calculate threat score from NLP analysis."""
        scores = []
        
        # Entity-based scoring
        entity_score = self._calculate_entity_score(nlp_results.get('entities', {}))
        scores.append(entity_score)
        
        # Sentiment-based scoring
        sentiment_score = self._calculate_sentiment_risk(nlp_results.get('sentiment', {}))
        scores.append(sentiment_score)
        
        # Linguistic-based scoring
        linguistic_score = self._calculate_linguistic_risk(nlp_results.get('linguistic', {}))
        scores.append(linguistic_score)
        
        # Weighted combination
        weights = [0.35, 0.35, 0.30]
        final_score = sum(s * w for s, w in zip(scores, weights))
        
        return min(final_score, 1.0)
    
    def _calculate_entity_score(self, entities: Dict) -> float:
        """Calculate risk score based on entities."""
        score = 0.0
        
        # Brand mentions increase risk
        brand_mentions = entities.get('brand_mentions', 0)
        score += min(brand_mentions * 0.15, 0.45)
        
        # Suspicious entity types
        all_entities = entities.get('all', [])
        entity_labels = [e.get('label', '') for e in all_entities]
        
        high_risk_labels = {'URGENCY', 'CREDENTIAL_REQUESTS', 'FINANCIAL_INDICATORS'}
        medium_risk_labels = {'AUTHORITY_CLAIMS', 'SUSPICIOUS_URL'}
        
        high_risk_count = sum(1 for label in entity_labels if label in high_risk_labels)
        medium_risk_count = sum(1 for label in entity_labels if label in medium_risk_labels)
        
        score += high_risk_count * 0.15
        score += medium_risk_count * 0.08
        
        return min(score, 1.0)
    
    def _calculate_sentiment_risk(self, sentiment: Dict) -> float:
        """Calculate risk score from sentiment analysis."""
        score = 0.0
        
        # Fear and urgency emotions are high risk
        emotion_scores = sentiment.get('emotion_scores', {})
        score += emotion_scores.get('fear', 0) * 0.25
        score += emotion_scores.get('urgency', 0) * 0.25
        
        # Negative polarity increases risk
        polarity = sentiment.get('polarity', 0)
        if polarity < -0.3:
            score += abs(polarity) * 0.2
        
        # Manipulation detection
        manipulation = sentiment.get('manipulation', {})
        for manip_type, data in manipulation.items():
            score += data.get('score', 0) * 0.15
        
        return min(score, 1.0)
    
    def _calculate_linguistic_risk(self, linguistic: Dict) -> float:
        """Calculate risk score from linguistic features."""
        score = 0.0
        
        # Urgency indicators
        urgency_count = len(linguistic.get('urgency_indicators', []))
        score += min(urgency_count * 0.1, 0.3)
        
        # Deception indicators
        deception_count = len(linguistic.get('deception_indicators', []))
        score += min(deception_count * 0.08, 0.24)
        
        # Emotional manipulation
        manipulation_score = linguistic.get('emotional_manipulation', 0)
        score += manipulation_score * 0.25
        
        # Poor language quality (may indicate non-native speakers/common in phishing)
        grammar_errors = linguistic.get('grammar_errors', 0)
        spelling_errors = linguistic.get('spelling_errors', 0)
        if grammar_errors > 3 or spelling_errors > 3:
            score += 0.15
        
        # Excessive authority references
        authority_refs = len(linguistic.get('authority_references', []))
        score += min(authority_refs * 0.1, 0.2)
        
        return min(score, 1.0)
    
    def _calculate_contextual_factors(
        self,
        domain: str,
        brand_name: str,
        nlp_results: Dict,
        historical_data: Optional[Dict]
    ) -> List[ContextualFactor]:
        """Calculate contextual factors for threat assessment."""
        factors = []
        
        # Urgency tactics factor
        urgency_score = self._calculate_urgency_factor(nlp_results)
        factors.append(ContextualFactor(
            name='urgency_tactics',
            weight=self.CONTEXTUAL_WEIGHTS['urgency_tactics'],
            score=urgency_score,
            evidence=nlp_results.get('linguistic', {}).get('urgency_indicators', []),
            confidence=0.85
        ))
        
        # Emotional manipulation factor
        manipulation_score = nlp_results.get('linguistic', {}).get('emotional_manipulation', 0)
        factors.append(ContextualFactor(
            name='emotional_manipulation',
            weight=self.CONTEXTUAL_WEIGHTS['emotional_manipulation'],
            score=manipulation_score,
            evidence=['emotional_appeal_detected'] if manipulation_score > 0.5 else [],
            confidence=0.80
        ))
        
        # Authority impersonation factor
        authority_score = self._calculate_authority_factor(nlp_results)
        factors.append(ContextualFactor(
            name='authority_impersonation',
            weight=self.CONTEXTUAL_WEIGHTS['authority_impersonation'],
            score=authority_score,
            evidence=nlp_results.get('linguistic', {}).get('authority_references', []),
            confidence=0.82
        ))
        
        # Credential requests factor
        credential_score = self._calculate_credential_factor(nlp_results)
        factors.append(ContextualFactor(
            name='credential_requests',
            weight=self.CONTEXTUAL_WEIGHTS['credential_requests'],
            score=credential_score,
            evidence=['credential_request_detected'] if credential_score > 0.5 else [],
            confidence=0.88
        ))
        
        # Language quality factor
        quality_score = self._calculate_language_quality_factor(nlp_results)
        factors.append(ContextualFactor(
            name='language_quality',
            weight=self.CONTEXTUAL_WEIGHTS['language_quality'],
            score=quality_score,
            evidence=['grammar_errors', 'spelling_errors'],
            confidence=0.75
        ))
        
        # Historical pattern factor
        if historical_data:
            historical_score = self._calculate_historical_factor(domain, historical_data)
            factors.append(ContextualFactor(
                name='historical_pattern',
                weight=self.CONTEXTUAL_WEIGHTS['historical_pattern'],
                score=historical_score,
                evidence=['previous_detections'] if historical_score > 0.5 else [],
                confidence=0.70
            ))
        
        return factors
    
    def _calculate_email_contextual_factors(
        self,
        sender: str,
        subject: str,
        body: str,
        headers: Optional[Dict],
        email_analysis: Dict
    ) -> List[ContextualFactor]:
        """Calculate contextual factors specific to emails."""
        factors = []
        
        # Sender domain analysis
        sender_score = 0.0
        evidence = []
        
        if '@' in sender:
            domain = sender.split('@')[1]
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.top', '.xyz']
            if any(domain.endswith(tld) for tld in suspicious_tlds):
                sender_score += 0.4
                evidence.append('suspicious_sender_tld')
            
            if 'noreply' in sender.lower() or 'no-reply' in sender.lower():
                sender_score += 0.1
                evidence.append('noreply_address')
        
        factors.append(ContextualFactor(
            name='sender_analysis',
            weight=0.15,
            score=min(sender_score, 1.0),
            evidence=evidence,
            confidence=0.85
        ))
        
        # SPF/DKIM analysis if headers available
        if headers:
            auth_score = 0.0
            auth_evidence = []
            
            if headers.get('spf') == 'fail':
                auth_score += 0.5
                auth_evidence.append('spf_failed')
            if headers.get('dkim') == 'fail':
                auth_score += 0.4
                auth_evidence.append('dkim_failed')
            if headers.get('dmarc') == 'fail':
                auth_score += 0.3
                auth_evidence.append('dmarc_failed')
            
            if auth_evidence:
                factors.append(ContextualFactor(
                    name='authentication_failure',
                    weight=0.20,
                    score=min(auth_score, 1.0),
                    evidence=auth_evidence,
                    confidence=0.90
                ))
        
        # Subject line analysis
        subject_score = 0.0
        subject_evidence = []
        subject_lower = subject.lower()
        
        urgency_words = ['urgent', 'immediate', 'action required', 'alert', 'warning']
        if any(word in subject_lower for word in urgency_words):
            subject_score += 0.3
            subject_evidence.append('urgency_in_subject')
        
        if subject.count('!') > 1:
            subject_score += 0.1
            subject_evidence.append('excessive_punctuation')
        
        factors.append(ContextualFactor(
            name='subject_analysis',
            weight=0.12,
            score=min(subject_score, 1.0),
            evidence=subject_evidence,
            confidence=0.80
        ))
        
        return factors
    
    def _calculate_social_contextual_factors(
        self,
        username: str,
        platform: str,
        content: str,
        profile_data: Optional[Dict],
        nlp_results: Dict
    ) -> List[ContextualFactor]:
        """Calculate contextual factors for social media."""
        factors = []
        
        # Username analysis
        username_score = 0.0
        username_evidence = []
        
        if any(suffix in username.lower() for suffix in ['official', 'real', 'verified']):
            username_score += 0.3
            username_evidence.append('authority_claim_in_username')
        
        if username[-1:].isdigit():
            username_score += 0.15
            username_evidence.append('numeric_suffix')
        
        if username.startswith('_'):
            username_score += 0.1
            username_evidence.append('underscore_prefix')
        
        factors.append(ContextualFactor(
            name='username_analysis',
            weight=0.15,
            score=min(username_score, 1.0),
            evidence=username_evidence,
            confidence=0.80
        ))
        
        # Profile data analysis
        if profile_data:
            profile_score = 0.0
            profile_evidence = []
            
            if profile_data.get('is_verified') == False:
                # Unverified account claiming to be official
                if 'official' in content.lower() or 'official' in username.lower():
                    profile_score += 0.4
                    profile_evidence.append('unverified_official_claim')
            
            if profile_data.get('follower_count', 0) < 100:
                profile_score += 0.2
                profile_evidence.append('low_follower_count')
            
            if profile_data.get('account_age_days', 365) < 30:
                profile_score += 0.3
                profile_evidence.append('new_account')
            
            if profile_evidence:
                factors.append(ContextualFactor(
                    name='profile_analysis',
                    weight=0.18,
                    score=min(profile_score, 1.0),
                    evidence=profile_evidence,
                    confidence=0.75
                ))
        
        # Engagement patterns
        if profile_data and 'engagement_rate' in profile_data:
            engagement = profile_data['engagement_rate']
            if engagement > 0.15:  # Unusually high engagement
                factors.append(ContextualFactor(
                    name='engagement_anomaly',
                    weight=0.10,
                    score=0.4,
                    evidence=['suspiciously_high_engagement'],
                    confidence=0.65
                ))
        
        return factors
    
    def _calculate_urgency_factor(self, nlp_results: Dict) -> float:
        """Calculate urgency tactics factor."""
        score = 0.0
        
        # Count urgency indicators
        urgency = nlp_results.get('linguistic', {}).get('urgency_indicators', [])
        score += min(len(urgency) * 0.15, 0.5)
        
        # Check sentiment
        if nlp_results.get('sentiment', {}).get('dominant_emotion') == 'urgency':
            score += 0.25
        
        # Check manipulation
        manipulation = nlp_results.get('sentiment', {}).get('manipulation', {})
        score += manipulation.get('urgency_manipulation', {}).get('score', 0) * 0.25
        
        return min(score, 1.0)
    
    def _calculate_authority_factor(self, nlp_results: Dict) -> float:
        """Calculate authority impersonation factor."""
        score = 0.0
        
        # Authority references
        authority_refs = nlp_results.get('linguistic', {}).get('authority_references', [])
        score += min(len(authority_refs) * 0.15, 0.4)
        
        # Trust indicators (excessive trust claims may indicate impersonation)
        trust_indicators = nlp_results.get('linguistic', {}).get('trust_indicators', [])
        if len(trust_indicators) > 3:
            score += 0.2
        
        return min(score, 1.0)
    
    def _calculate_credential_factor(self, nlp_results: Dict) -> float:
        """Calculate credential request factor."""
        score = 0.0
        
        # Check for credential-related entities
        entities = nlp_results.get('entities', {}).get('all', [])
        credential_labels = ['CREDENTIAL_REQUESTS', 'AUTHORITY_CLAIMS']
        credential_entities = [e for e in entities if e.get('label') in credential_labels]
        score += min(len(credential_entities) * 0.25, 0.5)
        
        return min(score, 1.0)
    
    def _calculate_language_quality_factor(self, nlp_results: Dict) -> float:
        """Calculate language quality factor."""
        linguistic = nlp_results.get('linguistic', {})
        
        grammar_errors = linguistic.get('grammar_errors', 0)
        spelling_errors = linguistic.get('spelling_errors', 0)
        
        # Higher score = more errors = more suspicious
        if grammar_errors > 5 or spelling_errors > 5:
            return 0.8
        elif grammar_errors > 3 or spelling_errors > 3:
            return 0.5
        elif grammar_errors > 1 or spelling_errors > 1:
            return 0.3
        else:
            return 0.1
    
    def _calculate_historical_factor(
        self, domain: str, historical_data: Dict
    ) -> float:
        """Calculate historical pattern factor."""
        score = 0.0
        
        previous_detections = historical_data.get('previous_detections', 0)
        if previous_detections > 5:
            score += 0.4
        elif previous_detections > 2:
            score += 0.25
        elif previous_detections > 0:
            score += 0.1
        
        # Check for similar domains previously flagged
        similar_flagged = historical_data.get('similar_domains_flagged', [])
        score += min(len(similar_flagged) * 0.1, 0.3)
        
        return min(score, 1.0)
    
    def _aggregate_contextual_scores(self, factors: List[ContextualFactor]) -> float:
        """Aggregate contextual factor scores."""
        if not factors:
            return 0.0
        
        total_weight = sum(f.weight for f in factors)
        weighted_score = sum(f.score * f.weight for f in factors)
        
        return weighted_score / total_weight if total_weight > 0 else 0.0
    
    def _combine_scores(
        self,
        base_score: float,
        nlp_score: float,
        contextual_score: float,
        email_weight: float = 1.0
    ) -> float:
        """Combine different threat scores."""
        # Base weights
        base_weight = 0.35
        nlp_weight = 0.35
        contextual_weight = 0.30
        
        # Adjust for email if needed
        if email_weight != 1.0:
            nlp_weight *= email_weight
            contextual_weight *= email_weight
            # Re-normalize
            total = base_weight + nlp_weight + contextual_weight
            base_weight /= total
            nlp_weight /= total
            contextual_weight /= total
        
        combined = (
            base_score * base_weight +
            nlp_score * nlp_weight +
            contextual_score * contextual_weight
        )
        
        return min(combined, 1.0)
    
    def _calculate_category_scores(
        self,
        nlp_results: Dict,
        contextual_factors: List[ContextualFactor]
    ) -> Dict[ThreatCategory, float]:
        """Calculate scores for each threat category."""
        scores = {category: 0.0 for category in ThreatCategory}
        
        # Phishing score
        scores[ThreatCategory.PHISHING] = self._calculate_phishing_score(
            nlp_results, contextual_factors
        )
        
        # Brand impersonation score
        scores[ThreatCategory.BRAND_IMPERSONATION] = self._calculate_impersonation_score(
            nlp_results, contextual_factors
        )
        
        # Urgency manipulation score
        urgency_factor = next(
            (f for f in contextual_factors if f.name == 'urgency_tactics'),
            None
        )
        scores[ThreatCategory.URGENCY_MANIPULATION] = urgency_factor.score if urgency_factor else 0.0
        
        # Credential harvesting score
        credential_factor = next(
            (f for f in contextual_factors if f.name == 'credential_requests'),
            None
        )
        scores[ThreatCategory.CREDENTIAL_HARVESTING] = credential_factor.score if credential_factor else 0.0
        
        # Financial fraud score
        scores[ThreatCategory.FINANCIAL_FRAUD] = self._calculate_financial_score(nlp_results)
        
        # Social engineering score
        scores[ThreatCategory.SOCIAL_ENGINEERING] = self._calculate_social_engineering_score(
            nlp_results, contextual_factors
        )
        
        return scores
    
    def _calculate_phishing_score(
        self, nlp_results: Dict, contextual_factors: List[ContextualFactor]
    ) -> float:
        """Calculate phishing category score."""
        score = 0.0
        
        # Check for credential requests
        credential_factor = next(
            (f for f in contextual_factors if f.name == 'credential_requests'),
            None
        )
        if credential_factor:
            score += credential_factor.score * 0.3
        
        # Check for urgency
        urgency_factor = next(
            (f for f in contextual_factors if f.name == 'urgency_tactics'),
            None
        )
        if urgency_factor:
            score += urgency_factor.score * 0.25
        
        # Check for authority claims
        authority_factor = next(
            (f for f in contextual_factors if f.name == 'authority_impersonation'),
            None
        )
        if authority_factor:
            score += authority_factor.score * 0.25
        
        # Check entities
        entities = nlp_results.get('entities', {}).get('all', [])
        credential_entities = [e for e in entities if e.get('label') == 'CREDENTIAL_REQUESTS']
        score += min(len(credential_entities) * 0.1, 0.2)
        
        return min(score, 1.0)
    
    def _calculate_impersonation_score(
        self, nlp_results: Dict, contextual_factors: List[ContextualFactor]
    ) -> float:
        """Calculate brand impersonation score."""
        score = 0.0
        
        # Brand mentions
        brand_mentions = nlp_results.get('entities', {}).get('brand_mentions', 0)
        score += min(brand_mentions * 0.2, 0.4)
        
        # Authority impersonation
        authority_factor = next(
            (f for f in contextual_factors if f.name == 'authority_impersonation'),
            None
        )
        if authority_factor:
            score += authority_factor.score * 0.3
        
        # Brand voice inconsistency
        voice_sim = nlp_results.get('brand_voice_similarity')
        if voice_sim is not None and voice_sim < 0.5:
            score += (0.5 - voice_sim) * 0.3
        
        return min(score, 1.0)
    
    def _calculate_financial_score(self, nlp_results: Dict) -> float:
        """Calculate financial fraud score."""
        score = 0.0
        
        entities = nlp_results.get('entities', {}).get('all', [])
        financial_entities = [e for e in entities if e.get('label') == 'FINANCIAL_INDICATORS']
        score += min(len(financial_entities) * 0.2, 0.5)
        
        return min(score, 1.0)
    
    def _calculate_social_engineering_score(
        self, nlp_results: Dict, contextual_factors: List[ContextualFactor]
    ) -> float:
        """Calculate social engineering score."""
        score = 0.0
        
        # Emotional manipulation
        manipulation_factor = next(
            (f for f in contextual_factors if f.name == 'emotional_manipulation'),
            None
        )
        if manipulation_factor:
            score += manipulation_factor.score * 0.35
        
        # Fear appeal
        fear_score = nlp_results.get('sentiment', {}).get('emotion_scores', {}).get('fear', 0)
        score += fear_score * 0.3
        
        # Urgency
        urgency_score = nlp_results.get('sentiment', {}).get('emotion_scores', {}).get('urgency', 0)
        score += urgency_score * 0.25
        
        return min(score, 1.0)
    
    def _extract_threat_indicators(
        self, nlp_results: Dict, contextual_factors: List[ContextualFactor]
    ) -> List[ThreatIndicator]:
        """Extract specific threat indicators."""
        indicators = []
        
        # Extract from entities
        for entity in nlp_results.get('entities', {}).get('all', []):
            label = entity.get('label', '')
            if label in ['URGENCY', 'CREDENTIAL_REQUESTS', 'FINANCIAL_INDICATORS']:
                indicators.append(ThreatIndicator(
                    category=self._map_label_to_category(label),
                    indicator_type='entity_detection',
                    description=f"Detected {label} entity: {entity.get('text', '')}",
                    confidence=entity.get('confidence', 0.8),
                    evidence=entity.get('context', ''),
                    severity='high' if label == 'CREDENTIAL_REQUESTS' else 'medium'
                ))
        
        # Extract from contextual factors
        for factor in contextual_factors:
            if factor.score > 0.5:
                indicators.append(ThreatIndicator(
                    category=ThreatCategory.SOCIAL_ENGINEERING,
                    indicator_type='contextual_factor',
                    description=f"High-risk contextual factor: {factor.name}",
                    confidence=factor.confidence,
                    evidence=str(factor.evidence),
                    severity='high' if factor.score > 0.8 else 'medium'
                ))
        
        return indicators
    
    def _extract_email_threat_indicators(
        self, email_analysis: Dict, contextual_factors: List[ContextualFactor]
    ) -> List[ThreatIndicator]:
        """Extract threat indicators specific to emails."""
        indicators = []
        
        # From email threat assessment
        threat_assessment = email_analysis.get('threat_assessment', {})
        for factor in threat_assessment.get('contributing_factors', []):
            indicators.append(ThreatIndicator(
                category=ThreatCategory.PHISHING,
                indicator_type='email_pattern',
                description=f"Email threat factor: {factor}",
                confidence=0.85,
                evidence=factor,
                severity='high'
            ))
        
        # Add general indicators
        indicators.extend(self._extract_threat_indicators(
            email_analysis.get('full_analysis', {}),
            contextual_factors
        ))
        
        return indicators
    
    def _extract_social_threat_indicators(
        self,
        username: str,
        platform: str,
        nlp_results: Dict,
        contextual_factors: List[ContextualFactor]
    ) -> List[ThreatIndicator]:
        """Extract threat indicators for social media."""
        indicators = []
        
        # Username-based indicators
        username_factor = next(
            (f for f in contextual_factors if f.name == 'username_analysis'),
            None
        )
        if username_factor and username_factor.score > 0.3:
            indicators.append(ThreatIndicator(
                category=ThreatCategory.BRAND_IMPERSONATION,
                indicator_type='username_pattern',
                description=f"Suspicious username pattern: {username}",
                confidence=username_factor.confidence,
                evidence=str(username_factor.evidence),
                severity='medium'
            ))
        
        # Profile-based indicators
        profile_factor = next(
            (f for f in contextual_factors if f.name == 'profile_analysis'),
            None
        )
        if profile_factor and profile_factor.score > 0.3:
            indicators.append(ThreatIndicator(
                category=ThreatCategory.SOCIAL_ENGINEERING,
                indicator_type='profile_anomaly',
                description="Suspicious profile characteristics",
                confidence=profile_factor.confidence,
                evidence=str(profile_factor.evidence),
                severity='medium'
            ))
        
        # Add general indicators
        indicators.extend(self._extract_threat_indicators(nlp_results, contextual_factors))
        
        return indicators
    
    def _map_label_to_category(self, label: str) -> ThreatCategory:
        """Map entity label to threat category."""
        mapping = {
            'URGENCY': ThreatCategory.URGENCY_MANIPULATION,
            'CREDENTIAL_REQUESTS': ThreatCategory.CREDENTIAL_HARVESTING,
            'FINANCIAL_INDICATORS': ThreatCategory.FINANCIAL_FRAUD,
            'AUTHORITY_CLAIMS': ThreatCategory.BRAND_IMPERSONATION,
            'SUSPICIOUS_URL': ThreatCategory.SUSPICIOUS_URL,
        }
        return mapping.get(label, ThreatCategory.SOCIAL_ENGINEERING)
    
    def _determine_severity(
        self, score: float, indicators: List[ThreatIndicator]
    ) -> ThreatSeverity:
        """Determine threat severity level."""
        # Check for critical indicators
        critical_indicators = sum(
            1 for i in indicators 
            if i.severity == 'high' and i.confidence > 0.8
        )
        
        if score >= self.SEVERITY_THRESHOLDS[ThreatSeverity.CRITICAL]:
            return ThreatSeverity.CRITICAL
        elif score >= self.SEVERITY_THRESHOLDS[ThreatSeverity.HIGH] or critical_indicators >= 3:
            return ThreatSeverity.HIGH
        elif score >= self.SEVERITY_THRESHOLDS[ThreatSeverity.MEDIUM]:
            return ThreatSeverity.MEDIUM
        elif score >= self.SEVERITY_THRESHOLDS[ThreatSeverity.LOW]:
            return ThreatSeverity.LOW
        else:
            return ThreatSeverity.MINIMAL
    
    def _generate_recommendations(
        self,
        domain: str,
        brand_name: str,
        severity: ThreatSeverity,
        indicators: List[ThreatIndicator],
        category_scores: Dict[ThreatCategory, float]
    ) -> List[str]:
        """Generate recommendations based on assessment."""
        recommendations = []
        
        if severity == ThreatSeverity.CRITICAL:
            recommendations.append(
                f"IMMEDIATE ACTION REQUIRED: High-confidence threat detected targeting {brand_name}"
            )
            recommendations.append("Initiate domain takedown process immediately")
            recommendations.append("Notify security team and legal counsel")
        
        elif severity == ThreatSeverity.HIGH:
            recommendations.append(
                f"HIGH PRIORITY: Likely impersonation of {brand_name} detected"
            )
            recommendations.append("Collect evidence and prepare takedown documentation")
            recommendations.append("Monitor for related domain registrations")
        
        elif severity == ThreatSeverity.MEDIUM:
            recommendations.append(
                f"MEDIUM PRIORITY: Suspicious domain requires manual review"
            )
            recommendations.append("Verify domain ownership and content")
        
        # Category-specific recommendations
        if category_scores.get(ThreatCategory.CREDENTIAL_HARVESTING, 0) > 0.6:
            recommendations.append(
                "CREDENTIAL HARVESTING: Domain appears to be collecting login credentials"
            )
        
        if category_scores.get(ThreatCategory.PHISHING, 0) > 0.6:
            recommendations.append(
                "PHISHING DETECTED: Domain exhibits phishing characteristics"
            )
        
        if category_scores.get(ThreatCategory.BRAND_IMPERSONATION, 0) > 0.6:
            recommendations.append(
                f"BRAND IMPERSONATION: Domain is impersonating {brand_name}"
            )
        
        return recommendations
    
    def _generate_email_recommendations(
        self,
        sender: str,
        subject: str,
        severity: ThreatSeverity,
        indicators: List[ThreatIndicator]
    ) -> List[str]:
        """Generate recommendations for email threats."""
        recommendations = []
        
        if severity == ThreatSeverity.CRITICAL:
            recommendations.append("CRITICAL: Do not interact with this email")
            recommendations.append("Report to security team immediately")
            recommendations.append("Block sender at email gateway")
        
        elif severity == ThreatSeverity.HIGH:
            recommendations.append("HIGH RISK: Likely phishing email")
            recommendations.append("Do not click links or download attachments")
            recommendations.append("Verify sender through separate channel")
        
        # Check for specific indicators
        auth_failures = [i for i in indicators if i.indicator_type == 'authentication_failure']
        if auth_failures:
            recommendations.append(
                "AUTHENTICATION FAILED: Email failed SPF/DKIM/DMARC checks"
            )
        
        return recommendations
    
    def _generate_social_recommendations(
        self,
        username: str,
        platform: str,
        brand_name: str,
        severity: ThreatSeverity,
        indicators: List[ThreatIndicator]
    ) -> List[str]:
        """Generate recommendations for social media threats."""
        recommendations = []
        
        if severity == ThreatSeverity.CRITICAL:
            recommendations.append(
                f"CRITICAL: Report @{username} on {platform} for impersonation immediately"
            )
        
        elif severity == ThreatSeverity.HIGH:
            recommendations.append(
                f"HIGH PRIORITY: Review and report suspicious account @{username}"
            )
        
        recommendations.append(
            f"Check if @{username} on {platform} is a verified {brand_name} account"
        )
        
        return recommendations
    
    def _determine_monitoring_priority(self, severity: ThreatSeverity, score: float) -> str:
        """Determine monitoring priority."""
        if severity == ThreatSeverity.CRITICAL:
            return "immediate"
        elif severity == ThreatSeverity.HIGH:
            return "high"
        elif severity == ThreatSeverity.MEDIUM:
            return "normal"
        else:
            return "low"
    
    def _calculate_confidence(
        self,
        base_score: float,
        nlp_results: Dict,
        contextual_factors: List[ContextualFactor]
    ) -> float:
        """Calculate overall confidence in the assessment."""
        confidences = []
        
        # Base model confidence
        confidences.append(0.85 if base_score > 0 else 0.5)
        
        # NLP confidence
        sentiment_conf = nlp_results.get('sentiment', {}).get('confidence', 0.5)
        confidences.append(sentiment_conf)
        
        # Contextual factor confidences
        for factor in contextual_factors:
            confidences.append(factor.confidence)
        
        return sum(confidences) / len(confidences) if confidences else 0.5
    
    def _update_history(self, assessment: ContextualThreatAssessment):
        """Update detection history."""
        self.detection_history.append({
            'timestamp': assessment.timestamp,
            'source': assessment.source,
            'brand': assessment.brand_name,
            'score': assessment.overall_score,
            'severity': assessment.severity.value
        })
        
        # Keep only recent history
        if len(self.detection_history) > 10000:
            self.detection_history = self.detection_history[-5000:]


# Convenience functions
def score_domain_threat(
    domain: str,
    brand_name: str,
    base_threat_score: float,
    page_content: Optional[str] = None
) -> ContextualThreatAssessment:
    """Quick function to score domain threat."""
    scorer = ContextualThreatScorer()
    return scorer.score_domain_threat(domain, brand_name, base_threat_score, page_content)


def score_email_threat(
    subject: str,
    body: str,
    sender: str,
    brand_name: str
) -> ContextualThreatAssessment:
    """Quick function to score email threat."""
    scorer = ContextualThreatScorer()
    return scorer.score_email_threat(subject, body, sender, brand_name)


if __name__ == '__main__':
    # Example usage
    scorer = ContextualThreatScorer()
    
    # Test domain scoring
    test_content = """
    Welcome to Apple ID Verification
    
    Dear Apple Customer,
    
    We have detected suspicious activity on your account. Your Apple ID has been 
    temporarily suspended for security reasons. You must verify your account 
    immediately to prevent permanent suspension.
    
    Please login to verify your account: http://appleid-verify-secure.com/login
    
    Failure to respond within 24 hours will result in account termination and 
    loss of all your data.
    
    Sincerely,
    Apple Security Team
    """
    
    result = scorer.score_domain_threat(
        domain="appleid-verify-secure.com",
        brand_name="apple",
        base_threat_score=0.75,
        page_content=test_content
    )
    
    print("=== Contextual Threat Assessment ===\n")
    print(f"Domain: {result.source}")
    print(f"Brand: {result.brand_name}")
    print(f"Overall Score: {result.overall_score:.3f}")
    print(f"Base Score: {result.base_threat_score:.3f}")
    print(f"NLP Score: {result.nlp_threat_score:.3f}")
    print(f"Contextual Score: {result.contextual_score:.3f}")
    print(f"Severity: {result.severity.value.upper()}")
    print(f"Confidence: {result.confidence:.3f}")
    
    print(f"\nCategory Scores:")
    for category, score in result.category_scores.items():
        print(f"  {category.value}: {score:.3f}")
    
    print(f"\nContextual Factors:")
    for factor in result.contextual_factors:
        print(f"  {factor.name}: {factor.score:.3f} (weight: {factor.weight})")
    
    print(f"\nRecommended Actions:")
    for action in result.recommended_actions:
        print(f"  - {action}")
