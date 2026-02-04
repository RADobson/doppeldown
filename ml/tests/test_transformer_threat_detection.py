"""
Test suite for transformer-based threat detection module.

Tests cover:
- Homoglyph detection
- Typosquatting analysis
- Semantic similarity
- Phishing content classification
- Ensemble predictions
- Edge cases and error handling
"""

import pytest
import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from transformer_threat_detector import (
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
    ThreatDetectorFactory
)

from nlp_threat_ensemble import (
    NLPThreatEnsemble,
    EnsembleConfig,
    EnsembleStrategy,
    EnsembleResult,
    SemanticSimilarityComponent,
    CharacterAnalysisComponent,
    HeuristicRulesComponent,
    PhishingClassifierComponent,
    EnsembleFactory
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def detector():
    """Create a transformer threat detector."""
    return TransformerThreatDetector(lazy_load=True)


@pytest.fixture
def ensemble():
    """Create an NLP ensemble."""
    return NLPThreatEnsemble()


@pytest.fixture
def homoglyph_analyzer():
    """Create a homoglyph analyzer."""
    return HomoglyphAnalyzer()


@pytest.fixture
def typosquatting_analyzer():
    """Create a typosquatting analyzer."""
    return TyposquattingAnalyzer()


@pytest.fixture
def phishing_classifier():
    """Create a phishing classifier."""
    return PhishingContentClassifier()


# ============================================================================
# Homoglyph Detection Tests
# ============================================================================

class TestHomoglyphAnalyzer:
    """Tests for homoglyph detection."""
    
    def test_detects_cyrillic_a(self):
        """Test detection of Cyrillic 'а' substitution."""
        result = HomoglyphAnalyzer.detect_homoglyphs("аpple.com", "apple")
        
        assert result['has_homoglyphs'] is True
        assert result['homoglyph_count'] >= 1
        assert result['risk_score'] > 0.8
    
    def test_detects_cyrillic_o(self):
        """Test detection of Cyrillic 'о' substitution."""
        result = HomoglyphAnalyzer.detect_homoglyphs("gооgle.com", "google")
        
        assert result['has_homoglyphs'] is True
        assert 'exact_homoglyph_match' in str(result.get('attack_type', '')) or result['risk_score'] > 0.8
    
    def test_normalizes_homoglyphs(self):
        """Test homoglyph normalization."""
        normalized = HomoglyphAnalyzer._normalize_homoglyphs("gооgle")
        assert normalized == "google" or 'o' in normalized
    
    def test_clean_domain_no_homoglyphs(self):
        """Test that clean domains don't trigger false positives."""
        result = HomoglyphAnalyzer.detect_homoglyphs("google.com", "google")
        
        assert result['has_homoglyphs'] is False
        assert result['homoglyph_count'] == 0
    
    def test_mixed_script_detection(self):
        """Test detection of mixed scripts."""
        result = HomoglyphAnalyzer.detect_homoglyphs("gооgle.com", "google")
        unicode_analysis = result.get('unicode_analysis', {})
        
        # Should detect mixed scripts or homoglyphs
        assert result['has_homoglyphs'] or unicode_analysis.get('mixed_scripts', False)
    
    def test_unicode_analysis(self):
        """Test unicode character analysis."""
        analysis = HomoglyphAnalyzer._analyze_unicode("tеst")  # Cyrillic 'е'
        
        assert 'scripts' in analysis
        assert 'categories' in analysis


# ============================================================================
# Typosquatting Detection Tests
# ============================================================================

class TestTyposquattingAnalyzer:
    """Tests for typosquatting detection."""
    
    def test_character_omission(self):
        """Test detection of character omission."""
        result = TyposquattingAnalyzer.analyze("gogle.com", "google")
        
        assert result['is_typosquat'] is True
        assert any(t['type'] == 'character_omission' for t in result['techniques_detected'])
    
    def test_character_repetition(self):
        """Test detection of character repetition."""
        result = TyposquattingAnalyzer.analyze("gooogle.com", "google")
        
        assert result['is_typosquat'] is True
        assert any(t['type'] == 'character_repetition' for t in result['techniques_detected'])
    
    def test_character_transposition(self):
        """Test detection of character transposition."""
        result = TyposquattingAnalyzer.analyze("googel.com", "google")
        
        assert result['is_typosquat'] is True
        assert any(t['type'] == 'character_transposition' for t in result['techniques_detected'])
    
    def test_keyboard_proximity(self):
        """Test detection of keyboard proximity errors."""
        result = TyposquattingAnalyzer.analyze("goofle.com", "google")  # f is near g
        
        assert result['keyboard_distance'] > 0 or result['is_typosquat']
    
    def test_digit_substitution(self):
        """Test detection of digit substitution."""
        result = TyposquattingAnalyzer.analyze("g00gle.com", "google")
        
        assert result['is_typosquat'] is True
        assert any(t['type'] == 'digit_substitution' for t in result['techniques_detected'])
    
    def test_legitimate_domain(self):
        """Test that legitimate domains don't trigger false positives."""
        result = TyposquattingAnalyzer.analyze("google.com", "google")
        
        assert result['is_typosquat'] is False
        assert result['edit_distance'] == 0
    
    def test_similarity_score(self):
        """Test similarity score calculation."""
        result = TyposquattingAnalyzer.analyze("gogle.com", "google")
        
        assert result['similarity_score'] > 0.8  # Very similar
    
    def test_edit_distance(self):
        """Test edit distance calculation."""
        distance = TyposquattingAnalyzer._edit_distance("google", "gogle")
        assert distance == 1
        
        distance = TyposquattingAnalyzer._edit_distance("google", "google")
        assert distance == 0


# ============================================================================
# Transformer Threat Detector Tests
# ============================================================================

class TestTransformerThreatDetector:
    """Tests for the main transformer threat detector."""
    
    def test_basic_threat_detection(self, detector):
        """Test basic threat detection."""
        result = detector.detect_threat(
            "google-login-verify.com",
            "google"
        )
        
        assert isinstance(result, ThreatDetectionResult)
        assert result.domain_or_text == "google-login-verify.com"
        assert result.brand_name == "google"
        assert isinstance(result.is_threat, bool)
        assert 0 <= result.overall_score <= 1
    
    def test_detects_combo_squatting(self, detector):
        """Test detection of combo-squatting."""
        result = detector.detect_threat(
            "google-security-support.com",
            "google"
        )
        
        assert result.is_threat is True
        assert result.overall_score > 0.5
        assert any('combo' in t.lower() for t in result.detected_techniques)
    
    def test_detects_suspicious_tld(self, detector):
        """Test detection of suspicious TLDs."""
        result = detector.detect_threat(
            "google-verify.tk",
            "google"
        )
        
        assert result.is_threat is True
        assert any('tld' in t.lower() for t in result.detected_techniques)
    
    def test_legitimate_domain(self, detector):
        """Test that legitimate domains score low."""
        result = detector.detect_threat(
            "microsoft.com",
            "microsoft"
        )
        
        # Should be very low threat or no threat
        assert result.overall_score < 0.5 or result.risk_level in [RiskLevel.LOW, RiskLevel.MINIMAL]
    
    def test_with_page_content(self, detector):
        """Test threat detection with page content."""
        phishing_content = """
        URGENT: Your account has been suspended!
        Please verify your identity immediately by entering your password.
        Click here to confirm your account details.
        """
        
        result = detector.detect_threat(
            "apple-verify.xyz",
            "apple",
            page_content=phishing_content
        )
        
        assert result.is_threat is True
        assert result.phishing_classifier_score > 0.3
    
    def test_risk_level_calculation(self, detector):
        """Test risk level calculation."""
        # High threat
        result = detector.detect_threat(
            "gооgle-security-verify.tk",  # Cyrillic o's
            "google"
        )
        
        assert result.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL, RiskLevel.MEDIUM]
    
    def test_recommendations_generated(self, detector):
        """Test that recommendations are generated."""
        result = detector.detect_threat(
            "paypal-secure-login.xyz",
            "paypal"
        )
        
        if result.is_threat:
            assert len(result.recommendations) > 0
    
    def test_processing_time_recorded(self, detector):
        """Test that processing time is recorded."""
        result = detector.detect_threat(
            "test.com",
            "test"
        )
        
        assert result.processing_time_ms >= 0
    
    def test_batch_detection(self, detector):
        """Test batch threat detection."""
        items = [
            ("google.com", "google"),
            ("google-verify.xyz", "google"),
            ("microsoft-support.tk", "microsoft"),
        ]
        
        result = detector.detect_threats_batch(items)
        
        assert isinstance(result, BatchDetectionResult)
        assert result.total_analyzed == 3
        assert len(result.results) == 3
        assert result.processing_time_ms >= 0
    
    def test_to_dict_serialization(self, detector):
        """Test result serialization to dict."""
        result = detector.detect_threat(
            "test-domain.com",
            "test"
        )
        
        result_dict = result.to_dict()
        
        assert isinstance(result_dict, dict)
        assert 'is_threat' in result_dict
        assert 'overall_score' in result_dict
        assert 'risk_level' in result_dict


# ============================================================================
# Phishing Content Classifier Tests
# ============================================================================

class TestPhishingContentClassifier:
    """Tests for phishing content classification."""
    
    def test_detects_urgency_language(self, phishing_classifier):
        """Test detection of urgency language."""
        result = phishing_classifier.classify(
            "URGENT: Act immediately! Your account expires in 24 hours!"
        )
        
        assert result['phishing_score'] > 0.3
        assert 'urgency' in result['pattern_analysis']['categories_detected']
    
    def test_detects_credential_requests(self, phishing_classifier):
        """Test detection of credential requests."""
        result = phishing_classifier.classify(
            "Please enter your password and SSN to verify your identity."
        )
        
        assert result['phishing_score'] > 0.3
        assert 'credentials' in result['pattern_analysis']['categories_detected']
    
    def test_detects_threat_language(self, phishing_classifier):
        """Test detection of threat language."""
        result = phishing_classifier.classify(
            "Your account will be suspended due to unauthorized activity."
        )
        
        assert result['phishing_score'] > 0.3
        assert 'threats' in result['pattern_analysis']['categories_detected']
    
    def test_normal_content_low_score(self, phishing_classifier):
        """Test that normal content gets low score."""
        result = phishing_classifier.classify(
            "Welcome to our website. Browse our products and enjoy shopping!"
        )
        
        assert result['phishing_score'] < 0.5
    
    def test_combined_indicators(self, phishing_classifier):
        """Test detection of multiple indicators."""
        result = phishing_classifier.classify(
            """
            URGENT: Your Apple account has been suspended!
            Unauthorized access detected. Your account will be terminated 
            within 24 hours unless you verify your password immediately.
            Click here to confirm your credentials.
            """
        )
        
        assert result['phishing_score'] > 0.5
        assert len(result['pattern_analysis']['categories_detected']) >= 2


# ============================================================================
# NLP Ensemble Tests
# ============================================================================

class TestNLPEnsemble:
    """Tests for the NLP threat ensemble."""
    
    def test_ensemble_prediction(self, ensemble):
        """Test basic ensemble prediction."""
        result = ensemble.predict(
            "google-verify-login.xyz",
            "google"
        )
        
        assert isinstance(result, EnsembleResult)
        assert isinstance(result.is_threat, bool)
        assert 0 <= result.threat_score <= 1
        assert len(result.component_scores) > 0
    
    def test_component_scores_present(self, ensemble):
        """Test that component scores are present."""
        result = ensemble.predict(
            "test-domain.com",
            "test"
        )
        
        assert len(result.component_scores) >= 3  # At least 3 components
        
        for cs in result.component_scores:
            assert 0 <= cs.score <= 1
            assert cs.latency_ms >= 0
    
    def test_agreement_level(self, ensemble):
        """Test agreement level calculation."""
        result = ensemble.predict(
            "obvious-phishing-google-verify.tk",
            "google"
        )
        
        assert 0 <= result.agreement_level <= 1
    
    def test_caching(self, ensemble):
        """Test result caching."""
        # First call
        result1 = ensemble.predict("test.com", "test", use_cache=True)
        
        # Second call (should be cached)
        result2 = ensemble.predict("test.com", "test", use_cache=True)
        
        assert result1.threat_score == result2.threat_score
    
    def test_strategies(self):
        """Test different ensemble strategies."""
        strategies = [
            EnsembleStrategy.WEIGHTED_AVERAGE,
            EnsembleStrategy.MAX_VOTE,
            EnsembleStrategy.SOFT_VOTE,
        ]
        
        for strategy in strategies:
            config = EnsembleConfig(strategy=strategy)
            ensemble = NLPThreatEnsemble(config=config)
            
            result = ensemble.predict("test.com", "test")
            assert 0 <= result.threat_score <= 1
    
    def test_batch_prediction(self, ensemble):
        """Test batch prediction."""
        items = [
            ("google.com", "google", None),
            ("google-verify.xyz", "google", None),
            ("microsoft.com", "microsoft", None),
        ]
        
        results = ensemble.predict_batch(items)
        
        assert len(results) == 3
        assert all(isinstance(r, EnsembleResult) for r in results)
    
    def test_to_dict_serialization(self, ensemble):
        """Test ensemble result serialization."""
        result = ensemble.predict("test.com", "test")
        
        result_dict = result.to_dict()
        
        assert isinstance(result_dict, dict)
        assert 'is_threat' in result_dict
        assert 'component_scores' in result_dict
    
    def test_component_info(self, ensemble):
        """Test getting component information."""
        info = ensemble.get_component_info()
        
        assert 'strategy' in info
        assert 'components' in info
        assert 'threshold' in info


# ============================================================================
# Factory Tests
# ============================================================================

class TestFactories:
    """Tests for detector factories."""
    
    def test_detector_factory_default(self):
        """Test default detector factory."""
        detector = ThreatDetectorFactory.create_default()
        assert isinstance(detector, TransformerThreatDetector)
    
    def test_detector_factory_lightweight(self):
        """Test lightweight detector factory."""
        detector = ThreatDetectorFactory.create_lightweight()
        assert isinstance(detector, TransformerThreatDetector)
        assert detector.config.max_length == 256
    
    def test_ensemble_factory_default(self):
        """Test default ensemble factory."""
        ensemble = EnsembleFactory.create_default()
        assert isinstance(ensemble, NLPThreatEnsemble)
    
    def test_ensemble_factory_lightweight(self):
        """Test lightweight ensemble factory."""
        ensemble = EnsembleFactory.create_lightweight()
        assert isinstance(ensemble, NLPThreatEnsemble)


# ============================================================================
# Component Tests
# ============================================================================

class TestIndividualComponents:
    """Tests for individual ensemble components."""
    
    def test_semantic_component(self):
        """Test semantic similarity component."""
        component = SemanticSimilarityComponent()
        
        score = component.score("google-verify.com", "google")
        
        assert 0 <= score.score <= 1
        assert score.latency_ms >= 0
    
    def test_character_component(self):
        """Test character analysis component."""
        component = CharacterAnalysisComponent()
        
        score = component.score("gogle.com", "google")
        
        assert 0 <= score.score <= 1
        assert 'edit_distance' in score.features_used
    
    def test_heuristic_component(self):
        """Test heuristic rules component."""
        component = HeuristicRulesComponent()
        
        score = component.score("google-secure-login.tk", "google")
        
        assert 0 <= score.score <= 1
        assert len(score.metadata.get('rules_triggered', [])) > 0
    
    def test_classifier_component(self):
        """Test phishing classifier component."""
        component = PhishingClassifierComponent()
        
        content = "Urgent: verify your password immediately!"
        score = component.score("test.com", "test", content)
        
        assert 0 <= score.score <= 1


# ============================================================================
# Edge Cases and Error Handling
# ============================================================================

class TestEdgeCases:
    """Tests for edge cases and error handling."""
    
    def test_empty_domain(self, detector):
        """Test handling of empty domain."""
        result = detector.detect_threat("", "google")
        assert isinstance(result, ThreatDetectionResult)
    
    def test_empty_brand(self, detector):
        """Test handling of empty brand."""
        result = detector.detect_threat("test.com", "")
        assert isinstance(result, ThreatDetectionResult)
    
    def test_unicode_domain(self, detector):
        """Test handling of unicode domain."""
        result = detector.detect_threat("例え.com", "example")
        assert isinstance(result, ThreatDetectionResult)
    
    def test_very_long_domain(self, detector):
        """Test handling of very long domain."""
        long_domain = "a" * 100 + ".com"
        result = detector.detect_threat(long_domain, "test")
        assert isinstance(result, ThreatDetectionResult)
    
    def test_special_characters_in_domain(self, detector):
        """Test handling of special characters."""
        result = detector.detect_threat("test-domain_123.com", "test")
        assert isinstance(result, ThreatDetectionResult)
    
    def test_none_content(self, detector):
        """Test handling of None content."""
        result = detector.detect_threat("test.com", "test", page_content=None)
        assert isinstance(result, ThreatDetectionResult)
    
    def test_very_long_content(self, detector):
        """Test handling of very long content."""
        long_content = "This is test content. " * 10000
        result = detector.detect_threat("test.com", "test", page_content=long_content)
        assert isinstance(result, ThreatDetectionResult)


# ============================================================================
# Integration Tests
# ============================================================================

class TestIntegration:
    """Integration tests for the complete pipeline."""
    
    def test_full_pipeline_threat(self, detector):
        """Test complete pipeline for a threat."""
        result = detector.detect_threat(
            "аpple-id-verify-secure.tk",  # Cyrillic 'а'
            "apple",
            page_content="""
            URGENT: Your Apple ID has been locked!
            Unauthorized sign-in detected. Verify your password immediately
            or your account will be permanently disabled within 24 hours.
            """
        )
        
        assert result.is_threat is True
        assert result.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
        assert len(result.detected_techniques) > 0
        assert len(result.recommendations) > 0
    
    def test_full_pipeline_safe(self, detector):
        """Test complete pipeline for a safe domain."""
        result = detector.detect_threat(
            "google.com",
            "google",
            page_content="""
            Welcome to Google. Search the world's information.
            """
        )
        
        # Should be low threat
        assert result.overall_score < 0.7
        assert result.risk_level in [RiskLevel.LOW, RiskLevel.MINIMAL, RiskLevel.MEDIUM]
    
    def test_ensemble_full_pipeline(self, ensemble):
        """Test ensemble complete pipeline."""
        result = ensemble.predict(
            "paypal-security-update.xyz",
            "paypal",
            content="Your account requires immediate verification."
        )
        
        assert result.is_threat is True
        assert len(result.component_scores) >= 3
        assert result.explanation is not None
        assert result.recommendations is not None


# ============================================================================
# Performance Tests
# ============================================================================

class TestPerformance:
    """Performance tests."""
    
    def test_single_detection_time(self, detector):
        """Test single detection is reasonably fast."""
        import time
        
        start = time.time()
        result = detector.detect_threat("test.com", "test")
        elapsed = (time.time() - start) * 1000
        
        # Should complete in under 5 seconds even without GPU
        assert elapsed < 5000
    
    def test_batch_detection_scaling(self, detector):
        """Test batch detection scales reasonably."""
        import time
        
        items = [(f"test{i}.com", "test") for i in range(10)]
        
        start = time.time()
        result = detector.detect_threats_batch(items)
        elapsed = (time.time() - start) * 1000
        
        # Average per item should be reasonable
        per_item = elapsed / len(items)
        assert per_item < 2000  # Less than 2 seconds per item


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
