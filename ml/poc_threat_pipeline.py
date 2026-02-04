#!/usr/bin/env python3
"""
DoppelDown ML Threat Detection - Proof of Concept Pipeline
===========================================================

A complete, runnable ML pipeline for detecting brand impersonation threats,
phishing attempts, and domain-related risks. Uses scikit-learn for lightweight,
production-ready inference without heavy deep learning dependencies.

Pipeline stages:
  1. Synthetic data generation (typosquatting, combosquatting, homoglyphs, etc.)
  2. Feature engineering (30+ features from domains)
  3. Model training (Random Forest ensemble + Isolation Forest anomaly detection)
  4. Evaluation with comprehensive metrics
  5. Real-time inference with explainability

Usage:
  python poc_threat_pipeline.py              # Full pipeline demo
  python poc_threat_pipeline.py --train      # Train and save models
  python poc_threat_pipeline.py --eval       # Evaluate saved models
  python poc_threat_pipeline.py --score      # Score example domains
"""

import json
import math
import os
import random
import re
import string
import sys
import time
import hashlib
from collections import Counter
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import List, Dict, Optional, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

import numpy as np

try:
    from sklearn.ensemble import (
        RandomForestClassifier, GradientBoostingClassifier,
        IsolationForest, VotingClassifier
    )
    from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.metrics import (
        classification_report, confusion_matrix, roc_auc_score,
        precision_recall_curve, average_precision_score, roc_curve,
        f1_score, accuracy_score
    )
    from sklearn.calibration import CalibratedClassifierCV
    import joblib
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    print("ERROR: scikit-learn required. Install: pip install scikit-learn")
    sys.exit(1)

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import seaborn as sns
    HAS_PLOTS = True
except ImportError:
    HAS_PLOTS = False

# ============================================================================
# Constants & Configuration
# ============================================================================

KNOWN_BRANDS = [
    "google", "apple", "microsoft", "amazon", "facebook", "meta", "netflix",
    "paypal", "instagram", "twitter", "linkedin", "spotify", "uber", "airbnb",
    "dropbox", "slack", "zoom", "stripe", "shopify", "twitch", "github",
    "coinbase", "binance", "chase", "wellsfargo", "bankofamerica", "citibank",
    "adobe", "salesforce", "oracle", "cisco", "intel", "nvidia", "samsung",
    "sony", "walmart", "target", "ebay", "etsy", "pinterest", "tiktok",
    "snapchat", "reddit", "discord", "telegram", "whatsapp", "signal"
]

SUSPICIOUS_TLDS = {
    'tk': 0.9, 'ml': 0.9, 'ga': 0.9, 'cf': 0.9, 'gq': 0.9,
    'xyz': 0.7, 'top': 0.7, 'click': 0.8, 'link': 0.6, 'loan': 0.8,
    'work': 0.6, 'download': 0.8, 'stream': 0.7, 'racing': 0.7,
    'win': 0.7, 'bid': 0.7, 'party': 0.6, 'trade': 0.6, 'review': 0.5,
    'science': 0.5, 'date': 0.6, 'faith': 0.6, 'accountant': 0.7,
    'cricket': 0.5, 'zip': 0.6, 'mov': 0.5, 'icu': 0.7, 'buzz': 0.5,
    'best': 0.4, 'rest': 0.4, 'cam': 0.5, 'space': 0.4, 'surf': 0.4,
    'monster': 0.5, 'quest': 0.4, 'hair': 0.5, 'sbs': 0.5, 'cfd': 0.6
}

PHISHING_KEYWORDS = [
    'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification',
    'secure', 'security', 'update', 'account', 'confirm', 'password',
    'banking', 'wallet', 'payment', 'billing', 'invoice', 'support',
    'helpdesk', 'help-desk', 'service', 'customer', 'official',
    'alert', 'warning', 'urgent', 'suspended', 'locked', 'recover',
    'restore', 'reset', 'unlock', 'activate', 'validate', 'authenticate',
    'credential', 'authorize', 'admin', 'portal', 'dashboard',
    'notification', 'reward', 'prize', 'winner', 'free', 'gift',
    'bonus', 'offer', 'promo', 'discount', 'claim', 'redeem',
]

# Homoglyph mapping: visually similar characters
HOMOGLYPH_MAP = {
    'a': ['а', 'ɑ', 'α', 'ạ', 'ą', 'à', 'á', 'â', 'ã', 'ä', 'å'],
    'b': ['Ь', 'ɓ', 'Ƅ', 'ḃ', 'ḅ'],
    'c': ['с', 'ϲ', 'ç', 'ć', 'ĉ', 'ċ'],
    'd': ['ԁ', 'ɗ', 'ḋ', 'ḍ', 'đ'],
    'e': ['е', 'ε', 'ẹ', 'ė', 'ę', 'è', 'é', 'ê', 'ë'],
    'f': ['ƒ', 'ḟ'],
    'g': ['ɡ', 'ğ', 'ġ', 'ģ', 'ǧ'],
    'h': ['һ', 'ĥ', 'ħ', 'ḣ', 'ḥ'],
    'i': ['і', 'ɩ', 'ì', 'í', 'î', 'ï', 'ı', 'ĩ'],
    'j': ['ϳ', 'ĵ', 'ɉ'],
    'k': ['κ', 'ḱ', 'ḳ', 'ķ'],
    'l': ['ⅼ', 'ℓ', 'ĺ', 'ḷ', 'ļ'],
    'm': ['м', 'ṁ', 'ṃ'],
    'n': ['п', 'ñ', 'ń', 'ṅ', 'ṇ', 'ŋ'],
    'o': ['о', 'ο', 'σ', 'ọ', 'ø', 'ö', 'ô', 'ò', 'ó', 'õ'],
    'p': ['р', 'ρ', 'ṗ', 'ṕ'],
    'q': ['ɋ', 'q'],
    'r': ['г', 'ṙ', 'ṛ', 'ŗ', 'ř'],
    's': ['ѕ', 'ś', 'ṡ', 'ş', 'š'],
    't': ['τ', 'ṫ', 'ṭ', 'ţ', 'ŧ'],
    'u': ['υ', 'ụ', 'ù', 'ú', 'û', 'ü', 'ũ', 'ū'],
    'v': ['ν', 'ṽ', 'ṿ'],
    'w': ['ω', 'ẁ', 'ẃ', 'ẅ', 'ŵ'],
    'x': ['х', 'ẋ', 'ẍ'],
    'y': ['у', 'ý', 'ÿ', 'ŷ', 'ẏ'],
    'z': ['ż', 'ź', 'ž', 'ẑ', 'ẓ'],
    '0': ['О', 'о', 'Ο', 'ο'],
    '1': ['l', 'I', 'ⅼ', '|'],
}

KEYBOARD_ADJACENCY = {
    'q': 'wa', 'w': 'qeas', 'e': 'wrds', 'r': 'etdf', 't': 'ryfg',
    'y': 'tugh', 'u': 'yijh', 'i': 'uojk', 'o': 'ipkl', 'p': 'ol',
    'a': 'qwsz', 's': 'wedxza', 'd': 'erfcxs', 'f': 'rtgvcd',
    'g': 'tyhbvf', 'h': 'yujnbg', 'j': 'uikmnh', 'k': 'ioljm',
    'l': 'opk', 'z': 'asx', 'x': 'zsdc', 'c': 'xdfv', 'v': 'cfgb',
    'b': 'vghn', 'n': 'bhjm', 'm': 'njk',
}

DIGIT_SUBSTITUTIONS = {
    '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's',
    '7': 't', '8': 'b', '9': 'g',
}

LEGITIMATE_TLDS = ['com', 'org', 'net', 'io', 'co', 'dev', 'app', 'ai', 'us', 'uk', 'de', 'fr', 'au', 'ca']


# ============================================================================
# Enums & Data Classes
# ============================================================================

class ThreatType(str, Enum):
    TYPOSQUATTING = "typosquatting"
    COMBOSQUATTING = "combosquatting"
    HOMOGLYPH = "homoglyph"
    BITSQUATTING = "bitsquatting"
    PHISHING_KEYWORD = "phishing_keyword"
    SUSPICIOUS_TLD = "suspicious_tld"
    BRAND_ABUSE = "brand_abuse"
    LEGITIMATE = "legitimate"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class ThreatScore:
    domain: str
    brand_name: str
    threat_score: float
    risk_level: str
    is_threat: bool
    confidence: float
    detected_techniques: List[str]
    feature_importance: Dict[str, float]
    recommendations: List[str]
    processing_time_ms: float
    model_version: str = "2.0.0-poc"

    def to_dict(self) -> Dict:
        return asdict(self)

    def __repr__(self):
        return (
            f"ThreatScore(domain={self.domain!r}, brand={self.brand_name!r}, "
            f"score={self.threat_score:.3f}, risk={self.risk_level}, "
            f"threat={self.is_threat}, techniques={self.detected_techniques})"
        )


# ============================================================================
# Feature Engineering
# ============================================================================

class FeatureExtractor:
    """Extract 30+ features from a domain for threat classification."""

    FEATURE_NAMES = [
        # Length features (5)
        'domain_length', 'sld_length', 'tld_length', 'subdomain_count', 'total_parts',
        # Character composition (8)
        'digit_count', 'hyphen_count', 'dot_count', 'special_char_count',
        'uppercase_ratio', 'digit_ratio', 'consonant_vowel_ratio', 'unique_char_ratio',
        # Entropy & complexity (3)
        'shannon_entropy', 'trigram_uniqueness', 'char_frequency_std',
        # Brand similarity (6)
        'levenshtein_distance', 'levenshtein_normalized', 'jaro_winkler_similarity',
        'brand_in_domain', 'brand_length_ratio', 'longest_common_subsequence_ratio',
        # Phishing indicators (5)
        'phishing_keyword_count', 'suspicious_tld_score', 'has_brand_with_keyword',
        'keyword_density', 'looks_like_login_page',
        # Homoglyph & substitution (4)
        'homoglyph_score', 'digit_substitution_count', 'mixed_script_score',
        'visual_similarity_score',
        # Structural patterns (4)
        'has_excessive_hyphens', 'has_ip_pattern', 'numeric_prefix_suffix',
        'random_looking_score',
    ]

    def __init__(self):
        self._reverse_homoglyphs = {}
        for ascii_char, confusables in HOMOGLYPH_MAP.items():
            for c in confusables:
                self._reverse_homoglyphs[c] = ascii_char

    def extract(self, domain: str, brand_name: str) -> np.ndarray:
        """Extract feature vector from a domain + brand pair."""
        domain_lower = domain.lower().strip()
        brand_lower = brand_name.lower().strip()

        # Parse domain parts
        parts = domain_lower.split('.')
        tld = parts[-1] if len(parts) > 1 else ''
        sld = parts[-2] if len(parts) > 1 else parts[0]
        subdomains = parts[:-2] if len(parts) > 2 else []

        features = []

        # --- Length features ---
        features.append(len(domain_lower))                    # domain_length
        features.append(len(sld))                             # sld_length
        features.append(len(tld))                             # tld_length
        features.append(len(subdomains))                      # subdomain_count
        features.append(len(parts))                           # total_parts

        # --- Character composition ---
        alpha_chars = re.sub(r'[^a-z]', '', sld)
        features.append(sum(c.isdigit() for c in sld))       # digit_count
        features.append(sld.count('-'))                       # hyphen_count
        features.append(domain_lower.count('.'))              # dot_count
        features.append(sum(not c.isalnum() and c not in '.-' for c in domain_lower))  # special_char_count
        features.append(sum(c.isupper() for c in domain) / max(len(domain), 1))  # uppercase_ratio
        features.append(sum(c.isdigit() for c in sld) / max(len(sld), 1))  # digit_ratio

        vowels = sum(c in 'aeiou' for c in alpha_chars)
        consonants = len(alpha_chars) - vowels
        features.append(consonants / max(vowels, 1))          # consonant_vowel_ratio
        features.append(len(set(sld)) / max(len(sld), 1))    # unique_char_ratio

        # --- Entropy & complexity ---
        features.append(self._shannon_entropy(sld))            # shannon_entropy
        features.append(self._trigram_uniqueness(sld))         # trigram_uniqueness
        features.append(self._char_frequency_std(sld))         # char_frequency_std

        # --- Brand similarity ---
        lev_dist = self._levenshtein_distance(sld, brand_lower)
        features.append(lev_dist)                              # levenshtein_distance
        features.append(lev_dist / max(len(brand_lower), 1))  # levenshtein_normalized
        features.append(self._jaro_winkler(sld, brand_lower)) # jaro_winkler_similarity
        features.append(1.0 if brand_lower in sld else 0.0)   # brand_in_domain
        features.append(len(brand_lower) / max(len(sld), 1))  # brand_length_ratio
        features.append(self._lcs_ratio(sld, brand_lower))    # longest_common_subsequence_ratio

        # --- Phishing indicators ---
        kw_count = sum(1 for kw in PHISHING_KEYWORDS if kw in sld or kw in domain_lower)
        features.append(kw_count)                              # phishing_keyword_count
        features.append(SUSPICIOUS_TLDS.get(tld, 0.0))       # suspicious_tld_score
        features.append(1.0 if brand_lower in sld and kw_count > 0 else 0.0)  # has_brand_with_keyword
        features.append(kw_count / max(len(sld.split('-')), 1))  # keyword_density
        features.append(1.0 if any(kw in domain_lower for kw in ['login', 'signin', 'password', 'verify']) else 0.0)  # looks_like_login_page

        # --- Homoglyph & substitution ---
        features.append(self._homoglyph_score(sld, brand_lower))  # homoglyph_score
        features.append(self._digit_substitution_count(sld, brand_lower))  # digit_substitution_count
        features.append(self._mixed_script_score(domain))      # mixed_script_score
        features.append(self._visual_similarity(sld, brand_lower))  # visual_similarity_score

        # --- Structural patterns ---
        features.append(1.0 if sld.count('-') >= 3 else 0.0)  # has_excessive_hyphens
        features.append(1.0 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}', domain_lower) else 0.0)  # has_ip_pattern
        features.append(1.0 if re.match(r'^\d', sld) or re.search(r'\d$', sld) else 0.0)  # numeric_prefix_suffix
        features.append(self._random_looking_score(sld))       # random_looking_score

        return np.array(features, dtype=np.float64)

    def extract_batch(self, domains: List[str], brand_name: str) -> np.ndarray:
        """Extract features for multiple domains."""
        return np.array([self.extract(d, brand_name) for d in domains])

    # --- Helper methods ---

    @staticmethod
    def _shannon_entropy(s: str) -> float:
        if not s:
            return 0.0
        freq = Counter(s)
        probs = [count / len(s) for count in freq.values()]
        return -sum(p * math.log2(p) for p in probs if p > 0)

    @staticmethod
    def _trigram_uniqueness(s: str) -> float:
        if len(s) < 3:
            return 1.0
        trigrams = [s[i:i+3] for i in range(len(s) - 2)]
        return len(set(trigrams)) / len(trigrams)

    @staticmethod
    def _char_frequency_std(s: str) -> float:
        if not s:
            return 0.0
        freq = Counter(s)
        counts = list(freq.values())
        mean = sum(counts) / len(counts)
        variance = sum((c - mean) ** 2 for c in counts) / len(counts)
        return math.sqrt(variance)

    @staticmethod
    def _levenshtein_distance(s1: str, s2: str) -> int:
        if len(s1) < len(s2):
            return FeatureExtractor._levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        prev_row = list(range(len(s2) + 1))
        for i, c1 in enumerate(s1):
            curr_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = prev_row[j + 1] + 1
                deletions = curr_row[j] + 1
                substitutions = prev_row[j] + (c1 != c2)
                curr_row.append(min(insertions, deletions, substitutions))
            prev_row = curr_row
        return prev_row[-1]

    @staticmethod
    def _jaro_winkler(s1: str, s2: str) -> float:
        if s1 == s2:
            return 1.0
        len1, len2 = len(s1), len(s2)
        if len1 == 0 or len2 == 0:
            return 0.0

        match_dist = max(len1, len2) // 2 - 1
        match_dist = max(0, match_dist)

        s1_matches = [False] * len1
        s2_matches = [False] * len2
        matches = 0
        transpositions = 0

        for i in range(len1):
            start = max(0, i - match_dist)
            end = min(i + match_dist + 1, len2)
            for j in range(start, end):
                if s2_matches[j] or s1[i] != s2[j]:
                    continue
                s1_matches[i] = True
                s2_matches[j] = True
                matches += 1
                break

        if matches == 0:
            return 0.0

        k = 0
        for i in range(len1):
            if not s1_matches[i]:
                continue
            while not s2_matches[k]:
                k += 1
            if s1[i] != s2[k]:
                transpositions += 1
            k += 1

        jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3

        # Winkler modification
        prefix = 0
        for i in range(min(4, len1, len2)):
            if s1[i] == s2[i]:
                prefix += 1
            else:
                break

        return jaro + prefix * 0.1 * (1 - jaro)

    @staticmethod
    def _lcs_ratio(s1: str, s2: str) -> float:
        if not s1 or not s2:
            return 0.0
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        return dp[m][n] / max(m, n)

    def _homoglyph_score(self, domain: str, brand: str) -> float:
        if not brand:
            return 0.0
        # Normalize domain by replacing homoglyphs with ASCII
        normalized = ''
        for c in domain:
            normalized += self._reverse_homoglyphs.get(c, c)

        # Check if normalized domain matches brand better
        orig_dist = self._levenshtein_distance(domain, brand)
        norm_dist = self._levenshtein_distance(normalized, brand)

        if norm_dist < orig_dist:
            return min(1.0, (orig_dist - norm_dist) / max(len(brand), 1) * 2)
        return 0.0

    @staticmethod
    def _digit_substitution_count(domain: str, brand: str) -> int:
        count = 0
        for digit, letter in DIGIT_SUBSTITUTIONS.items():
            if digit in domain and letter in brand:
                count += 1
        return count

    @staticmethod
    def _mixed_script_score(text: str) -> float:
        scripts = set()
        for c in text:
            cp = ord(c)
            if 0x0000 <= cp <= 0x007F:
                scripts.add('latin')
            elif 0x0400 <= cp <= 0x04FF:
                scripts.add('cyrillic')
            elif 0x0370 <= cp <= 0x03FF:
                scripts.add('greek')
            elif 0x0600 <= cp <= 0x06FF:
                scripts.add('arabic')
            elif 0x4E00 <= cp <= 0x9FFF:
                scripts.add('cjk')
        return min(1.0, max(0, len(scripts) - 1) * 0.5)

    def _visual_similarity(self, domain: str, brand: str) -> float:
        """Score how visually similar the domain looks to the brand."""
        if not brand or not domain:
            return 0.0

        # Normalize homoglyphs
        normalized = ''
        for c in domain:
            normalized += self._reverse_homoglyphs.get(c, c)

        # Also handle digit substitutions
        desubbed = normalized
        for digit, letter in DIGIT_SUBSTITUTIONS.items():
            desubbed = desubbed.replace(digit, letter)

        # Compute similarity after normalization
        jw = self._jaro_winkler(desubbed, brand)
        lcs = self._lcs_ratio(desubbed, brand)
        return (jw * 0.6 + lcs * 0.4)

    @staticmethod
    def _random_looking_score(s: str) -> float:
        """Heuristic for how random/generated a string looks."""
        if len(s) < 4:
            return 0.0
        # Check for consonant clusters
        consonants = 'bcdfghjklmnpqrstvwxyz'
        max_cons_run = 0
        curr_run = 0
        for c in s:
            if c in consonants:
                curr_run += 1
                max_cons_run = max(max_cons_run, curr_run)
            else:
                curr_run = 0

        # High entropy + long consonant runs = random-looking
        entropy = FeatureExtractor._shannon_entropy(s)
        randomness = 0.0
        if max_cons_run >= 4:
            randomness += 0.3
        if entropy > 3.5:
            randomness += 0.3
        if len(set(s)) / len(s) > 0.8:
            randomness += 0.2
        if not any(c in 'aeiou' for c in s[:4]):
            randomness += 0.2
        return min(1.0, randomness)


# ============================================================================
# Dataset Generator
# ============================================================================

class ThreatDatasetGenerator:
    """Generate synthetic training data for brand impersonation detection."""

    def __init__(self, brands: List[str] = None, seed: int = 42):
        self.brands = brands or KNOWN_BRANDS
        self.rng = random.Random(seed)
        self.np_rng = np.random.RandomState(seed)

    def generate(self, n_samples: int = 20000) -> Tuple[List[Dict], List[str], List[int]]:
        """Generate labeled dataset: domains + features + labels."""
        samples = []
        # Roughly 50/50 split legit vs threats
        n_legit = n_samples // 2
        n_threat = n_samples - n_legit

        # Generate legitimate samples
        for _ in range(n_legit):
            brand = self.rng.choice(self.brands)
            domain = self._generate_legitimate(brand)
            samples.append({
                'domain': domain,
                'brand': brand,
                'label': 0,
                'threat_type': ThreatType.LEGITIMATE.value,
            })

        # Generate threats with various techniques
        techniques = [
            (self._generate_typosquat, ThreatType.TYPOSQUATTING, 0.30),
            (self._generate_combosquat, ThreatType.COMBOSQUATTING, 0.25),
            (self._generate_homoglyph, ThreatType.HOMOGLYPH, 0.15),
            (self._generate_phishing_keyword, ThreatType.PHISHING_KEYWORD, 0.15),
            (self._generate_suspicious_tld, ThreatType.SUSPICIOUS_TLD, 0.10),
            (self._generate_brand_abuse, ThreatType.BRAND_ABUSE, 0.05),
        ]

        for _ in range(n_threat):
            brand = self.rng.choice(self.brands)
            # Select technique by weight
            r = self.rng.random()
            cumulative = 0.0
            gen_func = techniques[0][0]
            threat_type = techniques[0][1]
            for func, ttype, weight in techniques:
                cumulative += weight
                if r <= cumulative:
                    gen_func = func
                    threat_type = ttype
                    break

            domain = gen_func(brand)
            samples.append({
                'domain': domain,
                'brand': brand,
                'label': 1,
                'threat_type': threat_type.value,
            })

        self.rng.shuffle(samples)
        return samples

    def _generate_legitimate(self, brand: str) -> str:
        """Generate a legitimate-looking domain."""
        strategies = [
            lambda b: f"{b}.com",
            lambda b: f"{b}.{self.rng.choice(LEGITIMATE_TLDS)}",
            lambda b: f"{b}-{self.rng.choice(['app', 'io', 'dev', 'cloud', 'api', 'cdn', 'web', 'go'])}.com",
            lambda b: f"www.{b}.com",
            lambda b: f"{b}.{self.rng.choice(['co.uk', 'com.au', 'co.jp'])}",
            lambda b: f"my{b}.com",
            lambda b: f"{b}hq.com",
            lambda b: f"get{b}.com",
            lambda b: f"{b}{''.join(self.rng.choices(string.ascii_lowercase, k=2))}.com",
        ]
        return self.rng.choice(strategies)(brand)

    def _generate_typosquat(self, brand: str) -> str:
        """Generate typosquatting domain variants."""
        tld = self.rng.choice(['com', 'net', 'org', 'co'] + list(SUSPICIOUS_TLDS.keys())[:5])
        variant = brand

        technique = self.rng.choice([
            'omission', 'repetition', 'swap', 'insertion',
            'substitution', 'keyboard_adjacent'
        ])

        if technique == 'omission' and len(variant) > 3:
            idx = self.rng.randint(1, len(variant) - 1)
            variant = variant[:idx] + variant[idx+1:]
        elif technique == 'repetition':
            idx = self.rng.randint(0, len(variant) - 1)
            variant = variant[:idx] + variant[idx] + variant[idx:]
        elif technique == 'swap' and len(variant) > 2:
            idx = self.rng.randint(0, len(variant) - 2)
            chars = list(variant)
            chars[idx], chars[idx+1] = chars[idx+1], chars[idx]
            variant = ''.join(chars)
        elif technique == 'insertion':
            idx = self.rng.randint(1, len(variant))
            c = self.rng.choice(string.ascii_lowercase)
            variant = variant[:idx] + c + variant[idx:]
        elif technique == 'substitution':
            idx = self.rng.randint(0, len(variant) - 1)
            c = self.rng.choice(string.ascii_lowercase)
            while c == variant[idx]:
                c = self.rng.choice(string.ascii_lowercase)
            variant = variant[:idx] + c + variant[idx+1:]
        elif technique == 'keyboard_adjacent':
            idx = self.rng.randint(0, len(variant) - 1)
            if variant[idx] in KEYBOARD_ADJACENCY:
                adj = KEYBOARD_ADJACENCY[variant[idx]]
                replacement = self.rng.choice(adj)
                variant = variant[:idx] + replacement + variant[idx+1:]

        return f"{variant}.{tld}"

    def _generate_combosquat(self, brand: str) -> str:
        """Generate combosquatting domains (brand + keyword)."""
        tld = self.rng.choice(list(SUSPICIOUS_TLDS.keys())[:10] + ['com', 'net', 'org'])
        keyword = self.rng.choice(PHISHING_KEYWORDS[:20])
        separator = self.rng.choice(['-', '', '.'])

        patterns = [
            f"{brand}{separator}{keyword}",
            f"{keyword}{separator}{brand}",
            f"{brand}{separator}{keyword}{separator}{''.join(self.rng.choices(string.digits, k=2))}",
            f"my{brand}{separator}{keyword}",
            f"{brand}{separator}{keyword}{separator}online",
        ]
        sld = self.rng.choice(patterns)
        # Clean dots from SLD
        sld = sld.replace('.', '-')
        return f"{sld}.{tld}"

    def _generate_homoglyph(self, brand: str) -> str:
        """Generate domains with visually similar Unicode characters."""
        tld = self.rng.choice(['com', 'net'] + list(SUSPICIOUS_TLDS.keys())[:5])
        chars = list(brand)
        # Replace 1-3 characters with homoglyphs
        n_replacements = self.rng.randint(1, min(3, len(chars)))
        replaceable = [i for i, c in enumerate(chars) if c in HOMOGLYPH_MAP]

        if replaceable:
            indices = self.rng.sample(replaceable, min(n_replacements, len(replaceable)))
            for idx in indices:
                chars[idx] = self.rng.choice(HOMOGLYPH_MAP[chars[idx]])

        return f"{''.join(chars)}.{tld}"

    def _generate_phishing_keyword(self, brand: str) -> str:
        """Generate domains with brand + phishing keywords."""
        tld = self.rng.choice(list(SUSPICIOUS_TLDS.keys())[:15])
        keywords = self.rng.sample(PHISHING_KEYWORDS, k=self.rng.randint(1, 3))
        parts = [brand] + keywords
        self.rng.shuffle(parts)
        return f"{'-'.join(parts)}.{tld}"

    def _generate_suspicious_tld(self, brand: str) -> str:
        """Generate brand domains on suspicious TLDs."""
        tld = self.rng.choice(list(SUSPICIOUS_TLDS.keys()))
        modifications = [
            brand,
            brand + str(self.rng.randint(1, 99)),
            brand + self.rng.choice(['official', 'real', 'genuine', 'original', 'team']),
        ]
        return f"{self.rng.choice(modifications)}.{tld}"

    def _generate_brand_abuse(self, brand: str) -> str:
        """Generate various brand abuse patterns."""
        tld = self.rng.choice(list(SUSPICIOUS_TLDS.keys())[:8] + ['com', 'net'])
        patterns = [
            f"{brand}-{''.join(self.rng.choices(string.ascii_lowercase + string.digits, k=6))}",
            f"{''.join(self.rng.choices(string.ascii_lowercase, k=4))}-{brand}",
            f"{brand}{''.join(self.rng.choices(string.digits, k=4))}",
            f"the-real-{brand}",
            f"{brand}-{''.join(self.rng.choices(string.ascii_lowercase, k=3))}-official",
        ]
        return f"{self.rng.choice(patterns)}.{tld}"


# ============================================================================
# Model Training & Evaluation
# ============================================================================

class ThreatDetectionPipeline:
    """Complete ML pipeline for threat detection."""

    def __init__(self, model_dir: str = "models/poc"):
        self.model_dir = model_dir
        self.feature_extractor = FeatureExtractor()
        self.scaler = StandardScaler()
        self.classifier = None
        self.anomaly_detector = None
        self.is_trained = False
        self.training_stats = {}

    def prepare_data(self, samples: List[Dict]) -> Tuple[np.ndarray, np.ndarray, List[Dict]]:
        """Extract features from raw samples."""
        print(f"\n{'='*60}")
        print(f"📊 Feature Extraction")
        print(f"{'='*60}")

        X_list = []
        y_list = []
        valid_samples = []

        start = time.time()
        for i, sample in enumerate(samples):
            try:
                features = self.feature_extractor.extract(sample['domain'], sample['brand'])
                if not np.any(np.isnan(features)):
                    X_list.append(features)
                    y_list.append(sample['label'])
                    valid_samples.append(sample)
            except Exception as e:
                continue

            if (i + 1) % 5000 == 0:
                elapsed = time.time() - start
                print(f"  Processed {i+1}/{len(samples)} samples ({elapsed:.1f}s)")

        X = np.array(X_list)
        y = np.array(y_list)

        elapsed = time.time() - start
        print(f"  ✅ Extracted {len(FeatureExtractor.FEATURE_NAMES)} features from {len(X)} samples in {elapsed:.1f}s")
        print(f"  Label distribution: {Counter(y)}")

        return X, y, valid_samples

    def train(self, X: np.ndarray, y: np.ndarray, test_size: float = 0.2):
        """Train the ensemble classifier and anomaly detector."""
        print(f"\n{'='*60}")
        print(f"🏋️ Model Training")
        print(f"{'='*60}")

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        print(f"  Training set: {len(X_train)} samples")
        print(f"  Test set:     {len(X_test)} samples")

        # --- Train Random Forest ---
        print(f"\n  🌲 Training Random Forest...")
        rf_start = time.time()
        rf = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features='sqrt',
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
        )
        rf.fit(X_train_scaled, y_train)
        rf_time = time.time() - rf_start
        rf_acc = rf.score(X_test_scaled, y_test)
        print(f"     Accuracy: {rf_acc:.4f} ({rf_time:.1f}s)")

        # --- Train Gradient Boosting ---
        print(f"\n  🚀 Training Gradient Boosting...")
        gb_start = time.time()
        gb = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=8,
            learning_rate=0.1,
            subsample=0.8,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42,
        )
        gb.fit(X_train_scaled, y_train)
        gb_time = time.time() - gb_start
        gb_acc = gb.score(X_test_scaled, y_test)
        print(f"     Accuracy: {gb_acc:.4f} ({gb_time:.1f}s)")

        # --- Create calibrated voting ensemble ---
        print(f"\n  🎯 Building Voting Ensemble...")
        self.classifier = VotingClassifier(
            estimators=[('rf', rf), ('gb', gb)],
            voting='soft',
            weights=[0.55, 0.45],
        )
        # VotingClassifier needs to be fit
        self.classifier.fit(X_train_scaled, y_train)
        ensemble_acc = self.classifier.score(X_test_scaled, y_test)
        print(f"     Ensemble Accuracy: {ensemble_acc:.4f}")

        # --- Train Isolation Forest for anomaly detection ---
        print(f"\n  🔍 Training Isolation Forest (anomaly detection)...")
        iso_start = time.time()
        # Train only on legitimate samples
        X_legit = X_train_scaled[y_train == 0]
        self.anomaly_detector = IsolationForest(
            n_estimators=200,
            contamination=0.1,
            max_features=0.8,
            random_state=42,
            n_jobs=-1,
        )
        self.anomaly_detector.fit(X_legit)
        iso_time = time.time() - iso_start
        print(f"     Trained on {len(X_legit)} legitimate samples ({iso_time:.1f}s)")

        # --- Cross-validation ---
        print(f"\n  📈 Cross-validation (5-fold)...")
        cv_scores = cross_val_score(rf, X_train_scaled, y_train, cv=5, scoring='f1')
        print(f"     F1 scores: {[f'{s:.4f}' for s in cv_scores]}")
        print(f"     Mean F1: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

        # --- Evaluation ---
        self._evaluate(X_test_scaled, y_test)

        # --- Feature importance ---
        self._print_feature_importance(rf)

        # Store stats
        self.training_stats = {
            'rf_accuracy': rf_acc,
            'gb_accuracy': gb_acc,
            'ensemble_accuracy': ensemble_acc,
            'cv_f1_mean': cv_scores.mean(),
            'cv_f1_std': cv_scores.std(),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'n_features': X_train.shape[1],
        }

        self.is_trained = True
        return X_test_scaled, y_test

    def _evaluate(self, X_test: np.ndarray, y_test: np.ndarray):
        """Comprehensive evaluation."""
        print(f"\n{'='*60}")
        print(f"📋 Evaluation Results")
        print(f"{'='*60}")

        y_pred = self.classifier.predict(X_test)
        y_proba = self.classifier.predict_proba(X_test)[:, 1]

        # Classification report
        print(f"\n  Classification Report:")
        report = classification_report(y_test, y_pred, target_names=['Legitimate', 'Threat'])
        for line in report.split('\n'):
            print(f"    {line}")

        # AUC-ROC
        auc = roc_auc_score(y_test, y_proba)
        print(f"\n  AUC-ROC: {auc:.4f}")

        # Average Precision
        avg_prec = average_precision_score(y_test, y_proba)
        print(f"  Average Precision: {avg_prec:.4f}")

        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        print(f"\n  Confusion Matrix:")
        print(f"    {'':>15} Pred Legit  Pred Threat")
        print(f"    {'Actual Legit':>15}  {cm[0][0]:>7}     {cm[0][1]:>7}")
        print(f"    {'Actual Threat':>15}  {cm[1][0]:>7}     {cm[1][1]:>7}")

        # Anomaly detection evaluation
        anomaly_scores = self.anomaly_detector.decision_function(X_test)
        anomaly_preds = self.anomaly_detector.predict(X_test)
        # IsolationForest: -1 = anomaly, 1 = normal
        anomaly_labels = (anomaly_preds == -1).astype(int)
        anomaly_acc = accuracy_score(y_test, anomaly_labels)
        print(f"\n  Isolation Forest Accuracy: {anomaly_acc:.4f}")

        self.training_stats['auc_roc'] = auc
        self.training_stats['avg_precision'] = avg_prec
        self.training_stats['confusion_matrix'] = cm.tolist()

        # Generate plots if matplotlib available
        if HAS_PLOTS:
            self._generate_plots(y_test, y_proba, y_pred, cm)

    def _print_feature_importance(self, model):
        """Print top feature importances."""
        print(f"\n  🔑 Top 15 Feature Importances:")
        importances = model.feature_importances_
        feature_names = FeatureExtractor.FEATURE_NAMES
        sorted_idx = np.argsort(importances)[::-1]

        for rank, idx in enumerate(sorted_idx[:15], 1):
            bar = '█' * int(importances[idx] * 100)
            print(f"    {rank:>2}. {feature_names[idx]:<32} {importances[idx]:.4f}  {bar}")

    def _generate_plots(self, y_test, y_proba, y_pred, cm):
        """Generate evaluation plots."""
        plot_dir = os.path.join(self.model_dir, 'plots')
        os.makedirs(plot_dir, exist_ok=True)

        try:
            # ROC Curve
            fpr, tpr, _ = roc_curve(y_test, y_proba)
            auc = roc_auc_score(y_test, y_proba)

            fig, axes = plt.subplots(2, 2, figsize=(14, 12))
            fig.suptitle('DoppelDown ML Threat Detection - Model Evaluation', fontsize=14, fontweight='bold')

            # Plot 1: ROC Curve
            axes[0, 0].plot(fpr, tpr, 'b-', linewidth=2, label=f'AUC = {auc:.4f}')
            axes[0, 0].plot([0, 1], [0, 1], 'k--', alpha=0.3)
            axes[0, 0].set_xlabel('False Positive Rate')
            axes[0, 0].set_ylabel('True Positive Rate')
            axes[0, 0].set_title('ROC Curve')
            axes[0, 0].legend()
            axes[0, 0].grid(True, alpha=0.3)

            # Plot 2: Precision-Recall Curve
            precision, recall, _ = precision_recall_curve(y_test, y_proba)
            avg_prec = average_precision_score(y_test, y_proba)
            axes[0, 1].plot(recall, precision, 'r-', linewidth=2, label=f'AP = {avg_prec:.4f}')
            axes[0, 1].set_xlabel('Recall')
            axes[0, 1].set_ylabel('Precision')
            axes[0, 1].set_title('Precision-Recall Curve')
            axes[0, 1].legend()
            axes[0, 1].grid(True, alpha=0.3)

            # Plot 3: Confusion Matrix
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                        xticklabels=['Legitimate', 'Threat'],
                        yticklabels=['Legitimate', 'Threat'],
                        ax=axes[1, 0])
            axes[1, 0].set_xlabel('Predicted')
            axes[1, 0].set_ylabel('Actual')
            axes[1, 0].set_title('Confusion Matrix')

            # Plot 4: Score Distribution
            legit_scores = y_proba[y_test == 0]
            threat_scores = y_proba[y_test == 1]
            axes[1, 1].hist(legit_scores, bins=50, alpha=0.6, label='Legitimate', color='green')
            axes[1, 1].hist(threat_scores, bins=50, alpha=0.6, label='Threats', color='red')
            axes[1, 1].axvline(x=0.5, color='black', linestyle='--', alpha=0.5, label='Threshold (0.5)')
            axes[1, 1].set_xlabel('Threat Probability')
            axes[1, 1].set_ylabel('Count')
            axes[1, 1].set_title('Score Distribution')
            axes[1, 1].legend()
            axes[1, 1].grid(True, alpha=0.3)

            plt.tight_layout()
            plot_path = os.path.join(plot_dir, 'evaluation.png')
            plt.savefig(plot_path, dpi=150, bbox_inches='tight')
            plt.close()
            print(f"\n  📊 Plots saved to {plot_path}")

            # Feature importance plot
            fig, ax = plt.subplots(figsize=(12, 8))
            rf = self.classifier.estimators_[0]
            importances = rf.feature_importances_
            sorted_idx = np.argsort(importances)
            feature_names = FeatureExtractor.FEATURE_NAMES

            colors = plt.cm.RdYlGn_r(importances[sorted_idx] / importances.max())
            ax.barh([feature_names[i] for i in sorted_idx], importances[sorted_idx], color=colors)
            ax.set_xlabel('Feature Importance')
            ax.set_title('DoppelDown Feature Importance (Random Forest)')
            ax.grid(True, alpha=0.3, axis='x')

            plt.tight_layout()
            fi_path = os.path.join(plot_dir, 'feature_importance.png')
            plt.savefig(fi_path, dpi=150, bbox_inches='tight')
            plt.close()
            print(f"  📊 Feature importance plot saved to {fi_path}")

        except Exception as e:
            print(f"  ⚠️  Plot generation failed: {e}")

    def save(self):
        """Save trained models to disk."""
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.classifier, os.path.join(self.model_dir, 'classifier.joblib'))
        joblib.dump(self.anomaly_detector, os.path.join(self.model_dir, 'anomaly_detector.joblib'))
        joblib.dump(self.scaler, os.path.join(self.model_dir, 'scaler.joblib'))

        with open(os.path.join(self.model_dir, 'training_stats.json'), 'w') as f:
            json.dump(self.training_stats, f, indent=2)

        with open(os.path.join(self.model_dir, 'feature_names.json'), 'w') as f:
            json.dump(FeatureExtractor.FEATURE_NAMES, f, indent=2)

        print(f"\n  💾 Models saved to {self.model_dir}/")

    def load(self):
        """Load trained models from disk."""
        self.classifier = joblib.load(os.path.join(self.model_dir, 'classifier.joblib'))
        self.anomaly_detector = joblib.load(os.path.join(self.model_dir, 'anomaly_detector.joblib'))
        self.scaler = joblib.load(os.path.join(self.model_dir, 'scaler.joblib'))

        stats_path = os.path.join(self.model_dir, 'training_stats.json')
        if os.path.exists(stats_path):
            with open(stats_path) as f:
                self.training_stats = json.load(f)

        self.is_trained = True
        print(f"  ✅ Models loaded from {self.model_dir}/")


# ============================================================================
# Real-time Threat Scorer
# ============================================================================

class ThreatScorer:
    """Production-ready threat scoring engine."""

    def __init__(self, pipeline: ThreatDetectionPipeline):
        self.pipeline = pipeline
        self.fe = pipeline.feature_extractor

    def score_domain(self, domain: str, brand_name: str) -> ThreatScore:
        """Score a single domain for threat probability."""
        start = time.time()

        # Extract features
        features = self.fe.extract(domain, brand_name)
        features_scaled = self.pipeline.scaler.transform(features.reshape(1, -1))

        # Get classifier probability
        proba = self.pipeline.classifier.predict_proba(features_scaled)[0]
        threat_prob = float(proba[1])

        # Get anomaly score
        anomaly_score = float(self.pipeline.anomaly_detector.decision_function(features_scaled)[0])
        # Normalize anomaly score to [0, 1] range (more negative = more anomalous)
        anomaly_normalized = 1.0 / (1.0 + np.exp(anomaly_score * 3))  # sigmoid transform

        # Combined score (weighted)
        combined_score = 0.7 * threat_prob + 0.3 * anomaly_normalized

        # Detect techniques
        techniques = self._detect_techniques(domain, brand_name, features)

        # Determine risk level
        risk_level = self._risk_level(combined_score)

        # Compute confidence
        confidence = self._confidence(threat_prob, anomaly_normalized, techniques)

        # Get feature importance for this prediction
        feature_importance = self._local_feature_importance(features_scaled)

        # Generate recommendations
        recommendations = self._recommendations(
            domain, brand_name, combined_score, risk_level, techniques
        )

        elapsed_ms = (time.time() - start) * 1000

        return ThreatScore(
            domain=domain,
            brand_name=brand_name,
            threat_score=round(combined_score, 4),
            risk_level=risk_level,
            is_threat=combined_score >= 0.5,
            confidence=round(confidence, 4),
            detected_techniques=techniques,
            feature_importance=feature_importance,
            recommendations=recommendations,
            processing_time_ms=round(elapsed_ms, 2),
        )

    def score_batch(self, domains: List[str], brand_name: str) -> List[ThreatScore]:
        """Score multiple domains."""
        return [self.score_domain(d, brand_name) for d in domains]

    def _detect_techniques(self, domain: str, brand: str, features: np.ndarray) -> List[str]:
        """Detect which impersonation techniques are used."""
        techniques = []
        domain_lower = domain.lower()
        brand_lower = brand.lower()
        parts = domain_lower.split('.')
        sld = parts[-2] if len(parts) > 1 else parts[0]
        tld = parts[-1] if len(parts) > 1 else ''

        # Typosquatting
        lev = self.fe._levenshtein_distance(sld, brand_lower)
        if 1 <= lev <= 3 and brand_lower not in sld:
            techniques.append("typosquatting")

        # Homoglyph
        if features[FeatureExtractor.FEATURE_NAMES.index('homoglyph_score')] > 0:
            techniques.append("homoglyph_attack")

        # Combosquatting
        if brand_lower in sld and sld != brand_lower:
            techniques.append("combosquatting")

        # Phishing keywords
        kw_count = features[FeatureExtractor.FEATURE_NAMES.index('phishing_keyword_count')]
        if kw_count > 0:
            found_kws = [kw for kw in PHISHING_KEYWORDS if kw in domain_lower]
            techniques.append(f"phishing_keywords({','.join(found_kws[:3])})")

        # Suspicious TLD
        tld_score = features[FeatureExtractor.FEATURE_NAMES.index('suspicious_tld_score')]
        if tld_score > 0.5:
            techniques.append(f"suspicious_tld(.{tld})")

        # Digit substitution
        digit_subs = features[FeatureExtractor.FEATURE_NAMES.index('digit_substitution_count')]
        if digit_subs > 0:
            techniques.append("digit_substitution")

        # Mixed script
        if features[FeatureExtractor.FEATURE_NAMES.index('mixed_script_score')] > 0:
            techniques.append("mixed_script")

        # Brand abuse (brand in domain with random chars)
        if brand_lower in sld:
            remaining = sld.replace(brand_lower, '').strip('-')
            if remaining and all(c in string.digits + string.ascii_lowercase + '-' for c in remaining):
                if len(remaining) >= 4 and features[FeatureExtractor.FEATURE_NAMES.index('random_looking_score')] > 0.3:
                    techniques.append("brand_abuse_with_random")

        return techniques if techniques else ["none_detected"]

    @staticmethod
    def _risk_level(score: float) -> str:
        if score >= 0.85:
            return RiskLevel.CRITICAL.value
        elif score >= 0.65:
            return RiskLevel.HIGH.value
        elif score >= 0.4:
            return RiskLevel.MEDIUM.value
        return RiskLevel.LOW.value

    @staticmethod
    def _confidence(threat_prob: float, anomaly_score: float, techniques: List[str]) -> float:
        """Calculate confidence in the prediction."""
        # High confidence when classifier and anomaly detector agree
        agreement = 1.0 - abs(threat_prob - anomaly_score)

        # More techniques = higher confidence for threats
        technique_bonus = min(0.2, len([t for t in techniques if t != 'none_detected']) * 0.05)

        # Extreme probabilities = higher confidence
        extremity = abs(threat_prob - 0.5) * 2

        confidence = 0.4 * agreement + 0.3 * extremity + 0.3 * (0.5 + technique_bonus)
        return min(1.0, max(0.0, confidence))

    def _local_feature_importance(self, features_scaled: np.ndarray) -> Dict[str, float]:
        """Get approximate feature importance for this specific prediction."""
        rf = self.pipeline.classifier.estimators_[0]
        importances = rf.feature_importances_
        feature_names = FeatureExtractor.FEATURE_NAMES

        # Weight global importance by feature magnitude
        magnitudes = np.abs(features_scaled[0])
        weighted = importances * magnitudes
        weighted = weighted / (weighted.sum() + 1e-10)

        # Return top 10
        top_idx = np.argsort(weighted)[::-1][:10]
        return {feature_names[i]: round(float(weighted[i]), 4) for i in top_idx}

    @staticmethod
    def _recommendations(domain: str, brand: str, score: float, risk: str, techniques: List[str]) -> List[str]:
        """Generate actionable recommendations."""
        recs = []

        if risk == RiskLevel.CRITICAL.value:
            recs.append("🚨 IMMEDIATE ACTION: High-confidence brand impersonation detected")
            recs.append("Initiate domain takedown process immediately")
            recs.append(f"Domain '{domain}' is impersonating '{brand}' with high confidence")
        elif risk == RiskLevel.HIGH.value:
            recs.append("⚠️ HIGH RISK: Likely brand impersonation")
            recs.append("Review domain and prepare takedown request")
            recs.append("Monitor for active phishing campaigns using this domain")
        elif risk == RiskLevel.MEDIUM.value:
            recs.append("📋 MONITOR: Possible brand impersonation")
            recs.append("Add to watchlist for continued monitoring")
        else:
            recs.append("✅ LOW RISK: No significant threat indicators")

        # Technique-specific recommendations
        for tech in techniques:
            if 'homoglyph' in tech:
                recs.append("Domain uses visually deceptive Unicode characters (homoglyph attack)")
            if 'typosquatting' in tech:
                recs.append("Domain is a typo variant of the protected brand")
            if 'phishing_keywords' in tech:
                recs.append("Domain contains phishing-associated keywords")
            if 'suspicious_tld' in tech:
                recs.append("Domain uses a TLD commonly associated with abuse")
            if 'digit_substitution' in tech:
                recs.append("Domain uses number-for-letter substitution (e.g., 0 for o)")

        return recs


# ============================================================================
# Interactive Demo
# ============================================================================

def run_demo():
    """Run the complete pipeline demonstration."""

    print("""
╔══════════════════════════════════════════════════════════════════╗
║        DoppelDown ML Threat Detection - PoC Pipeline           ║
║                                                                ║
║  Brand Impersonation • Phishing Detection • Domain Risk        ║
╚══════════════════════════════════════════════════════════════════╝
    """)

    # Step 1: Generate Data
    print(f"{'='*60}")
    print(f"📦 Step 1: Generating Synthetic Training Data")
    print(f"{'='*60}")

    gen = ThreatDatasetGenerator(seed=42)
    n_samples = 25000
    print(f"  Generating {n_samples} samples across {len(KNOWN_BRANDS)} brands...")
    samples = gen.generate(n_samples)

    # Show sample distribution
    threat_types = Counter(s['threat_type'] for s in samples)
    print(f"\n  Dataset distribution:")
    for ttype, count in sorted(threat_types.items(), key=lambda x: -x[1]):
        bar = '█' * (count // 100)
        print(f"    {ttype:<20} {count:>5} ({count/len(samples)*100:.1f}%)  {bar}")

    # Show examples
    print(f"\n  Sample threats:")
    threats = [s for s in samples if s['label'] == 1]
    for s in random.sample(threats, min(8, len(threats))):
        print(f"    {s['domain']:<40} (brand: {s['brand']}, type: {s['threat_type']})")

    # Step 2: Feature Extraction & Training
    pipeline = ThreatDetectionPipeline(model_dir="models/poc")
    X, y, valid_samples = pipeline.prepare_data(samples)

    # Step 3: Train
    X_test, y_test = pipeline.train(X, y)

    # Step 4: Save models
    pipeline.save()

    # Step 5: Real-time Scoring Demo
    print(f"\n{'='*60}")
    print(f"🎯 Step 5: Real-Time Threat Scoring Demo")
    print(f"{'='*60}")

    scorer = ThreatScorer(pipeline)

    test_cases = [
        # (domain, brand, expected_threat)
        ("google.com", "google", False),
        ("g00gle-login.tk", "google", True),
        ("gogle.com", "google", True),
        ("google-security-verify.xyz", "google", True),
        ("apple.com", "apple", False),
        ("аpple.com", "apple", True),  # Cyrillic 'а'
        ("apple-id-verify.cf", "apple", True),
        ("paypal-secure-login.ml", "paypal", True),
        ("paypal.com", "paypal", False),
        ("netfl1x-account.tk", "netflix", True),
        ("amazon-prize-winner.ga", "amazon", True),
        ("amazon.com", "amazon", False),
        ("microsoftt.com", "microsoft", True),
        ("microsoft-support-helpdesk.click", "microsoft", True),
        ("facebook.com", "facebook", False),
        ("facebbok-login.xyz", "facebook", True),
        ("stripe.com", "stripe", False),
        ("str1pe-payment-verify.top", "stripe", True),
        ("github.com", "github", False),
        ("github-security-alert.ga", "github", True),
    ]

    print(f"\n  {'Domain':<45} {'Brand':<12} {'Score':>6} {'Risk':<9} {'Threat':>6}  Techniques")
    print(f"  {'─'*120}")

    for domain, brand, expected in test_cases:
        result = scorer.score_domain(domain, brand)
        correct = "✅" if result.is_threat == expected else "❌"
        risk_color = {
            'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'
        }.get(result.risk_level, '⚪')

        techniques_str = ', '.join(result.detected_techniques[:2])
        print(f"  {correct} {domain:<43} {brand:<12} {result.threat_score:>5.3f} {risk_color}{result.risk_level:<8} "
              f"{'YES' if result.is_threat else 'no ':>5}  {techniques_str}")

    # Step 6: Detailed Analysis of a specific threat
    print(f"\n{'='*60}")
    print(f"🔬 Step 6: Detailed Threat Analysis")
    print(f"{'='*60}")

    detailed = scorer.score_domain("g00gle-secure-login.tk", "google")
    print(f"\n  Domain:      {detailed.domain}")
    print(f"  Brand:       {detailed.brand_name}")
    print(f"  Threat Score: {detailed.threat_score:.4f}")
    print(f"  Risk Level:  {detailed.risk_level.upper()}")
    print(f"  Is Threat:   {detailed.is_threat}")
    print(f"  Confidence:  {detailed.confidence:.4f}")
    print(f"  Latency:     {detailed.processing_time_ms:.2f}ms")
    print(f"\n  Detected Techniques:")
    for tech in detailed.detected_techniques:
        print(f"    • {tech}")
    print(f"\n  Feature Importance (this prediction):")
    for feat, imp in list(detailed.feature_importance.items())[:8]:
        bar = '█' * int(imp * 200)
        print(f"    {feat:<32} {imp:.4f}  {bar}")
    print(f"\n  Recommendations:")
    for rec in detailed.recommendations:
        print(f"    {rec}")

    # Step 7: Batch Processing Demo
    print(f"\n{'='*60}")
    print(f"⚡ Step 7: Batch Processing Performance")
    print(f"{'='*60}")

    # Generate a batch of test domains
    batch_domains = [
        f"{brand}{suffix}.{tld}"
        for brand in ['google', 'apple', 'amazon', 'paypal']
        for suffix in ['-login', '-verify', '', '-secure', '-support', '123', '-official', '-team']
        for tld in ['com', 'tk', 'xyz', 'ml']
    ]

    start = time.time()
    batch_results = scorer.score_batch(batch_domains, "google")
    elapsed = time.time() - start

    threats_found = sum(1 for r in batch_results if r.is_threat)
    critical = sum(1 for r in batch_results if r.risk_level == 'critical')

    print(f"\n  Scored {len(batch_domains)} domains in {elapsed:.2f}s ({elapsed/len(batch_domains)*1000:.1f}ms per domain)")
    print(f"  Threats found: {threats_found}/{len(batch_domains)} ({threats_found/len(batch_domains)*100:.1f}%)")
    print(f"  Critical: {critical}")
    print(f"  Risk distribution:")
    risk_dist = Counter(r.risk_level for r in batch_results)
    for risk, count in sorted(risk_dist.items()):
        print(f"    {risk:<10} {count:>4}")

    # Step 8: Export results
    print(f"\n{'='*60}")
    print(f"💾 Step 8: Export Results")
    print(f"{'='*60}")

    results_dir = os.path.join(pipeline.model_dir, 'results')
    os.makedirs(results_dir, exist_ok=True)

    # Export as JSON
    export_data = {
        'pipeline_version': '2.0.0-poc',
        'training_stats': pipeline.training_stats,
        'n_features': len(FeatureExtractor.FEATURE_NAMES),
        'feature_names': FeatureExtractor.FEATURE_NAMES,
        'sample_results': [r.to_dict() for r in batch_results[:20]],
    }

    export_path = os.path.join(results_dir, 'pipeline_results.json')
    with open(export_path, 'w') as f:
        json.dump(export_data, f, indent=2, default=str)
    print(f"  Results exported to {export_path}")

    if HAS_PANDAS:
        df = pd.DataFrame([r.to_dict() for r in batch_results])
        csv_path = os.path.join(results_dir, 'batch_scores.csv')
        df.to_csv(csv_path, index=False)
        print(f"  CSV exported to {csv_path}")

    print(f"\n{'='*60}")
    print(f"✅ Pipeline Complete!")
    print(f"{'='*60}")
    print(f"\n  📁 Model artifacts: {pipeline.model_dir}/")
    print(f"  📊 Evaluation plots: {pipeline.model_dir}/plots/")
    print(f"  📋 Results: {results_dir}/")
    print(f"\n  Next steps:")
    print(f"    1. Review model performance in evaluation plots")
    print(f"    2. Integrate scorer into DoppelDown scan pipeline")
    print(f"    3. Train on real-world labeled data when available")
    print(f"    4. Deploy API server for production use")


# ============================================================================
# CLI Entry Point
# ============================================================================

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='DoppelDown ML Threat Detection PoC')
    parser.add_argument('--train', action='store_true', help='Train and save models')
    parser.add_argument('--eval', action='store_true', help='Evaluate saved models')
    parser.add_argument('--score', action='store_true', help='Score example domains')
    parser.add_argument('--n-samples', type=int, default=25000, help='Number of training samples')
    parser.add_argument('--model-dir', type=str, default='models/poc', help='Model directory')
    args = parser.parse_args()

    if args.train:
        gen = ThreatDatasetGenerator(seed=42)
        samples = gen.generate(args.n_samples)
        pipeline = ThreatDetectionPipeline(model_dir=args.model_dir)
        X, y, valid = pipeline.prepare_data(samples)
        pipeline.train(X, y)
        pipeline.save()
    elif args.eval:
        pipeline = ThreatDetectionPipeline(model_dir=args.model_dir)
        pipeline.load()
        # Quick eval
        gen = ThreatDatasetGenerator(seed=99)
        samples = gen.generate(5000)
        X, y, _ = pipeline.prepare_data(samples)
        X_scaled = pipeline.scaler.transform(X)
        pipeline._evaluate(X_scaled, y)
    elif args.score:
        pipeline = ThreatDetectionPipeline(model_dir=args.model_dir)
        pipeline.load()
        scorer = ThreatScorer(pipeline)

        domains = [
            ("g00gle-login.tk", "google"),
            ("apple.com", "apple"),
            ("paypal-verify.ml", "paypal"),
            ("amazon-prize.ga", "amazon"),
        ]
        for domain, brand in domains:
            result = scorer.score_domain(domain, brand)
            print(json.dumps(result.to_dict(), indent=2, default=str))
    else:
        run_demo()
