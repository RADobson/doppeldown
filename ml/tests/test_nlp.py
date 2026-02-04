"""
Test Suite for DoppelDown NLP Threat Detection
Validates all NLP features including NER, sentiment analysis, and brand impersonation detection.
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nlp_analyzer import NLPAnalyzer, NLPEntityRecognizer, NLPSentimentAnalyzer, analyze_text
from contextual_threat_scorer import ContextualThreatScorer, score_domain_threat
from brand_impersonation_nlp import BrandImpersonationDetector, ImpersonationTechnique, detect_impersonation
from nlp_integration import NLPIntegratedThreatDetector, detect_threat


class TestNLPEntityRecognizer(unittest.TestCase):
    """Test Named Entity Recognition."""
    
    def setUp(self):
        self.recognizer = NLPEntityRecognizer()
    
    def test_extract_entities_basic(self):
        """Test basic entity extraction."""
        text = "Contact us at support@apple.com or call 1-800-555-0123. Visit https://apple.com"
        entities = self.recognizer.extract_entities(text)
        
        # Should find email, phone, and URL
        entity_labels = [e.label for e in entities]
        self.assertIn('EMAIL', entity_labels)
        self.assertIn('PHONE', entity_labels)
        self.assertIn('URL', entity_labels)
    
    def test_extract_brand_entities(self):
        """Test brand entity extraction."""
        text = "Welcome to Apple Store. Apple products are the best."
        brand_names = ['apple', 'microsoft']
        entities = self.recognizer.extract_brand_entities(text, brand_names)
        
        self.assertGreaterEqual(len(entities), 1)
        self.assertEqual(entities[0].label, 'BRAND_MENTION')
    
    def test_suspicious_pattern_detection(self):
        """Test detection of suspicious patterns."""
        text = "URGENT: Your account will be suspended immediately!"
        entities = self.recognizer.extract_entities(text)
        
        # Should detect urgency
        entity_labels = [e.label for e in entities]
        self.assertIn('URGENCY', entity_labels)


class TestNLPSentimentAnalyzer(unittest.TestCase):
    """Test Sentiment Analysis."""
    
    def setUp(self):
        self.analyzer = NLPSentimentAnalyzer()
    
    def test_sentiment_analysis(self):
        """Test basic sentiment analysis."""
        text = "We are pleased to announce great news!"
        result = self.analyzer.analyze_sentiment(text)
        
        self.assertIsNotNone(result)
        self.assertIn('polarity', result.__dict__)
        self.assertIn('dominant_emotion', result.__dict__)
    
    def test_manipulation_detection(self):
        """Test emotional manipulation detection."""
        text = "URGENT! Your account will be suspended in 24 hours! Act immediately!"
        manipulation = self.analyzer.detect_manipulation(text)
        
        self.assertIn('urgency_manipulation', manipulation)
        self.assertGreater(manipulation['urgency_manipulation']['score'], 0)
    
    def test_fear_appeal_detection(self):
        """Test fear appeal detection."""
        text = "WARNING: Your account has been compromised. Immediate action required!"
        manipulation = self.analyzer.detect_manipulation(text)
        
        self.assertIn('fear_appeal', manipulation)


class TestNLPAnalyzer(unittest.TestCase):
    """Test main NLP Analyzer."""
    
    def setUp(self):
        self.analyzer = NLPAnalyzer()
    
    def test_analyze_text(self):
        """Test comprehensive text analysis."""
        text = "Apple Security Alert: Verify your account immediately."
        result = self.analyzer.analyze_text(text, brand_names=['apple'])
        
        self.assertIn('entities', result)
        self.assertIn('sentiment', result)
        self.assertIn('linguistic', result)
        self.assertIn('summary', result)
    
    def test_analyze_email(self):
        """Test email analysis."""
        subject = "URGENT: Apple ID Verification Required"
        body = """
        Dear Customer,
        
        Your Apple ID has been suspended. Verify immediately at:
        http://apple-verify-now.com
        
        Apple Security Team
        """
        sender = "security@apple-verify-now.com"
        
        result = self.analyzer.analyze_email(subject, body, sender, ['apple'])
        
        self.assertIn('subject_analysis', result)
        self.assertIn('full_analysis', result)
        self.assertIn('threat_assessment', result)
    
    def test_analyze_webpage(self):
        """Test webpage content analysis."""
        title = "Apple ID - Secure Login"
        content = """
        Welcome to Apple ID. Please enter your credentials to verify your account.
        This is an urgent security update required for all Apple users.
        """
        
        result = self.analyzer.analyze_webpage_content(title, content, "", ['apple'])
        
        self.assertIn('entities', result)
        self.assertIn('linguistic', result)
        self.assertIn('impersonation_score', result)


class TestContextualThreatScorer(unittest.TestCase):
    """Test Contextual Threat Scorer."""
    
    def setUp(self):
        self.scorer = ContextualThreatScorer()
    
    def test_score_domain_threat(self):
        """Test domain threat scoring."""
        domain = "apple-verify-secure.com"
        brand_name = "apple"
        base_score = 0.7
        
        result = self.scorer.score_domain_threat(domain, brand_name, base_score)
        
        self.assertIsNotNone(result)
        self.assertGreaterEqual(result.overall_score, 0)
        self.assertLessEqual(result.overall_score, 1)
        self.assertIn(ThreatCategory.PHISHING, result.category_scores)
    
    def test_score_email_threat(self):
        """Test email threat scoring."""
        subject = "URGENT: Apple ID Suspended"
        body = "Your account has been suspended. Click here to verify."
        sender = "security@apple-suspension.com"
        brand_name = "apple"
        
        result = self.scorer.score_email_threat(subject, body, sender, brand_name)
        
        self.assertIsNotNone(result)
        self.assertGreaterEqual(result.overall_score, 0)


class TestBrandImpersonationDetector(unittest.TestCase):
    """Test Brand Impersonation Detection."""
    
    def setUp(self):
        self.detector = BrandImpersonationDetector()
    
    def test_homoglyph_detection(self):
        """Test homoglyph attack detection."""
        # Using Cyrillic 'о' instead of Latin 'o'
        text = "gооgle-security.com"  # gопgle with Cyrillic o's
        brand_name = "google"
        
        result = self.detector.detect(text, brand_name)
        
        # Check if homoglyph technique was detected
        techniques = [t.technique for t in result.detected_techniques]
        self.assertIn(ImpersonationTechnique.HOMOGLYPH, techniques)
    
    def test_typosquatting_detection(self):
        """Test typosquatting detection."""
        text = "gogle.com"  # Missing 'o'
        brand_name = "google"
        
        result = self.detector.detect(text, brand_name)
        
        techniques = [t.technique for t in result.detected_techniques]
        self.assertIn(ImpersonationTechnique.TYPOSQUATTING, techniques)
    
    def test_combo_squatting_detection(self):
        """Test combo-squatting detection."""
        text = "apple-login-verify.com"
        brand_name = "apple"
        
        result = self.detector.detect(text, brand_name)
        
        techniques = [t.technique for t in result.detected_techniques]
        self.assertIn(ImpersonationTechnique.COMBO_SQUATTING, techniques)
    
    def test_prefix_squatting_detection(self):
        """Test prefix squatting detection."""
        text = "secure-apple-login.com"
        brand_name = "apple"
        
        result = self.detector.detect(text, brand_name)
        
        techniques = [t.technique for t in result.detected_techniques]
        self.assertIn(ImpersonationTechnique.PREFIX_SQUATTING, techniques)
    
    def test_visual_similarity(self):
        """Test visual similarity calculation."""
        text = "g00gle.com"
        brand_name = "google"
        
        result = self.detector.detect(text, brand_name)
        
        self.assertGreater(result.visual_similarity, 0.5)


class TestNLPIntegration(unittest.TestCase):
    """Test NLP Integration with ML pipeline."""
    
    def setUp(self):
        self.detector = NLPIntegratedThreatDetector()
    
    def test_detect_domain_threat(self):
        """Test integrated domain threat detection."""
        domain = "apple-verify-secure.com"
        brand_name = "apple"
        content = """
        Apple ID Verification
        Your account has been suspended. Verify immediately to prevent termination.
        """
        
        result = self.detector.detect_domain_threat(domain, brand_name, content)
        
        self.assertIsNotNone(result)
        self.assertEqual(result.source, domain)
        self.assertEqual(result.brand_name, brand_name)
        self.assertGreaterEqual(result.overall_threat_score, 0)
        self.assertLessEqual(result.overall_threat_score, 1)
    
    def test_detect_email_threat(self):
        """Test integrated email threat detection."""
        subject = "URGENT: Apple ID Suspended"
        body = "Your account has been suspended. Click here to verify."
        sender = "security@apple-suspension.com"
        brand_name = "apple"
        
        result = self.detector.detect_email_threat(subject, body, sender, brand_name)
        
        self.assertIsNotNone(result)
        self.assertEqual(result.source_type, "email")
    
    def test_detect_social_threat(self):
        """Test integrated social media threat detection."""
        username = "apple_official_support"
        platform = "twitter"
        content = "We're giving away free iPhones! Click the link to claim."
        brand_name = "apple"
        
        result = self.detector.detect_social_threat(username, platform, content, brand_name)
        
        self.assertIsNotNone(result)
        self.assertEqual(result.source_type, "social")


class TestConvenienceFunctions(unittest.TestCase):
    """Test convenience functions."""
    
    def test_analyze_text_function(self):
        """Test analyze_text convenience function."""
        text = "Apple Security: Verify your account now!"
        result = analyze_text(text, brand_names=['apple'])
        
        self.assertIn('entities', result)
        self.assertIn('sentiment', result)
    
    def test_score_domain_threat_function(self):
        """Test score_domain_threat convenience function."""
        result = score_domain_threat("test.com", "test", 0.5)
        
        self.assertIsNotNone(result)
        self.assertGreaterEqual(result.overall_score, 0)
    
    def test_detect_impersonation_function(self):
        """Test detect_impersonation convenience function."""
        result = detect_impersonation("g00gle.com", "google")
        
        self.assertIsNotNone(result)
        self.assertIsInstance(result.is_impersonation, bool)
    
    def test_detect_threat_function(self):
        """Test detect_threat convenience function."""
        result = detect_threat("test.com", "domain", "test")
        
        self.assertIsNotNone(result)
        self.assertEqual(result.source, "test.com")


def run_demo():
    """Run a demonstration of all NLP features."""
    print("=" * 70)
    print("DOPPELDOWN NLP THREAT DETECTION DEMO")
    print("=" * 70)
    
    # Demo 1: NLP Analysis
    print("\n1. NLP ANALYSIS")
    print("-" * 70)
    
    analyzer = NLPAnalyzer()
    
    sample_text = """
    URGENT: Your Apple ID has been suspended!
    
    Dear Valued Customer,
    
    We have detected suspicious activity on your Apple ID account. 
    Your account has been temporarily suspended for security reasons.
    
    You must verify your account within 24 hours to prevent permanent 
    suspension and data loss.
    
    Please login to verify: http://appleid-verify-secure.com/login
    
    Sincerely,
    Apple Security Team
    """
    
    result = analyzer.analyze_text(sample_text, brand_names=['apple', 'apple id'])
    
    print(f"Entities found: {result['entities']['count']}")
    print(f"Brand mentions: {result['entities']['brand_mentions']}")
    print(f"Dominant emotion: {result['sentiment']['dominant_emotion']}")
    print(f"Polarity: {result['sentiment']['polarity']:.3f}")
    print(f"Urgency indicators: {len(result['linguistic']['urgency_indicators'])}")
    print(f"Risk level: {result['summary']['risk_level']}")
    print(f"Risk factors: {result['summary']['risk_factors']}")
    
    # Demo 2: Brand Impersonation Detection
    print("\n2. BRAND IMPERSONATION DETECTION")
    print("-" * 70)
    
    detector = BrandImpersonationDetector()
    
    test_cases = [
        ("g00gle-security.com", "google"),
        ("apple-verify-login.com", "apple"),
        ("amaz0n-help-center.com", "amazon"),
        ("microsoft.com", "microsoft"),
    ]
    
    for domain, brand in test_cases:
        result = detector.detect(domain, brand, "domain")
        status = "IMPERSONATION" if result.is_impersonation else "LEGITIMATE"
        print(f"{domain:30} ({brand:10}) -> {status:15} (risk: {result.risk_score:.2f})")
        if result.detected_techniques:
            techniques = ", ".join(t.technique.value for t in result.detected_techniques[:2])
            print(f"  Techniques: {techniques}")
    
    # Demo 3: Contextual Threat Scoring
    print("\n3. CONTEXTUAL THREAT SCORING")
    print("-" * 70)
    
    scorer = ContextualThreatScorer()
    
    content = """
    Apple ID Verification Required
    
    Your account has been suspended due to suspicious activity.
    Verify immediately to prevent permanent termination.
    Login here: apple-verify-secure.com
    """
    
    result = scorer.score_domain_threat(
        domain="apple-verify-secure.com",
        brand_name="apple",
        base_threat_score=0.75,
        page_content=content
    )
    
    print(f"Domain: {result.source}")
    print(f"Overall Score: {result.overall_score:.3f}")
    print(f"Base Score: {result.base_threat_score:.3f}")
    print(f"NLP Score: {result.nlp_threat_score:.3f}")
    print(f"Contextual Score: {result.contextual_score:.3f}")
    print(f"Severity: {result.severity.value}")
    print(f"Contextual Factors:")
    for factor in result.contextual_factors:
        print(f"  - {factor.name}: {factor.score:.3f}")
    
    # Demo 4: Integrated Detection
    print("\n4. INTEGRATED THREAT DETECTION")
    print("-" * 70)
    
    integrated = NLPIntegratedThreatDetector()
    
    result = integrated.detect_domain_threat(
        domain="secure-apple-verify.com",
        brand_name="apple",
        page_content=content
    )
    
    print(f"Source: {result.source}")
    print(f"Overall Score: {result.overall_threat_score:.3f}")
    print(f"  - ML Score: {result.ml_threat_score:.3f}")
    print(f"  - NLP Score: {result.nlp_threat_score:.3f}")
    print(f"  - Contextual Score: {result.contextual_threat_score:.3f}")
    print(f"  - Impersonation Score: {result.impersonation_score:.3f}")
    print(f"Risk Level: {result.risk_level.upper()}")
    print(f"Processing Time: {result.processing_time_ms:.2f}ms")
    print(f"\nRecommended Actions:")
    for action in result.recommended_actions[:3]:
        print(f"  - {action}")
    
    print("\n" + "=" * 70)
    print("DEMO COMPLETE")
    print("=" * 70)


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == 'demo':
        run_demo()
    else:
        # Run unit tests
        unittest.main(argv=[''], verbosity=2, exit=False)
