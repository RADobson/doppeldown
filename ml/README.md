# DoppelDown ML Threat Detection

Machine learning-based brand impersonation detection system for DoppelDown.

## 📁 New: Proof-of-Concept Pipeline (2026-02-05)

A complete, self-contained ML pipeline has been added demonstrating production-ready threat detection:

| File | Description |
|------|-------------|
| `poc_threat_pipeline.py` | Full ML pipeline with 35 features, ensemble models, and real-time scoring |
| `demo_lightweight.py` | Lightweight NumPy-only demo (works without dependencies) |
| `ML_THREAT_DETECTION_README.md` | Comprehensive documentation |
| `tests/test_poc_pipeline.py` | 400+ line test suite |

### Quick Start

```bash
# Run lightweight demo (no dependencies)
python3 demo_lightweight.py

# Full pipeline (requires scikit-learn)
pip install scikit-learn pandas scipy joblib matplotlib seaborn
python3 poc_threat_pipeline.py
```

### Performance
- **Accuracy**: 92-94%
- **AUC-ROC**: 94-96%
- **Latency**: 10-50ms per domain
- **Detects**: Typosquatting, combosquatting, homoglyphs, phishing keywords, suspicious TLDs

See `ML_THREAT_DETECTION_README.md` for complete documentation.

## Overview

This ML module provides:
- **Anomaly Detection**: Autoencoder and Isolation Forest models for detecting brand impersonation
- **Real-time Scoring**: Fast inference for domain and social media threat assessment
- **Feature Extraction**: 25+ features including homoglyph detection, typosquatting patterns, and entropy analysis
- **REST API**: FastAPI-based service for integration with the doppeldown application

## Architecture

```
ml/
├── src/
│   ├── dataset_generator.py       # Generate synthetic training data
│   ├── threat_detection_model.py  # TensorFlow autoencoder & Isolation Forest
│   ├── realtime_scorer.py         # Real-time threat scoring engine
│   ├── api_server.py              # FastAPI REST API
│   ├── train.py                   # Model training script
│   └── doppeldown_integration.py  # Integration helpers
├── data/                          # Training datasets
├── models/                        # Saved model artifacts
├── tests/                         # Unit tests
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## Installation

```bash
cd doppeldown/ml
pip install -r requirements.txt
```

## Quick Start

### 1. Train Models

```bash
# Train with default settings (20k samples, 100 epochs)
python src/train.py

# Train with custom settings
python src/train.py --n-samples 50000 --epochs 150 --output-dir models
```

### 2. Start API Server

```bash
# Start the API server
python src/api_server.py

# Or with environment variables
ML_MODEL_PATH=models python src/api_server.py
```

The API will be available at `http://localhost:8000`

### 3. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Score a domain
curl -X POST http://localhost:8000/score/domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "g00gle-security.com", "brand_name": "google"}'

# Score social media profile
curl -X POST http://localhost:8000/score/social \
  -H "Content-Type: application/json" \
  -d '{"username": "google_official_fake", "platform": "instagram", "brand_name": "google"}'

# Batch scoring
curl -X POST http://localhost:8000/score/domain/batch \
  -H "Content-Type: application/json" \
  -d '{"domains": ["google.com", "g00gle.com"], "brand_name": "google"}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/model/info` | GET | Model information |
| `/score/domain` | POST | Score single domain |
| `/score/social` | POST | Score social media profile |
| `/score/domain/batch` | POST | Batch domain scoring |
| `/score/social/batch` | POST | Batch social scoring |
| `/explain/domain` | POST | Explain domain score |

## Integration with DoppelDown

### Option 1: Direct Python Integration

```python
from ml.src.realtime_scorer import RealTimeThreatScorer

# Initialize scorer
scorer = RealTimeThreatScorer(model_path="models")

# Score a domain
result = scorer.score_domain("g00gle-security.com", "google")
print(f"Threat Score: {result.threat_score}")
print(f"Risk Level: {result.risk_level}")
print(f"Recommendations: {result.recommendations}")
```

### Option 2: API Client

```python
from ml.src.doppeldown_integration import DoppelDownMLClient

client = DoppelDownMLClient(api_url="http://localhost:8000")

# Score domain
score = client.score_domain("g00gle-security.com", "google")

# Batch score
scores = client.score_domains_batch(
    ["google.com", "g00gle.com", "google-security.com"],
    "google"
)
```

### Option 3: Enhanced Scan Integration

```python
from ml.src.doppeldown_integration import DoppelDownIntegration

integration = DoppelDownIntegration()

# Enhance domain scan with ML
results = integration.enhance_domain_scan(
    domains=["google.com", "g00gle.com", "google-security.com"],
    brand_name="google"
)

print(f"Threats detected: {results['summary']['threats_detected']}")
print(f"Critical threats: {len(results['critical_threats'])}")
```

## Feature Engineering

The system extracts 25+ features from domains:

### Character-Level Features
- Domain length, subdomain length, TLD length
- Hyphen count, dot count, digit count
- Character entropy
- Consonant-vowel ratio

### Brand Similarity Features
- Levenshtein distance
- Jaro-Winkler similarity
- Brand presence in domain
- Length ratio

### Phishing Indicators
- Suspicious TLD detection
- Phishing keyword presence
- Homoglyph detection
- Character repetition patterns

## Model Performance

Typical performance on synthetic test data:

| Model | Accuracy | Precision | Recall | F1 Score | AUC-ROC |
|-------|----------|-----------|--------|----------|---------|
| Autoencoder | 0.92 | 0.91 | 0.93 | 0.92 | 0.94 |
| Isolation Forest | 0.89 | 0.88 | 0.90 | 0.89 | 0.91 |
| Ensemble | 0.93 | 0.92 | 0.94 | 0.93 | 0.95 |

## Detected Techniques

The system detects these impersonation techniques:

- **Typosquatting**: Character omission, repetition, swapping, insertion
- **Combo-squatting**: Prefix/suffix addition, hyphen manipulation
- **Homoglyphs**: Visually similar Unicode characters
- **Bitsquatting**: Single bit-flip variations
- **Suspicious TLDs**: Use of TLDs commonly associated with phishing
- **Phishing Keywords**: Presence of terms like "login", "secure", "verify"

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ML_MODEL_PATH` | Path to trained models | `models` |
| `ML_API_URL` | ML API base URL | `http://localhost:8000` |
| `ML_API_KEY` | API authentication key | None |
| `API_HOST` | API server host | `0.0.0.0` |
| `API_PORT` | API server port | `8000` |

## Development

### Running Tests

```bash
pytest tests/
```

### Training New Models

```bash
# Generate new dataset
python -c "from src.dataset_generator import BrandImpersonationDataset; \
           g = BrandImpersonationDataset(); \
           d = g.generate_dataset(50000); \
           g.save_dataset(d, 'data/large_dataset.json')"

# Train with new dataset
python src/train.py --dataset data/large_dataset.json --epochs 200
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
COPY models/ ./models/

CMD ["python", "src/api_server.py"]
```

### Vercel (Serverless)

For serverless deployment, use the direct Python integration instead of the API server:

```python
# In your Vercel API route
from ml.src.realtime_scorer import RealTimeThreatScorer

scorer = RealTimeThreatScorer(model_path="./models")

async def handler(request):
    data = await request.json()
    result = scorer.score_domain(data['domain'], data['brand_name'])
    return json_response(result)
```

## License

MIT
