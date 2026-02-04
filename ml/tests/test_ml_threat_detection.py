"""
Unit tests for ML threat detection components.
"""

import unittest
import numpy as np
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from dataset_generator import BrandImpersonationDataset
from threat_detection_model import (
    AutoencoderThreatModel,
    IsolationForestThreatModel,
    EnsembleThreatModel
)
from realtime_scorer import FeatureExtractor, RealTimeThreatScorer


class TestDatasetGenerator(unittest.TestCase):
    """Test the dataset generator."""
    
    def setUp(self):
        self.generator = BrandImpersonationDataset(random_seed=42)
    
    def test_generate_typosquatting(self):
        """Test typosquatting generation."""
        # Test character omission
        result = self.generator.generate_typosquatting("google", "character_omission")
        self.assertNotEqual(result, "google")
        self.assertEqual(len(result), len("google") - 1)
        
        # Test character repetition
        result = self.generator.generate_typosquatting("google", "character_repetition")
        self.assertTrue(len(result) > len("google"))
    
    def test_extract_features(self):
        """Test feature extraction."""
        features = self.generator.extract_features("g00gle.com", "google")
        
        self.assertIn("domain_length", features)
        self.assertIn("levenshtein_distance", features)
        self.assertIn("jaro_winkler", features)
        self.assertIn("has_homoglyph", features)
        
        # Check specific features
        self.assertEqual(features["digit_count"], 2)  # Two zeros in g00gle
        self.assertGreater(features["levenshtein_distance"], 0)
    
    def test_dataset_generation(self):
        """Test full dataset generation."""
        dataset = self.generator.generate_dataset(n_samples=100, impersonation_ratio=0.5)
        
        self.assertEqual(len(dataset), 100)
        
        # Check balance
        labels = [s.label for s in dataset]
        self.assertGreater(sum(labels), 0)  # Has some threats
        self.assertLess(sum(labels), 100)   # Has some legitimate


class TestFeatureExtractor(unittest.TestCase):
    """Test the feature extractor."""
    
    def setUp(self):
        self.extractor = FeatureExtractor()
    
    def test_extract_domain_features(self):
        """Test domain feature extraction."""
        features = self.extractor.extract_domain_features("g00gle-security.com", "google")
        
        # Check key features exist
        required_features = [
            "domain_length", "levenshtein_distance", "jaro_winkler",
            "has_homoglyph", "suspicious_tld", "has_phishing_keyword"
        ]
        for feat in required_features:
            self.assertIn(feat, features)
        
        # Check specific values
        self.assertEqual(features["hyphen_count"], 1)
        self.assertEqual(features["digit_count"], 2)
    
    def test_extract_social_features(self):
        """Test social media feature extraction."""
        features = self.extractor.extract_social_features(
            "google_official", "twitter", "google"
        )
        
        self.assertIn("username_length", features)
        self.assertIn("brand_in_username", features)
        self.assertEqual(features["has_official_suffix"], 1.0)
    
    def test_homoglyph_detection(self):
        """Test homoglyph detection."""
        # Cyrillic 'о' in place of Latin 'o'
        features = self.extractor.extract_domain_features("gооgle.com", "google")
        self.assertEqual(features["has_homoglyph"], 1.0)
    
    def test_similarity_metrics(self):
        """Test string similarity metrics."""
        # Exact match
        features = self.extractor.extract_domain_features("google.com", "google")
        self.assertEqual(features["levenshtein_distance"], 0)
        self.assertEqual(features["brand_in_domain"], 1.0)
        
        # Typo
        features = self.extractor.extract_domain_features("goolge.com", "google")
        self.assertEqual(features["levenshtein_distance"], 2)  # Swap distance


class TestThreatDetectionModel(unittest.TestCase):
    """Test threat detection models."""
    
    def setUp(self):
        # Create small dataset for testing
        self.generator = BrandImpersonationDataset(random_seed=42)
        self.dataset = self.generator.generate_dataset(n_samples=200, impersonation_ratio=0.3)
        
        self.X = np.array([list(s.features.values()) for s in self.dataset])
        self.y = np.array([s.label for s in self.dataset])
        self.X_legitimate = self.X[self.y == 0]
    
    def test_autoencoder_training(self):
        """Test autoencoder model training."""
        model = AutoencoderThreatModel(input_dim=self.X.shape[1])
        
        metrics = model.train(self.X_legitimate, epochs=10, batch_size=32)
        
        self.assertIn("final_loss", metrics)
        self.assertIn("threshold", metrics)
        self.assertTrue(model.is_trained)
    
    def test_autoencoder_prediction(self):
        """Test autoencoder predictions."""
        model = AutoencoderThreatModel(input_dim=self.X.shape[1])
        model.train(self.X_legitimate, epochs=10, batch_size=32)
        
        # Test on a sample
        features = self.dataset[0].features
        result = model.predict(features, self.dataset[0].brand_name)
        
        self.assertIsNotNone(result.threat_score)
        self.assertIsNotNone(result.is_threat)
        self.assertIn(result.model_type, ["autoencoder"])
    
    def test_isolation_forest_training(self):
        """Test isolation forest model training."""
        model = IsolationForestThreatModel(contamination=0.3)
        
        metrics = model.train(self.X)
        
        self.assertIn("mean_score", metrics)
        self.assertTrue(model.is_trained)
    
    def test_isolation_forest_prediction(self):
        """Test isolation forest predictions."""
        model = IsolationForestThreatModel(contamination=0.3)
        model.train(self.X)
        
        features = self.dataset[0].features
        result = model.predict(features, self.dataset[0].brand_name)
        
        self.assertIsNotNone(result.threat_score)
        self.assertIsNotNone(result.is_threat)
        self.assertEqual(result.model_type, "isolation_forest")


class TestRealTimeScorer(unittest.TestCase):
    """Test real-time threat scorer."""
    
    def setUp(self):
        # Use default initialization (may be slow)
        self.scorer = RealTimeThreatScorer()
    
    def test_score_domain(self):
        """Test domain scoring."""
        result = self.scorer.score_domain("g00gle.com", "google")
        
        self.assertEqual(result.domain, "g00gle.com")
        self.assertEqual(result.brand_name, "google")
        self.assertGreaterEqual(result.threat_score, 0.0)
        self.assertLessEqual(result.threat_score, 1.0)
        self.assertIn(result.risk_level, ["low", "medium", "high", "critical"])
    
    def test_score_social_profile(self):
        """Test social media profile scoring."""
        result = self.scorer.score_social_profile("google_official", "twitter", "google")
        
        self.assertIn("google_official", result.domain)
        self.assertEqual(result.brand_name, "google")
        self.assertGreaterEqual(result.threat_score, 0.0)
    
    def test_batch_scoring(self):
        """Test batch domain scoring."""
        domains = ["google.com", "g00gle.com", "googIe.com"]
        results = self.scorer.batch_score_domains(domains, "google")
        
        self.assertEqual(len(results), 3)
        for r in results:
            self.assertIsNotNone(r.threat_score)
    
    def test_risk_levels(self):
        """Test risk level assignment."""
        # These should produce different risk levels
        test_cases = [
            ("google.com", "google", "low"),
            ("g00gle-security-verify.com", "google", "critical"),
        ]
        
        for domain, brand, expected_min in test_cases:
            result = self.scorer.score_domain(domain, brand)
            risk_levels = ["low", "medium", "high", "critical"]
            actual_idx = risk_levels.index(result.risk_level)
            expected_idx = risk_levels.index(expected_min)
            self.assertGreaterEqual(actual_idx, expected_idx,
                f"Expected at least {expected_min} risk for {domain}, got {result.risk_level}")


class TestIntegration(unittest.TestCase):
    """Integration tests."""
    
    def test_end_to_end_pipeline(self):
        """Test complete pipeline from generation to scoring."""
        # Generate data
        generator = BrandImpersonationDataset(random_seed=42)
        dataset = generator.generate_dataset(n_samples=100, impersonation_ratio=0.5)
        
        # Train model
        X = np.array([list(s.features.values()) for s in dataset])
        y = np.array([s.label for s in dataset])
        X_legitimate = X[y == 0]
        
        model = AutoencoderThreatModel(input_dim=X.shape[1])
        model.train(X_legitimate, epochs=5, batch_size=32)
        
        # Score samples
        scores = []
        for sample in dataset[:10]:
            result = model.predict(sample.features, sample.brand_name)
            scores.append(result)
        
        # Verify results
        self.assertEqual(len(scores), 10)
        for s in scores:
            self.assertIsNotNone(s.threat_score)
            self.assertGreaterEqual(s.threat_score, 0.0)
            self.assertLessEqual(s.threat_score, 1.0)


def run_tests():
    """Run all tests."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestDatasetGenerator))
    suite.addTests(loader.loadTestsFromTestCase(TestFeatureExtractor))
    suite.addTests(loader.loadTestsFromTestCase(TestThreatDetectionModel))
    suite.addTests(loader.loadTestsFromTestCase(TestRealTimeScorer))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
