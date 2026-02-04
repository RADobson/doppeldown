"""
Advanced Brand Impersonation Detection using Machine Learning and NLP
Implements sophisticated models to detect nuanced brand impersonation techniques.
"""

import numpy as np
import re
from typing import List, Dict, Optional, Tuple, Any, Set
from dataclasses import dataclass, field
from collections import defaultdict, Counter
import logging
from enum import Enum

# ML Libraries
try:
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import classification_report, roc_auc_score, precision_recall_curve
    from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.pipeline import Pipeline, FeatureUnion
    from sklearn.base import BaseEstimator, TransformerMixin
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning("scikit-learn not available")

try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False

from nlp_analyzer import NLPAnalyzer, ThreatCategory
from contextual_threat_scorer import ContextualThreatScorer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ImpersonationTechnique(Enum):
    """Specific brand impersonation techniques."""
    HOMOGLYPH = "homoglyph"  # Visual similarity (e.g., gооgle with cyrillic о)
    TYPOSQUATTING = "typosquatting"  # Common typos
    COMBO_SQUATTING = "combo_squatting"  # Brand + keyword
    SOUNDEX = "soundex"  # Sound-alike names
    BITSQUATTING = "bitsquatting"  # Single bit flip
    HOMOGRAPH = "homograph"  # Different scripts that look similar
    PREFIX_SQUATTING = "prefix_squatting"  # Prefix addition
    SUFFIX_SQUATTING = "suffix_squatting"  # Suffix addition
    HYPHENATION = "hyphenation"  # Strategic hyphen insertion
    PLURALIZATION = "pluralization"  # Singular/plural swap
    TLD_SWAP = "tld_swap"  # Different top-level domain
    SUBDOMAIN = "subdomain"  # brand.phishing-site.com
    TRANSPOSITION = "transposition"  # Adjacent character swap
    REPETITION = "repetition"  # Character repetition
    OMISSION = "omission"  # Character omission
    INSERTION = "insertion"  # Character insertion
    REPLACEMENT = "replacement"  # Character replacement
    SPOOFED_SENDER = "spoofed_sender"  # Email sender spoofing
    VISUAL_SPOOFING = "visual_spoofing"  # Logo/visual spoofing
    LANGUAGE_MIMICRY = "language_mimicry"  # Mimicking brand voice


@dataclass
class TechniqueDetection:
    """Detection result for a specific technique."""
    technique: ImpersonationTechnique
    confidence: float
    evidence: List[str]
    matched_text: str
    severity: str


@dataclass
class BrandImpersonationResult:
    """Complete brand impersonation detection result."""
    brand_name: str
    target_text: str
    is_impersonation: bool
    overall_confidence: float
    detected_techniques: List[TechniqueDetection]
    risk_score: float
    linguistic_similarity: float
    visual_similarity: float
    contextual_risk_factors: List[str]
    recommendations: List[str]


class TextFeatureExtractor(BaseEstimator, TransformerMixin):
    """Custom sklearn transformer for text features."""
    
    def __init__(self):
        self.nlp = None
        if SPACY_AVAILABLE:
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except:
                pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        """Extract features from text."""
        features = []
        for text in X:
            features.append(self._extract_features(text))
        return np.array(features)
    
    def _extract_features(self, text: str) -> List[float]:
        """Extract numerical features from text."""
        text_lower = text.lower()
        
        # Character-level features
        features = [
            len(text),  # Length
            len(text.split()),  # Word count
            text.count('.'),  # Dot count
            text.count('-'),  # Hyphen count
            text.count('_'),  # Underscore count
            sum(c.isdigit() for c in text),  # Digit count
            sum(c.isupper() for c in text),  # Uppercase count
            text.count('!'),  # Exclamation count
            len(set(text)) / max(len(text), 1),  # Character diversity
        ]
        
        # Brand indicator features
        brand_indicators = ['official', 'real', 'verified', 'authentic', 'secure']
        features.extend([1 if indicator in text_lower else 0 for indicator in brand_indicators])
        
        # Urgency features
        urgency_words = ['urgent', 'immediately', 'now', 'emergency', 'alert']
        features.extend([1 if word in text_lower else 0 for word in urgency_words])
        
        return features


class BrandImpersonationDetector:
    """
    Machine Learning-based brand impersonation detector.
    Uses ensemble methods to detect sophisticated impersonation techniques.
    """
    
    # Homoglyph character mappings
    HOMOGLYPHS = {
        'a': ['а', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ɑ', 'α'],
        'b': ['Ь', 'ḃ', 'ḅ', 'β'],
        'c': ['с', 'ć', 'č', 'ç', 'ĉ', 'ċ', 'σ'],
        'd': ['ԁ', 'ḍ', 'ɗ', 'ď', 'đ'],
        'e': ['е', 'è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę', 'ε'],
        'g': ['ɡ', 'ģ', 'ğ', 'ǧ', 'ġ'],
        'h': ['һ', 'ḫ', 'ḩ', 'ħ'],
        'i': ['і', 'ì', 'í', 'î', 'ï', 'ī', 'į', 'ı', '1', 'l'],
        'j': ['ј', 'ĵ', 'ʝ'],
        'k': ['к', 'ķ', 'ḱ', 'ḳ'],
        'l': ['і', '1', 'I', 'l', 'ł'],
        'm': ['м', 'ṃ', 'ɱ'],
        'n': ['ո', 'ñ', 'ń', 'ň', 'ņ', 'ŋ'],
        'o': ['о', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō', 'ő', '0'],
        'p': ['р', 'þ', 'ṕ', 'ṗ', 'ρ'],
        'q': ['ԛ', 'ʠ'],
        'r': ['г', 'ṙ', 'ř', 'ŗ', 'ɍ'],
        's': ['ѕ', 'ś', 'š', 'ş', 'ŝ', 'ș', '5'],
        't': ['т', 'ť', 'ţ', 'ț', 'ŧ', '7'],
        'u': ['υ', 'ù', 'ú', 'û', 'ü', 'ū', 'ű', 'ů'],
        'v': ['ν', 'ѵ', 'ṽ'],
        'w': ['ω', 'ѡ', 'ẃ', 'ẅ'],
        'x': ['х', 'ẋ', 'ẍ'],
        'y': ['у', 'ý', 'ÿ', 'ŷ', 'γ'],
        'z': ['ᴢ', 'ż', 'ž', 'ź'],
    }
    
    # Common typo patterns (QWERTY keyboard)
    KEYBOARD_NEIGHBORS = {
        'a': 'qwsz',
        'b': 'vghn',
        'c': 'xdfv',
        'd': 'serfcx',
        'e': 'wsdr',
        'f': 'drtgvc',
        'g': 'ftyhbv',
        'h': 'gyujnb',
        'i': 'ujko',
        'j': 'huikmn',
        'k': 'jiolm',
        'l': 'kop',
        'm': 'njk',
        'n': 'bhjm',
        'o': 'iklp',
        'p': 'ol',
        'q': 'wa',
        'r': 'edft',
        's': 'wedxza',
        't': 'rfgy',
        'u': 'yhji',
        'v': 'cfgb',
        'w': 'qase',
        'x': 'zsdc',
        'y': 'tghu',
        'z': 'asx',
    }
    
    # Brand vocabulary for voice analysis
    BRAND_VOICE_PATTERNS = {
        'formality': r'\b(please|kindly|regards|sincerely|respectfully)\b',
        'urgency_legitimate': r'\b(important|attention|notice|reminder)\b',
        'technical': r'\b(verify|authenticate|secure|encrypt|protocol)\b',
        'professional': r'\b(team|department|support|service|assistance)\b',
    }
    
    def __init__(self, use_ml_models: bool = True):
        self.use_ml = use_ml_models and SKLEARN_AVAILABLE
        self.nlp_analyzer = NLPAnalyzer()
        self.contextual_scorer = ContextualThreatScorer()
        
        # ML Models
        self.technique_classifier = None
        self.risk_scorer = None
        self.text_vectorizer = None
        self.feature_scaler = None
        
        # Technique-specific detectors
        self.technique_detectors = {
            ImpersonationTechnique.HOMOGLYPH: self._detect_homoglyph,
            ImpersonationTechnique.TYPOSQUATTING: self._detect_typosquatting,
            ImpersonationTechnique.COMBO_SQUATTING: self._detect_combo_squatting,
            ImpersonationTechnique.HOMOGRAPH: self._detect_homograph,
            ImpersonationTechnique.BITSQUATTING: self._detect_bitsquatting,
            ImpersonationTechnique.PREFIX_SQUATTING: self._detect_prefix_squatting,
            ImpersonationTechnique.SUFFIX_SQUATTING: self._detect_suffix_squatting,
            ImpersonationTechnique.HYPHENATION: self._detect_hyphenation,
            ImpersonationTechnique.TRANSPOSITION: self._detect_transposition,
            ImpersonationTechnique.REPETITION: self._detect_repetition,
            ImpersonationTechnique.SPOOFED_SENDER: self._detect_spoofed_sender,
            ImpersonationTechnique.LANGUAGE_MIMICRY: self._detect_language_mimicry,
        }
        
        if self.use_ml:
            self._init_ml_models()
        
        logger.info("Brand Impersonation Detector initialized")
    
    def _init_ml_models(self):
        """Initialize machine learning models."""
        # Technique classification pipeline
        self.technique_classifier = Pipeline([
            ('features', FeatureUnion([
                ('tfidf', TfidfVectorizer(
                    ngram_range=(1, 3),
                    max_features=5000,
                    min_df=2
                )),
                ('text_stats', TextFeatureExtractor())
            ])),
            ('classifier', RandomForestClassifier(
                n_estimators=100,
                max_depth=20,
                random_state=42,
                n_jobs=-1
            ))
        ])
        
        # Risk scoring model
        self.risk_scorer = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        logger.info("ML models initialized")
    
    def detect(
        self,
        text: str,
        brand_name: str,
        content_type: str = "domain",  # domain, email, social, webpage
        brand_voice_samples: Optional[List[str]] = None,
        base_features: Optional[Dict] = None
    ) -> BrandImpersonationResult:
        """
        Detect brand impersonation in text.
        
        Args:
            text: Text to analyze (domain, email content, etc.)
            brand_name: Brand being protected
            content_type: Type of content being analyzed
            brand_voice_samples: Known brand voice samples for comparison
            base_features: Pre-computed base features
            
        Returns:
            BrandImpersonationResult with detection details
        """
        # Run all technique detectors
        detected_techniques = []
        for technique, detector in self.technique_detectors.items():
            try:
                result = detector(text, brand_name)
                if result.confidence > 0.3:  # Threshold for inclusion
                    detected_techniques.append(result)
            except Exception as e:
                logger.debug(f"Technique detector {technique} failed: {e}")
        
        # Sort by confidence
        detected_techniques.sort(key=lambda x: x.confidence, reverse=True)
        
        # Calculate similarities
        linguistic_sim = self._calculate_linguistic_similarity(text, brand_name, brand_voice_samples)
        visual_sim = self._calculate_visual_similarity(text, brand_name)
        
        # Run NLP analysis
        nlp_results = self.nlp_analyzer.analyze_text(text, [brand_name])
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(
            detected_techniques, linguistic_sim, visual_sim, nlp_results
        )
        
        # Determine if impersonation
        is_impersonation = risk_score > 0.6 or any(
            t.confidence > 0.8 for t in detected_techniques
        )
        
        # Calculate overall confidence
        overall_confidence = self._calculate_overall_confidence(
            detected_techniques, nlp_results
        )
        
        # Extract contextual risk factors
        risk_factors = self._extract_risk_factors(detected_techniques, nlp_results)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            brand_name, detected_techniques, risk_score, content_type
        )
        
        return BrandImpersonationResult(
            brand_name=brand_name,
            target_text=text,
            is_impersonation=is_impersonation,
            overall_confidence=overall_confidence,
            detected_techniques=detected_techniques,
            risk_score=risk_score,
            linguistic_similarity=linguistic_sim,
            visual_similarity=visual_sim,
            contextual_risk_factors=risk_factors,
            recommendations=recommendations
        )
    
    def detect_batch(
        self,
        texts: List[str],
        brand_name: str,
        content_type: str = "domain"
    ) -> List[BrandImpersonationResult]:
        """Detect impersonation in multiple texts."""
        results = []
        for text in texts:
            results.append(self.detect(text, brand_name, content_type))
        return results
    
    def _detect_homoglyph(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect homoglyph attacks."""
        evidence = []
        homoglyph_count = 0
        
        for char in text:
            for original, homoglyphs in self.HOMOGLYPHS.items():
                if char in homoglyphs:
                    evidence.append(f"Found homoglyph '{char}' for '{original}'")
                    homoglyph_count += 1
        
        # Check for brand similarity with homoglyphs
        normalized_text = self._normalize_homoglyphs(text)
        if brand_name.lower() in normalized_text.lower():
            evidence.append(f"Brand name found after homoglyph normalization")
        
        confidence = min(homoglyph_count * 0.25, 1.0)
        severity = "high" if homoglyph_count > 1 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.HOMOGLYPH,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_typosquatting(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect typosquatting attacks."""
        evidence = []
        typo_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Character omission
        for i in range(len(brand_lower)):
            omitted = brand_lower[:i] + brand_lower[i+1:]
            if omitted in text_lower:
                evidence.append(f"Character omission detected: missing '{brand_lower[i]}'")
                typo_score += 0.3
        
        # Character repetition
        for i in range(len(brand_lower)):
            repeated = brand_lower[:i+1] + brand_lower[i] + brand_lower[i+1:]
            if repeated in text_lower:
                evidence.append(f"Character repetition detected: '{brand_lower[i]}' repeated")
                typo_score += 0.25
        
        # Character swap (adjacent)
        for i in range(len(brand_lower) - 1):
            swapped = brand_lower[:i] + brand_lower[i+1] + brand_lower[i] + brand_lower[i+2:]
            if swapped in text_lower:
                evidence.append(f"Character swap detected: '{brand_lower[i]}{brand_lower[i+1]}'")
                typo_score += 0.25
        
        # QWERTY substitution
        for i, char in enumerate(brand_lower):
            if char in self.KEYBOARD_NEIGHBORS:
                for neighbor in self.KEYBOARD_NEIGHBORS[char]:
                    substituted = brand_lower[:i] + neighbor + brand_lower[i+1:]
                    if substituted in text_lower:
                        evidence.append(f"QWERTY substitution: '{char}' -> '{neighbor}'")
                        typo_score += 0.2
        
        # Levenshtein distance check
        distance = self._levenshtein_distance(text_lower.replace('.', '').replace('-', ''), brand_lower)
        if 0 < distance <= 2:
            evidence.append(f"Low Levenshtein distance: {distance}")
            typo_score += 0.3 * (3 - distance)
        
        confidence = min(typo_score, 1.0)
        severity = "high" if typo_score > 0.6 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.TYPOSQUATTING,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_combo_squatting(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect combo-squatting (brand + keyword)."""
        evidence = []
        combo_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Common phishing keywords
        phishing_keywords = [
            'login', 'signin', 'account', 'verify', 'secure', 'update',
            'confirm', 'authenticate', 'password', 'credential', 'billing',
            'payment', 'wallet', 'support', 'help', 'service'
        ]
        
        # Check for brand + keyword
        for keyword in phishing_keywords:
            patterns = [
                f"{brand_lower}-{keyword}",
                f"{keyword}-{brand_lower}",
                f"{brand_lower}{keyword}",
                f"{keyword}{brand_lower}",
                f"my{brand_lower}-{keyword}",
                f"secure-{brand_lower}-{keyword}",
            ]
            for pattern in patterns:
                if pattern in text_lower:
                    evidence.append(f"Combo-squatting detected: '{pattern}'")
                    combo_score += 0.35
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.top', '.xyz']
        for tld in suspicious_tlds:
            if text_lower.endswith(tld):
                evidence.append(f"Suspicious TLD: {tld}")
                combo_score += 0.2
        
        confidence = min(combo_score, 1.0)
        severity = "high" if combo_score > 0.5 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.COMBO_SQUATTING,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_homograph(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect homograph attacks (different scripts)."""
        evidence = []
        homograph_score = 0
        
        # Check for non-ASCII characters that look like ASCII
        for char in text:
            if ord(char) > 127:
                # Check if it's a known homoglyph
                for original, homoglyphs in self.HOMOGLYPHS.items():
                    if char in homoglyphs:
                        evidence.append(f"Homograph character: '{char}' (U+{ord(char):04X}) looks like '{original}'")
                        homograph_score += 0.4
        
        confidence = min(homograph_score, 1.0)
        severity = "critical" if homograph_score > 0.5 else "high"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.HOMOGRAPH,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_bitsquatting(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect bitsquatting (single bit flip)."""
        evidence = []
        bitsquat_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Single bit flip detection
        bit_flips = {
            'a': 'q', 'b': 'v', 'c': 'e', 'd': 's', 'e': 'r', 'f': 'd',
            'g': 'f', 'h': 'j', 'i': 'u', 'j': 'k', 'k': 'l', 'l': 'k',
            'm': 'n', 'n': 'm', 'o': 'i', 'p': 'o', 'q': 'w', 'r': 'e',
            's': 'a', 't': 'r', 'u': 'y', 'v': 'c', 'w': 'q', 'x': 'z',
            'y': 't', 'z': 'x'
        }
        
        for i, char in enumerate(brand_lower):
            if char in bit_flips:
                flipped = brand_lower[:i] + bit_flips[char] + brand_lower[i+1:]
                if flipped in text_lower:
                    evidence.append(f"Bitsquatting: '{char}' -> '{bit_flips[char]}' (possible bit flip)")
                    bitsquat_score += 0.4
        
        confidence = min(bitsquat_score, 1.0)
        severity = "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.BITSQUATTING,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_prefix_squatting(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect prefix squatting."""
        evidence = []
        prefix_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        suspicious_prefixes = [
            'secure', 'login', 'signin', 'my', 'official', 'real',
            'verify', 'auth', 'account', 'web', 'www', 'mail', 'email'
        ]
        
        for prefix in suspicious_prefixes:
            if text_lower.startswith(f"{prefix}-{brand_lower}"):
                evidence.append(f"Suspicious prefix: '{prefix}-{brand_lower}'")
                prefix_score += 0.4
            elif text_lower.startswith(f"{prefix}{brand_lower}"):
                evidence.append(f"Suspicious prefix (no hyphen): '{prefix}{brand_lower}'")
                prefix_score += 0.35
        
        confidence = min(prefix_score, 1.0)
        severity = "high" if prefix_score > 0.5 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.PREFIX_SQUATTING,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_suffix_squatting(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect suffix squatting."""
        evidence = []
        suffix_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        suspicious_suffixes = [
            'login', 'signin', 'secure', 'verify', 'auth', 'support',
            'help', 'service', 'official', 'real', 'update', 'confirm'
        ]
        
        for suffix in suspicious_suffixes:
            if f"-{brand_lower}-{suffix}" in text_lower:
                evidence.append(f"Suspicious suffix: '-{suffix}'")
                suffix_score += 0.35
            elif text_lower.startswith(f"{brand_lower}-{suffix}"):
                evidence.append(f"Brand with suspicious suffix: '{brand_lower}-{suffix}'")
                suffix_score += 0.4
        
        confidence = min(suffix_score, 1.0)
        severity = "high" if suffix_score > 0.5 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.SUFFIX_SQUATTING,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_hyphenation(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect strategic hyphen insertion."""
        evidence = []
        hyphen_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Check for hyphen insertion in brand name
        for i in range(1, len(brand_lower)):
            hyphenated = brand_lower[:i] + '-' + brand_lower[i:]
            if hyphenated in text_lower:
                evidence.append(f"Strategic hyphenation: '{hyphenated}'")
                hyphen_score += 0.4
        
        # Multiple hyphens
        hyphen_count = text.count('-')
        if hyphen_count > 2:
            evidence.append(f"Multiple hyphens detected: {hyphen_count}")
            hyphen_score += min(hyphen_count * 0.1, 0.3)
        
        confidence = min(hyphen_score, 1.0)
        severity = "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.HYPHENATION,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_transposition(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect character transposition."""
        evidence = []
        transposition_score = 0
        
        text_lower = text.lower()
        brand_lower = brand_name.lower()
        
        # Check for adjacent character swaps
        for i in range(len(brand_lower) - 1):
            transposed = brand_lower[:i] + brand_lower[i+1] + brand_lower[i] + brand_lower[i+2:]
            if transposed in text_lower:
                evidence.append(f"Character transposition: '{brand_lower[i]}{brand_lower[i+1]}' -> '{brand_lower[i+1]}{brand_lower[i]}'")
                transposition_score += 0.4
        
        confidence = min(transposition_score, 1.0)
        severity = "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.TRANSPOSITION,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_repetition(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect character repetition."""
        evidence = []
        repetition_score = 0
        
        # Check for repeated characters
        for match in re.finditer(r'(.)\1{2,}', text.lower()):
            evidence.append(f"Character repetition: '{match.group()}'")
            repetition_score += 0.25
        
        # Check for brand with repeated characters
        brand_lower = brand_name.lower()
        for char in set(brand_lower):
            repeated = brand_lower.replace(char, char * 2)
            if repeated in text.lower():
                evidence.append(f"Brand character repeated: '{char}'")
                repetition_score += 0.3
        
        confidence = min(repetition_score, 1.0)
        severity = "low"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.REPETITION,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_spoofed_sender(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect spoofed email sender patterns."""
        evidence = []
        spoof_score = 0
        
        # Check for common spoofing patterns
        if 'noreply' in text.lower() or 'no-reply' in text.lower():
            evidence.append("Common noreply pattern detected")
            spoof_score += 0.2
        
        # Check for domain similarity
        if '@' in text:
            sender_domain = text.split('@')[1]
            similarity = self._calculate_string_similarity(sender_domain, f"{brand_name}.com")
            if 0.6 < similarity < 1.0:
                evidence.append(f"Domain similarity to brand: {similarity:.2f}")
                spoof_score += similarity * 0.5
        
        # Check for display name spoofing indicators
        if '"' in text or '<' in text:
            evidence.append("Display name formatting detected")
            spoof_score += 0.15
        
        confidence = min(spoof_score, 1.0)
        severity = "high" if spoof_score > 0.5 else "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.SPOOFED_SENDER,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _detect_language_mimicry(self, text: str, brand_name: str) -> TechniqueDetection:
        """Detect brand voice/language mimicry."""
        evidence = []
        mimicry_score = 0
        
        # Check for brand voice patterns
        text_lower = text.lower()
        
        # Formal language
        formal_words = ['please', 'kindly', 'regards', 'sincerely', 'respectfully']
        formal_count = sum(1 for word in formal_words if word in text_lower)
        if formal_count > 2:
            evidence.append(f"Formal language pattern: {formal_count} indicators")
            mimicry_score += formal_count * 0.1
        
        # Technical/security language
        tech_words = ['verify', 'authenticate', 'secure', 'encrypt', 'protocol']
        tech_count = sum(1 for word in tech_words if word in text_lower)
        if tech_count > 1:
            evidence.append(f"Technical language: {tech_count} indicators")
            mimicry_score += tech_count * 0.15
        
        # Professional references
        prof_words = ['team', 'department', 'support', 'service']
        prof_count = sum(1 for word in prof_words if word in text_lower)
        if prof_count > 1:
            evidence.append(f"Professional references: {prof_count} indicators")
            mimicry_score += prof_count * 0.1
        
        confidence = min(mimicry_score, 1.0)
        severity = "medium"
        
        return TechniqueDetection(
            technique=ImpersonationTechnique.LANGUAGE_MIMICRY,
            confidence=confidence,
            evidence=evidence,
            matched_text=text,
            severity=severity
        )
    
    def _calculate_linguistic_similarity(
        self,
        text: str,
        brand_name: str,
        brand_voice_samples: Optional[List[str]]
    ) -> float:
        """Calculate linguistic similarity to brand voice."""
        if not brand_voice_samples:
            # Use basic heuristics
            text_lower = text.lower()
            brand_lower = brand_name.lower()
            
            if brand_lower in text_lower:
                return 0.5
            return 0.2
        
        # Use TF-IDF cosine similarity
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2))
            all_texts = brand_voice_samples + [text]
            tfidf_matrix = vectorizer.fit_transform(all_texts)
            
            similarities = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1])
            return float(np.mean(similarities))
        except:
            return 0.3
    
    def _calculate_visual_similarity(self, text: str, brand_name: str) -> float:
        """Calculate visual similarity to brand name."""
        text_normalized = self._normalize_homoglyphs(text.lower())
        brand_lower = brand_name.lower()
        
        # Remove common separators
        text_clean = re.sub(r'[.-]', '', text_normalized)
        
        # Check for exact match
        if brand_lower in text_clean:
            return 0.9
        
        # Levenshtein distance
        distance = self._levenshtein_distance(text_clean, brand_lower)
        max_len = max(len(text_clean), len(brand_lower))
        
        if max_len == 0:
            return 0.0
        
        similarity = 1 - (distance / max_len)
        return max(0, similarity)
    
    def _calculate_risk_score(
        self,
        techniques: List[TechniqueDetection],
        linguistic_sim: float,
        visual_sim: float,
        nlp_results: Dict
    ) -> float:
        """Calculate overall risk score."""
        if not techniques:
            return 0.1
        
        # Technique-based score
        technique_score = sum(t.confidence * (1.5 if t.severity == 'critical' else 
                                               1.2 if t.severity == 'high' else 1.0) 
                             for t in techniques)
        technique_score = min(technique_score / max(len(techniques), 1), 1.0)
        
        # Visual similarity contributes to risk
        visual_risk = visual_sim * 0.3
        
        # Linguistic similarity (high similarity with bad content = high risk)
        linguistic_risk = linguistic_sim * 0.2
        
        # NLP risk factors
        nlp_risk = 0.0
        if nlp_results.get('sentiment', {}).get('dominant_emotion') == 'fear':
            nlp_risk += 0.2
        if nlp_results.get('linguistic', {}).get('emotional_manipulation', 0) > 0.5:
            nlp_risk += 0.2
        
        # Combine scores
        total_risk = technique_score * 0.5 + visual_risk + linguistic_risk + nlp_risk
        return min(total_risk, 1.0)
    
    def _calculate_overall_confidence(
        self,
        techniques: List[TechniqueDetection],
        nlp_results: Dict
    ) -> float:
        """Calculate overall confidence in detection."""
        confidences = []
        
        # Technique confidences
        for technique in techniques:
            confidences.append(technique.confidence)
        
        # NLP confidence
        sentiment_conf = nlp_results.get('sentiment', {}).get('confidence', 0.5)
        confidences.append(sentiment_conf)
        
        if not confidences:
            return 0.5
        
        return sum(confidences) / len(confidences)
    
    def _extract_risk_factors(
        self,
        techniques: List[TechniqueDetection],
        nlp_results: Dict
    ) -> List[str]:
        """Extract contextual risk factors."""
        factors = []
        
        for technique in techniques:
            if technique.confidence > 0.6:
                factors.append(f"{technique.technique.value}_detected")
        
        sentiment = nlp_results.get('sentiment', {})
        if sentiment.get('dominant_emotion') == 'fear':
            factors.append('fear_based_messaging')
        if sentiment.get('dominant_emotion') == 'urgency':
            factors.append('urgency_tactics')
        
        linguistic = nlp_results.get('linguistic', {})
        if linguistic.get('emotional_manipulation', 0) > 0.5:
            factors.append('emotional_manipulation')
        if len(linguistic.get('urgency_indicators', [])) > 2:
            factors.append('excessive_urgency')
        
        return factors
    
    def _generate_recommendations(
        self,
        brand_name: str,
        techniques: List[TechniqueDetection],
        risk_score: float,
        content_type: str
    ) -> List[str]:
        """Generate recommendations based on detection."""
        recommendations = []
        
        if risk_score > 0.8:
            recommendations.append(
                f"CRITICAL: High-confidence brand impersonation of {brand_name} detected"
            )
            recommendations.append("Immediate takedown recommended")
        elif risk_score > 0.6:
            recommendations.append(
                f"HIGH PRIORITY: Likely impersonation of {brand_name}"
            )
            recommendations.append("Collect evidence for takedown")
        
        # Technique-specific recommendations
        technique_types = [t.technique for t in techniques if t.confidence > 0.5]
        
        if ImpersonationTechnique.HOMOGLYPH in technique_types:
            recommendations.append("Homoglyph attack detected - visual spoofing technique")
        
        if ImpersonationTechnique.HOMOGRAPH in technique_types:
            recommendations.append("Homograph attack - internationalized domain name spoofing")
        
        if ImpersonationTechnique.TYPOSQUATTING in technique_types:
            recommendations.append("Typosquatting detected - targets user typing errors")
        
        if ImpersonationTechnique.COMBO_SQUATTING in technique_types:
            recommendations.append("Combo-squatting detected - misleading brand-keyword combinations")
        
        if ImpersonationTechnique.SPOOFED_SENDER in technique_types:
            recommendations.append("Sender spoofing detected - verify email headers")
        
        return recommendations
    
    def _normalize_homoglyphs(self, text: str) -> str:
        """Normalize homoglyph characters to ASCII equivalents."""
        normalized = text
        for original, homoglyphs in self.HOMOGLYPHS.items():
            for homoglyph in homoglyphs:
                normalized = normalized.replace(homoglyph, original)
        return normalized
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance."""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    def _calculate_string_similarity(self, s1: str, s2: str) -> float:
        """Calculate similarity between two strings."""
        distance = self._levenshtein_distance(s1, s2)
        max_len = max(len(s1), len(s2))
        if max_len == 0:
            return 1.0
        return 1 - (distance / max_len)


# Convenience function
def detect_impersonation(
    text: str,
    brand_name: str,
    content_type: str = "domain"
) -> BrandImpersonationResult:
    """Quick function to detect impersonation."""
    detector = BrandImpersonationDetector()
    return detector.detect(text, brand_name, content_type)


if __name__ == '__main__':
    # Example usage
    detector = BrandImpersonationDetector()
    
    test_cases = [
        ("g00gle-security.com", "google"),
        ("secure-apple-verify.com", "apple"),
        ("amaz0n-help.com", "amazon"),
        ("microsoft.com", "microsoft"),
        ("gооgle.com", "google"),  # With Cyrillic о
        ("paypa1-security.com", "paypal"),
    ]
    
    print("=== Brand Impersonation Detection Results ===\n")
    
    for text, brand in test_cases:
        result = detector.detect(text, brand)
        
        print(f"Text: {text}")
        print(f"Brand: {result.brand_name}")
        print(f"Is Impersonation: {result.is_impersonation}")
        print(f"Risk Score: {result.risk_score:.3f}")
        print(f"Visual Similarity: {result.visual_similarity:.3f}")
        print(f"Overall Confidence: {result.overall_confidence:.3f}")
        
        if result.detected_techniques:
            print("Detected Techniques:")
            for technique in result.detected_techniques[:3]:
                print(f"  - {technique.technique.value}: {technique.confidence:.3f} ({technique.severity})")
        
        if result.recommendations:
            print("Recommendations:")
            for rec in result.recommendations[:2]:
                print(f"  - {rec}")
        
        print("-" * 50)
