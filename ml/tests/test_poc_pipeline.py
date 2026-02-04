#!/usr/bin/env python3
"""
Comprehensive test suite for the DoppelDown ML Threat Detection PoC Pipeline.

Tests cover:
- Feature extraction (30+ features)
- Dataset generation quality
- Model training & evaluation
- Threat scoring accuracy
- Edge cases and robustness
- Batch processing
"""

import os
import sys
import json
import math
import tempfile
import shutil
from collections import Counter

import numpy as np
import pytest

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from poc_threat_pipeline import (
    FeatureExtractor, ThreatDatasetGenerator, ThreatDetectionPipeline,
    ThreatScorer, ThreatScore, ThreatType, RiskLevel,
    KNOWN_BRANDS, SUSPICIOUS_TLDS, PHISHING_KEYWORDS, HOMOGLYPH_MAP,
)


# ============================================================================
# Feature Extractor Tests
# ============================================================================

class TestFeatureExtractor:
    """Tests for the FeatureExtractor."""

    @pytest.fixture
    def fe(self):
        return FeatureExtractor()

    def test_feature_count(self, fe):
        """Should extract the correct number of features."""
        features = fe.extract("google.com", "google")
        assert len(features) == len(FeatureExtractor.FEATURE_NAMES)
        assert len(features) == 35  # 30+ features

    def test_no_nan_values(self, fe):
        """Features should never contain NaN."""
        test_cases = [
            ("google.com", "google"),
            ("a.tk", "verylongbrandname"),
            ("sub.domain.example.com", "example"),
            ("123.456.789.com", "brand"),
            ("x.y", "z"),
        ]
        for domain, brand in test_cases:
            features = fe.extract(domain, brand)
            assert not np.any(np.isnan(features)), f"NaN in features for {domain}"

    def test_legitimate_domain_features(self, fe):
        """Legitimate domains should have low threat indicators."""
        features = fe.extract("google.com", "google")
        names = FeatureExtractor.FEATURE_NAMES

        # Brand should be in domain
        assert features[names.index('brand_in_domain')] == 1.0
        # No suspicious TLD
        assert features[names.index('suspicious_tld_score')] == 0.0
        # No phishing keywords
        assert features[names.index('phishing_keyword_count')] == 0
        # Low Levenshtein distance
        assert features[names.index('levenshtein_distance')] == 0

    def test_threat_domain_features(self, fe):
        """Threat domains should have high threat indicators."""
        features = fe.extract("g00gle-login.tk", "google")
        names = FeatureExtractor.FEATURE_NAMES

        # Suspicious TLD
        assert features[names.index('suspicious_tld_score')] > 0.5
        # Phishing keywords present
        assert features[names.index('phishing_keyword_count')] > 0
        # Digit substitution
        assert features[names.index('digit_substitution_count')] > 0

    def test_homoglyph_detection(self, fe):
        """Should detect homoglyph attacks."""
        # Cyrillic 'а' (U+0430) looks like Latin 'a'
        features = fe.extract("аpple.com", "apple")
        names = FeatureExtractor.FEATURE_NAMES

        homoglyph_score = features[names.index('homoglyph_score')]
        assert homoglyph_score > 0, "Should detect Cyrillic homoglyph"

    def test_shannon_entropy(self, fe):
        """Shannon entropy should be calculated correctly."""
        # All same characters -> entropy = 0
        assert fe._shannon_entropy("aaaa") == 0.0
        # Two equally distributed chars -> entropy = 1.0
        assert abs(fe._shannon_entropy("ab") - 1.0) < 0.01
        # Empty string -> 0
        assert fe._shannon_entropy("") == 0.0

    def test_jaro_winkler(self, fe):
        """Jaro-Winkler similarity should work correctly."""
        assert fe._jaro_winkler("google", "google") == 1.0
        assert fe._jaro_winkler("google", "gogle") > 0.9
        assert fe._jaro_winkler("google", "zzzzz") < 0.5
        assert fe._jaro_winkler("", "") == 1.0
        assert fe._jaro_winkler("a", "") == 0.0

    def test_levenshtein_distance(self, fe):
        """Levenshtein distance should be correct."""
        assert fe._levenshtein_distance("google", "google") == 0
        assert fe._levenshtein_distance("google", "gogle") == 1
        assert fe._levenshtein_distance("google", "googel") == 1
        assert fe._levenshtein_distance("", "abc") == 3
        assert fe._levenshtein_distance("kitten", "sitting") == 3

    def test_lcs_ratio(self, fe):
        """LCS ratio should be correct."""
        assert fe._lcs_ratio("google", "google") == 1.0
        assert fe._lcs_ratio("", "") == 0.0
        assert 0 < fe._lcs_ratio("google", "gogle") < 1.0

    def test_batch_extraction(self, fe):
        """Batch extraction should work correctly."""
        domains = ["google.com", "gogle.com", "g00gle.tk"]
        X = fe.extract_batch(domains, "google")
        assert X.shape == (3, len(FeatureExtractor.FEATURE_NAMES))
        assert not np.any(np.isnan(X))

    def test_suspicious_tld_scoring(self, fe):
        """Suspicious TLDs should score high."""
        for tld in ['tk', 'ml', 'ga', 'cf']:
            features = fe.extract(f"brand.{tld}", "brand")
            idx = FeatureExtractor.FEATURE_NAMES.index('suspicious_tld_score')
            assert features[idx] > 0.5, f"TLD .{tld} should be suspicious"

    def test_digit_substitution_detection(self, fe):
        """Should detect digit-for-letter substitutions."""
        features = fe.extract("g00gle.com", "google")
        idx = FeatureExtractor.FEATURE_NAMES.index('digit_substitution_count')
        assert features[idx] > 0

    def test_mixed_script_detection(self, fe):
        """Should detect mixed script domains."""
        # Latin + Cyrillic mix
        features = fe.extract("аpple.com", "apple")  # Cyrillic а
        idx = FeatureExtractor.FEATURE_NAMES.index('mixed_script_score')
        assert features[idx] > 0

    def test_visual_similarity(self, fe):
        """Visual similarity should be high for homoglyph attacks."""
        # After normalization, should look very similar
        score = fe._visual_similarity("g00gle", "google")
        assert score > 0.5, "Digit substitution should have high visual similarity"


# ============================================================================
# Dataset Generator Tests
# ============================================================================

class TestDatasetGenerator:
    """Tests for the ThreatDatasetGenerator."""

    @pytest.fixture
    def gen(self):
        return ThreatDatasetGenerator(seed=42)

    def test_generates_correct_count(self, gen):
        """Should generate the requested number of samples."""
        samples = gen.generate(1000)
        assert len(samples) == 1000

    def test_balanced_labels(self, gen):
        """Should generate roughly balanced labels."""
        samples = gen.generate(10000)
        labels = [s['label'] for s in samples]
        pos_ratio = sum(labels) / len(labels)
        assert 0.4 <= pos_ratio <= 0.6, f"Imbalanced: {pos_ratio:.2f}"

    def test_all_threat_types_present(self, gen):
        """Should include all threat types."""
        samples = gen.generate(10000)
        types = set(s['threat_type'] for s in samples)
        assert ThreatType.LEGITIMATE.value in types
        assert ThreatType.TYPOSQUATTING.value in types
        assert ThreatType.COMBOSQUATTING.value in types
        assert ThreatType.HOMOGLYPH.value in types

    def test_domain_format(self, gen):
        """All domains should have valid format."""
        samples = gen.generate(1000)
        for s in samples:
            assert '.' in s['domain'], f"Invalid domain: {s['domain']}"
            parts = s['domain'].split('.')
            assert len(parts) >= 2, f"Domain needs SLD.TLD: {s['domain']}"

    def test_reproducibility(self, gen):
        """Same seed should produce same results."""
        gen2 = ThreatDatasetGenerator(seed=42)
        s1 = gen.generate(100)
        s2 = gen2.generate(100)
        assert s1[0]['domain'] == s2[0]['domain']

    def test_brand_coverage(self, gen):
        """Should use multiple brands."""
        samples = gen.generate(5000)
        brands = set(s['brand'] for s in samples)
        assert len(brands) >= 10, "Should use diverse brands"

    def test_threat_diversity(self, gen):
        """Threats should use diverse techniques."""
        samples = gen.generate(5000)
        threat_types = Counter(s['threat_type'] for s in samples if s['label'] == 1)
        # Should have at least 4 different threat types
        assert len(threat_types) >= 4


# ============================================================================
# Pipeline Training Tests
# ============================================================================

class TestPipeline:
    """Tests for the ThreatDetectionPipeline."""

    @pytest.fixture
    def trained_pipeline(self, tmp_path):
        """Train a small pipeline for testing."""
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(3000)

        pipeline = ThreatDetectionPipeline(model_dir=str(tmp_path / "models"))
        X, y, valid = pipeline.prepare_data(samples)
        pipeline.train(X, y)
        return pipeline

    def test_feature_preparation(self):
        """Should extract features from samples."""
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(500)

        pipeline = ThreatDetectionPipeline()
        X, y, valid = pipeline.prepare_data(samples)

        assert X.shape[0] > 0
        assert X.shape[1] == len(FeatureExtractor.FEATURE_NAMES)
        assert len(y) == X.shape[0]
        assert set(y).issubset({0, 1})

    def test_model_training(self, trained_pipeline):
        """Pipeline should train successfully."""
        assert trained_pipeline.is_trained
        assert trained_pipeline.classifier is not None
        assert trained_pipeline.anomaly_detector is not None

    def test_training_stats(self, trained_pipeline):
        """Should record training statistics."""
        stats = trained_pipeline.training_stats
        assert 'rf_accuracy' in stats
        assert 'gb_accuracy' in stats
        assert 'ensemble_accuracy' in stats
        assert stats['ensemble_accuracy'] > 0.7, "Ensemble accuracy should be > 70%"

    def test_model_persistence(self, trained_pipeline, tmp_path):
        """Should save and load models correctly."""
        model_dir = str(tmp_path / "saved_models")
        trained_pipeline.model_dir = model_dir
        trained_pipeline.save()

        # Check files exist
        assert os.path.exists(os.path.join(model_dir, 'classifier.joblib'))
        assert os.path.exists(os.path.join(model_dir, 'anomaly_detector.joblib'))
        assert os.path.exists(os.path.join(model_dir, 'scaler.joblib'))
        assert os.path.exists(os.path.join(model_dir, 'training_stats.json'))

        # Load into new pipeline
        new_pipeline = ThreatDetectionPipeline(model_dir=model_dir)
        new_pipeline.load()
        assert new_pipeline.is_trained

    def test_accuracy_above_threshold(self, trained_pipeline):
        """Model should achieve reasonable accuracy."""
        assert trained_pipeline.training_stats['ensemble_accuracy'] > 0.75

    def test_auc_roc_above_threshold(self, trained_pipeline):
        """AUC-ROC should be reasonable."""
        if 'auc_roc' in trained_pipeline.training_stats:
            assert trained_pipeline.training_stats['auc_roc'] > 0.80


# ============================================================================
# Threat Scorer Tests
# ============================================================================

class TestThreatScorer:
    """Tests for the ThreatScorer."""

    @pytest.fixture
    def scorer(self, tmp_path):
        """Create a trained scorer."""
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(5000)

        pipeline = ThreatDetectionPipeline(model_dir=str(tmp_path / "models"))
        X, y, valid = pipeline.prepare_data(samples)
        pipeline.train(X, y)

        return ThreatScorer(pipeline)

    def test_legitimate_domain_low_score(self, scorer):
        """Legitimate domains should score low."""
        result = scorer.score_domain("google.com", "google")
        assert result.threat_score < 0.5, f"google.com should be low risk, got {result.threat_score}"
        assert result.risk_level in ['low', 'medium']

    def test_obvious_threat_high_score(self, scorer):
        """Obvious threats should score high."""
        result = scorer.score_domain("g00gle-login-verify.tk", "google")
        assert result.threat_score > 0.5, f"Threat domain should be high risk, got {result.threat_score}"
        assert result.is_threat

    def test_typosquat_detection(self, scorer):
        """Should detect typosquatting."""
        result = scorer.score_domain("gogle.com", "google")
        techniques = ' '.join(result.detected_techniques)
        assert 'typosquatting' in techniques or result.threat_score > 0.3

    def test_homoglyph_detection(self, scorer):
        """Should detect homoglyph attacks."""
        result = scorer.score_domain("аpple.com", "apple")  # Cyrillic а
        assert any('homoglyph' in t for t in result.detected_techniques) or result.threat_score > 0.4

    def test_combosquat_detection(self, scorer):
        """Should detect combosquatting."""
        result = scorer.score_domain("google-login-verify.xyz", "google")
        assert result.is_threat or result.threat_score > 0.4

    def test_suspicious_tld_detection(self, scorer):
        """Should flag suspicious TLDs."""
        result = scorer.score_domain("google.tk", "google")
        assert any('tld' in t.lower() for t in result.detected_techniques)

    def test_score_contains_all_fields(self, scorer):
        """ThreatScore should have all required fields."""
        result = scorer.score_domain("test.com", "test")
        assert isinstance(result, ThreatScore)
        assert result.domain == "test.com"
        assert result.brand_name == "test"
        assert 0 <= result.threat_score <= 1
        assert result.risk_level in ['low', 'medium', 'high', 'critical']
        assert isinstance(result.is_threat, bool)
        assert 0 <= result.confidence <= 1
        assert isinstance(result.detected_techniques, list)
        assert isinstance(result.feature_importance, dict)
        assert isinstance(result.recommendations, list)
        assert result.processing_time_ms > 0

    def test_risk_levels(self, scorer):
        """Risk levels should be properly assigned."""
        # Low risk
        low = scorer.score_domain("google.com", "google")
        assert low.risk_level in ['low', 'medium']

        # Should be higher risk
        high = scorer.score_domain("g00gle-secure-login-verify.tk", "google")
        assert high.threat_score > low.threat_score

    def test_batch_scoring(self, scorer):
        """Batch scoring should work correctly."""
        domains = ["google.com", "gogle.com", "g00gle.tk"]
        results = scorer.score_batch(domains, "google")
        assert len(results) == 3
        assert all(isinstance(r, ThreatScore) for r in results)

    def test_to_dict(self, scorer):
        """ThreatScore should serialize to dict."""
        result = scorer.score_domain("test.com", "test")
        d = result.to_dict()
        assert isinstance(d, dict)
        assert 'domain' in d
        assert 'threat_score' in d
        assert 'risk_level' in d
        assert 'detected_techniques' in d

    def test_recommendations_generated(self, scorer):
        """Should generate recommendations."""
        result = scorer.score_domain("g00gle-login.tk", "google")
        assert len(result.recommendations) > 0

    def test_scoring_speed(self, scorer):
        """Scoring should be fast."""
        result = scorer.score_domain("test.com", "test")
        assert result.processing_time_ms < 500, "Scoring should be < 500ms"

    def test_feature_importance_present(self, scorer):
        """Should provide feature importance."""
        result = scorer.score_domain("g00gle.tk", "google")
        assert len(result.feature_importance) > 0
        # Values should be floats between 0 and 1
        for v in result.feature_importance.values():
            assert 0 <= v <= 1


# ============================================================================
# Edge Case Tests
# ============================================================================

class TestEdgeCases:
    """Test edge cases and robustness."""

    @pytest.fixture
    def fe(self):
        return FeatureExtractor()

    def test_empty_brand(self, fe):
        """Should handle empty brand name."""
        features = fe.extract("test.com", "")
        assert not np.any(np.isnan(features))

    def test_very_long_domain(self, fe):
        """Should handle very long domains."""
        long_domain = "a" * 200 + ".com"
        features = fe.extract(long_domain, "brand")
        assert not np.any(np.isnan(features))

    def test_short_domain(self, fe):
        """Should handle very short domains."""
        features = fe.extract("a.b", "c")
        assert not np.any(np.isnan(features))

    def test_numeric_domain(self, fe):
        """Should handle all-numeric domains."""
        features = fe.extract("12345.com", "brand")
        assert not np.any(np.isnan(features))

    def test_hyphen_only_sld(self, fe):
        """Should handle hyphen-heavy domains."""
        features = fe.extract("a-b-c-d-e.com", "brand")
        assert not np.any(np.isnan(features))

    def test_unicode_domain(self, fe):
        """Should handle Unicode domains."""
        features = fe.extract("тест.com", "test")
        assert not np.any(np.isnan(features))

    def test_subdomain_handling(self, fe):
        """Should handle subdomains correctly."""
        features = fe.extract("sub1.sub2.domain.com", "domain")
        names = FeatureExtractor.FEATURE_NAMES
        assert features[names.index('subdomain_count')] == 2

    def test_identical_domain_and_brand(self, fe):
        """When domain SLD equals brand, distance should be 0."""
        features = fe.extract("google.com", "google")
        names = FeatureExtractor.FEATURE_NAMES
        assert features[names.index('levenshtein_distance')] == 0
        assert features[names.index('jaro_winkler_similarity')] == 1.0


# ============================================================================
# Integration Tests
# ============================================================================

class TestIntegration:
    """End-to-end integration tests."""

    def test_full_pipeline_flow(self, tmp_path):
        """Complete pipeline should run without errors."""
        # Generate
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(2000)
        assert len(samples) == 2000

        # Prepare
        pipeline = ThreatDetectionPipeline(model_dir=str(tmp_path / "models"))
        X, y, valid = pipeline.prepare_data(samples)
        assert X.shape[0] > 0

        # Train
        pipeline.train(X, y)
        assert pipeline.is_trained

        # Save & Load
        pipeline.save()
        new_pipeline = ThreatDetectionPipeline(model_dir=str(tmp_path / "models"))
        new_pipeline.load()
        assert new_pipeline.is_trained

        # Score
        scorer = ThreatScorer(new_pipeline)
        result = scorer.score_domain("g00gle.tk", "google")
        assert isinstance(result, ThreatScore)
        assert result.threat_score > 0  # Should not be exactly 0

    def test_threat_type_accuracy(self, tmp_path):
        """Pipeline should correctly classify different threat types."""
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(5000)

        pipeline = ThreatDetectionPipeline(model_dir=str(tmp_path / "models"))
        X, y, valid = pipeline.prepare_data(samples)
        pipeline.train(X, y)

        scorer = ThreatScorer(pipeline)

        # Test various threat types
        tests = [
            ("google.com", "google", False),     # Legitimate
            ("gogle.com", "google", True),        # Typosquat
            ("google-login.tk", "google", True),  # Combo + suspicious TLD
        ]

        correct = 0
        for domain, brand, expected_threat in tests:
            result = scorer.score_domain(domain, brand)
            if result.is_threat == expected_threat:
                correct += 1

        accuracy = correct / len(tests)
        assert accuracy >= 0.5, f"Should get at least 50% of test cases right, got {accuracy:.1%}"


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
