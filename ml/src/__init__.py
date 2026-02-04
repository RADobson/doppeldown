"""
DoppelDown Machine Learning Module
Advanced threat detection using NLP and machine learning.

Includes:
- Core ML models (Autoencoder, Isolation Forest)
- Traditional NLP analysis (spaCy, NLTK)
- Transformer-based threat detection (BERT, Sentence Transformers)
- NLP ensemble system for robust predictions
"""

from .threat_detection_model import (
    ThreatDetectionModel,
    AutoencoderThreatModel,
    IsolationForestThreatModel,
    EnsembleThreatModel,
    DetectionResult
)

from .realtime_scorer import (
    RealTimeThreatScorer,
    FeatureExtractor,
    RealTimeScore
)

from .dataset_generator import (
    BrandImpersonationDataset,
    BrandImpersonationSample
)

# NLP components (optional - only available if dependencies installed)
try:
    from .nlp_analyzer import (
        NLPAnalyzer,
        NLPEntityRecognizer,
        NLPSentimentAnalyzer,
        LinguisticAnalyzer,
        analyze_text,
        ThreatCategory
    )
    from .contextual_threat_scorer import (
        ContextualThreatScorer,
        ContextualThreatAssessment,
        score_domain_threat,
        score_email_threat
    )
    from .brand_impersonation_nlp import (
        BrandImpersonationDetector,
        BrandImpersonationResult,
        ImpersonationTechnique,
        detect_impersonation
    )
    from .nlp_integration import (
        NLPIntegratedThreatDetector,
        IntegratedThreatResult,
        detect_threat
    )
    NLP_AVAILABLE = True
except ImportError as e:
    NLP_AVAILABLE = False
    import logging
    logging.warning(f"NLP components not available: {e}")

# Transformer-based components (optional - requires transformers, torch)
TRANSFORMERS_AVAILABLE = False
try:
    from .transformer_threat_detector import (
        TransformerThreatDetector,
        TransformerConfig,
        ThreatDetectionResult,
        BatchDetectionResult,
        ThreatType,
        RiskLevel,
        HomoglyphAnalyzer,
        TyposquattingAnalyzer,
        SemanticBrandMatcher,
        PhishingContentClassifier,
        ThreatDetectorFactory,
        detect_threat as transformer_detect_threat,
        detect_threats_batch
    )
    from .nlp_threat_ensemble import (
        NLPThreatEnsemble,
        EnsembleConfig,
        EnsembleStrategy,
        EnsembleResult,
        ComponentScore,
        ModelRole,
        SemanticSimilarityComponent,
        CharacterAnalysisComponent,
        HeuristicRulesComponent,
        PhishingClassifierComponent,
        EnsembleFactory,
        predict_threat
    )
    TRANSFORMERS_AVAILABLE = True
except ImportError as e:
    import logging
    logging.warning(f"Transformer components not available: {e}")

__version__ = "2.0.0"

__all__ = [
    # Core ML
    'ThreatDetectionModel',
    'AutoencoderThreatModel',
    'IsolationForestThreatModel',
    'EnsembleThreatModel',
    'DetectionResult',
    'RealTimeThreatScorer',
    'FeatureExtractor',
    'RealTimeScore',
    'BrandImpersonationDataset',
    'BrandImpersonationSample',
    
    # Traditional NLP (if available)
    'NLPAnalyzer',
    'NLPEntityRecognizer',
    'NLPSentimentAnalyzer',
    'LinguisticAnalyzer',
    'ContextualThreatScorer',
    'ContextualThreatAssessment',
    'BrandImpersonationDetector',
    'BrandImpersonationResult',
    'ImpersonationTechnique',
    'NLPIntegratedThreatDetector',
    'IntegratedThreatResult',
    'ThreatCategory',
    
    # Transformer-based (if available)
    'TransformerThreatDetector',
    'TransformerConfig',
    'ThreatDetectionResult',
    'BatchDetectionResult',
    'ThreatType',
    'RiskLevel',
    'HomoglyphAnalyzer',
    'TyposquattingAnalyzer',
    'SemanticBrandMatcher',
    'PhishingContentClassifier',
    'ThreatDetectorFactory',
    'NLPThreatEnsemble',
    'EnsembleConfig',
    'EnsembleStrategy',
    'EnsembleResult',
    'ComponentScore',
    'ModelRole',
    'SemanticSimilarityComponent',
    'CharacterAnalysisComponent',
    'HeuristicRulesComponent',
    'PhishingClassifierComponent',
    'EnsembleFactory',
    
    # Functions
    'analyze_text',
    'score_domain_threat',
    'score_email_threat',
    'detect_impersonation',
    'detect_threat',
    'transformer_detect_threat',
    'detect_threats_batch',
    'predict_threat',
    
    # Constants
    'NLP_AVAILABLE',
    'TRANSFORMERS_AVAILABLE',
]
