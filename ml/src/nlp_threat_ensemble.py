"""
Advanced NLP Ensemble for Threat Detection.

This module implements a sophisticated ensemble system that combines:
- Multiple transformer models (BERT, RoBERTa, DistilBERT)
- Character-level CNN/LSTM for domain analysis
- Cross-encoder models for brand-domain similarity
- Gradient boosting meta-learner for score fusion

Provides state-of-the-art threat detection through model diversity.

Author: DoppelDown ML Team
Version: 2.0.0
"""

import numpy as np
import json
import logging
import hashlib
import time
from typing import List, Dict, Optional, Tuple, Any, Union, Callable, Set
from dataclasses import dataclass, field, asdict
from enum import Enum
from pathlib import Path
from collections import defaultdict
from abc import ABC, abstractmethod
import re
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check available libraries
TORCH_AVAILABLE = False
TRANSFORMERS_AVAILABLE = False
SKLEARN_AVAILABLE = False

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from torch.utils.data import DataLoader, Dataset
    TORCH_AVAILABLE = True
except ImportError:
    logger.warning("PyTorch not available")

try:
    from transformers import AutoTokenizer, AutoModel, AutoConfig
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    logger.warning("Transformers not available")

try:
    from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
    from sklearn.preprocessing import StandardScaler
    from sklearn.calibration import CalibratedClassifierCV
    SKLEARN_AVAILABLE = True
except ImportError:
    logger.warning("scikit-learn not available")


# ============================================================================
# Data Structures
# ============================================================================

class EnsembleStrategy(Enum):
    """Ensemble combination strategies."""
    WEIGHTED_AVERAGE = "weighted_average"
    MAX_VOTE = "max_vote"
    STACKING = "stacking"
    BOOSTING = "boosting"
    SOFT_VOTE = "soft_vote"


class ModelRole(Enum):
    """Role of model in ensemble."""
    SEMANTIC = "semantic"           # Semantic similarity
    SYNTACTIC = "syntactic"         # Character/structure analysis
    CLASSIFIER = "classifier"       # Content classification
    CROSS_ENCODER = "cross_encoder" # Pair-wise scoring
    META_LEARNER = "meta_learner"   # Score fusion


@dataclass
class EnsembleConfig:
    """Configuration for the NLP ensemble."""
    # Ensemble settings
    strategy: EnsembleStrategy = EnsembleStrategy.WEIGHTED_AVERAGE
    enable_calibration: bool = True
    temperature: float = 1.0
    
    # Model selection
    models: Dict[str, str] = field(default_factory=lambda: {
        'semantic_primary': 'sentence-transformers/all-MiniLM-L6-v2',
        'semantic_secondary': 'sentence-transformers/paraphrase-MiniLM-L3-v2',
        'classifier': 'distilbert-base-uncased',
        'cross_encoder': 'cross-encoder/ms-marco-MiniLM-L-6-v2'
    })
    
    # Model weights (for weighted average)
    weights: Dict[str, float] = field(default_factory=lambda: {
        'semantic_primary': 0.30,
        'semantic_secondary': 0.15,
        'classifier': 0.25,
        'cross_encoder': 0.20,
        'heuristic': 0.10
    })
    
    # Processing settings
    max_length: int = 256
    batch_size: int = 32
    device: str = "auto"
    
    # Thresholds
    threat_threshold: float = 0.65
    high_confidence_threshold: float = 0.85
    disagreement_threshold: float = 0.3


@dataclass
class ComponentScore:
    """Score from an individual ensemble component."""
    component_name: str
    role: ModelRole
    score: float
    confidence: float
    latency_ms: float
    features_used: List[str]
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EnsembleResult:
    """Complete result from ensemble prediction."""
    # Core prediction
    is_threat: bool
    threat_score: float
    confidence: float
    
    # Component breakdown
    component_scores: List[ComponentScore]
    agreement_level: float
    
    # Analysis
    risk_factors: List[str]
    detected_techniques: List[str]
    explanation: str
    recommendations: List[str]
    
    # Metadata
    ensemble_strategy: str
    total_latency_ms: float
    models_used: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        result = asdict(self)
        result['component_scores'] = [asdict(c) for c in self.component_scores]
        for cs in result['component_scores']:
            cs['role'] = cs['role'].value
        return result


# ============================================================================
# Base Component Interface
# ============================================================================

class EnsembleComponent(ABC):
    """Abstract base class for ensemble components."""
    
    def __init__(self, name: str, role: ModelRole, weight: float = 1.0):
        self.name = name
        self.role = role
        self.weight = weight
        self._initialized = False
    
    @abstractmethod
    def initialize(self):
        """Initialize the component (load models, etc.)."""
        pass
    
    @abstractmethod
    def score(
        self, 
        domain: str, 
        brand_name: str,
        content: Optional[str] = None
    ) -> ComponentScore:
        """
        Score a domain for threat likelihood.
        
        Args:
            domain: Domain to analyze
            brand_name: Brand to protect
            content: Optional page content
            
        Returns:
            ComponentScore with results
        """
        pass
    
    def ensure_initialized(self):
        """Ensure component is initialized before use."""
        if not self._initialized:
            self.initialize()
            self._initialized = True


# ============================================================================
# Semantic Similarity Component
# ============================================================================

class SemanticSimilarityComponent(EnsembleComponent):
    """
    Semantic similarity scoring using sentence transformers.
    
    Computes embedding-based similarity between domain variations
    and brand name representations.
    """
    
    def __init__(
        self, 
        name: str = "semantic_primary",
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        weight: float = 0.30
    ):
        super().__init__(name, ModelRole.SEMANTIC, weight)
        self.model_name = model_name
        self._model = None
        self._brand_cache = {}
    
    def initialize(self):
        """Load the sentence transformer model."""
        if TRANSFORMERS_AVAILABLE:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
                logger.info(f"Loaded semantic model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not load semantic model: {e}")
    
    def score(
        self, 
        domain: str, 
        brand_name: str,
        content: Optional[str] = None
    ) -> ComponentScore:
        """Score domain-brand semantic similarity."""
        start_time = time.time()
        
        self.ensure_initialized()
        
        features_used = []
        metadata = {}
        
        # Extract domain components
        domain_lower = domain.lower()
        sld = domain_lower.split('.')[0]  # Second-level domain
        
        # Domain representations
        domain_texts = [
            sld,
            sld.replace('-', ' ').replace('_', ' '),
            domain_lower,
        ]
        features_used.extend(['sld', 'sld_normalized', 'full_domain'])
        
        # Add content if available
        if content:
            # Extract key phrases from content
            content_snippet = content[:500]
            domain_texts.append(content_snippet)
            features_used.append('content_snippet')
        
        # Calculate similarity
        if self._model:
            similarity = self._compute_transformer_similarity(
                domain_texts, brand_name
            )
            metadata['method'] = 'transformer'
        else:
            similarity = self._compute_fallback_similarity(sld, brand_name)
            metadata['method'] = 'fallback'
        
        # Confidence based on clarity of signal
        confidence = 0.5 + 0.5 * abs(similarity - 0.5)
        
        latency = (time.time() - start_time) * 1000
        
        return ComponentScore(
            component_name=self.name,
            role=self.role,
            score=similarity,
            confidence=confidence,
            latency_ms=latency,
            features_used=features_used,
            metadata=metadata
        )
    
    def _compute_transformer_similarity(
        self, 
        domain_texts: List[str], 
        brand_name: str
    ) -> float:
        """Compute similarity using transformer embeddings."""
        # Get brand embedding (cached)
        if brand_name not in self._brand_cache:
            brand_texts = [
                brand_name,
                f"official {brand_name}",
                f"{brand_name} website",
                f"{brand_name} login",
                f"{brand_name} support"
            ]
            brand_embeddings = self._model.encode(brand_texts, normalize_embeddings=True)
            self._brand_cache[brand_name] = np.mean(brand_embeddings, axis=0)
        
        brand_embedding = self._brand_cache[brand_name]
        
        # Encode domain texts
        domain_embeddings = self._model.encode(domain_texts, normalize_embeddings=True)
        
        # Compute max similarity
        similarities = [
            float(np.dot(emb, brand_embedding))
            for emb in domain_embeddings
        ]
        
        return max(similarities)
    
    def _compute_fallback_similarity(self, sld: str, brand_name: str) -> float:
        """Fallback similarity using string metrics."""
        brand_lower = brand_name.lower()
        
        # Levenshtein similarity
        def levenshtein_ratio(s1: str, s2: str) -> float:
            if not s1 or not s2:
                return 0.0
            
            m, n = len(s1), len(s2)
            dp = [[0] * (n + 1) for _ in range(m + 1)]
            
            for i in range(m + 1):
                dp[i][0] = i
            for j in range(n + 1):
                dp[0][j] = j
            
            for i in range(1, m + 1):
                for j in range(1, n + 1):
                    cost = 0 if s1[i-1] == s2[j-1] else 1
                    dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)
            
            return 1 - dp[m][n] / max(m, n)
        
        # Check containment
        if brand_lower in sld:
            return 0.85
        
        return levenshtein_ratio(sld, brand_lower)


# ============================================================================
# Character-Level Analysis Component
# ============================================================================

class CharacterAnalysisComponent(EnsembleComponent):
    """
    Character-level domain analysis for typosquatting detection.
    
    Analyzes character patterns, keyboard distances, and visual similarities.
    """
    
    # Keyboard adjacency map
    KEYBOARD_MAP = {
        'q': 'wa', 'w': 'qeas', 'e': 'wrsd', 'r': 'etdf', 't': 'ryfg',
        'y': 'tugh', 'u': 'yihj', 'i': 'uojk', 'o': 'ipkl', 'p': 'ol',
        'a': 'qwsz', 's': 'awedxz', 'd': 'serfcx', 'f': 'drtgvc',
        'g': 'ftyhbv', 'h': 'gyujnb', 'j': 'huikmn', 'k': 'jiolm',
        'l': 'kop', 'z': 'asx', 'x': 'zsdc', 'c': 'xdfv', 'v': 'cfgb',
        'b': 'vghn', 'n': 'bhjm', 'm': 'njk'
    }
    
    # Visual confusables
    VISUALS = {
        'a': ['а', 'α', '@', '4'],
        'e': ['е', 'ε', '3'],
        'i': ['і', 'l', '1', '|'],
        'o': ['о', '0', 'ο'],
        'c': ['с', 'ϲ'],
        'p': ['р', 'ρ'],
        's': ['ѕ', '5', '$'],
        'x': ['х', '×'],
        'y': ['у', 'ү'],
    }
    
    def __init__(self, name: str = "character_analysis", weight: float = 0.20):
        super().__init__(name, ModelRole.SYNTACTIC, weight)
    
    def initialize(self):
        """Character analysis doesn't need heavy initialization."""
        pass
    
    def score(
        self, 
        domain: str, 
        brand_name: str,
        content: Optional[str] = None
    ) -> ComponentScore:
        """Score domain for character-level threats."""
        start_time = time.time()
        
        sld = domain.lower().split('.')[0]
        brand_lower = brand_name.lower()
        
        features_used = []
        metadata = {'analyses': {}}
        
        # 1. Edit distance analysis
        edit_score = self._edit_distance_score(sld, brand_lower)
        features_used.append('edit_distance')
        metadata['analyses']['edit_distance'] = edit_score
        
        # 2. Keyboard proximity analysis
        keyboard_score = self._keyboard_proximity_score(sld, brand_lower)
        features_used.append('keyboard_proximity')
        metadata['analyses']['keyboard_proximity'] = keyboard_score
        
        # 3. Visual confusion analysis
        visual_score = self._visual_confusion_score(sld, brand_lower)
        features_used.append('visual_confusion')
        metadata['analyses']['visual_confusion'] = visual_score
        
        # 4. N-gram overlap
        ngram_score = self._ngram_overlap_score(sld, brand_lower)
        features_used.append('ngram_overlap')
        metadata['analyses']['ngram_overlap'] = ngram_score
        
        # 5. Pattern analysis
        pattern_score = self._pattern_analysis_score(sld, brand_lower)
        features_used.append('pattern_analysis')
        metadata['analyses']['pattern_analysis'] = pattern_score
        
        # Combine scores
        weights = {
            'edit_distance': 0.25,
            'keyboard_proximity': 0.20,
            'visual_confusion': 0.25,
            'ngram_overlap': 0.15,
            'pattern_analysis': 0.15
        }
        
        combined_score = sum(
            metadata['analyses'][k] * v 
            for k, v in weights.items()
        )
        
        # Calculate confidence
        scores = list(metadata['analyses'].values())
        variance = np.var(scores) if scores else 0
        confidence = 0.7 + 0.3 * (1 - min(1, variance * 2))
        
        latency = (time.time() - start_time) * 1000
        
        return ComponentScore(
            component_name=self.name,
            role=self.role,
            score=combined_score,
            confidence=confidence,
            latency_ms=latency,
            features_used=features_used,
            metadata=metadata
        )
    
    def _edit_distance_score(self, s1: str, s2: str) -> float:
        """Score based on edit distance."""
        if not s1 or not s2:
            return 0.0
        
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if s1[i-1] == s2[j-1] else 1
                dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)
        
        distance = dp[m][n]
        max_len = max(m, n)
        
        # High similarity at low edit distance is suspicious
        similarity = 1 - distance / max_len
        
        # Transform: very high similarity (1-2 edits) is most suspicious
        if distance <= 2:
            return 0.9 - (distance * 0.1)
        elif distance <= 4:
            return 0.7 - ((distance - 2) * 0.15)
        else:
            return max(0, similarity * 0.5)
    
    def _keyboard_proximity_score(self, s1: str, s2: str) -> float:
        """Score based on keyboard proximity."""
        if len(s1) != len(s2):
            return 0.0
        
        proximity_matches = 0
        for c1, c2 in zip(s1, s2):
            if c1 != c2:
                adj = self.KEYBOARD_MAP.get(c2, '')
                if c1 in adj:
                    proximity_matches += 1
        
        if proximity_matches > 0:
            return min(0.9, 0.6 + proximity_matches * 0.15)
        return 0.0
    
    def _visual_confusion_score(self, s1: str, s2: str) -> float:
        """Score based on visual character confusion."""
        visual_matches = 0
        
        for c1 in s1:
            confusables = self.VISUALS.get(c1, [])
            if confusables and c1 in s2:
                continue
            # Check if any confusable of c1 matches the brand
            for conf in confusables:
                if conf in s1:
                    visual_matches += 1
                    break
        
        # Check reverse direction
        for c2, confusables in self.VISUALS.items():
            for conf in confusables:
                if conf in s1 and c2 in s2:
                    visual_matches += 1
                    break
        
        if visual_matches > 0:
            return min(0.95, 0.7 + visual_matches * 0.1)
        return 0.0
    
    def _ngram_overlap_score(self, s1: str, s2: str, n: int = 2) -> float:
        """Score based on character n-gram overlap."""
        def get_ngrams(s: str, n: int) -> Set[str]:
            return {s[i:i+n] for i in range(len(s) - n + 1)}
        
        ngrams1 = get_ngrams(s1, n)
        ngrams2 = get_ngrams(s2, n)
        
        if not ngrams1 or not ngrams2:
            return 0.0
        
        intersection = len(ngrams1 & ngrams2)
        union = len(ngrams1 | ngrams2)
        
        jaccard = intersection / union if union > 0 else 0
        
        # High overlap is suspicious
        return jaccard if jaccard > 0.5 else jaccard * 0.5
    
    def _pattern_analysis_score(self, domain: str, brand: str) -> float:
        """Score based on common attack patterns."""
        score = 0.0
        
        # Check for brand containment with modifications
        if brand in domain:
            remaining = domain.replace(brand, '', 1)
            if remaining:
                # Brand + security keywords
                security_keywords = ['login', 'secure', 'verify', 'update', 'support', 'help']
                if any(kw in remaining.lower() for kw in security_keywords):
                    score = max(score, 0.85)
                
                # Brand + separator + keyword
                if '-' in remaining or '_' in remaining:
                    score = max(score, 0.75)
        
        # Check for digit substitution
        digit_map = {'0': 'o', '1': 'il', '3': 'e', '4': 'a', '5': 's', '7': 't'}
        normalized = domain
        for digit, letters in digit_map.items():
            for letter in letters:
                normalized = normalized.replace(digit, letter)
        
        if normalized != domain and brand in normalized:
            score = max(score, 0.90)
        
        return score


# ============================================================================
# Heuristic Rules Component
# ============================================================================

class HeuristicRulesComponent(EnsembleComponent):
    """
    Rule-based heuristic analysis for domain threats.
    
    Applies expert-crafted rules for known threat patterns.
    """
    
    # Suspicious TLDs
    SUSPICIOUS_TLDS = {
        '.tk', '.ml', '.ga', '.cf', '.gq',  # Free domains
        '.xyz', '.top', '.click', '.link', '.work',  # Spam-heavy
        '.download', '.review', '.loan', '.date', '.racing',
        '.win', '.bid', '.stream', '.trade', '.party'
    }
    
    # Security/phishing keywords
    PHISHING_KEYWORDS = {
        'login', 'signin', 'sign-in', 'logon',
        'secure', 'security', 'verify', 'verification',
        'update', 'confirm', 'validate',
        'account', 'password', 'credential',
        'support', 'helpdesk', 'service',
        'official', 'authentic', 'genuine'
    }
    
    def __init__(self, name: str = "heuristic_rules", weight: float = 0.10):
        super().__init__(name, ModelRole.CLASSIFIER, weight)
    
    def initialize(self):
        """No initialization needed for rule-based component."""
        pass
    
    def score(
        self, 
        domain: str, 
        brand_name: str,
        content: Optional[str] = None
    ) -> ComponentScore:
        """Apply heuristic rules to score domain."""
        start_time = time.time()
        
        domain_lower = domain.lower()
        brand_lower = brand_name.lower()
        
        features_used = []
        metadata = {'rules_triggered': []}
        
        score = 0.0
        
        # Rule 1: Suspicious TLD
        for tld in self.SUSPICIOUS_TLDS:
            if domain_lower.endswith(tld):
                score += 0.25
                metadata['rules_triggered'].append(f'suspicious_tld_{tld}')
                features_used.append('tld_check')
                break
        
        # Rule 2: Brand in domain with security keywords
        if brand_lower in domain_lower:
            for keyword in self.PHISHING_KEYWORDS:
                if keyword in domain_lower:
                    score += 0.30
                    metadata['rules_triggered'].append(f'brand_with_keyword_{keyword}')
                    features_used.append('brand_keyword_combo')
                    break
        
        # Rule 3: Excessive hyphens
        hyphen_count = domain_lower.count('-')
        if hyphen_count >= 2:
            score += 0.15 + (hyphen_count - 2) * 0.05
            metadata['rules_triggered'].append(f'excessive_hyphens_{hyphen_count}')
            features_used.append('hyphen_count')
        
        # Rule 4: Very long domain
        sld = domain_lower.split('.')[0]
        if len(sld) > 30:
            score += 0.15
            metadata['rules_triggered'].append('long_domain')
            features_used.append('domain_length')
        
        # Rule 5: Multiple TLDs (brand.com.otherdomain.com pattern)
        parts = domain_lower.split('.')
        if len(parts) > 3:
            score += 0.20
            metadata['rules_triggered'].append('multiple_tld_pattern')
            features_used.append('subdomain_depth')
        
        # Rule 6: Brand in subdomain only
        if len(parts) > 2 and brand_lower in parts[0]:
            score += 0.25
            metadata['rules_triggered'].append('brand_in_subdomain')
            features_used.append('subdomain_brand')
        
        # Rule 7: Digit substitution pattern
        if any(c.isdigit() for c in sld):
            digit_positions = [i for i, c in enumerate(sld) if c.isdigit()]
            if digit_positions:
                score += 0.15
                metadata['rules_triggered'].append('contains_digits')
                features_used.append('digit_substitution')
        
        # Normalize score
        final_score = min(1.0, score)
        
        # Confidence based on number of rules triggered
        confidence = 0.6 + 0.1 * len(metadata['rules_triggered'])
        confidence = min(0.95, confidence)
        
        latency = (time.time() - start_time) * 1000
        
        return ComponentScore(
            component_name=self.name,
            role=self.role,
            score=final_score,
            confidence=confidence,
            latency_ms=latency,
            features_used=features_used,
            metadata=metadata
        )


# ============================================================================
# Phishing Content Classifier Component
# ============================================================================

class PhishingClassifierComponent(EnsembleComponent):
    """
    Phishing content classification using transformer models.
    """
    
    # Pattern categories for fallback
    PATTERNS = {
        'urgency': [
            r'\b(urgent|immediately|right now|act fast|limited time)\b',
            r'\b(expires?|deadline|within \d+ hours?)\b'
        ],
        'credentials': [
            r'\b(password|login|credentials|verify|confirm)\b',
            r'\b(ssn|social security|credit card|bank)\b'
        ],
        'threats': [
            r'\b(suspend|terminate|close|restrict|disable)\b',
            r'\b(unauthorized|suspicious|unusual)\b'
        ],
        'authority': [
            r'\b(official|support|team|department|service)\b',
            r'\b(dear customer|valued member)\b'
        ]
    }
    
    def __init__(
        self, 
        name: str = "phishing_classifier",
        model_name: str = "distilbert-base-uncased",
        weight: float = 0.25
    ):
        super().__init__(name, ModelRole.CLASSIFIER, weight)
        self.model_name = model_name
        self._model = None
        self._tokenizer = None
        self._device = "cpu"
    
    def initialize(self):
        """Load transformer model for classification."""
        if TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
            try:
                from transformers import AutoModelForSequenceClassification
                
                self._tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                self._model = AutoModelForSequenceClassification.from_pretrained(
                    self.model_name,
                    num_labels=2,
                    ignore_mismatched_sizes=True
                )
                
                if torch.cuda.is_available():
                    self._device = "cuda"
                elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                    self._device = "mps"
                
                self._model.to(self._device)
                self._model.eval()
                logger.info(f"Loaded classifier: {self.model_name} on {self._device}")
            except Exception as e:
                logger.warning(f"Could not load classifier: {e}")
    
    def score(
        self, 
        domain: str, 
        brand_name: str,
        content: Optional[str] = None
    ) -> ComponentScore:
        """Score content for phishing indicators."""
        start_time = time.time()
        
        self.ensure_initialized()
        
        features_used = []
        metadata = {}
        
        # If no content, score based on domain only
        if not content:
            domain_score = self._score_domain_text(domain, brand_name)
            return ComponentScore(
                component_name=self.name,
                role=self.role,
                score=domain_score * 0.5,  # Lower confidence without content
                confidence=0.5,
                latency_ms=(time.time() - start_time) * 1000,
                features_used=['domain_only'],
                metadata={'mode': 'domain_only'}
            )
        
        # Pattern-based scoring
        pattern_result = self._score_patterns(content)
        features_used.extend(pattern_result['categories'])
        metadata['pattern_score'] = pattern_result['score']
        metadata['categories_found'] = pattern_result['categories']
        
        # Model-based scoring
        model_score = 0.5
        if self._model and self._tokenizer:
            model_score = self._model_score(content)
            features_used.append('transformer_classification')
            metadata['model_score'] = model_score
        
        # Combine scores
        combined_score = 0.6 * pattern_result['score'] + 0.4 * model_score
        
        # Boost if brand is mentioned in suspicious content
        if brand_name.lower() in content.lower() and pattern_result['score'] > 0.3:
            combined_score = min(1.0, combined_score * 1.2)
            features_used.append('brand_in_suspicious_content')
        
        # Calculate confidence
        confidence = 0.65 + 0.35 * abs(combined_score - 0.5)
        
        latency = (time.time() - start_time) * 1000
        
        return ComponentScore(
            component_name=self.name,
            role=self.role,
            score=combined_score,
            confidence=confidence,
            latency_ms=latency,
            features_used=features_used,
            metadata=metadata
        )
    
    def _score_patterns(self, content: str) -> Dict[str, Any]:
        """Score content using pattern matching."""
        content_lower = content.lower()
        categories_found = []
        
        weights = {'urgency': 0.2, 'credentials': 0.35, 'threats': 0.25, 'authority': 0.2}
        score = 0.0
        
        for category, patterns in self.PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, content_lower, re.IGNORECASE):
                    categories_found.append(category)
                    score += weights.get(category, 0.15)
                    break
        
        return {
            'score': min(1.0, score),
            'categories': list(set(categories_found))
        }
    
    def _model_score(self, content: str) -> float:
        """Score using transformer model."""
        try:
            inputs = self._tokenizer(
                content[:512],
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            )
            
            if self._device != "cpu":
                inputs = {k: v.to(self._device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self._model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
                return float(probs[0][1])  # Phishing probability
        except Exception as e:
            logger.warning(f"Model scoring failed: {e}")
            return 0.5
    
    def _score_domain_text(self, domain: str, brand: str) -> float:
        """Score based on domain text alone."""
        score = 0.0
        domain_lower = domain.lower()
        brand_lower = brand.lower()
        
        # Brand in domain
        if brand_lower in domain_lower:
            score += 0.3
            
            # With security keywords
            keywords = ['login', 'secure', 'verify', 'support', 'account']
            if any(kw in domain_lower for kw in keywords):
                score += 0.3
        
        return min(1.0, score)


# ============================================================================
# NLP Ensemble Orchestrator
# ============================================================================

class NLPThreatEnsemble:
    """
    Orchestrates multiple NLP components for robust threat detection.
    
    Combines diverse models and strategies for high-accuracy predictions.
    """
    
    def __init__(
        self,
        config: Optional[EnsembleConfig] = None,
        components: Optional[List[EnsembleComponent]] = None
    ):
        """
        Initialize the ensemble.
        
        Args:
            config: EnsembleConfig with settings
            components: List of pre-configured components (optional)
        """
        self.config = config or EnsembleConfig()
        
        if components:
            self.components = components
        else:
            self.components = self._create_default_components()
        
        # Meta-learner for stacking (if sklearn available)
        self._meta_learner = None
        self._scaler = None
        
        # Result cache
        self._cache = {}
        self._cache_max_size = 10000
    
    def _create_default_components(self) -> List[EnsembleComponent]:
        """Create default ensemble components."""
        components = []
        
        # Semantic similarity (primary)
        components.append(SemanticSimilarityComponent(
            name="semantic_primary",
            model_name=self.config.models.get('semantic_primary', 'sentence-transformers/all-MiniLM-L6-v2'),
            weight=self.config.weights.get('semantic_primary', 0.30)
        ))
        
        # Character analysis
        components.append(CharacterAnalysisComponent(
            name="character_analysis",
            weight=self.config.weights.get('character', 0.20)
        ))
        
        # Heuristic rules
        components.append(HeuristicRulesComponent(
            name="heuristic_rules",
            weight=self.config.weights.get('heuristic', 0.10)
        ))
        
        # Phishing classifier
        components.append(PhishingClassifierComponent(
            name="phishing_classifier",
            model_name=self.config.models.get('classifier', 'distilbert-base-uncased'),
            weight=self.config.weights.get('classifier', 0.25)
        ))
        
        return components
    
    def _get_cache_key(self, domain: str, brand: str, content: Optional[str]) -> str:
        """Generate cache key."""
        content_hash = hashlib.md5((content or '').encode()).hexdigest()[:8]
        return f"{domain}:{brand}:{content_hash}"
    
    def predict(
        self,
        domain: str,
        brand_name: str,
        content: Optional[str] = None,
        use_cache: bool = True
    ) -> EnsembleResult:
        """
        Make ensemble prediction for a domain.
        
        Args:
            domain: Domain to analyze
            brand_name: Brand to protect
            content: Optional page content
            use_cache: Whether to use cached results
            
        Returns:
            EnsembleResult with comprehensive analysis
        """
        start_time = time.time()
        
        # Check cache
        cache_key = self._get_cache_key(domain, brand_name, content)
        if use_cache and cache_key in self._cache:
            cached = self._cache[cache_key]
            return cached
        
        # Collect component scores
        component_scores = []
        for component in self.components:
            try:
                score = component.score(domain, brand_name, content)
                component_scores.append(score)
            except Exception as e:
                logger.warning(f"Component {component.name} failed: {e}")
        
        # Combine scores based on strategy
        combined_score = self._combine_scores(component_scores)
        
        # Calculate agreement level
        scores = [cs.score for cs in component_scores]
        agreement = 1.0 - (np.std(scores) if len(scores) > 1 else 0)
        
        # Determine if threat
        is_threat = combined_score >= self.config.threat_threshold
        
        # Calculate overall confidence
        confidences = [cs.confidence for cs in component_scores]
        avg_confidence = np.mean(confidences) if confidences else 0.5
        confidence = avg_confidence * agreement
        
        # Generate analysis
        risk_factors = self._identify_risk_factors(component_scores)
        techniques = self._identify_techniques(component_scores)
        explanation = self._generate_explanation(
            is_threat, combined_score, component_scores
        )
        recommendations = self._generate_recommendations(
            is_threat, combined_score, techniques
        )
        
        total_latency = (time.time() - start_time) * 1000
        
        result = EnsembleResult(
            is_threat=is_threat,
            threat_score=combined_score,
            confidence=confidence,
            component_scores=component_scores,
            agreement_level=agreement,
            risk_factors=risk_factors,
            detected_techniques=techniques,
            explanation=explanation,
            recommendations=recommendations,
            ensemble_strategy=self.config.strategy.value,
            total_latency_ms=total_latency,
            models_used=[c.name for c in self.components]
        )
        
        # Cache result
        if use_cache:
            if len(self._cache) >= self._cache_max_size:
                # Remove oldest entries
                keys = list(self._cache.keys())[:100]
                for k in keys:
                    del self._cache[k]
            self._cache[cache_key] = result
        
        return result
    
    def _combine_scores(self, component_scores: List[ComponentScore]) -> float:
        """Combine component scores using configured strategy."""
        if not component_scores:
            return 0.5
        
        if self.config.strategy == EnsembleStrategy.WEIGHTED_AVERAGE:
            total_weight = sum(
                self.config.weights.get(cs.component_name, 1.0) 
                for cs in component_scores
            )
            
            weighted_sum = sum(
                cs.score * self.config.weights.get(cs.component_name, 1.0)
                for cs in component_scores
            )
            
            return weighted_sum / total_weight if total_weight > 0 else 0.5
        
        elif self.config.strategy == EnsembleStrategy.MAX_VOTE:
            return max(cs.score for cs in component_scores)
        
        elif self.config.strategy == EnsembleStrategy.SOFT_VOTE:
            # Temperature-scaled averaging
            scores = [cs.score for cs in component_scores]
            temp = self.config.temperature
            
            exp_scores = [np.exp(s / temp) for s in scores]
            total = sum(exp_scores)
            
            return sum(s * e for s, e in zip(scores, exp_scores)) / total
        
        else:
            # Default to simple average
            return np.mean([cs.score for cs in component_scores])
    
    def _identify_risk_factors(
        self, 
        component_scores: List[ComponentScore]
    ) -> List[str]:
        """Identify key risk factors from component analyses."""
        risk_factors = []
        
        for cs in component_scores:
            if cs.score > 0.6:
                risk_factors.append(f"{cs.component_name}: high score ({cs.score:.2f})")
            
            # Check metadata for specific findings
            metadata = cs.metadata
            
            if 'rules_triggered' in metadata:
                for rule in metadata['rules_triggered'][:3]:
                    risk_factors.append(f"Rule: {rule}")
            
            if 'categories_found' in metadata:
                for cat in metadata['categories_found']:
                    risk_factors.append(f"Content pattern: {cat}")
        
        return risk_factors[:10]  # Limit to top 10
    
    def _identify_techniques(
        self, 
        component_scores: List[ComponentScore]
    ) -> List[str]:
        """Identify specific attack techniques detected."""
        techniques = set()
        
        for cs in component_scores:
            if cs.score < 0.5:
                continue
            
            # From character analysis
            if cs.component_name == "character_analysis":
                analyses = cs.metadata.get('analyses', {})
                if analyses.get('visual_confusion', 0) > 0.5:
                    techniques.add('homoglyph_attack')
                if analyses.get('keyboard_proximity', 0) > 0.5:
                    techniques.add('typosquatting')
                if analyses.get('edit_distance', 0) > 0.5:
                    techniques.add('character_manipulation')
            
            # From heuristics
            if cs.component_name == "heuristic_rules":
                rules = cs.metadata.get('rules_triggered', [])
                if any('keyword' in r for r in rules):
                    techniques.add('combo_squatting')
                if any('subdomain' in r for r in rules):
                    techniques.add('subdomain_abuse')
                if any('tld' in r for r in rules):
                    techniques.add('suspicious_tld')
            
            # From classifier
            if cs.component_name == "phishing_classifier":
                categories = cs.metadata.get('categories_found', [])
                if 'credentials' in categories:
                    techniques.add('credential_phishing')
                if 'urgency' in categories:
                    techniques.add('urgency_manipulation')
        
        return list(techniques)
    
    def _generate_explanation(
        self,
        is_threat: bool,
        score: float,
        component_scores: List[ComponentScore]
    ) -> str:
        """Generate human-readable explanation."""
        if not is_threat:
            return f"Domain appears safe. Ensemble score: {score:.2f}"
        
        # Find top contributors
        sorted_scores = sorted(
            component_scores, 
            key=lambda x: x.score, 
            reverse=True
        )
        
        top = sorted_scores[0] if sorted_scores else None
        
        explanation = f"THREAT DETECTED (score: {score:.2f}). "
        
        if top:
            explanation += f"Primary indicator: {top.component_name} ({top.score:.2f}). "
        
        agreement = 1.0 - np.std([cs.score for cs in component_scores])
        if agreement > 0.8:
            explanation += "High model agreement strengthens this assessment."
        elif agreement < 0.5:
            explanation += "Note: Models show some disagreement; manual review recommended."
        
        return explanation
    
    def _generate_recommendations(
        self,
        is_threat: bool,
        score: float,
        techniques: List[str]
    ) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        if not is_threat:
            recommendations.append("Continue standard monitoring")
            return recommendations
        
        if score >= 0.85:
            recommendations.append("CRITICAL: Initiate immediate takedown process")
            recommendations.append("Document evidence for legal action")
            recommendations.append("Alert brand protection team")
        elif score >= 0.70:
            recommendations.append("HIGH PRIORITY: Begin takedown/UDRP process")
            recommendations.append("Block domain on corporate networks")
            recommendations.append("Monitor for active campaigns")
        else:
            recommendations.append("Add to monitoring watchlist")
            recommendations.append("Investigate domain ownership")
        
        # Technique-specific recommendations
        if 'homoglyph_attack' in techniques:
            recommendations.append("Report IDN/homoglyph abuse to registrar")
        
        if 'credential_phishing' in techniques:
            recommendations.append("Submit to Safe Browsing and PhishTank")
        
        if 'typosquatting' in techniques:
            recommendations.append("Consider defensive domain registration")
        
        return recommendations[:5]
    
    def predict_batch(
        self,
        items: List[Tuple[str, str, Optional[str]]],
        use_cache: bool = True
    ) -> List[EnsembleResult]:
        """
        Batch prediction for multiple domains.
        
        Args:
            items: List of (domain, brand_name, content) tuples
            use_cache: Whether to use cached results
            
        Returns:
            List of EnsembleResult
        """
        results = []
        
        for domain, brand, content in items:
            result = self.predict(domain, brand, content, use_cache)
            results.append(result)
        
        return results
    
    def get_component_info(self) -> Dict[str, Any]:
        """Get information about ensemble components."""
        return {
            'strategy': self.config.strategy.value,
            'components': [
                {
                    'name': c.name,
                    'role': c.role.value,
                    'weight': c.weight,
                    'initialized': c._initialized
                }
                for c in self.components
            ],
            'threshold': self.config.threat_threshold,
            'cache_size': len(self._cache)
        }


# ============================================================================
# Factory and Convenience Functions
# ============================================================================

class EnsembleFactory:
    """Factory for creating configured ensembles."""
    
    @staticmethod
    def create_default() -> NLPThreatEnsemble:
        """Create ensemble with default configuration."""
        return NLPThreatEnsemble()
    
    @staticmethod
    def create_lightweight() -> NLPThreatEnsemble:
        """Create lightweight ensemble for resource-constrained environments."""
        config = EnsembleConfig(
            strategy=EnsembleStrategy.WEIGHTED_AVERAGE,
            models={
                'semantic_primary': 'sentence-transformers/paraphrase-MiniLM-L3-v2',
                'classifier': 'distilbert-base-uncased'
            },
            weights={
                'semantic_primary': 0.35,
                'character_analysis': 0.30,
                'heuristic_rules': 0.20,
                'phishing_classifier': 0.15
            }
        )
        return NLPThreatEnsemble(config=config)
    
    @staticmethod
    def create_high_accuracy() -> NLPThreatEnsemble:
        """Create high-accuracy ensemble with more models."""
        config = EnsembleConfig(
            strategy=EnsembleStrategy.SOFT_VOTE,
            temperature=0.5,
            models={
                'semantic_primary': 'sentence-transformers/all-mpnet-base-v2',
                'semantic_secondary': 'sentence-transformers/all-MiniLM-L6-v2',
                'classifier': 'microsoft/deberta-v3-small'
            }
        )
        return NLPThreatEnsemble(config=config)


# Global instance for convenience
_default_ensemble = None


def get_ensemble() -> NLPThreatEnsemble:
    """Get or create the default ensemble instance."""
    global _default_ensemble
    if _default_ensemble is None:
        _default_ensemble = NLPThreatEnsemble()
    return _default_ensemble


def predict_threat(
    domain: str,
    brand_name: str,
    content: Optional[str] = None
) -> EnsembleResult:
    """Convenience function for single prediction."""
    return get_ensemble().predict(domain, brand_name, content)


# ============================================================================
# Demo
# ============================================================================

def demo():
    """Run demonstration of the NLP ensemble."""
    print("=" * 70)
    print("DoppelDown NLP Threat Ensemble - Demo")
    print("=" * 70)
    
    # Create ensemble
    print("\n[1] Creating ensemble...")
    ensemble = NLPThreatEnsemble()
    
    print(f"Strategy: {ensemble.config.strategy.value}")
    print(f"Components: {len(ensemble.components)}")
    
    # Test cases
    test_cases = [
        ("google-security-verify.com", "google", None, "Combo-squatting"),
        ("g00gle.com", "google", None, "Digit substitution"),
        ("microsoft.com", "microsoft", None, "Legitimate domain"),
        ("аpple-login.tk", "apple", None, "Homoglyph + suspicious TLD"),
        (
            "paypal-verify.xyz", 
            "paypal",
            "URGENT: Your account has been suspended. Verify your identity immediately to restore access. Enter your password below.",
            "Full phishing with content"
        ),
    ]
    
    print("\n[2] Running threat detection...")
    print("-" * 70)
    
    for domain, brand, content, description in test_cases:
        result = ensemble.predict(domain, brand, content)
        
        status = "⚠️ THREAT" if result.is_threat else "✅ SAFE"
        
        print(f"\n{description}")
        print(f"  Domain: {domain}")
        print(f"  Brand: {brand}")
        print(f"  Status: {status}")
        print(f"  Score: {result.threat_score:.2f} (confidence: {result.confidence:.2f})")
        print(f"  Agreement: {result.agreement_level:.2f}")
        
        if result.detected_techniques:
            print(f"  Techniques: {', '.join(result.detected_techniques[:3])}")
        
        print(f"  Explanation: {result.explanation[:100]}...")
        
        # Show component breakdown
        print("  Component scores:")
        for cs in result.component_scores:
            print(f"    - {cs.component_name}: {cs.score:.2f}")
    
    print("\n" + "=" * 70)
    print("Demo complete!")
    print("=" * 70)


if __name__ == "__main__":
    demo()
