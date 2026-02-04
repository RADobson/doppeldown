#!/usr/bin/env python3
"""
DoppelDown ML Threat Detection - Lightweight Demo (NumPy Only)
==============================================================

A simplified demonstration of the ML threat detection pipeline using only NumPy.
This shows the core concepts without requiring scikit-learn installation.

For the full pipeline with trained models, see poc_threat_pipeline.py
"""

import numpy as np
import math
import random
import string
import time
from collections import Counter
from dataclasses import dataclass
from typing import List, Dict, Tuple

# Constants
KNOWN_BRANDS = [
    "google", "apple", "microsoft", "amazon", "facebook", "meta", "netflix",
    "paypal", "instagram", "twitter", "linkedin", "spotify", "uber", "airbnb",
    "dropbox", "slack", "zoom", "stripe", "shopify", "github", "coinbase"
]

SUSPICIOUS_TLDS = {'tk': 0.9, 'ml': 0.9, 'ga': 0.9, 'cf': 0.9, 'gq': 0.9,
                   'xyz': 0.7, 'top': 0.7, 'click': 0.8, 'loan': 0.8}

PHISHING_KEYWORDS = ['login', 'signin', 'verify', 'secure', 'security', 'password',
                     'account', 'confirm', 'update', 'wallet', 'payment', 'billing',
                     'support', 'helpdesk', 'official', 'alert', 'urgent']

HOMOGLYPH_MAP = {
    'a': ['а', 'ɑ', 'α'], 'o': ['о', 'ο', 'σ'], 'e': ['е', 'ε'],
    'p': ['р', 'ρ'], 'c': ['с', 'ϲ'], 'x': ['х'], 'y': ['у'],
    '0': ['О', 'о', 'Ο'], '1': ['l', 'I'],
}

DIGIT_SUBSTITUTIONS = {'0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b'}


@dataclass
class ThreatScore:
    domain: str
    brand_name: str
    threat_score: float
    risk_level: str
    is_threat: bool
    detected_techniques: List[str]
    processing_time_ms: float


class SimpleThreatDetector:
    """Lightweight rule-based threat detector using NumPy only."""

    def __init__(self):
        self._reverse_homoglyphs = {}
        for ascii_char, confusables in HOMOGLYPH_MAP.items():
            for c in confusables:
                self._reverse_homoglyphs[c] = ascii_char

    def score_domain(self, domain: str, brand_name: str) -> ThreatScore:
        """Score a domain for threat probability using heuristic rules."""
        start = time.time()
        domain_lower = domain.lower().strip()
        brand_lower = brand_name.lower().strip()
        parts = domain_lower.split('.')
        sld = parts[-2] if len(parts) > 1 else parts[0]
        tld = parts[-1] if len(parts) > 1 else ''

        scores = []
        techniques = []

        # 1. Brand similarity (Levenshtein normalized)
        lev_dist = self._levenshtein_distance(sld, brand_lower)
        lev_normalized = lev_dist / max(len(brand_lower), 1)
        if 0 < lev_normalized <= 0.3 and brand_lower not in sld:
            scores.append(0.7)
            techniques.append("typosquatting")
        elif brand_lower in sld and sld != brand_lower:
            scores.append(0.5)
            techniques.append("combosquatting")
        elif lev_normalized == 0:
            scores.append(0.0)

        # 2. Suspicious TLD
        tld_score = SUSPICIOUS_TLDS.get(tld, 0.0)
        if tld_score > 0.5:
            scores.append(tld_score)
            techniques.append(f"suspicious_tld(.{tld})")

        # 3. Phishing keywords
        kw_matches = [kw for kw in PHISHING_KEYWORDS if kw in domain_lower]
        if kw_matches:
            scores.append(min(0.8, len(kw_matches) * 0.3))
            techniques.append(f"phishing_keywords({','.join(kw_matches[:3])})")

        # 4. Digit substitution
        digit_subs = sum(1 for d, l in DIGIT_SUBSTITUTIONS.items() if d in sld and l in brand_lower)
        if digit_subs > 0:
            scores.append(min(0.6, digit_subs * 0.25))
            techniques.append("digit_substitution")

        # 5. Homoglyph detection
        homoglyph_score = self._detect_homoglyphs(sld, brand_lower)
        if homoglyph_score > 0:
            scores.append(homoglyph_score)
            techniques.append("homoglyph_attack")

        # 6. Excessive hyphens
        if sld.count('-') >= 3:
            scores.append(0.4)
            techniques.append("excessive_hyphens")

        # 7. Random-looking string
        if self._looks_random(sld.replace(brand_lower, '').replace('-', '')):
            scores.append(0.3)
            techniques.append("random_string")

        # Combine scores
        if scores:
            # Use max for strictness, but weight multiple signals
            base_score = max(scores)
            # Boost for multiple techniques
            technique_boost = min(0.15, (len(techniques) - 1) * 0.05)
            final_score = min(1.0, base_score + technique_boost)
        else:
            final_score = 0.1 if brand_lower in sld else 0.05

        # Determine risk level
        if final_score >= 0.8:
            risk = "critical"
        elif final_score >= 0.6:
            risk = "high"
        elif final_score >= 0.35:
            risk = "medium"
        else:
            risk = "low"

        elapsed_ms = (time.time() - start) * 1000

        return ThreatScore(
            domain=domain,
            brand_name=brand_name,
            threat_score=round(final_score, 3),
            risk_level=risk,
            is_threat=final_score >= 0.5,
            detected_techniques=techniques if techniques else ["none_detected"],
            processing_time_ms=round(elapsed_ms, 2)
        )

    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate edit distance between two strings."""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
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

    def _detect_homoglyphs(self, sld: str, brand: str) -> float:
        """Detect Unicode homoglyph attacks."""
        normalized = ''.join(self._reverse_homoglyphs.get(c, c) for c in sld)
        if normalized == sld:
            return 0.0
        # If normalized is closer to brand, it's likely a homoglyph attack
        orig_dist = self._levenshtein_distance(sld, brand)
        norm_dist = self._levenshtein_distance(normalized, brand)
        if norm_dist < orig_dist:
            return min(1.0, (orig_dist - norm_dist) * 0.5)
        return 0.0

    def _looks_random(self, s: str) -> bool:
        """Heuristic for random-looking strings."""
        if len(s) < 4:
            return False
        # High consonant ratio
        consonants = sum(c in 'bcdfghjklmnpqrstvwxyz' for c in s.lower())
        if consonants / len(s) > 0.8:
            return True
        # High unique character ratio
        if len(set(s)) / len(s) > 0.9:
            return True
        return False


def demo():
    """Run the lightweight threat detection demo."""
    print("""
╔══════════════════════════════════════════════════════════════════════╗
║     DoppelDown ML Threat Detection - Lightweight Demo              ║
║                                                                      ║
║  Brand Impersonation • Phishing • Domain Risk Assessment           ║
╚══════════════════════════════════════════════════════════════════════╝
    """)

    detector = SimpleThreatDetector()

    test_cases = [
        # (domain, brand, expected_threat)
        ("google.com", "google", False),
        ("g00gle-login.tk", "google", True),
        ("gogle.com", "google", True),
        ("google-security-verify.xyz", "google", True),
        ("apple.com", "apple", False),
        ("аpple.com", "apple", True),  # Cyrillic 'а'
        ("paypal.com", "paypal", False),
        ("paypal-secure-login.ml", "paypal", True),
        ("amazon.com", "amazon", False),
        ("amazon-prize-winner.ga", "amazon", True),
        ("microsoft.com", "microsoft", False),
        ("microsoftt-support.tk", "microsoft", True),
        ("facebook.com", "facebook", False),
        ("faceb00k-verify.xyz", "facebook", True),
        ("stripe.com", "stripe", False),
        ("str1pe-payment-verify.top", "stripe", True),
    ]

    print(f"  {'Domain':<40} {'Brand':<12} {'Score':>6} {'Risk':<9} {'Threat':>6}  Techniques")
    print(f"  {'─'*115}")

    correct = 0
    for domain, brand, expected in test_cases:
        result = detector.score_domain(domain, brand)
        correct += (result.is_threat == expected)

        risk_emoji = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}.get(result.risk_level, '⚪')
        correct_emoji = "✅" if result.is_threat == expected else "❌"

        techniques = ', '.join(result.detected_techniques[:2])
        print(f"  {correct_emoji} {domain:<38} {brand:<12} {result.threat_score:>5.2f} {risk_emoji}{result.risk_level:<8} "
              f"{'YES' if result.is_threat else 'no ':>5}  {techniques}")

    print(f"\n  Accuracy: {correct}/{len(test_cases)} ({correct/len(test_cases)*100:.1f}%)")
    print(f"  Average latency: {sum(r.processing_time_ms for r in [detector.score_domain(d, b) for d, b, _ in test_cases])/len(test_cases):.2f}ms")

    # Show detailed analysis
    print(f"\n{'='*70}")
    print("Detailed Analysis: g00gle-secure-login-verify.tk")
    print(f"{'='*70}")

    detailed = detector.score_domain("g00gle-secure-login-verify.tk", "google")
    print(f"\n  Domain:          {detailed.domain}")
    print(f"  Brand:           {detailed.brand_name}")
    print(f"  Threat Score:    {detailed.threat_score:.3f}")
    print(f"  Risk Level:      {detailed.risk_level.upper()}")
    print(f"  Is Threat:       {detailed.is_threat}")
    print(f"  Processing Time: {detailed.processing_time_ms:.2f}ms")
    print(f"\n  Detected Techniques:")
    for tech in detailed.detected_techniques:
        print(f"    • {tech}")

    print(f"\n{'='*70}")
    print("✅ Demo Complete!")
    print(f"{'='*70}")
    print("\nThis lightweight demo uses rule-based heuristics.")
    print("For ML-based detection with trained models, see poc_threat_pipeline.py")


if __name__ == '__main__':
    demo()
