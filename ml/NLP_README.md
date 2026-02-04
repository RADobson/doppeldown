# DoppelDown NLP Threat Detection

Advanced Natural Language Processing (NLP) features for DoppelDown's threat detection system. Implements named entity recognition, sentiment analysis, contextual threat scoring, and machine learning models to detect nuanced brand impersonation techniques.

## Features

### 1. Named Entity Recognition (NER)
- **NLPEntityRecognizer**: Extracts entities from text including:
  - Brand mentions
  - URLs, emails, phone numbers
  - Urgency indicators
  - Credential request patterns
  - Financial indicators
  - Authority claims

### 2. Sentiment Analysis
- **NLPSentimentAnalyzer**: Analyzes emotional content:
  - Polarity and subjectivity scoring
  - Emotion detection (fear, urgency, anger, trust)
  - Emotional manipulation detection
  - Fear appeal identification
  - Authority manipulation detection

### 3. Linguistic Analysis
- **LinguisticAnalyzer**: Extracts linguistic features:
  - Readability scoring
  - Formality assessment
  - Urgency/trust/deception indicator extraction
  - Grammar and spelling error estimation
  - Sentence and word complexity
  - Emotional manipulation scoring

### 4. Contextual Threat Scoring
- **ContextualThreatScorer**: Comprehensive threat assessment:
  - Combines ML, NLP, and contextual factors
  - Category-specific scoring (phishing, impersonation, etc.)
  - Contextual factor weighting
  - Historical pattern analysis
  - Severity determination

### 5. Brand Impersonation Detection
- **BrandImpersonationDetector**: ML-based impersonation detection:
  - 17 different impersonation techniques
  - Homoglyph detection (visual spoofing)
  - Typosquatting detection
  - Combo-squatting detection
  - Homograph detection
  - Bitsquatting detection
  - Language mimicry detection

### 6. Integrated Detection
- **NLPIntegratedThreatDetector**: Unified threat detection:
  - Combines all detection methods
  - Domain threat detection
  - Email threat detection
  - Social media threat detection
  - Weighted score combination

## Installation

### Install Dependencies

```bash
# Install spaCy and NLTK
pip install -r requirements-nlp.txt

# Download spaCy English model
python -m spacy download en_core_web_sm

# Download NLTK data
python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('stopwords'); nltk.download('punkt')"
```

## Quick Start

### Basic NLP Analysis

```python
from ml.src.nlp_analyzer import NLPAnalyzer

# Initialize analyzer
analyzer = NLPAnalyzer()

# Analyze text
text = "Your Apple ID has been suspended. Verify immediately!"
result = analyzer.analyze_text(text, brand_names=['apple'])

print(f"Risk Level: {result['summary']['risk_level']}")
print(f"Detected Entities: {result['entities']['count']}")
print(f"Dominant Emotion: {result['sentiment']['dominant_emotion']}")
```

### Brand Impersonation Detection

```python
from ml.src.brand_impersonation_nlp import BrandImpersonationDetector

detector = BrandImpersonationDetector()

# Detect impersonation
result = detector.detect(
    text="g00gle-security.com",
    brand_name="google",
    content_type="domain"
)

print(f"Is Impersonation: {result.is_impersonation}")
print(f"Risk Score: {result.risk_score}")
print(f"Visual Similarity: {result.visual_similarity}")

for technique in result.detected_techniques:
    print(f"- {technique.technique.value}: {technique.confidence:.2f}")
```

### Contextual Threat Scoring

```python
from ml.src.contextual_threat_scorer import ContextualThreatScorer

scorer = ContextualThreatScorer()

result = scorer.score_domain_threat(
    domain="apple-verify-secure.com",
    brand_name="apple",
    base_threat_score=0.75,
    page_content="Your account has been suspended..."
)

print(f"Overall Score: {result.overall_score}")
print(f"Severity: {result.severity.value}")

for factor in result.contextual_factors:
    print(f"- {factor.name}: {factor.score:.2f}")
```

### Integrated Threat Detection

```python
from ml.src.nlp_integration import NLPIntegratedThreatDetector

detector = NLPIntegratedThreatDetector()

# Detect domain threat
result = detector.detect_domain_threat(
    domain="secure-apple-login.com",
    brand_name="apple",
    page_content="Suspicious content..."
)

print(f"Overall Threat Score: {result.overall_threat_score}")
print(f"ML Score: {result.ml_threat_score}")
print(f"NLP Score: {result.nlp_threat_score}")
print(f"Risk Level: {result.risk_level}")

for action in result.recommended_actions:
    print(f"- {action}")
```

## Detected Impersonation Techniques

1. **Homoglyph**: Visual similarity using look-alike characters (Cyrillic о vs Latin o)
2. **Typosquatting**: Common typing errors and keyboard proximity substitutions
3. **Combo-squatting**: Brand name combined with misleading keywords
4. **Homograph**: Different scripts that appear identical
5. **Bitsquatting**: Single bit flip variations
6. **Prefix-squatting**: Suspicious prefixes added to brand
7. **Suffix-squatting**: Suspicious suffixes added to brand
8. **Hyphenation**: Strategic hyphen insertion
9. **Transposition**: Adjacent character swapping
10. **Repetition**: Character repetition
11. **Spoofed Sender**: Email sender spoofing
12. **Language Mimicry**: Brand voice imitation

## API Reference

### NLPAnalyzer

Main NLP analysis class combining entity recognition, sentiment analysis, and linguistic analysis.

```python
analyzer = NLPAnalyzer(spacy_model="en_core_web_sm")

# Analyze text
result = analyzer.analyze_text(text, brand_names=['apple'])

# Analyze email
result = analyzer.analyze_email(subject, body, sender, brand_names)

# Analyze webpage
result = analyzer.analyze_webpage_content(title, content, meta_description, brand_names)
```

### BrandImpersonationDetector

Detects brand impersonation using multiple techniques.

```python
detector = BrandImpersonationDetector(use_ml_models=True)

result = detector.detect(text, brand_name, content_type)
results = detector.detect_batch(texts, brand_name, content_type)
```

### ContextualThreatScorer

Provides contextual threat scoring for domains, emails, and social media.

```python
scorer = ContextualThreatScorer()

# Domain scoring
result = scorer.score_domain_threat(domain, brand_name, base_threat_score, page_content)

# Email scoring
result = scorer.score_email_threat(subject, body, sender, brand_name)

# Social media scoring
result = scorer.score_social_media_threat(username, platform, content, brand_name)
```

### NLPIntegratedThreatDetector

Unified interface combining all detection methods.

```python
detector = NLPIntegratedThreatDetector(
    ml_model_path="models/",
    enable_nlp=True,
    enable_contextual=True,
    enable_impersonation=True
)

# Domain detection
result = detector.detect_domain_threat(domain, brand_name, page_content)

# Email detection
result = detector.detect_email_threat(subject, body, sender, brand_name)

# Social media detection
result = detector.detect_social_threat(username, platform, content, brand_name)
```

## Testing

Run the test suite:

```bash
# Run all tests
python -m pytest ml/tests/test_nlp.py -v

# Run demo
python ml/tests/test_nlp.py demo
```

## Architecture

```
nlp_analyzer.py
├── NLPEntityRecognizer      # Named entity extraction
├── NLPSentimentAnalyzer     # Sentiment and emotion analysis
└── LinguisticAnalyzer       # Linguistic feature extraction

contextual_threat_scorer.py
└── ContextualThreatScorer   # Contextual threat assessment

brand_impersonation_nlp.py
└── BrandImpersonationDetector  # ML-based impersonation detection

nlp_integration.py
└── NLPIntegratedThreatDetector # Unified detection interface
```

## Performance Considerations

- **spaCy Model**: Uses `en_core_web_sm` by default for faster processing. Use `en_core_web_trf` for better accuracy.
- **Caching**: Results are cached where appropriate to avoid redundant processing.
- **Batch Processing**: Use batch methods (`detect_batch`, `batch_score_domains`) for multiple items.

## License

Part of the DoppelDown security platform.
