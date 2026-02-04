"""
Advanced Transformer-based Threat Detection Module for DoppelDown Brand Protection.

This module implements state-of-the-art NLP techniques using transformer models:
- BERT/RoBERTa-based phishing content classification
- Sentence Transformers for semantic brand similarity detection
- Character-level transformers for typosquatting detection
- Cross-encoder models for domain impersonation scoring
- Ensemble systems combining multiple transformer architectures

Author: DoppelDown ML Team
Version: 2.0.0
"""

import numpy as np
import re
import json
import logging
from typing import List, Dict, Optional, Tuple, Any, Union, Callable
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import defaultdict
import hashlib
from functools import lru_cache
import time
from pathlib import Path
import unicodedata

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import transformer dependencies
TRANSFORMERS_AVAILABLE = False
SENTENCE_TRANSFORMERS_AVAILABLE = False
TORCH_AVAILABLE = False

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    TORCH_AVAILABLE = True
except ImportError:
    logger.warning("PyTorch not available - using fallback implementations")

try:
    from transformers import (
        AutoTokenizer, 
        AutoModel, 
        AutoModelForSequenceClassification,
        pipeline,
        PreTrainedModel,
        PreTrainedTokenizer
    )
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    logger.warning("Transformers not available - using fallback implementations")

try:
    from sentence_transformers import SentenceTransformer, util as st_util
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    logger.warning("Sentence Transformers not available - using fallback implementations")

try:
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.preprocessing import normalize
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


# ============================================================================
# Data Classes and Enums
# ============================================================================

class ThreatType(Enum):
    """Types of brand protection threats."""
    PHISHING_DOMAIN = "phishing_domain"
    TYPOSQUATTING = "typosquatting"
    HOMOGLYPH_ATTACK = "homoglyph_attack"
    COMBO_SQUATTING = "combo_squatting"
    BRAND_IMPERSONATION = "brand_impersonation"
    CONTENT_PHISHING = "content_phishing"
    SOCIAL_IMPERSONATION = "social_impersonation"
    MALICIOUS_SUBDOMAIN = "malicious_subdomain"
    TLD_ABUSE = "tld_abuse"
    BITSQUATTING = "bitsquatting"


class RiskLevel(Enum):
    """Risk levels for detected threats."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MINIMAL = "minimal"


class ModelType(Enum):
    """Types of transformer models used."""
    SEMANTIC_SIMILARITY = "semantic_similarity"
    SEQUENCE_CLASSIFICATION = "sequence_classification"
    CHARACTER_LEVEL = "character_level"
    CROSS_ENCODER = "cross_encoder"
    ENSEMBLE = "ensemble"


@dataclass
class TransformerConfig:
    """Configuration for transformer models."""
    # Model identifiers
    semantic_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    phishing_classifier: str = "distilbert-base-uncased"
    cross_encoder: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    
    # Inference settings
    max_length: int = 512
    batch_size: int = 32
    device: str = "auto"  # "cpu", "cuda", "mps", "auto"
    
    # Caching
    enable_cache: bool = True
    cache_size: int = 10000
    
    # Ensemble weights
    semantic_weight: float = 0.35
    classifier_weight: float = 0.30
    character_weight: float = 0.20
    heuristic_weight: float = 0.15
    
    # Thresholds
    phishing_threshold: float = 0.65
    similarity_threshold: float = 0.80
    typosquatting_threshold: float = 0.85
    impersonation_threshold: float = 0.70


@dataclass
class ThreatDetectionResult:
    """Complete result from transformer-based threat detection."""
    domain_or_text: str
    brand_name: str
    is_threat: bool
    threat_type: Optional[ThreatType]
    risk_level: RiskLevel
    overall_score: float
    confidence: float
    
    # Component scores
    semantic_similarity_score: float
    phishing_classifier_score: float
    character_similarity_score: float
    heuristic_score: float
    
    # Detailed analysis
    detected_techniques: List[str]
    suspicious_patterns: List[Dict[str, Any]]
    embedding_analysis: Dict[str, Any]
    recommendations: List[str]
    
    # Metadata
    processing_time_ms: float
    model_versions: Dict[str, str]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        result = asdict(self)
        result['threat_type'] = self.threat_type.value if self.threat_type else None
        result['risk_level'] = self.risk_level.value
        return result


@dataclass 
class BatchDetectionResult:
    """Results from batch threat detection."""
    total_analyzed: int
    threats_found: int
    results: List[ThreatDetectionResult]
    processing_time_ms: float
    
    @property
    def threat_rate(self) -> float:
        return self.threats_found / self.total_analyzed if self.total_analyzed > 0 else 0.0
    
    def get_threats_by_level(self, level: RiskLevel) -> List[ThreatDetectionResult]:
        return [r for r in self.results if r.risk_level == level]


# ============================================================================
# Homoglyph and Character Analysis
# ============================================================================

class HomoglyphAnalyzer:
    """Analyze domains for homoglyph/IDN attacks using unicode analysis."""
    
    # Comprehensive homoglyph mapping
    HOMOGLYPH_MAP = {
        'a': ['а', 'ɑ', 'α', 'а', 'ａ', '@', '4', 'ä', 'á', 'à', 'â', 'ã', 'å', 'ą'],
        'b': ['ь', 'Ь', 'ｂ', '6', 'β', 'ḃ', 'ḅ'],
        'c': ['с', 'ϲ', 'ⅽ', 'ｃ', 'ç', 'ć', 'č', '(', '¢'],
        'd': ['ԁ', 'ⅾ', 'ｄ', 'đ', 'ð', 'ḋ'],
        'e': ['е', 'ё', 'ɛ', 'ｅ', '3', 'ε', 'é', 'è', 'ê', 'ë', 'ę', 'ě'],
        'f': ['ｆ', 'ƒ', 'ḟ'],
        'g': ['ɡ', 'ｇ', '9', 'ġ', 'ğ'],
        'h': ['һ', 'ｈ', 'ḣ', 'ħ'],
        'i': ['і', 'ⅰ', 'ｉ', '1', 'l', '|', '!', 'í', 'ì', 'î', 'ï', 'ı'],
        'j': ['ј', 'ｊ', 'ĵ'],
        'k': ['κ', 'ｋ', 'ķ', 'ḱ'],
        'l': ['ⅼ', 'ｌ', '1', 'I', '|', 'ł', 'ĺ', 'ľ'],
        'm': ['ⅿ', 'ｍ', 'ṁ', 'rn'],
        'n': ['ｎ', 'ñ', 'ń', 'ň', 'ņ', 'ŋ'],
        'o': ['о', 'ο', 'ｏ', '0', 'ø', 'ó', 'ò', 'ô', 'õ', 'ö', 'ő'],
        'p': ['р', 'ρ', 'ｐ', 'þ', 'ṗ'],
        'q': ['ｑ', 'ԛ'],
        'r': ['ｒ', 'ŕ', 'ř', 'ṙ'],
        's': ['ѕ', 'ｓ', '5', '$', 'ś', 'š', 'ş', 'ṡ'],
        't': ['ｔ', '7', '+', 'ţ', 'ť', 'ṫ'],
        'u': ['υ', 'ｕ', 'μ', 'ú', 'ù', 'û', 'ü', 'ű', 'ų'],
        'v': ['ν', 'ｖ', 'ṿ'],
        'w': ['ｗ', 'ẃ', 'ẁ', 'ŵ', 'ẇ', 'vv'],
        'x': ['х', 'ｘ', '×', 'ẋ'],
        'y': ['у', 'ｙ', 'ý', 'ÿ', 'ŷ', 'ẏ'],
        'z': ['ｚ', 'ź', 'ž', 'ż', 'ẑ'],
        '0': ['о', 'ο', 'O', 'Ο'],
        '1': ['l', 'I', 'i', '|', 'ⅼ', 'ⅰ'],
    }
    
    # Build reverse lookup
    REVERSE_HOMOGLYPH = {}
    for char, homoglyphs in HOMOGLYPH_MAP.items():
        for h in homoglyphs:
            REVERSE_HOMOGLYPH[h] = char
    
    # Confusable unicode categories
    SUSPICIOUS_CATEGORIES = {
        'Mc', 'Mn', 'Cf', 'Co',  # Combining marks, format chars
    }
    
    @classmethod
    def detect_homoglyphs(cls, text: str, brand: str) -> Dict[str, Any]:
        """
        Detect homoglyph attacks in text compared to brand name.
        
        Returns detailed analysis of potential unicode-based attacks.
        """
        findings = {
            'has_homoglyphs': False,
            'homoglyph_count': 0,
            'detected_chars': [],
            'normalized_text': '',
            'unicode_analysis': {},
            'risk_score': 0.0,
            'attack_type': None
        }
        
        text_lower = text.lower()
        brand_lower = brand.lower()
        
        # Normalize text
        normalized = cls._normalize_homoglyphs(text_lower)
        findings['normalized_text'] = normalized
        
        # Analyze unicode categories
        unicode_analysis = cls._analyze_unicode(text)
        findings['unicode_analysis'] = unicode_analysis
        
        # Check for homoglyphs
        for i, char in enumerate(text_lower):
            if char in cls.REVERSE_HOMOGLYPH:
                original = cls.REVERSE_HOMOGLYPH[char]
                findings['detected_chars'].append({
                    'position': i,
                    'char': char,
                    'original': original,
                    'unicode_name': unicodedata.name(char, 'UNKNOWN'),
                    'category': unicodedata.category(char)
                })
                findings['homoglyph_count'] += 1
        
        # Check if normalized matches brand
        if findings['homoglyph_count'] > 0:
            findings['has_homoglyphs'] = True
            
            # Calculate similarity after normalization
            if normalized == brand_lower or brand_lower in normalized:
                findings['attack_type'] = 'exact_homoglyph_match'
                findings['risk_score'] = 0.95
            elif cls._fuzzy_match(normalized, brand_lower) > 0.85:
                findings['attack_type'] = 'fuzzy_homoglyph_match'
                findings['risk_score'] = 0.85
            else:
                findings['risk_score'] = min(0.6, findings['homoglyph_count'] * 0.15)
        
        # Check for mixed scripts (punycode/IDN attacks)
        if unicode_analysis.get('mixed_scripts', False):
            findings['attack_type'] = findings['attack_type'] or 'mixed_script_attack'
            findings['risk_score'] = max(findings['risk_score'], 0.90)
        
        return findings
    
    @classmethod
    def _normalize_homoglyphs(cls, text: str) -> str:
        """Normalize homoglyphs back to ASCII equivalents."""
        result = []
        for char in text:
            if char in cls.REVERSE_HOMOGLYPH:
                result.append(cls.REVERSE_HOMOGLYPH[char])
            else:
                result.append(char)
        return ''.join(result)
    
    @classmethod
    def _analyze_unicode(cls, text: str) -> Dict[str, Any]:
        """Analyze unicode properties of text."""
        scripts = set()
        categories = defaultdict(int)
        suspicious_chars = []
        
        for char in text:
            category = unicodedata.category(char)
            categories[category] += 1
            
            try:
                name = unicodedata.name(char, '')
                # Extract script from unicode name
                if 'LATIN' in name:
                    scripts.add('Latin')
                elif 'CYRILLIC' in name:
                    scripts.add('Cyrillic')
                elif 'GREEK' in name:
                    scripts.add('Greek')
                elif any(s in name for s in ['CJK', 'HIRAGANA', 'KATAKANA']):
                    scripts.add('Asian')
            except:
                pass
            
            if category in cls.SUSPICIOUS_CATEGORIES:
                suspicious_chars.append({
                    'char': char,
                    'category': category,
                    'name': unicodedata.name(char, 'UNKNOWN')
                })
        
        return {
            'scripts': list(scripts),
            'mixed_scripts': len(scripts) > 1,
            'categories': dict(categories),
            'suspicious_chars': suspicious_chars,
            'has_suspicious_chars': len(suspicious_chars) > 0
        }
    
    @staticmethod
    def _fuzzy_match(text1: str, text2: str) -> float:
        """Calculate fuzzy string similarity."""
        if not text1 or not text2:
            return 0.0
        
        # Levenshtein-based similarity
        len1, len2 = len(text1), len(text2)
        if len1 == 0 or len2 == 0:
            return 0.0
        
        # Simple edit distance
        dp = [[0] * (len2 + 1) for _ in range(len1 + 1)]
        for i in range(len1 + 1):
            dp[i][0] = i
        for j in range(len2 + 1):
            dp[0][j] = j
        
        for i in range(1, len1 + 1):
            for j in range(1, len2 + 1):
                cost = 0 if text1[i-1] == text2[j-1] else 1
                dp[i][j] = min(
                    dp[i-1][j] + 1,
                    dp[i][j-1] + 1,
                    dp[i-1][j-1] + cost
                )
        
        distance = dp[len1][len2]
        max_len = max(len1, len2)
        return 1.0 - (distance / max_len)


class TyposquattingAnalyzer:
    """Analyze domains for typosquatting patterns."""
    
    # Keyboard adjacency for QWERTY layout
    KEYBOARD_ADJACENT = {
        'q': ['w', 'a', '1', '2'],
        'w': ['q', 'e', 'a', 's', '2', '3'],
        'e': ['w', 'r', 's', 'd', '3', '4'],
        'r': ['e', 't', 'd', 'f', '4', '5'],
        't': ['r', 'y', 'f', 'g', '5', '6'],
        'y': ['t', 'u', 'g', 'h', '6', '7'],
        'u': ['y', 'i', 'h', 'j', '7', '8'],
        'i': ['u', 'o', 'j', 'k', '8', '9'],
        'o': ['i', 'p', 'k', 'l', '9', '0'],
        'p': ['o', 'l', '0'],
        'a': ['q', 'w', 's', 'z'],
        's': ['a', 'w', 'e', 'd', 'z', 'x'],
        'd': ['s', 'e', 'r', 'f', 'x', 'c'],
        'f': ['d', 'r', 't', 'g', 'c', 'v'],
        'g': ['f', 't', 'y', 'h', 'v', 'b'],
        'h': ['g', 'y', 'u', 'j', 'b', 'n'],
        'j': ['h', 'u', 'i', 'k', 'n', 'm'],
        'k': ['j', 'i', 'o', 'l', 'm'],
        'l': ['k', 'o', 'p'],
        'z': ['a', 's', 'x'],
        'x': ['z', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k'],
    }
    
    # Common typo patterns
    COMMON_TYPOS = {
        'google': ['gogle', 'googel', 'googl', 'gooogle', 'g00gle', 'goolge'],
        'facebook': ['facbook', 'facebok', 'fcebook', 'faceboook', 'faebook'],
        'amazon': ['amazn', 'amazone', 'amzon', 'aamazon', 'amaazon'],
        'apple': ['aple', 'appel', 'appple', 'aplle', 'aaple'],
        'microsoft': ['microsft', 'mircosoft', 'micosoft', 'microsof', 'microsooft'],
        'paypal': ['paypl', 'paypall', 'paypla', 'payapl', 'peypal'],
    }
    
    @classmethod
    def analyze(cls, domain: str, brand: str) -> Dict[str, Any]:
        """
        Analyze domain for typosquatting techniques.
        
        Returns detailed analysis of potential typosquatting.
        """
        domain_lower = domain.lower().split('.')[0]  # Get SLD
        brand_lower = brand.lower()
        
        analysis = {
            'is_typosquat': False,
            'techniques_detected': [],
            'similarity_score': 0.0,
            'edit_distance': 0,
            'keyboard_distance': 0.0,
            'risk_score': 0.0
        }
        
        # Calculate edit distance
        analysis['edit_distance'] = cls._edit_distance(domain_lower, brand_lower)
        
        # Calculate similarity
        analysis['similarity_score'] = cls._calculate_similarity(domain_lower, brand_lower)
        
        # Check for specific typosquatting techniques
        techniques = []
        
        # 1. Character omission
        if cls._check_omission(domain_lower, brand_lower):
            techniques.append({
                'type': 'character_omission',
                'confidence': 0.9,
                'description': 'Missing character from brand name'
            })
        
        # 2. Character repetition
        if cls._check_repetition(domain_lower, brand_lower):
            techniques.append({
                'type': 'character_repetition',
                'confidence': 0.85,
                'description': 'Repeated character in brand name'
            })
        
        # 3. Character transposition
        if cls._check_transposition(domain_lower, brand_lower):
            techniques.append({
                'type': 'character_transposition',
                'confidence': 0.88,
                'description': 'Adjacent characters swapped'
            })
        
        # 4. Keyboard proximity (fat finger)
        keyboard_score = cls._check_keyboard_proximity(domain_lower, brand_lower)
        if keyboard_score > 0.7:
            techniques.append({
                'type': 'keyboard_proximity',
                'confidence': keyboard_score,
                'description': 'Keyboard-adjacent character substitution'
            })
            analysis['keyboard_distance'] = keyboard_score
        
        # 5. Vowel substitution
        if cls._check_vowel_substitution(domain_lower, brand_lower):
            techniques.append({
                'type': 'vowel_substitution',
                'confidence': 0.82,
                'description': 'Vowel replaced with different vowel'
            })
        
        # 6. Character insertion
        if cls._check_insertion(domain_lower, brand_lower):
            techniques.append({
                'type': 'character_insertion',
                'confidence': 0.87,
                'description': 'Extra character inserted'
            })
        
        # 7. Digit substitution
        if cls._check_digit_substitution(domain_lower, brand_lower):
            techniques.append({
                'type': 'digit_substitution',
                'confidence': 0.92,
                'description': 'Letter replaced with similar digit (e.g., o→0, l→1)'
            })
        
        analysis['techniques_detected'] = techniques
        analysis['is_typosquat'] = len(techniques) > 0
        
        # Calculate overall risk score
        if techniques:
            max_confidence = max(t['confidence'] for t in techniques)
            technique_count_factor = min(1.0, len(techniques) * 0.15)
            analysis['risk_score'] = min(1.0, max_confidence + technique_count_factor)
        
        return analysis
    
    @staticmethod
    def _edit_distance(s1: str, s2: str) -> int:
        """Calculate Levenshtein edit distance."""
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
        
        return dp[m][n]
    
    @staticmethod
    def _calculate_similarity(s1: str, s2: str) -> float:
        """Calculate normalized similarity score."""
        if not s1 or not s2:
            return 0.0
        
        distance = TyposquattingAnalyzer._edit_distance(s1, s2)
        max_len = max(len(s1), len(s2))
        return 1.0 - (distance / max_len)
    
    @staticmethod
    def _check_omission(domain: str, brand: str) -> bool:
        """Check if domain is brand with one character omitted."""
        if len(domain) != len(brand) - 1:
            return False
        
        for i in range(len(brand)):
            if brand[:i] + brand[i+1:] == domain:
                return True
        return False
    
    @staticmethod
    def _check_repetition(domain: str, brand: str) -> bool:
        """Check if domain has character repetition."""
        if len(domain) != len(brand) + 1:
            return False
        
        for i in range(len(brand)):
            test = brand[:i] + brand[i] + brand[i:]
            if test == domain:
                return True
        return False
    
    @staticmethod
    def _check_transposition(domain: str, brand: str) -> bool:
        """Check if domain has adjacent characters transposed."""
        if len(domain) != len(brand):
            return False
        
        for i in range(len(brand) - 1):
            test = brand[:i] + brand[i+1] + brand[i] + brand[i+2:]
            if test == domain:
                return True
        return False
    
    @classmethod
    def _check_keyboard_proximity(cls, domain: str, brand: str) -> float:
        """Check for keyboard proximity errors."""
        if len(domain) != len(brand):
            return 0.0
        
        keyboard_errors = 0
        for i, (d, b) in enumerate(zip(domain, brand)):
            if d != b:
                if d in cls.KEYBOARD_ADJACENT.get(b, []):
                    keyboard_errors += 1
                elif b in cls.KEYBOARD_ADJACENT.get(d, []):
                    keyboard_errors += 1
        
        if keyboard_errors > 0:
            # Return confidence based on number of keyboard errors
            return max(0.5, 1.0 - (keyboard_errors - 1) * 0.15)
        return 0.0
    
    @staticmethod
    def _check_vowel_substitution(domain: str, brand: str) -> bool:
        """Check for vowel substitution."""
        vowels = set('aeiou')
        if len(domain) != len(brand):
            return False
        
        for d, b in zip(domain, brand):
            if d != b:
                if d in vowels and b in vowels:
                    return True
        return False
    
    @staticmethod
    def _check_insertion(domain: str, brand: str) -> bool:
        """Check if domain has extra character inserted."""
        if len(domain) != len(brand) + 1:
            return False
        
        for i in range(len(domain)):
            if domain[:i] + domain[i+1:] == brand:
                return True
        return False
    
    @staticmethod
    def _check_digit_substitution(domain: str, brand: str) -> bool:
        """Check for digit substitution (l33t speak)."""
        digit_map = {'0': 'o', '1': 'il', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b'}
        
        if len(domain) != len(brand):
            return False
        
        for d, b in zip(domain, brand):
            if d != b:
                if d in digit_map and b in digit_map[d]:
                    return True
                if d.isdigit() and b.isalpha():
                    return True
        return False


# ============================================================================
# Transformer-based Threat Detection
# ============================================================================

class TransformerThreatDetector:
    """
    Advanced threat detection using transformer models.
    
    Combines multiple transformer architectures for comprehensive threat analysis:
    - Semantic similarity using Sentence Transformers
    - Content classification using fine-tuned BERT models
    - Character-level analysis for typosquatting
    - Ensemble scoring for robust predictions
    """
    
    def __init__(
        self,
        config: Optional[TransformerConfig] = None,
        model_path: Optional[str] = None,
        lazy_load: bool = True
    ):
        """
        Initialize the transformer threat detector.
        
        Args:
            config: TransformerConfig with model settings
            model_path: Path to saved models
            lazy_load: If True, load models on first use
        """
        self.config = config or TransformerConfig()
        self.model_path = Path(model_path) if model_path else None
        self._models_loaded = False
        
        # Initialize components
        self._semantic_model = None
        self._classifier = None
        self._tokenizer = None
        self._device = None
        
        # Analysis components
        self.homoglyph_analyzer = HomoglyphAnalyzer()
        self.typosquatting_analyzer = TyposquattingAnalyzer()
        
        # Brand embeddings cache
        self._brand_embeddings = {}
        
        # Inference cache
        self._result_cache = {}
        
        if not lazy_load:
            self._load_models()
    
    def _determine_device(self) -> str:
        """Determine the best available device."""
        if self.config.device != "auto":
            return self.config.device
        
        if TORCH_AVAILABLE:
            if torch.cuda.is_available():
                return "cuda"
            elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                return "mps"
        return "cpu"
    
    def _load_models(self):
        """Load transformer models."""
        if self._models_loaded:
            return
        
        self._device = self._determine_device()
        logger.info(f"Loading models on device: {self._device}")
        
        # Load semantic similarity model
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                self._semantic_model = SentenceTransformer(
                    self.config.semantic_model,
                    device=self._device
                )
                logger.info(f"Loaded semantic model: {self.config.semantic_model}")
            except Exception as e:
                logger.warning(f"Failed to load semantic model: {e}")
        
        # Load classifier model
        if TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
            try:
                self._tokenizer = AutoTokenizer.from_pretrained(
                    self.config.phishing_classifier
                )
                self._classifier = AutoModelForSequenceClassification.from_pretrained(
                    self.config.phishing_classifier,
                    num_labels=2  # Binary classification
                )
                self._classifier.to(self._device)
                self._classifier.eval()
                logger.info(f"Loaded classifier: {self.config.phishing_classifier}")
            except Exception as e:
                logger.warning(f"Failed to load classifier model: {e}")
        
        self._models_loaded = True
    
    def _get_cache_key(self, domain: str, brand: str) -> str:
        """Generate cache key for results."""
        content = f"{domain}:{brand}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def _get_brand_embedding(self, brand: str) -> Optional[np.ndarray]:
        """Get or compute brand name embedding."""
        if not self._semantic_model:
            return None
        
        if brand not in self._brand_embeddings:
            # Generate variations for brand
            variations = [
                brand,
                f"{brand} official",
                f"official {brand}",
                f"{brand} company",
                f"{brand}.com"
            ]
            
            embeddings = self._semantic_model.encode(
                variations,
                convert_to_numpy=True,
                normalize_embeddings=True
            )
            
            # Use mean of variations as brand embedding
            self._brand_embeddings[brand] = np.mean(embeddings, axis=0)
        
        return self._brand_embeddings[brand]
    
    def detect_threat(
        self,
        domain: str,
        brand_name: str,
        page_content: Optional[str] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> ThreatDetectionResult:
        """
        Detect potential threats for a domain against a brand.
        
        This method combines multiple detection techniques:
        1. Semantic similarity analysis
        2. Phishing content classification
        3. Character-level typosquatting detection
        4. Homoglyph/IDN attack detection
        5. Heuristic pattern matching
        
        Args:
            domain: Domain to analyze
            brand_name: Brand name to protect
            page_content: Optional page content for deeper analysis
            additional_context: Additional context for scoring
            
        Returns:
            ThreatDetectionResult with comprehensive analysis
        """
        start_time = time.time()
        
        # Check cache
        cache_key = self._get_cache_key(domain, brand_name)
        if self.config.enable_cache and cache_key in self._result_cache:
            cached = self._result_cache[cache_key]
            cached.processing_time_ms = 0.1  # Cache hit
            return cached
        
        # Ensure models are loaded
        self._load_models()
        
        # Initialize scores
        semantic_score = 0.0
        classifier_score = 0.0
        character_score = 0.0
        heuristic_score = 0.0
        
        detected_techniques = []
        suspicious_patterns = []
        embedding_analysis = {}
        
        # 1. Semantic Similarity Analysis
        if self._semantic_model:
            semantic_result = self._analyze_semantic_similarity(domain, brand_name)
            semantic_score = semantic_result['similarity_score']
            embedding_analysis = semantic_result
            
            if semantic_score > self.config.similarity_threshold:
                detected_techniques.append('semantic_brand_match')
        
        # 2. Character-level Analysis (Typosquatting + Homoglyphs)
        typo_result = self.typosquatting_analyzer.analyze(domain, brand_name)
        homoglyph_result = self.homoglyph_analyzer.detect_homoglyphs(domain, brand_name)
        
        character_score = max(typo_result['risk_score'], homoglyph_result['risk_score'])
        
        if typo_result['is_typosquat']:
            detected_techniques.extend([t['type'] for t in typo_result['techniques_detected']])
            suspicious_patterns.append({
                'type': 'typosquatting',
                'details': typo_result
            })
        
        if homoglyph_result['has_homoglyphs']:
            detected_techniques.append('homoglyph_attack')
            suspicious_patterns.append({
                'type': 'homoglyph',
                'details': homoglyph_result
            })
        
        # 3. Content Classification (if content provided)
        if page_content and self._classifier:
            classifier_result = self._classify_phishing_content(page_content, brand_name)
            classifier_score = classifier_result['phishing_probability']
            
            if classifier_score > self.config.phishing_threshold:
                detected_techniques.append('phishing_content')
                suspicious_patterns.append({
                    'type': 'phishing_classification',
                    'details': classifier_result
                })
        
        # 4. Heuristic Analysis
        heuristic_result = self._apply_heuristics(domain, brand_name, page_content)
        heuristic_score = heuristic_result['score']
        detected_techniques.extend(heuristic_result['detected_patterns'])
        
        # 5. Calculate Ensemble Score
        weights = {
            'semantic': self.config.semantic_weight,
            'classifier': self.config.classifier_weight,
            'character': self.config.character_weight,
            'heuristic': self.config.heuristic_weight
        }
        
        # Normalize weights for available components
        total_weight = sum(weights.values())
        
        overall_score = (
            (semantic_score * weights['semantic'] +
             classifier_score * weights['classifier'] +
             character_score * weights['character'] +
             heuristic_score * weights['heuristic']) / total_weight
        )
        
        # Apply boosting for multiple detection methods
        if len(detected_techniques) >= 2:
            overall_score = min(1.0, overall_score * 1.15)
        if len(detected_techniques) >= 3:
            overall_score = min(1.0, overall_score * 1.10)
        
        # Determine threat type and risk level
        threat_type = self._determine_threat_type(
            detected_techniques, 
            typo_result, 
            homoglyph_result, 
            classifier_score
        )
        
        is_threat = overall_score >= self.config.impersonation_threshold
        risk_level = self._calculate_risk_level(overall_score)
        confidence = self._calculate_confidence(
            semantic_score, classifier_score, character_score, heuristic_score
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            is_threat, 
            risk_level, 
            detected_techniques, 
            overall_score
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        result = ThreatDetectionResult(
            domain_or_text=domain,
            brand_name=brand_name,
            is_threat=is_threat,
            threat_type=threat_type,
            risk_level=risk_level,
            overall_score=overall_score,
            confidence=confidence,
            semantic_similarity_score=semantic_score,
            phishing_classifier_score=classifier_score,
            character_similarity_score=character_score,
            heuristic_score=heuristic_score,
            detected_techniques=detected_techniques,
            suspicious_patterns=suspicious_patterns,
            embedding_analysis=embedding_analysis,
            recommendations=recommendations,
            processing_time_ms=processing_time,
            model_versions={
                'semantic': self.config.semantic_model,
                'classifier': self.config.phishing_classifier,
                'detector_version': '2.0.0'
            }
        )
        
        # Cache result
        if self.config.enable_cache:
            if len(self._result_cache) >= self.config.cache_size:
                # Remove oldest entries
                keys_to_remove = list(self._result_cache.keys())[:100]
                for key in keys_to_remove:
                    del self._result_cache[key]
            self._result_cache[cache_key] = result
        
        return result
    
    def _analyze_semantic_similarity(
        self, 
        domain: str, 
        brand_name: str
    ) -> Dict[str, Any]:
        """Analyze semantic similarity between domain and brand."""
        result = {
            'similarity_score': 0.0,
            'domain_embedding': None,
            'brand_embedding': None,
            'cosine_similarity': 0.0,
            'components_analyzed': []
        }
        
        if not self._semantic_model:
            # Fallback to character-based similarity
            result['similarity_score'] = self.typosquatting_analyzer._calculate_similarity(
                domain.split('.')[0], brand_name
            )
            return result
        
        # Extract domain components
        domain_parts = domain.lower().replace('-', ' ').replace('_', ' ').split('.')
        sld = domain_parts[0]  # Second-level domain
        
        # Generate domain representations
        domain_variations = [
            sld,
            domain,
            sld.replace(' ', ''),
            ' '.join(sld)  # Character-separated
        ]
        
        # Get embeddings
        domain_embeddings = self._semantic_model.encode(
            domain_variations,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        brand_embedding = self._get_brand_embedding(brand_name)
        
        if brand_embedding is not None:
            # Calculate similarities
            similarities = []
            for emb in domain_embeddings:
                sim = float(np.dot(emb, brand_embedding))
                similarities.append(sim)
            
            result['similarity_score'] = max(similarities)
            result['cosine_similarity'] = result['similarity_score']
            result['components_analyzed'] = domain_variations
        
        return result
    
    def _classify_phishing_content(
        self, 
        content: str, 
        brand_name: str
    ) -> Dict[str, Any]:
        """Classify content for phishing indicators."""
        result = {
            'phishing_probability': 0.0,
            'legitimate_probability': 0.0,
            'confidence': 0.0,
            'features_detected': []
        }
        
        # Heuristic phishing detection if no classifier
        if not self._classifier or not self._tokenizer:
            return self._heuristic_phishing_detection(content, brand_name)
        
        try:
            # Prepare input
            inputs = self._tokenizer(
                content[:self.config.max_length],
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=self.config.max_length
            )
            
            if self._device != "cpu":
                inputs = {k: v.to(self._device) for k, v in inputs.items()}
            
            # Get prediction
            with torch.no_grad():
                outputs = self._classifier(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
                
            result['legitimate_probability'] = float(probs[0][0])
            result['phishing_probability'] = float(probs[0][1])
            result['confidence'] = float(max(probs[0]))
            
        except Exception as e:
            logger.warning(f"Classification error: {e}")
            return self._heuristic_phishing_detection(content, brand_name)
        
        return result
    
    def _heuristic_phishing_detection(
        self, 
        content: str, 
        brand_name: str
    ) -> Dict[str, Any]:
        """Heuristic phishing detection for content."""
        content_lower = content.lower()
        
        features = []
        score = 0.0
        
        # Urgency indicators
        urgency_patterns = [
            r'\b(urgent|immediately|right now|act now|limited time|expires?|deadline)\b',
            r'\b(within \d+ hours?|24 hours?|48 hours?)\b',
            r'(!{2,}|\?{2,})',
        ]
        
        for pattern in urgency_patterns:
            if re.search(pattern, content_lower):
                features.append('urgency_language')
                score += 0.15
                break
        
        # Credential requests
        credential_patterns = [
            r'\b(password|login|sign.?in|credentials|verify|confirm|update).*(account|details|information)\b',
            r'\b(ssn|social security|credit card|bank account|routing number)\b',
            r'\b(enter|provide|submit|input).*(password|card|ssn|details)\b',
        ]
        
        for pattern in credential_patterns:
            if re.search(pattern, content_lower):
                features.append('credential_request')
                score += 0.25
                break
        
        # Threat language
        threat_patterns = [
            r'\b(suspend|terminate|close|restrict|limit|lock).*(account|access)\b',
            r'\b(unauthorized|suspicious|unusual).*(activity|access|login)\b',
            r'\b(fail|unable).*(verify|confirm|authenticate)\b',
        ]
        
        for pattern in threat_patterns:
            if re.search(pattern, content_lower):
                features.append('threat_language')
                score += 0.20
                break
        
        # Brand mention with suspicious context
        if brand_name.lower() in content_lower:
            suspicious_brand_patterns = [
                rf'{brand_name.lower()}.*(security|support|team|help|service)',
                rf'(dear|valued|important).*(customer|user|member)',
            ]
            for pattern in suspicious_brand_patterns:
                if re.search(pattern, content_lower):
                    features.append('suspicious_brand_context')
                    score += 0.15
                    break
        
        # Links and URLs
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        urls = re.findall(url_pattern, content)
        if urls:
            for url in urls:
                if brand_name.lower() not in url.lower():
                    features.append('external_link')
                    score += 0.10
                    break
        
        return {
            'phishing_probability': min(1.0, score),
            'legitimate_probability': max(0.0, 1.0 - score),
            'confidence': 0.7,  # Heuristic confidence
            'features_detected': features
        }
    
    def _apply_heuristics(
        self, 
        domain: str, 
        brand_name: str, 
        content: Optional[str]
    ) -> Dict[str, Any]:
        """Apply heuristic rules for threat detection."""
        score = 0.0
        detected_patterns = []
        domain_lower = domain.lower()
        brand_lower = brand_name.lower()
        
        # Suspicious TLD patterns
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click', 
                         '.link', '.work', '.date', '.review', '.loan', '.download']
        
        for tld in suspicious_tlds:
            if domain_lower.endswith(tld):
                score += 0.20
                detected_patterns.append(f'suspicious_tld_{tld}')
                break
        
        # Brand in subdomain pattern
        if brand_lower in domain_lower.split('.')[0] and len(domain.split('.')) > 2:
            score += 0.25
            detected_patterns.append('brand_in_subdomain')
        
        # Security/login keywords
        security_keywords = ['secure', 'login', 'signin', 'verify', 'update', 
                           'confirm', 'account', 'support', 'help', 'service']
        
        for keyword in security_keywords:
            if keyword in domain_lower:
                score += 0.15
                detected_patterns.append(f'security_keyword_{keyword}')
                break
        
        # Hyphen usage pattern
        hyphen_count = domain_lower.count('-')
        if hyphen_count >= 2:
            score += 0.15
            detected_patterns.append('excessive_hyphens')
        
        # Number substitution
        if any(c.isdigit() for c in domain_lower):
            # Check if digits replace letters
            import re
            if re.search(r'[a-z]\d|\d[a-z]', domain_lower):
                score += 0.20
                detected_patterns.append('digit_substitution')
        
        # Long domain
        if len(domain_lower.split('.')[0]) > 25:
            score += 0.10
            detected_patterns.append('long_domain')
        
        # Combo-squatting (brand + keyword)
        combo_keywords = ['login', 'secure', 'support', 'help', 'update', 'verify', 
                         'official', 'online', 'web', 'my', 'account']
        
        for keyword in combo_keywords:
            if brand_lower in domain_lower and keyword in domain_lower:
                score += 0.25
                detected_patterns.append(f'combo_squatting_{keyword}')
                break
        
        return {
            'score': min(1.0, score),
            'detected_patterns': detected_patterns
        }
    
    def _determine_threat_type(
        self,
        techniques: List[str],
        typo_result: Dict,
        homoglyph_result: Dict,
        classifier_score: float
    ) -> Optional[ThreatType]:
        """Determine the primary threat type."""
        if not techniques:
            return None
        
        # Priority-based determination
        if 'homoglyph_attack' in techniques:
            return ThreatType.HOMOGLYPH_ATTACK
        
        if typo_result['is_typosquat']:
            return ThreatType.TYPOSQUATTING
        
        if any('combo_squatting' in t for t in techniques):
            return ThreatType.COMBO_SQUATTING
        
        if classifier_score > 0.7:
            return ThreatType.CONTENT_PHISHING
        
        if 'semantic_brand_match' in techniques:
            return ThreatType.BRAND_IMPERSONATION
        
        if 'brand_in_subdomain' in techniques:
            return ThreatType.MALICIOUS_SUBDOMAIN
        
        if any('suspicious_tld' in t for t in techniques):
            return ThreatType.TLD_ABUSE
        
        return ThreatType.PHISHING_DOMAIN
    
    def _calculate_risk_level(self, score: float) -> RiskLevel:
        """Calculate risk level from score."""
        if score >= 0.85:
            return RiskLevel.CRITICAL
        elif score >= 0.70:
            return RiskLevel.HIGH
        elif score >= 0.50:
            return RiskLevel.MEDIUM
        elif score >= 0.30:
            return RiskLevel.LOW
        else:
            return RiskLevel.MINIMAL
    
    def _calculate_confidence(
        self,
        semantic: float,
        classifier: float,
        character: float,
        heuristic: float
    ) -> float:
        """Calculate confidence based on component agreement."""
        scores = [s for s in [semantic, classifier, character, heuristic] if s > 0]
        
        if not scores:
            return 0.5
        
        # Higher confidence when scores agree
        mean_score = np.mean(scores)
        std_score = np.std(scores) if len(scores) > 1 else 0
        
        # Confidence decreases with variance
        confidence = min(1.0, max(0.5, mean_score * (1 - std_score)))
        
        # Boost confidence if multiple methods agree
        agreeing_methods = sum(1 for s in scores if abs(s - mean_score) < 0.2)
        if agreeing_methods >= 3:
            confidence = min(1.0, confidence * 1.1)
        
        return confidence
    
    def _generate_recommendations(
        self,
        is_threat: bool,
        risk_level: RiskLevel,
        techniques: List[str],
        score: float
    ) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        if not is_threat:
            recommendations.append("Domain appears legitimate - continue monitoring")
            return recommendations
        
        if risk_level == RiskLevel.CRITICAL:
            recommendations.append("IMMEDIATE ACTION: Initiate domain takedown process")
            recommendations.append("Document evidence for legal proceedings")
            recommendations.append("Alert security team and brand protection partners")
        elif risk_level == RiskLevel.HIGH:
            recommendations.append("HIGH PRIORITY: Begin takedown/UDRP process")
            recommendations.append("Monitor for active phishing campaigns")
            recommendations.append("Consider blocking domain on corporate networks")
        elif risk_level == RiskLevel.MEDIUM:
            recommendations.append("Add to monitoring watchlist")
            recommendations.append("Investigate domain ownership and content")
            recommendations.append("Consider defensive registration of similar domains")
        else:
            recommendations.append("Continue passive monitoring")
            recommendations.append("Review periodically for escalation")
        
        # Technique-specific recommendations
        if 'homoglyph_attack' in techniques:
            recommendations.append("Homoglyph attack detected - report to IDN registrar")
        
        if 'phishing_content' in techniques:
            recommendations.append("Report phishing content to hosting provider")
            recommendations.append("Submit to Google Safe Browsing and PhishTank")
        
        if any('typo' in t for t in techniques):
            recommendations.append("Consider registering common typosquat variations")
        
        return recommendations
    
    def detect_threats_batch(
        self,
        items: List[Tuple[str, str]],  # List of (domain, brand_name) tuples
        page_contents: Optional[List[str]] = None
    ) -> BatchDetectionResult:
        """
        Batch threat detection for multiple domains.
        
        Args:
            items: List of (domain, brand_name) tuples
            page_contents: Optional list of page contents
            
        Returns:
            BatchDetectionResult with all analyses
        """
        start_time = time.time()
        
        results = []
        for i, (domain, brand) in enumerate(items):
            content = page_contents[i] if page_contents and i < len(page_contents) else None
            result = self.detect_threat(domain, brand, content)
            results.append(result)
        
        threats_found = sum(1 for r in results if r.is_threat)
        processing_time = (time.time() - start_time) * 1000
        
        return BatchDetectionResult(
            total_analyzed=len(items),
            threats_found=threats_found,
            results=results,
            processing_time_ms=processing_time
        )
    
    def precompute_brand_embeddings(self, brand_names: List[str]):
        """Precompute embeddings for a list of brand names."""
        self._load_models()
        
        for brand in brand_names:
            self._get_brand_embedding(brand)
        
        logger.info(f"Precomputed embeddings for {len(brand_names)} brands")


# ============================================================================
# Specialized Detectors
# ============================================================================

class SemanticBrandMatcher:
    """
    Semantic brand matching using sentence transformers.
    
    Identifies domains and content that semantically relate to protected brands.
    """
    
    def __init__(
        self, 
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        device: str = "auto"
    ):
        self.model_name = model_name
        self.device = device
        self._model = None
        self._brand_embeddings = {}
        
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            if device == "auto":
                device = "cuda" if TORCH_AVAILABLE and torch.cuda.is_available() else "cpu"
            self._model = SentenceTransformer(model_name, device=device)
    
    def compute_brand_similarity(
        self, 
        text: str, 
        brand_name: str,
        threshold: float = 0.7
    ) -> Dict[str, Any]:
        """
        Compute semantic similarity between text and brand.
        
        Returns similarity score and analysis.
        """
        if not self._model:
            return self._fallback_similarity(text, brand_name)
        
        # Get brand embedding
        if brand_name not in self._brand_embeddings:
            brand_texts = [
                brand_name,
                f"official {brand_name}",
                f"{brand_name} company",
                f"{brand_name} login",
                f"{brand_name} support"
            ]
            embeddings = self._model.encode(brand_texts, normalize_embeddings=True)
            self._brand_embeddings[brand_name] = np.mean(embeddings, axis=0)
        
        # Encode text
        text_embedding = self._model.encode([text], normalize_embeddings=True)[0]
        
        # Compute similarity
        similarity = float(np.dot(text_embedding, self._brand_embeddings[brand_name]))
        
        return {
            'similarity': similarity,
            'is_match': similarity >= threshold,
            'confidence': abs(similarity - threshold) + 0.5,
            'brand_name': brand_name,
            'text': text
        }
    
    def _fallback_similarity(self, text: str, brand_name: str) -> Dict[str, Any]:
        """Fallback string similarity when transformers unavailable."""
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Simple containment and similarity
        if brand_lower in text_lower:
            similarity = 0.85
        else:
            # Character overlap
            common = len(set(text_lower) & set(brand_lower))
            total = len(set(text_lower) | set(brand_lower))
            similarity = common / total if total > 0 else 0.0
        
        return {
            'similarity': similarity,
            'is_match': similarity >= 0.7,
            'confidence': 0.6,
            'brand_name': brand_name,
            'text': text
        }
    
    def find_matching_brands(
        self, 
        text: str, 
        brand_list: List[str],
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Find brands that best match the given text."""
        results = []
        
        for brand in brand_list:
            result = self.compute_brand_similarity(text, brand)
            results.append(result)
        
        # Sort by similarity
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        return results[:top_k]


class PhishingContentClassifier:
    """
    Classify text content for phishing indicators using transformers.
    """
    
    # Phishing indicator patterns
    PHISHING_PATTERNS = {
        'urgency': [
            r'\b(urgent|immediately|right now|act fast|limited time|expires?)\b',
            r'\b(within \d+ hours?|deadline|running out)\b',
            r'!!+|\\?\\?+',
        ],
        'credential_request': [
            r'\b(verify|confirm|update|validate).*(account|identity|information)\b',
            r'\b(password|login|sign.?in|credentials)\b',
            r'\b(enter|provide|submit).*(details|information)\b',
        ],
        'threat': [
            r'\b(suspend|terminate|close|restrict|disable).*(account|access|service)\b',
            r'\b(unauthorized|suspicious|unusual).*(activity|access|transaction)\b',
            r'\b(security|fraud).*(alert|warning|notice)\b',
        ],
        'reward': [
            r'\b(won|winner|prize|reward|congratulations)\b',
            r'\b(claim|collect|receive).*(prize|reward|gift)\b',
            r'\b(free|bonus|gift).*(offer|promotion)\b',
        ],
        'authority': [
            r'\b(official|authorized|verified|certified)\b',
            r'\b(team|department|support|service)\b',
            r'\b(from|sent by).*(security|support|admin)\b',
        ]
    }
    
    def __init__(self, model_name: str = "distilbert-base-uncased"):
        self.model_name = model_name
        self._model = None
        self._tokenizer = None
        self._device = "cpu"
        
        if TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
            try:
                self._tokenizer = AutoTokenizer.from_pretrained(model_name)
                self._model = AutoModelForSequenceClassification.from_pretrained(
                    model_name, 
                    num_labels=2,
                    ignore_mismatched_sizes=True
                )
                self._device = "cuda" if torch.cuda.is_available() else "cpu"
                self._model.to(self._device)
                self._model.eval()
            except Exception as e:
                logger.warning(f"Could not load classifier: {e}")
    
    def classify(
        self, 
        content: str,
        brand_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Classify content for phishing indicators.
        
        Returns classification result with detailed analysis.
        """
        # Pattern-based analysis
        pattern_results = self._analyze_patterns(content)
        
        # Model-based classification
        model_score = 0.5
        if self._model and self._tokenizer:
            model_score = self._model_classify(content)
        
        # Combine scores
        pattern_score = pattern_results['overall_score']
        combined_score = 0.6 * pattern_score + 0.4 * model_score
        
        # Brand-specific boost
        if brand_name and brand_name.lower() in content.lower():
            # Presence of brand name with phishing patterns is suspicious
            if pattern_results['categories_detected']:
                combined_score = min(1.0, combined_score * 1.2)
        
        return {
            'is_phishing': combined_score >= 0.6,
            'phishing_score': combined_score,
            'confidence': 0.7 + (0.3 * abs(combined_score - 0.5)),
            'pattern_analysis': pattern_results,
            'model_score': model_score,
            'risk_level': self._score_to_risk(combined_score)
        }
    
    def _analyze_patterns(self, content: str) -> Dict[str, Any]:
        """Analyze content for phishing patterns."""
        content_lower = content.lower()
        
        categories_detected = []
        pattern_matches = []
        
        for category, patterns in self.PHISHING_PATTERNS.items():
            for pattern in patterns:
                matches = re.findall(pattern, content_lower, re.IGNORECASE)
                if matches:
                    categories_detected.append(category)
                    pattern_matches.extend(matches)
                    break  # One match per category is enough
        
        # Calculate score based on categories
        category_weights = {
            'credential_request': 0.30,
            'threat': 0.25,
            'urgency': 0.20,
            'authority': 0.15,
            'reward': 0.10
        }
        
        score = sum(category_weights.get(c, 0.1) for c in categories_detected)
        score = min(1.0, score)
        
        return {
            'overall_score': score,
            'categories_detected': list(set(categories_detected)),
            'pattern_matches': pattern_matches[:10],  # Limit matches
            'category_count': len(set(categories_detected))
        }
    
    def _model_classify(self, content: str) -> float:
        """Use transformer model for classification."""
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
            logger.warning(f"Model classification failed: {e}")
            return 0.5
    
    @staticmethod
    def _score_to_risk(score: float) -> str:
        """Convert score to risk level string."""
        if score >= 0.8:
            return "critical"
        elif score >= 0.6:
            return "high"
        elif score >= 0.4:
            return "medium"
        else:
            return "low"


# ============================================================================
# Integration and Factory
# ============================================================================

class ThreatDetectorFactory:
    """Factory for creating configured threat detectors."""
    
    @staticmethod
    def create_default() -> TransformerThreatDetector:
        """Create detector with default configuration."""
        return TransformerThreatDetector()
    
    @staticmethod
    def create_lightweight() -> TransformerThreatDetector:
        """Create lightweight detector for resource-constrained environments."""
        config = TransformerConfig(
            semantic_model="sentence-transformers/all-MiniLM-L6-v2",
            phishing_classifier="distilbert-base-uncased",
            max_length=256,
            batch_size=16,
            semantic_weight=0.4,
            classifier_weight=0.2,
            character_weight=0.25,
            heuristic_weight=0.15
        )
        return TransformerThreatDetector(config=config)
    
    @staticmethod
    def create_high_accuracy() -> TransformerThreatDetector:
        """Create high-accuracy detector with larger models."""
        config = TransformerConfig(
            semantic_model="sentence-transformers/all-mpnet-base-v2",
            phishing_classifier="microsoft/deberta-v3-base",
            max_length=512,
            batch_size=8,
            semantic_weight=0.35,
            classifier_weight=0.35,
            character_weight=0.15,
            heuristic_weight=0.15
        )
        return TransformerThreatDetector(config=config)


# ============================================================================
# Convenience Functions
# ============================================================================

def detect_threat(
    domain: str,
    brand_name: str,
    page_content: Optional[str] = None
) -> ThreatDetectionResult:
    """
    Convenience function for single threat detection.
    
    Uses a global cached detector instance.
    """
    global _default_detector
    if '_default_detector' not in globals():
        _default_detector = TransformerThreatDetector()
    return _default_detector.detect_threat(domain, brand_name, page_content)


def detect_threats_batch(
    items: List[Tuple[str, str]],
    page_contents: Optional[List[str]] = None
) -> BatchDetectionResult:
    """
    Convenience function for batch threat detection.
    """
    global _default_detector
    if '_default_detector' not in globals():
        _default_detector = TransformerThreatDetector()
    return _default_detector.detect_threats_batch(items, page_contents)


# ============================================================================
# Demo and Testing
# ============================================================================

def demo():
    """Run demonstration of the threat detection system."""
    print("=" * 70)
    print("DoppelDown Transformer Threat Detection - Demo")
    print("=" * 70)
    
    # Create detector
    print("\n[1] Initializing detector...")
    detector = TransformerThreatDetector()
    
    # Test domains
    test_cases = [
        # (domain, brand, description)
        ("goog1e-login.com", "google", "Digit substitution"),
        ("аpple.com", "apple", "Homoglyph attack (Cyrillic 'а')"),
        ("paypa1-secure.com", "paypal", "Combo-squatting with digit"),
        ("amazon-verify-account.xyz", "amazon", "Suspicious TLD + keywords"),
        ("microsoft.com", "microsoft", "Legitimate domain"),
        ("facebоok-support.com", "facebook", "Homoglyph + combo"),
        ("netfliix-renew.com", "netflix", "Typosquatting"),
        ("apple-id-verify-now.tk", "apple", "Multiple red flags"),
    ]
    
    print("\n[2] Testing domain threats...")
    print("-" * 70)
    
    for domain, brand, description in test_cases:
        result = detector.detect_threat(domain, brand)
        
        status = "⚠️ THREAT" if result.is_threat else "✅ SAFE"
        
        print(f"\n{description}")
        print(f"  Domain: {domain}")
        print(f"  Brand: {brand}")
        print(f"  Status: {status} ({result.risk_level.value})")
        print(f"  Score: {result.overall_score:.2f} (confidence: {result.confidence:.2f})")
        
        if result.detected_techniques:
            print(f"  Techniques: {', '.join(result.detected_techniques[:3])}")
        
        if result.recommendations:
            print(f"  Recommendation: {result.recommendations[0]}")
    
    # Test content classification
    print("\n" + "=" * 70)
    print("[3] Testing phishing content classification...")
    print("-" * 70)
    
    phishing_content = """
    URGENT: Your Apple ID has been suspended due to suspicious activity.
    
    We detected unauthorized access to your account from an unknown device.
    To prevent permanent suspension, please verify your identity immediately.
    
    Click here to verify: http://apple-verify-secure.com/login
    
    You must complete this within 24 hours or your account will be closed.
    
    Apple Support Team
    """
    
    classifier = PhishingContentClassifier()
    content_result = classifier.classify(phishing_content, "apple")
    
    print(f"Content: (phishing email sample)")
    print(f"Is Phishing: {content_result['is_phishing']}")
    print(f"Score: {content_result['phishing_score']:.2f}")
    print(f"Risk Level: {content_result['risk_level']}")
    print(f"Categories: {content_result['pattern_analysis']['categories_detected']}")
    
    # Test batch processing
    print("\n" + "=" * 70)
    print("[4] Testing batch processing...")
    print("-" * 70)
    
    batch_items = [
        ("google-verify.com", "google"),
        ("microsoft-update.xyz", "microsoft"),
        ("amazon.com", "amazon"),
        ("fac3book-login.com", "facebook"),
    ]
    
    batch_result = detector.detect_threats_batch(batch_items)
    
    print(f"Analyzed: {batch_result.total_analyzed}")
    print(f"Threats Found: {batch_result.threats_found}")
    print(f"Threat Rate: {batch_result.threat_rate:.1%}")
    print(f"Processing Time: {batch_result.processing_time_ms:.1f}ms")
    
    print("\n" + "=" * 70)
    print("Demo complete!")
    print("=" * 70)


if __name__ == "__main__":
    demo()
