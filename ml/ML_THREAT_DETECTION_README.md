# DoppelDown ML Threat Detection - Proof of Concept

A comprehensive machine learning pipeline for detecting brand impersonation threats, phishing attempts, and domain-related risks. This PoC demonstrates production-ready ML techniques without requiring heavy deep learning dependencies.

## Overview

The ML threat detection system identifies malicious domains that impersonate legitimate brands through various techniques:

- **Typosquatting**: Character omission (`gogle.com`), repetition (`gooogle.com`), swapping (`googel.com`)
- **Combosquatting**: Adding security keywords (`google-security.com`)
- **Homoglyph Attacks**: Unicode visual deception (Cyrillic `а` looks like Latin `a`)
- **Digit Substitution**: Number-for-letter replacements (`g00gle`)
- **Suspicious TLDs**: Domains on abuse-prone TLDs (`.tk`, `.ml`, `.xyz`)
- **Phishing Keywords**: Presence of credential-related terms

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ML Threat Detection Pipeline                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Dataset    │────▶│   Feature    │────▶│    Model     │    │
│  │  Generator   │     │  Extraction  │     │   Training   │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                   │                     │             │
│         ▼                   ▼                     ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Ensemble Classifier                   │   │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────────┐   │   │
│  │   │   Random   │  │  Gradient  │  │    Isolation   │   │   │
│  │   │   Forest   │  │   Boosting │  │     Forest     │   │   │
│  │   └────────────┘  └────────────┘  └────────────────┘   │   │
│  │          │                │               │             │   │
│  │          └────────────────┴───────────────┘             │   │
│  │                       │                                  │   │
│  │                       ▼                                  │   │
│  │              ┌─────────────────┐                        │   │
│  │              │  Voting Ensemble │                       │   │
│  │              └─────────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Real-Time Scorer                      │   │
│  │  • Feature extraction                                  │   │
│  │  • Prediction ensemble                                 │   │
│  │  • Technique detection                                 │   │
│  │  • Risk classification                                 │   │
│  │  • Recommendation generation                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Dataset Generator (`ThreatDatasetGenerator`)

Generates synthetic training data with labeled examples of:
- **Legitimate domains** (~50%): Standard brand domains, variations, common TLDs
- **Typosquatting threats** (30%): Character-level mutations
- **Combosquatting threats** (25%): Brand + keyword combinations
- **Homoglyph threats** (15%): Unicode visual deception
- **Phishing keyword threats** (15%): Credential theft indicators
- **Suspicious TLD threats** (10%): Abuse-prone TLD usage
- **Brand abuse threats** (5%): Random character injection

### 2. Feature Extractor (`FeatureExtractor`)

Extracts **35 features** from each domain-brand pair:

#### Length Features (5)
- Domain length, SLD length, TLD length
- Subdomain count, Total parts

#### Character Composition (8)
- Digit count, Hyphen count, Dot count, Special char count
- Uppercase ratio, Digit ratio, Consonant-vowel ratio, Unique char ratio

#### Entropy & Complexity (3)
- Shannon entropy, Trigram uniqueness, Character frequency std dev

#### Brand Similarity (6)
- Levenshtein distance (raw & normalized)
- Jaro-Winkler similarity
- Brand presence in domain
- Brand length ratio
- Longest common subsequence ratio

#### Phishing Indicators (5)
- Phishing keyword count
- Suspicious TLD score
- Has brand + keyword combination
- Keyword density
- Looks like login page

#### Homoglyph & Substitution (4)
- Homoglyph score
- Digit substitution count
- Mixed script score
- Visual similarity score

#### Structural Patterns (4)
- Excessive hyphens
- IP pattern in domain
- Numeric prefix/suffix
- Random-looking score

### 3. ML Models

#### Random Forest Classifier
- 200 estimators
- Max depth: 20
- Min samples split: 5
- Class-balanced for imbalanced data
- Feature importance analysis

#### Gradient Boosting Classifier
- 150 estimators
- Learning rate: 0.1
- Max depth: 8
- Subsample: 0.8

#### Isolation Forest (Anomaly Detection)
- 200 estimators
- Contamination: 10%
- Trained only on legitimate samples
- Detects out-of-distribution threats

#### Voting Ensemble
- Soft voting (probability averaging)
- Weights: RF (0.55), GB (0.45)
- Combines strengths of both classifiers

### 4. Real-Time Scorer (`ThreatScorer`)

Production-ready inference with:
- **Threat Score**: Combined probability (0-1)
- **Risk Levels**: Low, Medium, High, Critical
- **Technique Detection**: Identifies specific attack patterns
- **Confidence Scoring**: Prediction reliability estimate
- **Feature Importance**: Local explanation per prediction
- **Recommendations**: Actionable security guidance

## File Structure

```
doppeldown/ml/
├── poc_threat_pipeline.py          # Full ML pipeline (~600 lines)
├── demo_lightweight.py             # NumPy-only demo (~250 lines)
├── tests/
│   └── test_poc_pipeline.py        # Comprehensive test suite (~400 lines)
├── models/poc/                     # Saved model artifacts
│   ├── classifier.joblib           # Trained ensemble
│   ├── anomaly_detector.joblib     # Isolation Forest
│   ├── scaler.joblib               # Feature scaler
│   ├── training_stats.json         # Performance metrics
│   ├── feature_names.json          # Feature metadata
│   ├── plots/
│   │   ├── evaluation.png          # ROC, PR, CM, distributions
│   │   └── feature_importance.png  # Feature rankings
│   └── results/
│       ├── pipeline_results.json   # Complete results
│       └── batch_scores.csv        # Batch scoring output
└── ML_THREAT_DETECTION_README.md   # This file
```

## Quick Start

### Option 1: Lightweight Demo (No Dependencies)

```bash
cd doppeldown/ml
python3 demo_lightweight.py
```

Output:
```
Accuracy: 16/16 (100.0%)
Average latency: 0.01ms per domain
```

### Option 2: Full Pipeline (Requires scikit-learn)

```bash
cd doppeldown/ml
pip install scikit-learn pandas scipy joblib matplotlib seaborn

# Run complete demo
python3 poc_threat_pipeline.py

# Or train models only
python3 poc_threat_pipeline.py --train --n-samples 25000

# Evaluate saved models
python3 poc_threat_pipeline.py --eval

# Score specific domains
python3 poc_threat_pipeline.py --score
```

### Option 3: Use as Library

```python
from poc_threat_pipeline import (
    FeatureExtractor, ThreatDatasetGenerator,
    ThreatDetectionPipeline, ThreatScorer
)

# Train models
pipeline = ThreatDetectionPipeline()
samples = ThreatDatasetGenerator().generate(25000)
X, y, valid = pipeline.prepare_data(samples)
pipeline.train(X, y)
pipeline.save()

# Score domains
scorer = ThreatScorer(pipeline)
result = scorer.score_domain("g00gle-login.tk", "google")

print(f"Score: {result.threat_score}")
print(f"Risk: {result.risk_level}")
print(f"Techniques: {result.detected_techniques}")
print(f"Recommendations: {result.recommendations}")
```

## Example Output

```json
{
  "domain": "g00gle-secure-login-verify.tk",
  "brand_name": "google",
  "threat_score": 0.9734,
  "risk_level": "critical",
  "is_threat": true,
  "confidence": 0.9532,
  "detected_techniques": [
    "suspicious_tld(.tk)",
    "phishing_keywords(login,verify,secure)",
    "digit_substitution",
    "excessive_hyphens"
  ],
  "feature_importance": {
    "suspicious_tld_score": 0.1523,
    "phishing_keyword_count": 0.1489,
    "digit_substitution_count": 0.1256,
    "brand_in_domain": 0.1123,
    "levenshtein_normalized": 0.0894
  },
  "recommendations": [
    "🚨 IMMEDIATE ACTION: High-confidence brand impersonation detected",
    "Initiate domain takedown process immediately",
    "Domain uses character substitution (g00gle)"
  ],
  "processing_time_ms": 23.45
}
```

## Performance

### Accuracy

| Metric | Score |
|--------|-------|
| Accuracy | 92-94% |
| Precision | 91-93% |
| Recall | 93-95% |
| F1 Score | 92-94% |
| AUC-ROC | 94-96% |
| Avg Precision | 93-95% |

### Speed

| Operation | Latency |
|-----------|---------|
| Single domain | 10-50ms |
| Batch (100) | 200-500ms |
| Batch (1000) | 2-5s |

### Model Size

| Component | Size |
|-----------|------|
| Random Forest | ~15MB |
| Gradient Boosting | ~5MB |
| Isolation Forest | ~2MB |
| Scaler | <1KB |
| **Total** | **~22MB** |

## Detected Techniques

| Technique | Description | Example |
|-----------|-------------|---------|
| Typosquatting | Character mutation | `gogle.com` |
| Combosquatting | Brand + keyword | `google-security.com` |
| Homoglyph Attack | Visual deception | `аpple.com` (Cyrillic) |
| Digit Substitution | Number-for-letter | `g00gle.com` |
| Phishing Keywords | Credential terms | `login`, `verify`, `secure` |
| Suspicious TLD | Abuse-prone TLD | `.tk`, `.ml`, `.xyz` |
| Excessive Hyphens | Dash-separated | `my-brand-login-help.com` |
| Random String | Generated noise | `google-x7k9m.com` |

## API Integration

### FastAPI Endpoint

```python
from fastapi import FastAPI
from poc_threat_pipeline import ThreatScorer

app = FastAPI()
scorer = ThreatScorer(pipeline)

@app.post("/score/domain")
async def score_domain(domain: str, brand_name: str):
    result = scorer.score_domain(domain, brand_name)
    return result.to_dict()

@app.post("/score/batch")
async def score_batch(domains: List[str], brand_name: str):
    results = scorer.score_batch(domains, brand_name)
    return [r.to_dict() for r in results]
```

### Next.js Integration

```typescript
// lib/ml-client.ts
export async function scoreDomain(domain: string, brand: string) {
  const response = await fetch('/api/ml/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, brand_name: brand })
  });
  return response.json();
}

// app/api/ml/score/route.ts
import { spawn } from 'child_process';
import { promisify } from 'util';

export async function POST(request: Request) {
  const { domain, brand_name } = await request.json();
  
  const python = spawn('python3', [
    '-c',
    `
import sys
sys.path.insert(0, 'ml')
from poc_threat_pipeline import ThreatScorer, ThreatDetectionPipeline

pipeline = ThreatDetectionPipeline(model_dir='ml/models/poc')
pipeline.load()
scorer = ThreatScorer(pipeline)
result = scorer.score_domain("${domain}", "${brand_name}")
print(result.to_dict())
    `
  ]);
  
  // Handle output...
}
```

## Testing

```bash
# Run all tests
python -m pytest ml/tests/test_poc_pipeline.py -v

# Run with coverage
python -m pytest ml/tests/test_poc_pipeline.py --cov=ml --cov-report=html

# Run specific test class
python -m pytest ml/tests/test_poc_pipeline.py::TestFeatureExtractor -v
```

## Configuration

### Risk Thresholds

```python
RISK_THRESHOLDS = {
    'critical': 0.85,
    'high': 0.65,
    'medium': 0.40,
    'low': 0.0
}
```

### Suspicious TLDs

```python
SUSPICIOUS_TLDS = {
    'tk': 0.9, 'ml': 0.9, 'ga': 0.9,  # Free domains
    'xyz': 0.7, 'top': 0.7,           # Spam-associated
    'click': 0.8, 'loan': 0.8,        # Phishing-associated
}
```

### Model Hyperparameters

```python
RANDOM_FOREST = {
    'n_estimators': 200,
    'max_depth': 20,
    'min_samples_split': 5,
    'class_weight': 'balanced'
}

GRADIENT_BOOSTING = {
    'n_estimators': 150,
    'learning_rate': 0.1,
    'max_depth': 8,
    'subsample': 0.8
}

ISOLATION_FOREST = {
    'n_estimators': 200,
    'contamination': 0.1,
    'max_features': 0.8
}
```

## Future Enhancements

1. **Deep Learning Models**
   - LSTM for sequence-based domain analysis
   - Transformer for semantic similarity
   - BERT for phishing content classification

2. **External Data Sources**
   - WHOIS age and registration patterns
   - DNS resolution history
   - SSL certificate analysis
   - Page content scraping

3. **Active Learning**
   - User feedback integration
   - Model retraining pipeline
   - Confidence-based sampling

4. **Explainability**
   - SHAP values for feature importance
   - LIME for local explanations
   - Counterfactual examples

5. **Production Features**
   - Redis caching for embeddings
   - Celery for async batch processing
   - Prometheus metrics
   - A/B testing framework

## License

Part of the DoppelDown brand protection platform.
