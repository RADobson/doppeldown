"""
DoppelDown Domain Reputation Scoring System

A comprehensive multi-signal reputation calculation system that integrates:
- Domain WHOIS data
- SSL/TLS certificate history
- DNS record analysis
- Web archiving services
- Threat intelligence APIs
"""

__version__ = "1.0.0"
__author__ = "Ernie <ernie@dobsondevelopment.com.au>"

from .reputation_engine import DomainReputationEngine
from .scoring_model import ReputationScoringModel, RiskFactor
from .data_sources import (
    WhoisDataSource,
    SSLDataSource,
    DNSDataSource,
    WebArchiveDataSource,
    ThreatIntelDataSource
)
from .anomaly_detector import AnomalyDetector
from .confidence_calculator import ConfidenceCalculator

__all__ = [
    'DomainReputationEngine',
    'ReputationScoringModel',
    'RiskFactor',
    'WhoisDataSource',
    'SSLDataSource',
    'DNSDataSource',
    'WebArchiveDataSource',
    'ThreatIntelDataSource',
    'AnomalyDetector',
    'ConfidenceCalculator'
]
