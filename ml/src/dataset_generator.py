"""
Dataset generator for brand impersonation detection.
Creates synthetic datasets of known brand impersonation techniques.
"""

import json
import random
import string
from typing import List, Dict, Tuple
from dataclasses import dataclass, asdict
import numpy as np

@dataclass
class BrandImpersonationSample:
    """Single sample of brand impersonation data."""
    domain: str
    brand_name: str
    label: int  # 0 = legitimate, 1 = impersonation
    technique: str
    features: Dict
    
    def to_dict(self) -> Dict:
        return {
            'domain': self.domain,
            'brand_name': self.brand_name,
            'label': self.label,
            'technique': self.technique,
            'features': self.features
        }

class BrandImpersonationDataset:
    """Generator for brand impersonation training data."""
    
    # Known legitimate brands for training
    LEGITIMATE_BRANDS = [
        "apple", "microsoft", "google", "amazon", "facebook", "meta",
        "netflix", "paypal", "chase", "bankofamerica", "wellsfargo",
        "citibank", "americanexpress", "visa", "mastercard", "stripe",
        "shopify", "ebay", "walmart", "target", "costco", "nike",
        "adidas", "samsung", "sony", "lg", "tesla", "spacex",
        "twitter", "linkedin", "instagram", "snapchat", "tiktok",
        "uber", "lyft", "airbnb", "booking", "expedia", "delta",
        "united", "americanairlines", "southwest", "fedex", "ups",
        "dhl", "usps", "att", "verizon", "tmobile", "sprint",
        "comcast", "spectrum", "disney", "hulu", "hbo", "spotify",
        "dropbox", "slack", "zoom", "teams", "webex", "salesforce",
        "hubspot", "mailchimp", "zendesk", "intercom", "twilio"
    ]
    
    # Impersonation techniques
    TECHNIQUES = {
        'typosquatting': [
            'character_omission',      # gooogle.com
            'character_repetition',    # gooogle.com  
            'character_swap',          # goolge.com
            'character_insertion',     # googole.com
            'character_substitution',  # g00gle.com
            'homoglyph',              # gооgle.com (cyrillic о)
            'double_letter',          # gooogle.com
            'missing_dot',            # googlecom.com
            'wrong_tld',              # google.net
            'singular_plural',        # apples.com
        ],
        'combo_squatting': [
            'prefix_addition',        # secure-google.com
            'suffix_addition',        # google-login.com
            'hyphen_addition',        # google-support.com
            'brand_combo',           # google-apple.com
        ],
        'homograph': [
            'cyrillic',              # gооgle.com
            'greek',                 # gοοgle.com
            'latin_extended',        # góogle.com
        ],
        'bitsquatting': [
            'single_bit_flip',       # hoogle.com (g->h)
        ],
        'homophone': [
            'sound_alike',           # gogle.com (silent letter)
        ]
    }
    
    # Homoglyph mappings
    HOMOGLYPHS = {
        'a': ['а', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ɑ', 'ɒ'],
        'e': ['е', 'è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę'],
        'o': ['о', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō', 'ő'],
        'i': ['і', 'ì', 'í', 'î', 'ï', 'ī', 'į', 'ı', 'l', 'L', '1'],
        'l': ['і', '1', 'I', 'l'],
        'n': ['ո', 'ñ', 'ń', 'ň', 'ņ', 'ŋ'],
        'r': ['г', 'ṙ', 'ř', 'ŗ', 'ɍ'],
        's': ['ѕ', 'ś', 'š', 'ş', 'ŝ', 'ș', '5'],
        't': ['т', 'ť', 'ţ', 'ț', 'ŧ', '7'],
        'p': ['р', 'þ', 'ṕ', 'ṗ'],
        'c': ['с', 'ć', 'č', 'ç', 'ĉ', 'ċ'],
        'x': ['х', 'ẋ', 'ẍ'],
        'y': ['у', 'ý', 'ÿ', 'ŷ'],
        'm': ['м', 'ṃ', 'ɱ'],
        'g': ['ɡ', 'ģ', 'ğ', 'ǧ'],
        'd': ['ԁ', 'ḍ', 'ɗ', 'ď'],
        'b': ['Ь', 'ḃ', 'ḅ'],
        'u': ['υ', 'ù', 'ú', 'û', 'ü', 'ū', 'ű', 'ů'],
    }
    
    # Common phishing keywords
    PHISHING_KEYWORDS = [
        'login', 'signin', 'account', 'verify', 'verification',
        'secure', 'security', 'update', 'confirm', 'authentication',
        'password', 'credential', 'billing', 'payment', 'wallet',
        'support', 'help', 'service', 'admin', 'manage',
        'recovery', 'restore', 'unlock', 'validate', 'authenticate',
        'notification', 'alert', 'warning', 'suspended', 'limited'
    ]
    
    # Suspicious TLDs commonly used for phishing
    SUSPICIOUS_TLDS = ['tk', 'ml', 'ga', 'cf', 'top', 'xyz', 'click', 'link', 
                       'work', 'date', 'party', 'racing', 'win', 'bid']
    
    # Trusted TLDs
    TRUSTED_TLDS = ['com', 'org', 'net', 'edu', 'gov', 'co', 'io', 'app']
    
    def __init__(self, random_seed: int = 42):
        random.seed(random_seed)
        np.random.seed(random_seed)
    
    def generate_typosquatting(self, brand: str, technique: str) -> str:
        """Generate typosquatting variations."""
        if technique == 'character_omission' and len(brand) > 3:
            # Remove random character
            pos = random.randint(0, len(brand) - 1)
            return brand[:pos] + brand[pos+1:]
        
        elif technique == 'character_repetition':
            # Repeat random character
            pos = random.randint(0, len(brand) - 1)
            return brand[:pos+1] + brand[pos] + brand[pos+1:]
        
        elif technique == 'character_swap' and len(brand) > 1:
            # Swap adjacent characters
            pos = random.randint(0, len(brand) - 2)
            chars = list(brand)
            chars[pos], chars[pos+1] = chars[pos+1], chars[pos]
            return ''.join(chars)
        
        elif technique == 'character_insertion':
            # Insert random character
            pos = random.randint(0, len(brand))
            char = random.choice(string.ascii_lowercase)
            return brand[:pos] + char + brand[pos:]
        
        elif technique == 'character_substitution':
            # Substitute with similar looking character
            pos = random.randint(0, len(brand) - 1)
            char = brand[pos]
            if char in '0123456789':
                subs = {'0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', 
                        '7': 't', '8': 'b', '9': 'g'}
                if char in subs:
                    return brand[:pos] + subs[char] + brand[pos+1:]
            elif char.lower() in self.HOMOGLYPHS:
                return brand[:pos] + random.choice(self.HOMOGLYPHS[char.lower()]) + brand[pos+1:]
            return brand
        
        elif technique == 'homoglyph':
            # Replace with homoglyph
            for char in brand:
                if char.lower() in self.HOMOGLYPHS:
                    return brand.replace(char, random.choice(self.HOMOGLYPHS[char.lower()]), 1)
            return brand
        
        elif technique == 'double_letter':
            # Double a letter
            pos = random.randint(0, len(brand) - 1)
            return brand[:pos] + brand[pos] + brand[pos:]
        
        elif technique == 'missing_dot':
            # Create subdomain that looks like TLD
            return f"www{brand}.com"
        
        elif technique == 'wrong_tld':
            # Use different TLD
            tld = random.choice(self.SUSPICIOUS_TLDS + ['net', 'org', 'info'])
            return f"{brand}.{tld}"
        
        elif technique == 'singular_plural':
            # Add or remove 's'
            if brand.endswith('s'):
                return brand[:-1]
            else:
                return brand + 's'
        
        return brand
    
    def generate_combo_squatting(self, brand: str, technique: str) -> str:
        """Generate combo-squatting variations."""
        if technique == 'prefix_addition':
            prefix = random.choice(['secure', 'login', 'my', 'official', 'real', 
                                   'auth', 'verify', 'www', 'mail', 'account'])
            return f"{prefix}-{brand}"
        
        elif technique == 'suffix_addition':
            suffix = random.choice(self.PHISHING_KEYWORDS + ['online', 'official', 'app'])
            return f"{brand}-{suffix}"
        
        elif technique == 'hyphen_addition':
            # Insert hyphen in strategic place
            if len(brand) > 4:
                pos = random.randint(2, len(brand) - 2)
                return f"{brand[:pos]}-{brand[pos:]}"
            return f"{brand}-online"
        
        elif technique == 'brand_combo':
            other_brand = random.choice([b for b in self.LEGITIMATE_BRANDS if b != brand])
            return f"{brand}-{other_brand}"
        
        return brand
    
    def generate_bitsquatting(self, brand: str) -> str:
        """Generate bitsquatting variations (single bit flip)."""
        if not brand:
            return brand
        
        pos = random.randint(0, len(brand) - 1)
        char = brand[pos]
        
        # Single bit flip mappings (simplified)
        bit_flips = {
            'a': 'q', 'b': 'v', 'c': 'e', 'd': 's', 'e': 'r', 'f': 'd',
            'g': 'f', 'h': 'j', 'i': 'u', 'j': 'k', 'k': 'l', 'l': 'k',
            'm': 'n', 'n': 'm', 'o': 'i', 'p': 'o', 'q': 'w', 'r': 'e',
            's': 'a', 't': 'r', 'u': 'y', 'v': 'c', 'w': 'q', 'x': 'z',
            'y': 't', 'z': 'x', '1': 'l', '0': 'o', '5': 's'
        }
        
        if char.lower() in bit_flips:
            flipped = bit_flips[char.lower()]
            if char.isupper():
                flipped = flipped.upper()
            return brand[:pos] + flipped + brand[pos+1:]
        
        return brand
    
    def generate_legitimate_variation(self, brand: str) -> str:
        """Generate legitimate-looking variations for negative samples."""
        variations = [
            f"{brand}.com",
            f"www.{brand}.com",
            f"{brand}.co",
            f"{brand}-group.com",
            f"{brand}inc.com",
            f"{brand}corp.com",
        ]
        return random.choice(variations)
    
    def extract_features(self, domain: str, brand: str) -> Dict:
        """Extract features from domain for ML model."""
        # Parse domain
        if '.' in domain:
            parts = domain.split('.')
            if parts[0] in ['www', 'mail', 'login', 'secure']:
                subdomain = parts[0]
                main_domain = parts[1] if len(parts) > 1 else ''
                tld = parts[2] if len(parts) > 2 else parts[-1]
            else:
                subdomain = ''
                main_domain = parts[0]
                tld = parts[-1]
        else:
            subdomain = ''
            main_domain = domain
            tld = ''
        
        # Character-level features
        features = {
            'domain_length': len(domain),
            'subdomain_length': len(subdomain),
            'main_domain_length': len(main_domain),
            'tld_length': len(tld),
            'has_www': 1 if 'www' in domain else 0,
            'has_https': 1 if 'https' in domain else 0,
            'hyphen_count': domain.count('-'),
            'dot_count': domain.count('.'),
            'digit_count': sum(c.isdigit() for c in domain),
            'special_char_count': sum(not c.isalnum() and c != '.' and c != '-' for c in domain),
            
            # Brand similarity features
            'brand_in_domain': 1 if brand.lower() in domain.lower() else 0,
            'levenshtein_distance': self._levenshtein_distance(main_domain.lower(), brand.lower()),
            'jaro_winkler': self._jaro_winkler(main_domain.lower(), brand.lower()),
            'length_ratio': len(main_domain) / max(len(brand), 1),
            
            # Phishing indicator features
            'suspicious_tld': 1 if tld in self.SUSPICIOUS_TLDS else 0,
            'trusted_tld': 1 if tld in self.TRUSTED_TLDS else 0,
            'has_phishing_keyword': 1 if any(kw in domain.lower() for kw in self.PHISHING_KEYWORDS) else 0,
            'phishing_keyword_count': sum(kw in domain.lower() for kw in self.PHISHING_KEYWORDS),
            
            # Entropy features
            'char_entropy': self._calculate_entropy(main_domain),
            'consonant_vowel_ratio': self._consonant_vowel_ratio(main_domain),
            
            # Homoglyph detection
            'has_homoglyph': 1 if self._contains_homoglyph(domain) else 0,
            'homoglyph_count': self._count_homoglyphs(domain),
            
            # Repetition features
            'max_char_repetition': self._max_char_repetition(domain),
            'consecutive_digits': self._consecutive_digits(domain),
        }
        
        return features
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance between two strings."""
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
    
    def _jaro_winkler(self, s1: str, s2: str) -> float:
        """Calculate Jaro-Winkler similarity."""
        if s1 == s2:
            return 1.0
        
        len1, len2 = len(s1), len(s2)
        match_distance = max(len1, len2) // 2 - 1
        
        s1_matches = [False] * len1
        s2_matches = [False] * len2
        
        matches = 0
        transpositions = 0
        
        for i in range(len1):
            start = max(0, i - match_distance)
            end = min(i + match_distance + 1, len2)
            
            for j in range(start, end):
                if s2_matches[j] or s1[i] != s2[j]:
                    continue
                s1_matches[i] = s2_matches[j] = True
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
        
        jaro = ((matches / len1) + (matches / len2) + 
                ((matches - transpositions / 2) / matches)) / 3
        
        # Jaro-Winkler adjustment
        prefix_len = 0
        for i in range(min(4, len1, len2)):
            if s1[i] == s2[i]:
                prefix_len += 1
            else:
                break
        
        return jaro + (0.1 * prefix_len * (1 - jaro))
    
    def _calculate_entropy(self, s: str) -> float:
        """Calculate Shannon entropy of a string."""
        if not s:
            return 0.0
        
        from math import log2
        prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
        return -sum(p * log2(p) for p in prob)
    
    def _consonant_vowel_ratio(self, s: str) -> float:
        """Calculate consonant to vowel ratio."""
        vowels = set('aeiouAEIOU')
        consonants = 0
        vowel_count = 0
        
        for c in s:
            if c.isalpha():
                if c in vowels:
                    vowel_count += 1
                else:
                    consonants += 1
        
        if vowel_count == 0:
            return float('inf') if consonants > 0 else 0.0
        return consonants / vowel_count
    
    def _contains_homoglyph(self, s: str) -> bool:
        """Check if string contains known homoglyphs."""
        for char in s:
            for originals, homoglyphs in self.HOMOGLYPHS.items():
                if char in homoglyphs:
                    return True
        return False
    
    def _count_homoglyphs(self, s: str) -> int:
        """Count homoglyphs in string."""
        count = 0
        for char in s:
            for originals, homoglyphs in self.HOMOGLYPHS.items():
                if char in homoglyphs:
                    count += 1
        return count
    
    def _max_char_repetition(self, s: str) -> int:
        """Find maximum consecutive character repetition."""
        if not s:
            return 0
        
        max_rep = 1
        current_rep = 1
        
        for i in range(1, len(s)):
            if s[i] == s[i-1]:
                current_rep += 1
                max_rep = max(max_rep, current_rep)
            else:
                current_rep = 1
        
        return max_rep
    
    def _consecutive_digits(self, s: str) -> int:
        """Count maximum consecutive digits."""
        max_digits = 0
        current_digits = 0
        
        for c in s:
            if c.isdigit():
                current_digits += 1
                max_digits = max(max_digits, current_digits)
            else:
                current_digits = 0
        
        return max_digits
    
    def generate_dataset(self, n_samples: int = 10000, 
                        impersonation_ratio: float = 0.5) -> List[BrandImpersonationSample]:
        """Generate balanced dataset of brand impersonation samples."""
        dataset = []
        n_impersonation = int(n_samples * impersonation_ratio)
        n_legitimate = n_samples - n_impersonation
        
        # Generate impersonation samples
        techniques_flat = []
        for category, techniques in self.TECHNIQUES.items():
            for technique in techniques:
                techniques_flat.append((category, technique))
        
        for i in range(n_impersonation):
            brand = random.choice(self.LEGITIMATE_BRANDS)
            category, technique = random.choice(techniques_flat)
            
            if category == 'typosquatting':
                domain_variant = self.generate_typosquatting(brand, technique)
            elif category == 'combo_squatting':
                domain_variant = self.generate_combo_squatting(brand, technique)
            elif category == 'bitsquatting':
                domain_variant = self.generate_bitsquatting(brand)
            else:
                domain_variant = self.generate_typosquatting(brand, 'homoglyph')
            
            # Add TLD
            if '.' not in domain_variant:
                tld = random.choice(self.SUSPICIOUS_TLDS + ['com', 'net', 'org'])
                domain = f"{domain_variant}.{tld}"
            else:
                domain = domain_variant
            
            features = self.extract_features(domain, brand)
            
            sample = BrandImpersonationSample(
                domain=domain,
                brand_name=brand,
                label=1,
                technique=f"{category}:{technique}",
                features=features
            )
            dataset.append(sample)
        
        # Generate legitimate samples
        for i in range(n_legitimate):
            brand = random.choice(self.LEGITIMATE_BRANDS)
            domain = self.generate_legitimate_variation(brand)
            features = self.extract_features(domain, brand)
            
            sample = BrandImpersonationSample(
                domain=domain,
                brand_name=brand,
                label=0,
                technique='legitimate',
                features=features
            )
            dataset.append(sample)
        
        # Shuffle dataset
        random.shuffle(dataset)
        
        return dataset
    
    def save_dataset(self, dataset: List[BrandImpersonationSample], 
                    filepath: str, format: str = 'json'):
        """Save dataset to file."""
        data = [sample.to_dict() for sample in dataset]
        
        if format == 'json':
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        elif format == 'jsonl':
            with open(filepath, 'w') as f:
                for sample in data:
                    f.write(json.dumps(sample) + '\n')
        elif format == 'csv':
            import csv
            if data:
                with open(filepath, 'w', newline='') as f:
                    # Flatten features
                    flat_data = []
                    for sample in data:
                        flat_sample = {
                            'domain': sample['domain'],
                            'brand_name': sample['brand_name'],
                            'label': sample['label'],
                            'technique': sample['technique']
                        }
                        flat_sample.update(sample['features'])
                        flat_data.append(flat_sample)
                    
                    writer = csv.DictWriter(f, fieldnames=flat_data[0].keys())
                    writer.writeheader()
                    writer.writerows(flat_data)


if __name__ == '__main__':
    # Generate dataset
    generator = BrandImpersonationDataset(random_seed=42)
    
    print("Generating brand impersonation dataset...")
    dataset = generator.generate_dataset(n_samples=20000, impersonation_ratio=0.5)
    
    # Save in multiple formats
    generator.save_dataset(dataset, 'data/brand_impersonation_dataset.json', 'json')
    generator.save_dataset(dataset, 'data/brand_impersonation_dataset.jsonl', 'jsonl')
    generator.save_dataset(dataset, 'data/brand_impersonation_dataset.csv', 'csv')
    
    print(f"Generated {len(dataset)} samples")
    print(f"Impersonation samples: {sum(1 for s in dataset if s.label == 1)}")
    print(f"Legitimate samples: {sum(1 for s in dataset if s.label == 0)}")
    
    # Print technique distribution
    from collections import Counter
    techniques = Counter(s.technique for s in dataset)
    print("\nTechnique distribution:")
    for technique, count in techniques.most_common(10):
        print(f"  {technique}: {count}")
