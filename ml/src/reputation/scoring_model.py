"""
Reputation Scoring Model

Implements weighted risk factor calculation with machine learning risk assessment.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
import math
import numpy as np
from datetime import datetime, timedelta
import json


class RiskSeverity(Enum):
    """Risk severity levels"""
    CRITICAL = 5
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    INFO = 1
    NONE = 0


@dataclass
class RiskFactor:
    """Represents a single risk factor with weight and confidence"""
    name: str
    score: float  # 0-100
    weight: float  # 0-1
    severity: RiskSeverity
    confidence: float  # 0-1
    description: str
    source: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    @property
    def weighted_score(self) -> float:
        """Calculate weighted score with confidence adjustment"""
        return self.score * self.weight * self.confidence


@dataclass
class ReputationScore:
    """Complete reputation score result"""
    domain: str
    overall_score: float  # 0-100 (0 = malicious, 100 = trustworthy)
    risk_level: str  # 'critical', 'high', 'medium', 'low', 'safe'
    confidence: float  # 0-1
    confidence_interval: Tuple[float, float]  # (lower, upper)
    factors: List[RiskFactor]
    threat_indicators: List[Dict[str, Any]]
    data_quality_score: float  # 0-1
    last_updated: datetime
    assessment_duration_ms: int
    
    # Historical tracking
    score_history: List[Dict[str, Any]] = field(default_factory=list)
    trend: str = 'stable'  # 'improving', 'declining', 'stable', 'volatile'
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            'domain': self.domain,
            'overall_score': round(self.overall_score, 2),
            'risk_level': self.risk_level,
            'confidence': round(self.confidence, 3),
            'confidence_interval': {
                'lower': round(self.confidence_interval[0], 2),
                'upper': round(self.confidence_interval[1], 2)
            },
            'factors': [
                {
                    'name': f.name,
                    'score': round(f.score, 2),
                    'weight': f.weight,
                    'severity': f.severity.name,
                    'confidence': round(f.confidence, 3),
                    'description': f.description,
                    'source': f.source,
                    'weighted_score': round(f.weighted_score, 2)
                }
                for f in self.factors
            ],
            'threat_indicators': self.threat_indicators,
            'data_quality_score': round(self.data_quality_score, 3),
            'last_updated': self.last_updated.isoformat(),
            'assessment_duration_ms': self.assessment_duration_ms,
            'trend': self.trend
        }


class ReputationScoringModel:
    """
    Multi-signal reputation scoring model with weighted risk factors
    and machine learning risk assessment
    """
    
    # Default weights for different data sources
    DEFAULT_WEIGHTS = {
        'threat_intel': 0.30,
        'domain_age': 0.20,
        'ssl_certificate': 0.15,
        'dns_configuration': 0.15,
        'web_presence': 0.10,
        'behavioral': 0.10
    }
    
    # Risk level thresholds
    RISK_THRESHOLDS = {
        'critical': (0, 20),
        'high': (20, 40),
        'medium': (40, 60),
        'low': (60, 80),
        'safe': (80, 100)
    }
    
    def __init__(self, custom_weights: Optional[Dict[str, float]] = None):
        """
        Initialize scoring model
        
        Args:
            custom_weights: Override default weights
        """
        self.weights = {**self.DEFAULT_WEIGHTS, **(custom_weights or {})}
        self._normalize_weights()
        
    def _normalize_weights(self):
        """Ensure weights sum to 1.0"""
        total = sum(self.weights.values())
        if total > 0:
            self.weights = {k: v/total for k, v in self.weights.items()}
    
    def calculate_score(
        self,
        domain: str,
        factors: List[RiskFactor],
        threat_indicators: List[Dict[str, Any]],
        data_quality_score: float,
        duration_ms: int
    ) -> ReputationScore:
        """
        Calculate overall reputation score from multiple risk factors
        
        Args:
            domain: Domain being assessed
            factors: List of risk factors
            threat_indicators: Detected threat indicators
            data_quality_score: Quality of available data (0-1)
            duration_ms: Assessment duration in milliseconds
            
        Returns:
            ReputationScore with complete assessment
        """
        if not factors:
            # No data available - return neutral score with low confidence
            return ReputationScore(
                domain=domain,
                overall_score=50.0,
                risk_level='unknown',
                confidence=0.1,
                confidence_interval=(0, 100),
                factors=[],
                threat_indicators=threat_indicators,
                data_quality_score=data_quality_score,
                last_updated=datetime.utcnow(),
                assessment_duration_ms=duration_ms
            )
        
        # Calculate weighted aggregate score
        total_weighted_score = sum(f.weighted_score for f in factors)
        total_weight = sum(f.weight * f.confidence for f in factors)
        
        if total_weight > 0:
            base_score = total_weighted_score / total_weight
        else:
            base_score = 50.0
        
        # Adjust for threat indicators
        threat_penalty = self._calculate_threat_penalty(threat_indicators)
        adjusted_score = max(0, base_score - threat_penalty)
        
        # Apply data quality adjustment
        confidence = self._calculate_confidence(factors, data_quality_score)
        
        # Calculate confidence interval using Wilson score
        confidence_interval = self._calculate_confidence_interval(
            adjusted_score, confidence, len(factors)
        )
        
        # Determine risk level
        risk_level = self._determine_risk_level(adjusted_score)
        
        # Calculate trend (would use historical data in production)
        trend = self._calculate_trend(factors)
        
        return ReputationScore(
            domain=domain,
            overall_score=adjusted_score,
            risk_level=risk_level,
            confidence=confidence,
            confidence_interval=confidence_interval,
            factors=factors,
            threat_indicators=threat_indicators,
            data_quality_score=data_quality_score,
            last_updated=datetime.utcnow(),
            assessment_duration_ms=duration_ms,
            trend=trend
        )
    
    def _calculate_threat_penalty(self, threat_indicators: List[Dict[str, Any]]) -> float:
        """Calculate score penalty from threat indicators"""
        penalty = 0.0
        severity_multipliers = {
            'critical': 30,
            'high': 20,
            'medium': 10,
            'low': 5
        }
        
        for indicator in threat_indicators:
            severity = indicator.get('severity', 'low')
            penalty += severity_multipliers.get(severity, 5)
        
        # Cap penalty at 50 points
        return min(penalty, 50)
    
    def _calculate_confidence(
        self,
        factors: List[RiskFactor],
        data_quality_score: float
    ) -> float:
        """Calculate overall confidence score"""
        if not factors:
            return 0.1
        
        # Average factor confidence weighted by factor weight
        total_confidence = sum(f.confidence * f.weight for f in factors)
        total_weight = sum(f.weight for f in factors)
        
        avg_confidence = total_confidence / total_weight if total_weight > 0 else 0.5
        
        # Combine with data quality
        return min(1.0, avg_confidence * (0.5 + 0.5 * data_quality_score))
    
    def _calculate_confidence_interval(
        self,
        score: float,
        confidence: float,
        sample_size: int
    ) -> Tuple[float, float]:
        """
        Calculate confidence interval using Wilson score interval
        """
        if sample_size < 1:
            return (0, 100)
        
        # Wilson score interval parameters
        z = 1.96  # 95% confidence
        p = score / 100.0  # Convert to proportion
        n = max(sample_size, 10)  # Minimum sample size
        
        # Wilson score interval
        denominator = 1 + z**2 / n
        centre_adjusted_probability = p + z**2 / (2 * n)
        adjusted_standard_deviation = math.sqrt(
            (p * (1 - p) + z**2 / (4 * n)) / n
        )
        
        lower_bound = (
            centre_adjusted_probability - z * adjusted_standard_deviation
        ) / denominator
        upper_bound = (
            centre_adjusted_probability + z * adjusted_standard_deviation
        ) / denominator
        
        # Scale back to 0-100
        lower = max(0, lower_bound * 100)
        upper = min(100, upper_bound * 100)
        
        # Adjust interval width based on confidence
        interval_width = (upper - lower) * (1.5 - confidence)
        centre = (upper + lower) / 2
        
        return (
            max(0, centre - interval_width / 2),
            min(100, centre + interval_width / 2)
        )
    
    def _determine_risk_level(self, score: float) -> str:
        """Determine risk level from score"""
        for level, (low, high) in self.RISK_THRESHOLDS.items():
            if low <= score < high or (level == 'safe' and score >= low):
                return level
        return 'unknown'
    
    def _calculate_trend(self, factors: List[RiskFactor]) -> str:
        """Calculate score trend from recent history"""
        # In production, this would compare with historical scores
        # For now, use factor volatility as proxy
        if len(factors) < 2:
            return 'stable'
        
        scores = [f.score for f in factors]
        std_dev = np.std(scores) if scores else 0
        
        if std_dev > 20:
            return 'volatile'
        elif std_dev > 10:
            return 'declining' if scores[-1] < scores[0] else 'improving'
        else:
            return 'stable'
    
    def get_feature_importance(self, factors: List[RiskFactor]) -> Dict[str, float]:
        """
        Get feature importance analysis for explainability
        """
        importance = {}
        total_weighted = sum(abs(f.weighted_score - 50) for f in factors)
        
        for factor in factors:
            deviation = abs(factor.weighted_score - 50)
            importance[factor.name] = {
                'contribution': round(deviation / total_weighted * 100, 2) if total_weighted > 0 else 0,
                'impact': 'positive' if factor.score > 50 else 'negative',
                'weight': factor.weight,
                'raw_score': factor.score
            }
        
        return importance
