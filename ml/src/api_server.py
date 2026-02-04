"""
FastAPI server for ML threat detection API.
Provides REST endpoints for real-time domain and social media threat scoring.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import json
import logging
from datetime import datetime

from realtime_scorer import RealTimeThreatScorer, RealTimeScore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="DoppelDown ML Threat Detection API",
    description="Machine learning-based brand impersonation and threat detection",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global scorer instance
scorer: Optional[RealTimeThreatScorer] = None

# Request/Response models
class DomainScoreRequest(BaseModel):
    domain: str = Field(..., description="Domain to analyze")
    brand_name: str = Field(..., description="Brand name to protect")
    
    class Config:
        json_schema_extra = {
            "example": {
                "domain": "g00gle-security.com",
                "brand_name": "google"
            }
        }


class SocialScoreRequest(BaseModel):
    username: str = Field(..., description="Social media username/handle")
    platform: str = Field(..., description="Social media platform (twitter, facebook, instagram, etc.)")
    brand_name: str = Field(..., description="Brand name to protect")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "google_official_fake",
                "platform": "instagram",
                "brand_name": "google"
            }
        }


class BatchDomainRequest(BaseModel):
    domains: List[str] = Field(..., description="List of domains to analyze")
    brand_name: str = Field(..., description="Brand name to protect")


class BatchSocialRequest(BaseModel):
    profiles: List[Dict[str, str]] = Field(..., description="List of profiles with username and platform")
    brand_name: str = Field(..., description="Brand name to protect")


class ScoreResponse(BaseModel):
    domain: str
    brand_name: str
    threat_score: float
    risk_level: str
    is_threat: bool
    confidence: float
    detected_techniques: List[str]
    scan_duration_ms: float
    timestamp: str
    model_version: str
    recommendations: List[str]


class BatchScoreResponse(BaseModel):
    results: List[ScoreResponse]
    total_scanned: int
    threats_detected: int
    scan_time_ms: float


class HealthResponse(BaseModel):
    status: str
    model_version: str
    models_loaded: List[str]
    timestamp: str


class ModelInfoResponse(BaseModel):
    model_version: str
    available_models: List[str]
    risk_thresholds: Dict[str, float]
    feature_count: int


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the threat scorer on startup."""
    global scorer
    
    model_path = os.environ.get("ML_MODEL_PATH", None)
    
    try:
        if model_path and os.path.exists(model_path):
            logger.info(f"Loading models from {model_path}")
            scorer = RealTimeThreatScorer(model_path=model_path)
        else:
            logger.info("Initializing default models (this may take a moment)...")
            scorer = RealTimeThreatScorer()
        
        logger.info("Threat scorer initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize threat scorer: {e}")
        raise


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and model status."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    return HealthResponse(
        status="healthy",
        model_version=scorer.model_version,
        models_loaded=list(scorer.models.keys()),
        timestamp=datetime.utcnow().isoformat()
    )


# Model info endpoint
@app.get("/model/info", response_model=ModelInfoResponse)
async def model_info():
    """Get information about the loaded models."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    return ModelInfoResponse(
        model_version=scorer.model_version,
        available_models=list(scorer.models.keys()),
        risk_thresholds=scorer.RISK_THRESHOLDS,
        feature_count=25  # Approximate feature count
    )


# Domain scoring endpoint
@app.post("/score/domain", response_model=ScoreResponse)
async def score_domain(request: DomainScoreRequest):
    """Score a single domain for brand impersonation risk."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    try:
        result = scorer.score_domain(request.domain, request.brand_name)
        return _convert_to_response(result)
    except Exception as e:
        logger.error(f"Error scoring domain: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Social media scoring endpoint
@app.post("/score/social", response_model=ScoreResponse)
async def score_social(request: SocialScoreRequest):
    """Score a social media profile for brand impersonation risk."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    try:
        result = scorer.score_social_profile(
            request.username, 
            request.platform, 
            request.brand_name
        )
        return _convert_to_response(result)
    except Exception as e:
        logger.error(f"Error scoring social profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Batch domain scoring endpoint
@app.post("/score/domain/batch", response_model=BatchScoreResponse)
async def score_domain_batch(request: BatchDomainRequest):
    """Score multiple domains in a single request."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    if len(request.domains) > 1000:
        raise HTTPException(status_code=400, detail="Maximum 1000 domains per batch")
    
    try:
        import time
        start_time = time.time()
        
        results = scorer.batch_score_domains(request.domains, request.brand_name)
        
        scan_time_ms = (time.time() - start_time) * 1000
        
        return BatchScoreResponse(
            results=[_convert_to_response(r) for r in results],
            total_scanned=len(results),
            threats_detected=sum(1 for r in results if r.is_threat),
            scan_time_ms=scan_time_ms
        )
    except Exception as e:
        logger.error(f"Error in batch domain scoring: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Batch social scoring endpoint
@app.post("/score/social/batch", response_model=BatchScoreResponse)
async def score_social_batch(request: BatchSocialRequest):
    """Score multiple social media profiles in a single request."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    if len(request.profiles) > 1000:
        raise HTTPException(status_code=400, detail="Maximum 1000 profiles per batch")
    
    try:
        import time
        start_time = time.time()
        
        profiles = [(p["username"], p["platform"]) for p in request.profiles]
        results = scorer.batch_score_social_profiles(profiles, request.brand_name)
        
        scan_time_ms = (time.time() - start_time) * 1000
        
        return BatchScoreResponse(
            results=[_convert_to_response(r) for r in results],
            total_scanned=len(results),
            threats_detected=sum(1 for r in results if r.is_threat),
            scan_time_ms=scan_time_ms
        )
    except Exception as e:
        logger.error(f"Error in batch social scoring: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Explain prediction endpoint
@app.post("/explain/domain")
async def explain_domain(request: DomainScoreRequest):
    """Get detailed explanation of why a domain was flagged."""
    if scorer is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    try:
        result = scorer.score_domain(request.domain, request.brand_name)
        
        # Get top contributing features
        top_features = _get_top_features(result.feature_vector, n=10)
        
        return {
            "domain": result.domain,
            "brand_name": result.brand_name,
            "threat_score": result.threat_score,
            "risk_level": result.risk_level,
            "is_threat": result.is_threat,
            "top_contributing_features": top_features,
            "detected_techniques": result.detected_techniques,
            "recommendations": result.recommendations
        }
    except Exception as e:
        logger.error(f"Error explaining domain: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _convert_to_response(result: RealTimeScore) -> ScoreResponse:
    """Convert RealTimeScore to API response format."""
    return ScoreResponse(
        domain=result.domain,
        brand_name=result.brand_name,
        threat_score=result.threat_score,
        risk_level=result.risk_level,
        is_threat=result.is_threat,
        confidence=result.confidence,
        detected_techniques=result.detected_techniques,
        scan_duration_ms=result.scan_duration_ms,
        timestamp=result.timestamp,
        model_version=result.model_version,
        recommendations=result.recommendations
    )


def _get_top_features(features: Dict[str, float], n: int = 10) -> List[Dict[str, Any]]:
    """Get top features contributing to threat score."""
    # Sort by absolute value (assuming higher absolute values indicate stronger signal)
    sorted_features = sorted(
        [(k, v) for k, v in features.items()],
        key=lambda x: abs(x[1]),
        reverse=True
    )
    
    return [
        {"feature": k, "value": float(v), "interpretation": _interpret_feature(k, v)}
        for k, v in sorted_features[:n]
    ]


def _interpret_feature(feature_name: str, value: float) -> str:
    """Provide human-readable interpretation of a feature."""
    interpretations = {
        'levenshtein_distance': lambda v: f"{'Low' if v <= 2 else 'Medium' if v <= 5 else 'High'} edit distance from brand name",
        'jaro_winkler': lambda v: f"{'High' if v > 0.9 else 'Medium' if v > 0.7 else 'Low'} text similarity to brand",
        'has_homoglyph': lambda v: "Contains visually deceptive characters" if v > 0 else "No homoglyphs detected",
        'suspicious_tld': lambda v: "Uses TLD commonly associated with phishing" if v > 0 else "TLD appears legitimate",
        'has_phishing_keyword': lambda v: "Contains terms commonly used in phishing" if v > 0 else "No phishing keywords",
        'hyphen_count': lambda v: f"{'Many' if v > 2 else 'Some' if v > 0 else 'No'} hyphens in domain",
        'digit_count': lambda v: f"Contains {int(v)} digits",
        'brand_in_domain': lambda v: "Brand name present in domain" if v > 0 else "Brand name not in domain",
    }
    
    if feature_name in interpretations:
        return interpretations[feature_name](value)
    return f"Value: {value:.3f}"


if __name__ == "__main__":
    import uvicorn
    
    host = os.environ.get("API_HOST", "0.0.0.0")
    port = int(os.environ.get("API_PORT", 8000))
    
    uvicorn.run(app, host=host, port=port)
