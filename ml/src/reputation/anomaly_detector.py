"""
Anomaly Detection Module

Implements statistical and ML-based anomaly detection for domain reputation signals.
"""

import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
import statistics


class AnomalyType(Enum):
    """Types of anomalies that can be detected"""
    STATISTICAL_OUTLIER = "statistical_outlier"
    TEMPORAL_ANOMALY = "temporal_anomaly"
    PATTERN_DEVIATION = "pattern_deviation"
    CLUSTER_ANOMALY = "cluster_anomaly"
    BEHAVIORAL_CHANGE = "behavioral_change"


@dataclass
class Anomaly:
    """Represents a detected anomaly"""
    type: AnomalyType
    severity: str  # 'critical', 'high', 'medium', 'low'
    description: str
    score: float  # Anomaly score 0-100
    features: List[str]
    metadata: Dict[str, Any]
    timestamp: datetime


class AnomalyDetector:
    """
    Multi-method anomaly detection for domain reputation analysis
    """
    
    def __init__(
        self,
        z_threshold: float = 2.5,
        iqr_multiplier: float = 1.5,
        temporal_window_days: int = 30
    ):
        """
        Initialize anomaly detector
        
        Args:
            z_threshold: Z-score threshold for statistical outliers
            iqr_multiplier: IQR multiplier for outlier detection
            temporal_window_days: Window for temporal anomaly detection
        """
        self.z_threshold = z_threshold
        self.iqr_multiplier = iqr_multiplier
        self.temporal_window_days = temporal_window_days
        self._baseline_stats: Dict[str, Dict[str, float]] = {}
    
    def detect_anomalies(
        self,
        domain: str,
        current_data: Dict[str, Any],
        historical_data: Optional[List[Dict[str, Any]]] = None
    ) -> List[Anomaly]:
        """
        Detect anomalies in domain data
        
        Args:
            domain: Domain being analyzed
            current_data: Current snapshot of domain data
            historical_data: Historical data points for comparison
            
        Returns:
            List of detected anomalies
        """
        anomalies = []
        
        # Statistical outlier detection
        statistical = self._detect_statistical_outliers(current_data)
        anomalies.extend(statistical)
        
        # Temporal anomaly detection
        if historical_data:
            temporal = self._detect_temporal_anomalies(current_data, historical_data)
            anomalies.extend(temporal)
        
        # Pattern-based detection
        patterns = self._detect_pattern_deviations(current_data)
        anomalies.extend(patterns)
        
        # Domain-specific anomaly detection
        domain_specific = self._detect_domain_anomalies(domain, current_data)
        anomalies.extend(domain_specific)
        
        return anomalies
    
    def _detect_statistical_outliers(
        self,
        data: Dict[str, Any]
    ) -> List[Anomaly]:
        """Detect statistical outliers using Z-score and IQR methods"""
        anomalies = []
        
        # Check numeric features
        numeric_features = [
            'domain_age_days',
            'ssl_validity_days',
            'dns_ttl',
            'mx_count',
            'txt_count'
        ]
        
        for feature in numeric_features:
            if feature in data and data[feature] is not None:
                value = float(data[feature])
                
                # Check against baseline if available
                if feature in self._baseline_stats:
                    stats = self._baseline_stats[feature]
                    mean = stats.get('mean', 0)
                    std = stats.get('std', 1)
                    
                    if std > 0:
                        z_score = abs((value - mean) / std)
                        if z_score > self.z_threshold:
                            anomalies.append(Anomaly(
                                type=AnomalyType.STATISTICAL_OUTLIER,
                                severity='high' if z_score > 3.5 else 'medium',
                                description=f"{feature} is {z_score:.1f} standard deviations from mean",
                                score=min(100, z_score * 20),
                                features=[feature],
                                metadata={
                                    'value': value,
                                    'mean': mean,
                                    'z_score': z_score
                                },
                                timestamp=datetime.utcnow()
                            ))
        
        return anomalies
    
    def _detect_temporal_anomalies(
        self,
        current: Dict[str, Any],
        historical: List[Dict[str, Any]]
    ) -> List[Anomaly]:
        """Detect temporal anomalies and sudden changes"""
        anomalies = []
        
        if len(historical) < 3:
            return anomalies
        
        # Sort by timestamp
        sorted_history = sorted(
            historical,
            key=lambda x: x.get('timestamp', datetime.min)
        )
        
        # Detect sudden score changes
        if 'reputation_score' in current:
            current_score = current['reputation_score']
            recent_scores = [
                h.get('reputation_score', current_score)
                for h in sorted_history[-5:]
            ]
            
            if recent_scores:
                avg_recent = statistics.mean(recent_scores)
                score_change = abs(current_score - avg_recent)
                
                if score_change > 20:  # Significant change threshold
                    anomalies.append(Anomaly(
                        type=AnomalyType.TEMPORAL_ANOMALY,
                        severity='critical' if score_change > 40 else 'high',
                        description=f"Reputation score changed by {score_change:.1f} points",
                        score=min(100, score_change * 2),
                        features=['reputation_score'],
                        metadata={
                            'current_score': current_score,
                            'previous_avg': avg_recent,
                            'change': score_change
                        },
                        timestamp=datetime.utcnow()
                    ))
        
        # Detect registration pattern anomalies
        if 'registrar' in current:
            current_registrar = current['registrar']
            registrar_history = [
                h.get('registrar') for h in sorted_history
                if h.get('registrar')
            ]
            
            if registrar_history and current_registrar != registrar_history[-1]:
                anomalies.append(Anomaly(
                    type=AnomalyType.TEMPORAL_ANOMALY,
                    severity='high',
                    description="Domain registrar has changed",
                    score=75.0,
                    features=['registrar'],
                    metadata={
                        'current': current_registrar,
                        'previous': registrar_history[-1]
                    },
                    timestamp=datetime.utcnow()
                ))
        
        return anomalies
    
    def _detect_pattern_deviations(self, data: Dict[str, Any]) -> List[Anomaly]:
        """Detect deviations from expected patterns"""
        anomalies = []
        
        # Check for suspicious patterns in DNS configuration
        dns_checks = {
            'no_mx_records': (
                data.get('mx_count') == 0 and data.get('has_website', False),
                'Domain has website but no MX records',
                'medium'
            ),
            'suspicious_ttl': (
                data.get('dns_ttl', 300) < 60,
                'Very low DNS TTL may indicate fast-flux behavior',
                'high'
            ),
            'multiple_cnames': (
                data.get('cname_count', 0) > 5,
                'Excessive CNAME chaining detected',
                'medium'
            ),
            'wildcard_dns': (
                data.get('has_wildcard_dns', False),
                'Wildcard DNS configuration detected',
                'low'
            )
        }
        
        for check_name, (condition, description, severity) in dns_checks.items():
            if condition:
                anomalies.append(Anomaly(
                    type=AnomalyType.PATTERN_DEVIATION,
                    severity=severity,
                    description=description,
                    score={'critical': 100, 'high': 75, 'medium': 50, 'low': 25}[severity],
                    features=['dns_configuration'],
                    metadata={'check': check_name},
                    timestamp=datetime.utcnow()
                ))
        
        # Check SSL/TLS patterns
        ssl_age = data.get('ssl_age_days', 0)
        domain_age = data.get('domain_age_days', 0)
        
        if domain_age > 365 and ssl_age < 7:
            anomalies.append(Anomaly(
                type=AnomalyType.PATTERN_DEVIATION,
                severity='medium',
                description='Recently issued certificate on established domain',
                score=45.0,
                features=['ssl_certificate'],
                metadata={
                    'ssl_age_days': ssl_age,
                    'domain_age_days': domain_age
                },
                timestamp=datetime.utcnow()
            ))
        
        return anomalies
    
    def _detect_domain_anomalies(
        self,
        domain: str,
        data: Dict[str, Any]
    ) -> List[Anomaly]:
        """Detect domain-specific anomalies"""
        anomalies = []
        
        # Check for suspicious TLD patterns
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz']
        domain_lower = domain.lower()
        
        for tld in suspicious_tlds:
            if domain_lower.endswith(tld):
                anomalies.append(Anomaly(
                    type=AnomalyType.CLUSTER_ANOMALY,
                    severity='low',
                    description=f'Domain uses high-risk TLD: {tld}',
                    score=30.0,
                    features=['tld'],
                    metadata={'tld': tld},
                    timestamp=datetime.utcnow()
                ))
        
        # Check for subdomain abuse
        subdomain_count = domain.count('.')
        if subdomain_count > 3:
            anomalies.append(Anomaly(
                type=AnomalyType.CLUSTER_ANOMALY,
                severity='medium',
                description='Excessive subdomain nesting',
                score=40.0,
                features=['subdomain_structure'],
                metadata={'subdomain_count': subdomain_count},
                timestamp=datetime.utcnow()
            ))
        
        # Check for brand impersonation patterns
        if data.get('brand_similarity_score', 0) > 0.8:
            anomalies.append(Anomaly(
                type=AnomalyType.BEHAVIORAL_CHANGE,
                severity='critical',
                description='High brand similarity score - possible impersonation',
                score=90.0,
                features=['brand_similarity'],
                metadata={
                    'similarity_score': data.get('brand_similarity_score'),
                    'target_brand': data.get('similar_brand')
                },
                timestamp=datetime.utcnow()
            ))
        
        return anomalies
    
    def update_baseline(
        self,
        feature_name: str,
        values: List[float]
    ):
        """Update baseline statistics for a feature"""
        if len(values) < 2:
            return
        
        self._baseline_stats[feature_name] = {
            'mean': statistics.mean(values),
            'std': statistics.stdev(values) if len(values) > 1 else 0,
            'median': statistics.median(values),
            'q1': np.percentile(values, 25),
            'q3': np.percentile(values, 75),
            'min': min(values),
            'max': max(values),
            'count': len(values)
        }
    
    def calculate_anomaly_score(self, anomalies: List[Anomaly]) -> float:
        """Calculate aggregate anomaly score from detected anomalies"""
        if not anomalies:
            return 0.0
        
        severity_weights = {
            'critical': 1.0,
            'high': 0.7,
            'medium': 0.4,
            'low': 0.1
        }
        
        weighted_scores = [
            a.score * severity_weights.get(a.severity, 0.1)
            for a in anomalies
        ]
        
        # Apply diminishing returns for multiple anomalies
        base_score = sum(weighted_scores)
        dampening = 1 + 0.1 * (len(anomalies) - 1)
        
        return min(100, base_score / dampening)
