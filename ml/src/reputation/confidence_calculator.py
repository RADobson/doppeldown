"""
Confidence Interval Calculator

Implements statistical methods for confidence interval generation
and uncertainty quantification.
"""

import math
from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import numpy as np


class ConfidenceMethod(Enum):
    """Methods for calculating confidence intervals"""
    WILSON = "wilson"
    CLopper_PEARSON = "clopper_pearson"
    NORMAL = "normal"
    BOOTSTRAP = "bootstrap"
    BAYESIAN = "bayesian"


@dataclass
class ConfidenceResult:
    """Result of confidence calculation"""
    point_estimate: float
    lower_bound: float
    upper_bound: float
    confidence_level: float
    method: ConfidenceMethod
    sample_size: int
    standard_error: Optional[float]
    margin_of_error: Optional[float]


class ConfidenceCalculator:
    """
    Calculates confidence intervals using multiple statistical methods
    """
    
    DEFAULT_CONFIDENCE_LEVEL = 0.95
    Z_SCORES = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    }
    
    def __init__(self, default_confidence: float = 0.95):
        """
        Initialize confidence calculator
        
        Args:
            default_confidence: Default confidence level (0-1)
        """
        self.default_confidence = default_confidence
    
    def calculate(
        self,
        successes: int,
        trials: int,
        method: ConfidenceMethod = ConfidenceMethod.WILSON,
        confidence_level: Optional[float] = None
    ) -> ConfidenceResult:
        """
        Calculate confidence interval for proportion
        
        Args:
            successes: Number of successes
            trials: Total number of trials
            method: Method to use for calculation
            confidence_level: Confidence level (default: 0.95)
            
        Returns:
            ConfidenceResult with bounds and metadata
        """
        if confidence_level is None:
            confidence_level = self.default_confidence
        
        if trials == 0:
            return ConfidenceResult(
                point_estimate=0.5,
                lower_bound=0.0,
                upper_bound=1.0,
                confidence_level=confidence_level,
                method=method,
                sample_size=0,
                standard_error=None,
                margin_of_error=None
            )
        
        p = successes / trials
        
        if method == ConfidenceMethod.WILSON:
            return self._wilson_score(p, trials, confidence_level)
        elif method == ConfidenceMethod.CLopper_PEARSON:
            return self._clopper_pearson(successes, trials, confidence_level)
        elif method == ConfidenceMethod.NORMAL:
            return self._normal_approximation(p, trials, confidence_level)
        else:
            return self._wilson_score(p, trials, confidence_level)
    
    def _wilson_score(
        self,
        p: float,
        n: int,
        confidence: float
    ) -> ConfidenceResult:
        """
        Wilson score interval - better for small samples and extreme proportions
        """
        z = self.Z_SCORES.get(confidence, 1.96)
        
        denominator = 1 + z**2 / n
        centre_adjusted = p + z**2 / (2 * n)
        adjusted_sd = math.sqrt((p * (1 - p) + z**2 / (4 * n)) / n)
        
        lower = max(0, (centre_adjusted - z * adjusted_sd) / denominator)
        upper = min(1, (centre_adjusted + z * adjusted_sd) / denominator)
        
        se = math.sqrt(p * (1 - p) / n) if n > 0 and p > 0 and p < 1 else None
        moe = z * se if se else None
        
        return ConfidenceResult(
            point_estimate=p,
            lower_bound=lower,
            upper_bound=upper,
            confidence_level=confidence,
            method=ConfidenceMethod.WILSON,
            sample_size=n,
            standard_error=se,
            margin_of_error=moe
        )
    
    def _clopper_pearson(
        self,
        successes: int,
        trials: int,
        confidence: float
    ) -> ConfidenceResult:
        """
        Clopper-Pearson exact interval - conservative, guarantees coverage
        """
        from scipy import stats
        
        alpha = 1 - confidence
        
        if successes == 0:
            lower = 0.0
        else:
            lower = stats.beta.ppf(alpha / 2, successes, trials - successes + 1)
        
        if successes == trials:
            upper = 1.0
        else:
            upper = stats.beta.ppf(1 - alpha / 2, successes + 1, trials - successes)
        
        p = successes / trials if trials > 0 else 0.5
        se = math.sqrt(p * (1 - p) / trials) if trials > 0 else None
        z = self.Z_SCORES.get(confidence, 1.96)
        moe = z * se if se else None
        
        return ConfidenceResult(
            point_estimate=p,
            lower_bound=lower,
            upper_bound=upper,
            confidence_level=confidence,
            method=ConfidenceMethod.CLopper_PEARSON,
            sample_size=trials,
            standard_error=se,
            margin_of_error=moe
        )
    
    def _normal_approximation(
        self,
        p: float,
        n: int,
        confidence: float
    ) -> ConfidenceResult:
        """
        Normal approximation - simple but less accurate for small samples
        """
        z = self.Z_SCORES.get(confidence, 1.96)
        se = math.sqrt(p * (1 - p) / n) if n > 0 else 0
        moe = z * se
        
        return ConfidenceResult(
            point_estimate=p,
            lower_bound=max(0, p - moe),
            upper_bound=min(1, p + moe),
            confidence_level=confidence,
            method=ConfidenceMethod.NORMAL,
            sample_size=n,
            standard_error=se,
            margin_of_error=moe
        )
    
    def calculate_for_score(
        self,
        score: float,
        factors: List[Any],
        method: ConfidenceMethod = ConfidenceMethod.WILSON
    ) -> Tuple[float, float]:
        """
        Calculate confidence interval for a reputation score
        
        Args:
            score: Point estimate score (0-100)
            factors: Risk factors contributing to score
            method: Calculation method
            
        Returns:
            Tuple of (lower_bound, upper_bound)
        """
        # Use number of factors as proxy for sample size
        n = max(len(factors), 10)
        
        # Convert score to proportion
        p = score / 100.0
        
        result = self.calculate(
            successes=int(p * n),
            trials=n,
            method=method
        )
        
        return (result.lower_bound * 100, result.upper_bound * 100)
    
    def aggregate_confidence(
        self,
        individual_confidences: List[float],
        weights: Optional[List[float]] = None
    ) -> float:
        """
        Aggregate multiple confidence scores into a single value
        
        Args:
            individual_confidences: List of confidence values (0-1)
            weights: Optional weights for each confidence
            
        Returns:
            Aggregated confidence score
        """
        if not individual_confidences:
            return 0.0
        
        if weights is None:
            weights = [1.0] * len(individual_confidences)
        
        if len(weights) != len(individual_confidences):
            weights = [1.0] * len(individual_confidences)
        
        # Weighted geometric mean - penalizes low confidences more
        log_confidences = [
            math.log(max(c, 0.001)) * w
            for c, w in zip(individual_confidences, weights)
        ]
        total_weight = sum(weights)
        
        if total_weight == 0:
            return 0.0
        
        geo_mean = math.exp(sum(log_confidences) / total_weight)
        
        # Adjust for number of factors (more factors = higher potential confidence)
        factor_bonus = min(0.2, len(individual_confidences) * 0.02)
        
        return min(1.0, geo_mean + factor_bonus)
    
    def calculate_uncertainty(
        self,
        data_quality: float,
        source_reliability: float,
        sample_size: int,
        time_since_update: float  # hours
    ) -> float:
        """
        Calculate overall uncertainty score
        
        Args:
            data_quality: Data quality score (0-1)
            source_reliability: Source reliability score (0-1)
            sample_size: Number of data points
            time_since_update: Hours since last update
            
        Returns:
            Uncertainty score (0-1, higher = more uncertain)
        """
        # Base uncertainty from data quality
        quality_uncertainty = 1 - data_quality
        
        # Uncertainty from source reliability
        reliability_uncertainty = 1 - source_reliability
        
        # Sample size uncertainty (diminishing returns after ~30)
        sample_uncertainty = 1 / math.sqrt(max(sample_size, 1))
        
        # Time decay uncertainty (increases with age)
        time_uncertainty = min(1.0, time_since_update / (24 * 7))  # Max after 1 week
        
        # Combine uncertainties (weighted average)
        uncertainty = (
            0.3 * quality_uncertainty +
            0.25 * reliability_uncertainty +
            0.25 * sample_uncertainty +
            0.2 * time_uncertainty
        )
        
        return min(1.0, uncertainty)
