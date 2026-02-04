"""
Advanced NLP Analysis Module for DoppelDown Threat Detection
Implements Named Entity Recognition, Sentiment Analysis, and Contextual Analysis
using spaCy and NLTK.
"""

import re
import string
from typing import List, Dict, Tuple, Optional, Any, Set
from dataclasses import dataclass, field
from collections import Counter, defaultdict
import logging
from enum import Enum

# NLP Libraries
try:
    import spacy
    from spacy.tokens import Doc, Span
    from spacy.matcher import Matcher, PhraseMatcher
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    logging.warning("spaCy not available. Install with: pip install spacy")

try:
    import nltk
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    from nltk.tokenize import sent_tokenize, word_tokenize
    from nltk.corpus import stopwords
    from nltk import pos_tag, ne_chunk
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    logging.warning("NLTK not available. Install with: pip install nltk")

try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ThreatCategory(Enum):
    """Categories of threats detectable via NLP."""
    PHISHING = "phishing"
    BRAND_IMPERSONATION = "brand_impersonation"
    SUSPICIOUS_URL = "suspicious_url"
    URGENCY_MANIPULATION = "urgency_manipulation"
    CREDENTIAL_HARVESTING = "credential_harvesting"
    FINANCIAL_FRAUD = "financial_fraud"
    MALWARE_DISTRIBUTION = "malware_distribution"
    SOCIAL_ENGINEERING = "social_engineering"
    LEGITIMATE = "legitimate"


@dataclass
class Entity:
    """Named entity extracted from text."""
    text: str
    label: str
    start: int
    end: int
    confidence: float = 0.0
    context: str = ""


@dataclass
class SentimentResult:
    """Sentiment analysis result."""
    polarity: float  # -1 to 1
    subjectivity: float  # 0 to 1
    confidence: float
    dominant_emotion: str
    emotion_scores: Dict[str, float] = field(default_factory=dict)


@dataclass
class LinguisticFeatures:
    """Linguistic features extracted from text."""
    readability_score: float
    formality_score: float
    urgency_indicators: List[str]
    trust_indicators: List[str]
    deception_indicators: List[str]
    grammar_errors: int
    spelling_errors: int
    sentence_complexity: float
    word_complexity: float
    emotional_manipulation_score: float
    authority_references: List[str]


@dataclass
class ContextualThreatScore:
    """Contextual threat scoring result."""
    overall_score: float
    category_scores: Dict[ThreatCategory, float]
    key_indicators: List[str]
    entity_risk_score: float
    sentiment_risk_score: float
    linguistic_risk_score: float
    contextual_factors: List[str]
    recommended_actions: List[str]


class NLPEntityRecognizer:
    """Named Entity Recognition for threat detection."""
    
    # Brand-related entity patterns
    BRAND_INDICATORS = [
        'official', 'real', 'verified', 'authentic', 'genuine',
        'support', 'helpdesk', 'customer service', 'security team',
        'account team', 'billing department'
    ]
    
    # Suspicious entity patterns
    SUSPICIOUS_PATTERNS = {
        'urgency': [
            r'\b(immediately|urgent|emergency|asap|right now|without delay)\b',
            r'\b(expire|expiration|deadline|limited time|act now)\b',
            r'\b(suspend|suspended|disable|deactivate|terminate)\b',
            r'\b(24 hours|48 hours|within \d+ (hour|day))\b',
        ],
        'credential_requests': [
            r'\b(password|login|credential|username|account details)\b',
            r'\b(verify.*identity|confirm.*account|validate.*information)\b',
            r'\b(update.*payment|billing information|credit card)\b',
            r'\b(ssn|social security|tax id|date of birth)\b',
        ],
        'financial_indicators': [
            r'\b(payment|invoice|billing|charge|transaction|refund)\b',
            r'\b(bank.*account|routing number|wire transfer)\b',
            r'\b(cryptocurrency|bitcoin|btc|eth|wallet)\b',
            r'\b(unauthorized.*charge|suspicious.*activity|fraud alert)\b',
        ],
        'authority_claims': [
            r'\b(irs|fbi|cia|government|federal|treasury)\b',
            r'\b(police|law enforcement|legal action|lawsuit)\b',
            r'\b(court|judge|attorney|subpoena|warrant)\b',
        ],
        'technical_social_engineering': [
            r'\b(click.*link|download.*attachment|open.*file)\b',
            r'\b(remote.*access|teamviewer|anydesk|screen sharing)\b',
            r'\b(software.*update|security.*patch|critical.*update)\b',
        ]
    }
    
    def __init__(self, spacy_model: str = "en_core_web_sm"):
        self.nlp = None
        self.matcher = None
        self.phrase_matcher = None
        
        if SPACY_AVAILABLE:
            try:
                self.nlp = spacy.load(spacy_model)
                self.matcher = Matcher(self.nlp.vocab)
                self.phrase_matcher = PhraseMatcher(self.nlp.vocab)
                self._setup_patterns()
                logger.info(f"Loaded spaCy model: {spacy_model}")
            except OSError:
                logger.warning(f"spaCy model {spacy_model} not found. Running with limited functionality.")
                logger.info(f"Install with: python -m spacy download {spacy_model}")
        
        self.compiled_patterns = {
            category: [re.compile(pattern, re.IGNORECASE) 
                      for pattern in patterns]
            for category, patterns in self.SUSPICIOUS_PATTERNS.items()
        }
    
    def _setup_patterns(self):
        """Setup spaCy matcher patterns."""
        # Urgency patterns
        urgency_patterns = [
            [{"LOWER": {"IN": ["urgent", "immediate", "emergency"]}}],
            [{"LOWER": "act"}, {"LOWER": {"IN": ["now", "immediately"]}}],
            [{"LOWER": {"IN": ["account", "access"]}}, {"LOWER": {"IN": ["suspended", "disabled", "terminated"]}}],
        ]
        self.matcher.add("URGENCY", urgency_patterns)
        
        # Add phrase patterns
        brand_phrases = [self.nlp.make_doc(text) for text in self.BRAND_INDICATORS]
        self.phrase_matcher.add("BRAND_INDICATORS", brand_phrases)
    
    def extract_entities(self, text: str) -> List[Entity]:
        """Extract named entities from text."""
        entities = []
        
        if not self.nlp:
            # Fallback to regex-based extraction
            return self._extract_entities_regex(text)
        
        doc = self.nlp(text)
        
        # Extract standard NER entities
        for ent in doc.ents:
            entity = Entity(
                text=ent.text,
                label=ent.label_,
                start=ent.start_char,
                end=ent.end_char,
                confidence=getattr(ent, 'confidence', 0.9),
                context=text[max(0, ent.start_char-30):min(len(text), ent.end_char+30)]
            )
            entities.append(entity)
        
        # Extract custom pattern matches
        matches = self.matcher(doc)
        for match_id, start, end in matches:
            span = doc[start:end]
            entity = Entity(
                text=span.text,
                label=self.nlp.vocab.strings[match_id],
                start=span.start_char,
                end=span.end_char,
                confidence=0.85,
                context=text[max(0, span.start_char-30):min(len(text), span.end_char+30)]
            )
            entities.append(entity)
        
        # Extract phrase matches
        phrase_matches = self.phrase_matcher(doc)
        for match_id, start, end in phrase_matches:
            span = doc[start:end]
            entity = Entity(
                text=span.text,
                label=self.nlp.vocab.strings[match_id],
                start=span.start_char,
                end=span.end_char,
                confidence=0.9,
                context=text[max(0, span.start_char-30):min(len(text), span.end_char+30)]
            )
            entities.append(entity)
        
        # Extract suspicious pattern matches
        entities.extend(self._extract_suspicious_patterns(text))
        
        return entities
    
    def _extract_entities_regex(self, text: str) -> List[Entity]:
        """Fallback regex-based entity extraction."""
        entities = []
        
        # URL extraction
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        for match in re.finditer(url_pattern, text, re.IGNORECASE):
            entities.append(Entity(
                text=match.group(),
                label="URL",
                start=match.start(),
                end=match.end(),
                confidence=0.95
            ))
        
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        for match in re.finditer(email_pattern, text):
            entities.append(Entity(
                text=match.group(),
                label="EMAIL",
                start=match.start(),
                end=match.end(),
                confidence=0.95
            ))
        
        # Phone number extraction
        phone_pattern = r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b'
        for match in re.finditer(phone_pattern, text):
            entities.append(Entity(
                text=match.group(),
                label="PHONE",
                start=match.start(),
                end=match.end(),
                confidence=0.9
            ))
        
        entities.extend(self._extract_suspicious_patterns(text))
        
        return entities
    
    def _extract_suspicious_patterns(self, text: str) -> List[Entity]:
        """Extract suspicious patterns from text."""
        entities = []
        
        for category, patterns in self.compiled_patterns.items():
            for pattern in patterns:
                for match in pattern.finditer(text):
                    entities.append(Entity(
                        text=match.group(),
                        label=category.upper(),
                        start=match.start(),
                        end=match.end(),
                        confidence=0.85
                    ))
        
        return entities
    
    def extract_brand_entities(self, text: str, brand_names: List[str]) -> List[Entity]:
        """Extract mentions of specific brand names."""
        entities = []
        text_lower = text.lower()
        
        for brand in brand_names:
            brand_lower = brand.lower()
            pattern = r'\b' + re.escape(brand_lower) + r'(?:\s+(?:inc|corp|llc|ltd|limited|group|company|co\.?))?\b'
            
            for match in re.finditer(pattern, text_lower):
                # Map back to original case
                original_text = text[match.start():match.end()]
                entities.append(Entity(
                    text=original_text,
                    label="BRAND_MENTION",
                    start=match.start(),
                    end=match.end(),
                    confidence=0.95,
                    context=text[max(0, match.start()-50):min(len(text), match.end()+50)]
                ))
        
        return entities
    
    def analyze_entity_context(self, entity: Entity, full_text: str) -> Dict[str, Any]:
        """Analyze the context around an entity for threat indicators."""
        context_window = 100
        start = max(0, entity.start - context_window)
        end = min(len(full_text), entity.end + context_window)
        context = full_text[start:end]
        
        analysis = {
            'entity': entity,
            'context': context,
            'surrounding_sentences': self._extract_sentences(context),
            'risk_indicators': [],
            'trust_indicators': [],
        }
        
        # Check for urgency in context
        urgency_words = ['urgent', 'immediately', 'asap', 'emergency', 'suspended', 'disabled']
        if any(word in context.lower() for word in urgency_words):
            analysis['risk_indicators'].append('urgency_language')
        
        # Check for credential requests
        credential_words = ['password', 'login', 'verify', 'confirm', 'account', 'ssn']
        if any(word in context.lower() for word in credential_words):
            analysis['risk_indicators'].append('credential_request')
        
        # Check for authority claims
        authority_words = ['official', 'verified', 'authorized', 'department', 'team']
        if any(word in context.lower() for word in authority_words):
            analysis['trust_indicators'].append('authority_claim')
        
        return analysis
    
    def _extract_sentences(self, text: str) -> List[str]:
        """Extract sentences from text."""
        if NLTK_AVAILABLE:
            return sent_tokenize(text)
        else:
            # Simple sentence splitting
            return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]


class NLPSentimentAnalyzer:
    """Sentiment analysis for threat detection."""
    
    # Emotion keywords for threat detection
    EMOTION_PATTERNS = {
        'fear': ['afraid', 'scared', 'terrified', 'worried', 'anxious', 'panic', 'alarm'],
        'anger': ['angry', 'furious', 'outraged', 'irritated', 'annoyed', 'frustrated'],
        'urgency': ['urgent', 'immediate', 'hurry', 'rush', 'quick', 'fast', 'now'],
        'trust': ['trust', 'confident', 'secure', 'safe', 'protected', 'verified'],
        'suspicion': ['suspicious', 'doubt', 'question', 'uncertain', 'unsure', 'wary'],
        'authority': ['official', 'authorized', 'legitimate', 'genuine', 'authentic'],
    }
    
    def __init__(self):
        self.vader_analyzer = None
        self.stop_words = set()
        
        if NLTK_AVAILABLE:
            try:
                self.vader_analyzer = SentimentIntensityAnalyzer()
                self.stop_words = set(stopwords.words('english'))
            except:
                nltk.download('vader_lexicon')
                nltk.download('stopwords')
                self.vader_analyzer = SentimentIntensityAnalyzer()
                self.stop_words = set(stopwords.words('english'))
        
        self.compiled_emotion_patterns = {
            emotion: [re.compile(r'\b' + word + r'\b', re.IGNORECASE) 
                     for word in words]
            for emotion, words in self.EMOTION_PATTERNS.items()
        }
    
    def analyze_sentiment(self, text: str) -> SentimentResult:
        """Analyze sentiment of text."""
        if self.vader_analyzer:
            return self._analyze_vader(text)
        elif TEXTBLOB_AVAILABLE:
            return self._analyze_textblob(text)
        else:
            return self._analyze_basic(text)
    
    def _analyze_vader(self, text: str) -> SentimentResult:
        """Analyze sentiment using VADER."""
        scores = self.vader_analyzer.polarity_scores(text)
        
        # Calculate emotion scores
        emotion_scores = self._calculate_emotion_scores(text)
        
        # Determine dominant emotion
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        
        # Calculate confidence
        confidence = abs(scores['compound']) + (scores['pos'] + scores['neg']) / 2
        
        return SentimentResult(
            polarity=scores['compound'],
            subjectivity=(scores['pos'] + scores['neg']) / 2,
            confidence=min(confidence, 1.0),
            dominant_emotion=dominant_emotion,
            emotion_scores=emotion_scores
        )
    
    def _analyze_textblob(self, text: str) -> SentimentResult:
        """Analyze sentiment using TextBlob."""
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        emotion_scores = self._calculate_emotion_scores(text)
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        
        return SentimentResult(
            polarity=polarity,
            subjectivity=subjectivity,
            confidence=abs(polarity) + subjectivity / 2,
            dominant_emotion=dominant_emotion,
            emotion_scores=emotion_scores
        )
    
    def _analyze_basic(self, text: str) -> SentimentResult:
        """Basic sentiment analysis without external libraries."""
        text_lower = text.lower()
        
        # Positive and negative word lists
        positive_words = ['good', 'great', 'excellent', 'happy', 'pleased', 'thank', 'appreciate']
        negative_words = ['bad', 'terrible', 'awful', 'angry', 'disappointed', 'concerned', 'problem']
        
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        total = pos_count + neg_count
        if total == 0:
            polarity = 0.0
        else:
            polarity = (pos_count - neg_count) / total
        
        emotion_scores = self._calculate_emotion_scores(text)
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        
        return SentimentResult(
            polarity=polarity,
            subjectivity=0.5 if total > 0 else 0.0,
            confidence=min(total / 10, 1.0),
            dominant_emotion=dominant_emotion,
            emotion_scores=emotion_scores
        )
    
    def _calculate_emotion_scores(self, text: str) -> Dict[str, float]:
        """Calculate emotion scores based on keyword matching."""
        scores = {}
        text_lower = text.lower()
        
        for emotion, patterns in self.compiled_emotion_patterns.items():
            count = sum(1 for pattern in patterns if pattern.search(text_lower))
            scores[emotion] = min(count / 3, 1.0)  # Normalize to 0-1
        
        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            scores = {k: v / total for k, v in scores.items()}
        else:
            scores = {k: 0.0 for k in self.EMOTION_PATTERNS.keys()}
        
        return scores
    
    def detect_manipulation(self, text: str) -> Dict[str, Any]:
        """Detect emotional manipulation techniques."""
        manipulation_indicators = {
            'urgency_manipulation': {
                'score': 0.0,
                'indicators': []
            },
            'fear_appeal': {
                'score': 0.0,
                'indicators': []
            },
            'authority_manipulation': {
                'score': 0.0,
                'indicators': []
            },
            'scarcity_tactics': {
                'score': 0.0,
                'indicators': []
            },
            'social_proof_manipulation': {
                'score': 0.0,
                'indicators': []
            }
        }
        
        text_lower = text.lower()
        sentences = self._split_sentences(text)
        
        # Urgency manipulation
        urgency_patterns = [
            r'\b(act|respond|reply)\s+(now|immediately|urgently|asap)',
            r'\b(limited\s+time|time\s+running\s+out|deadline)\b',
            r'\b(within\s+\d+\s+(hours?|days?|minutes?))\b',
            r'\b(expire|expiration)\b',
        ]
        for pattern in urgency_patterns:
            if re.search(pattern, text_lower):
                manipulation_indicators['urgency_manipulation']['score'] += 0.2
                manipulation_indicators['urgency_manipulation']['indicators'].append(pattern)
        
        # Fear appeal
        fear_patterns = [
            r'\b(account\s+(suspended|disabled|terminated|locked))\b',
            r'\b(unauthorized\s+access|security\s+breach|compromised)\b',
            r'\b(legal\s+action|lawsuit|court|attorney)\b',
            r'\b(penalty|fine|chargeback|dispute)\b',
        ]
        for pattern in fear_patterns:
            if re.search(pattern, text_lower):
                manipulation_indicators['fear_appeal']['score'] += 0.2
                manipulation_indicators['fear_appeal']['indicators'].append(pattern)
        
        # Authority manipulation
        authority_patterns = [
            r'\b(official\s+(communication|notice|alert))\b',
            r'\b(verified\s+(account|sender|source))\b',
            r'\b(security\s+team|fraud\s+department|compliance)\b',
        ]
        for pattern in authority_patterns:
            if re.search(pattern, text_lower):
                manipulation_indicators['authority_manipulation']['score'] += 0.2
                manipulation_indicators['authority_manipulation']['indicators'].append(pattern)
        
        # Cap scores at 1.0
        for key in manipulation_indicators:
            manipulation_indicators[key]['score'] = min(
                manipulation_indicators[key]['score'], 1.0
            )
        
        return manipulation_indicators
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        if NLTK_AVAILABLE:
            return sent_tokenize(text)
        else:
            return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]


class LinguisticAnalyzer:
    """Analyze linguistic features for threat detection."""
    
    # Lists for analysis
    URGENCY_WORDS = [
        'urgent', 'immediately', 'asap', 'emergency', 'critical', 'important',
        'alert', 'warning', 'attention', 'action required', 'response needed'
    ]
    
    TRUST_WORDS = [
        'secure', 'verified', 'authenticated', 'protected', 'safe',
        'official', 'legitimate', 'authorized', 'genuine', 'certified'
    ]
    
    DECEPTION_WORDS = [
        'confidential', 'private', 'sensitive', 'restricted', 'exclusive',
        'special offer', 'limited', 'selected', 'chosen', 'privileged'
    ]
    
    GRAMMAR_PATTERNS = [
        r'\b(their|there|they\'re)\b',  # Common confusions
        r'\b(your|you\'re)\b',
        r'\b(its|it\'s)\b',
        r'\b(affect|effect)\b',
        r'\d+\s+(?:st|nd|rd|th)\b',  # Ordinal misuse
    ]
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            stop_words='english'
        )
    
    def analyze(self, text: str, brand_context: Optional[str] = None) -> LinguisticFeatures:
        """Perform comprehensive linguistic analysis."""
        text_lower = text.lower()
        
        # Calculate readability
        readability = self._calculate_readability(text)
        
        # Calculate formality
        formality = self._calculate_formality(text)
        
        # Extract indicators
        urgency_indicators = [w for w in self.URGENCY_WORDS if w in text_lower]
        trust_indicators = [w for w in self.TRUST_WORDS if w in text_lower]
        deception_indicators = [w for w in self.DECEPTION_WORDS if w in text_lower]
        
        # Count errors
        grammar_errors = self._count_grammar_issues(text)
        spelling_errors = self._estimate_spelling_errors(text)
        
        # Calculate complexity
        sentence_complexity = self._calculate_sentence_complexity(text)
        word_complexity = self._calculate_word_complexity(text)
        
        # Emotional manipulation
        emotional_manipulation = self._calculate_emotional_manipulation(
            text, urgency_indicators, deception_indicators
        )
        
        # Authority references
        authority_references = self._extract_authority_references(text)
        
        return LinguisticFeatures(
            readability_score=readability,
            formality_score=formality,
            urgency_indicators=urgency_indicators,
            trust_indicators=trust_indicators,
            deception_indicators=deception_indicators,
            grammar_errors=grammar_errors,
            spelling_errors=spelling_errors,
            sentence_complexity=sentence_complexity,
            word_complexity=word_complexity,
            emotional_manipulation_score=emotional_manipulation,
            authority_references=authority_references
        )
    
    def _calculate_readability(self, text: str) -> float:
        """Calculate Flesch Reading Ease score (simplified)."""
        sentences = self._split_sentences(text)
        words = text.split()
        
        if not sentences or not words:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        avg_word_length = sum(len(w) for w in words) / len(words)
        
        # Simplified Flesch score
        score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_word_length)
        return max(0, min(100, score)) / 100  # Normalize to 0-1
    
    def _calculate_formality(self, text: str) -> float:
        """Calculate formality score based on vocabulary and structure."""
        formal_indicators = [
            r'\b(hereby|herewith|pursuant|whereas|notwithstanding)\b',
            r'\b(please|kindly|regards|sincerely|respectfully)\b',
            r'\b(dear\s+(?:sir|madam|customer|user))\b',
        ]
        
        informal_indicators = [
            r'\b(hey|hi|hello|thanks|cheers|btw|fyi)\b',
            r'!{2,}',  # Multiple exclamation marks
            r'\.{3,}',  # Ellipsis
            r'[A-Z]{3,}',  # ALL CAPS words
        ]
        
        formality_score = 0.5
        
        for pattern in formal_indicators:
            if re.search(pattern, text, re.IGNORECASE):
                formality_score += 0.1
        
        for pattern in informal_indicators:
            if re.search(pattern, text, re.IGNORECASE):
                formality_score -= 0.1
        
        return max(0, min(1, formality_score))
    
    def _count_grammar_issues(self, text: str) -> int:
        """Count potential grammar issues."""
        issues = 0
        for pattern in self.GRAMMAR_PATTERNS:
            issues += len(re.findall(pattern, text, re.IGNORECASE))
        
        # Check for missing spaces after punctuation
        issues += len(re.findall(r'[.!?][A-Z]', text))
        
        # Check for excessive punctuation
        issues += len(re.findall(r'[!?]{2,}', text))
        
        return issues
    
    def _estimate_spelling_errors(self, text: str) -> int:
        """Estimate spelling errors using common patterns."""
        # This is a simplified estimation
        # In production, use a proper spell checker like pyspellchecker
        
        suspicious_patterns = [
            r'\b[a-z]{10,}\b',  # Very long words
            r'\b[a-z]*[aeiou]{4,}[a-z]*\b',  # Too many vowels
            r'\b[a-z]*[^aeiou]{5,}[a-z]*\b',  # Too many consonants
        ]
        
        errors = 0
        for pattern in suspicious_patterns:
            errors += len(re.findall(pattern, text, re.IGNORECASE))
        
        return errors
    
    def _calculate_sentence_complexity(self, text: str) -> float:
        """Calculate average sentence complexity."""
        sentences = self._split_sentences(text)
        if not sentences:
            return 0.0
        
        complexities = []
        for sentence in sentences:
            words = sentence.split()
            if not words:
                continue
            
            # Complexity based on word count and punctuation
            complexity = len(words) / 20  # Normalize to ~20 words
            complexity += sentence.count(',') * 0.1
            complexity += sentence.count(';') * 0.2
            complexities.append(min(complexity, 2.0))
        
        return sum(complexities) / len(complexities) if complexities else 0.0
    
    def _calculate_word_complexity(self, text: str) -> float:
        """Calculate average word complexity."""
        words = re.findall(r'\b[a-zA-Z]+\b', text)
        if not words:
            return 0.0
        
        total_complexity = 0
        for word in words:
            # Complexity based on length and syllable estimation
            length_score = min(len(word) / 10, 1.0)
            syllable_score = min(self._count_syllables(word) / 4, 1.0)
            total_complexity += (length_score + syllable_score) / 2
        
        return total_complexity / len(words)
    
    def _count_syllables(self, word: str) -> int:
        """Estimate syllable count in a word."""
        word = word.lower()
        vowels = "aeiouy"
        count = 0
        prev_was_vowel = False
        
        for char in word:
            if char in vowels:
                if not prev_was_vowel:
                    count += 1
                prev_was_vowel = True
            else:
                prev_was_vowel = False
        
        # Adjust for silent e
        if word.endswith('e') and count > 1:
            count -= 1
        
        return max(1, count)
    
    def _calculate_emotional_manipulation(
        self, text: str, urgency: List[str], deception: List[str]
    ) -> float:
        """Calculate emotional manipulation score."""
        score = 0.0
        
        # Urgency contributes to manipulation
        score += len(urgency) * 0.1
        
        # Deception words contribute
        score += len(deception) * 0.08
        
        # Exclamation marks indicate emotional appeal
        score += text.count('!') * 0.05
        
        # ALL CAPS words indicate shouting/urgency
        caps_words = len(re.findall(r'\b[A-Z]{3,}\b', text))
        score += caps_words * 0.05
        
        return min(score, 1.0)
    
    def _extract_authority_references(self, text: str) -> List[str]:
        """Extract references to authority figures or organizations."""
        authority_patterns = [
            r'\b(?:CEO|CTO|CFO|CIO|COO|President|VP|Director|Manager)\b',
            r'\b(?:FBI|CIA|IRS|SEC|FTC|FDA|USPS)\b',
            r'\b(?:Federal|Government|Treasury|Justice Department)\b',
            r'\b(?:Security Team|Fraud Department|Compliance Office)\b',
        ]
        
        references = []
        for pattern in authority_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            references.extend(matches)
        
        return references
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        if NLTK_AVAILABLE:
            return sent_tokenize(text)
        else:
            return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    def compare_with_brand_voice(
        self, text: str, brand_voice_samples: List[str]
    ) -> float:
        """Compare text against known brand voice samples."""
        if not brand_voice_samples:
            return 0.5
        
        # Create TF-IDF vectors
        all_texts = brand_voice_samples + [text]
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)
            
            # Calculate similarity with brand samples
            similarities = cosine_similarity(
                tfidf_matrix[-1:],  # The text to check
                tfidf_matrix[:-1]   # Brand voice samples
            )
            
            return float(np.mean(similarities))
        except:
            return 0.5


class NLPAnalyzer:
    """Main NLP analysis orchestrator for threat detection."""
    
    def __init__(self, spacy_model: str = "en_core_web_sm"):
        self.entity_recognizer = NLPEntityRecognizer(spacy_model)
        self.sentiment_analyzer = NLPSentimentAnalyzer()
        self.linguistic_analyzer = LinguisticAnalyzer()
        
        logger.info("NLP Analyzer initialized")
    
    def analyze_text(
        self, 
        text: str, 
        brand_names: Optional[List[str]] = None,
        brand_voice_samples: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Perform comprehensive NLP analysis on text."""
        brand_names = brand_names or []
        
        # Entity extraction
        entities = self.entity_recognizer.extract_entities(text)
        brand_entities = self.entity_recognizer.extract_brand_entities(text, brand_names)
        
        # Sentiment analysis
        sentiment = self.sentiment_analyzer.analyze_sentiment(text)
        manipulation = self.sentiment_analyzer.detect_manipulation(text)
        
        # Linguistic analysis
        linguistic = self.linguistic_analyzer.analyze(text)
        
        # Brand voice comparison
        voice_similarity = None
        if brand_voice_samples:
            voice_similarity = self.linguistic_analyzer.compare_with_brand_voice(
                text, brand_voice_samples
            )
        
        return {
            'entities': {
                'all': [self._entity_to_dict(e) for e in entities],
                'brands': [self._entity_to_dict(e) for e in brand_entities],
                'count': len(entities),
                'brand_mentions': len(brand_entities)
            },
            'sentiment': {
                'polarity': sentiment.polarity,
                'subjectivity': sentiment.subjectivity,
                'confidence': sentiment.confidence,
                'dominant_emotion': sentiment.dominant_emotion,
                'emotion_scores': sentiment.emotion_scores,
                'manipulation': manipulation
            },
            'linguistic': {
                'readability': linguistic.readability_score,
                'formality': linguistic.formality_score,
                'urgency_indicators': linguistic.urgency_indicators,
                'trust_indicators': linguistic.trust_indicators,
                'deception_indicators': linguistic.deception_indicators,
                'grammar_errors': linguistic.grammar_errors,
                'spelling_errors': linguistic.spelling_errors,
                'sentence_complexity': linguistic.sentence_complexity,
                'word_complexity': linguistic.word_complexity,
                'emotional_manipulation': linguistic.emotional_manipulation_score,
                'authority_references': linguistic.authority_references
            },
            'brand_voice_similarity': voice_similarity,
            'summary': self._generate_summary(entities, sentiment, linguistic, brand_entities)
        }
    
    def analyze_email(
        self,
        subject: str,
        body: str,
        sender: str,
        brand_names: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Analyze email content for threat indicators."""
        combined_text = f"{subject}\n\n{body}"
        
        # Analyze subject separately
        subject_analysis = self.analyze_text(subject, brand_names)
        
        # Analyze full email
        full_analysis = self.analyze_text(combined_text, brand_names)
        
        # Email-specific checks
        email_indicators = self._extract_email_indicators(sender, subject, body)
        
        return {
            'subject_analysis': subject_analysis,
            'full_analysis': full_analysis,
            'email_indicators': email_indicators,
            'threat_assessment': self._assess_email_threat(
                subject_analysis, full_analysis, email_indicators
            )
        }
    
    def analyze_webpage_content(
        self,
        title: str,
        content: str,
        meta_description: str,
        brand_names: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Analyze webpage content for impersonation indicators."""
        combined_text = f"{title}\n{meta_description}\n\n{content[:5000]}"
        
        analysis = self.analyze_text(combined_text, brand_names)
        
        # Webpage-specific indicators
        webpage_indicators = {
            'title_brand_match': any(
                brand.lower() in title.lower() 
                for brand in (brand_names or [])
            ),
            'excessive_urgency': len(analysis['linguistic']['urgency_indicators']) > 3,
            'authority_claims': len(analysis['linguistic']['authority_references']) > 0,
            'credential_requests': self._check_credential_requests(content),
            'suspicious_forms': self._check_suspicious_forms(content)
        }
        
        analysis['webpage_indicators'] = webpage_indicators
        analysis['impersonation_score'] = self._calculate_impersonation_score(
            analysis, brand_names or []
        )
        
        return analysis
    
    def _entity_to_dict(self, entity: Entity) -> Dict[str, Any]:
        """Convert entity to dictionary."""
        return {
            'text': entity.text,
            'label': entity.label,
            'start': entity.start,
            'end': entity.end,
            'confidence': entity.confidence,
            'context': entity.context
        }
    
    def _generate_summary(
        self, 
        entities: List[Entity], 
        sentiment: SentimentResult,
        linguistic: LinguisticFeatures,
        brand_entities: List[Entity]
    ) -> Dict[str, Any]:
        """Generate analysis summary."""
        risk_factors = []
        
        if sentiment.dominant_emotion == 'fear':
            risk_factors.append('fear_based_messaging')
        
        if sentiment.dominant_emotion == 'urgency':
            risk_factors.append('urgency_tactics')
        
        if linguistic.emotional_manipulation_score > 0.5:
            risk_factors.append('emotional_manipulation')
        
        if len(linguistic.urgency_indicators) > 2:
            risk_factors.append('excessive_urgency')
        
        if linguistic.grammar_errors > 3 or linguistic.spelling_errors > 3:
            risk_factors.append('poor_language_quality')
        
        if brand_entities:
            risk_factors.append('brand_mentions')
        
        # Check for suspicious entity types
        suspicious_labels = {'URGENCY', 'CREDENTIAL_REQUESTS', 'FINANCIAL_INDICATORS'}
        entity_labels = {e.label for e in entities}
        if suspicious_labels & entity_labels:
            risk_factors.append('suspicious_entity_patterns')
        
        return {
            'risk_factors': risk_factors,
            'risk_level': self._calculate_risk_level(risk_factors, sentiment),
            'key_findings': self._generate_key_findings(entities, sentiment, linguistic)
        }
    
    def _calculate_risk_level(
        self, risk_factors: List[str], sentiment: SentimentResult
    ) -> str:
        """Calculate overall risk level."""
        score = len(risk_factors) * 0.15
        
        if sentiment.dominant_emotion in ['fear', 'urgency']:
            score += 0.2
        
        if sentiment.polarity < -0.3:
            score += 0.1
        
        if score >= 0.7:
            return 'high'
        elif score >= 0.4:
            return 'medium'
        else:
            return 'low'
    
    def _generate_key_findings(
        self, 
        entities: List[Entity], 
        sentiment: SentimentResult,
        linguistic: LinguisticFeatures
    ) -> List[str]:
        """Generate key findings from analysis."""
        findings = []
        
        if sentiment.dominant_emotion:
            findings.append(f"Dominant emotional tone: {sentiment.dominant_emotion}")
        
        if linguistic.urgency_indicators:
            findings.append(f"Urgency indicators found: {len(linguistic.urgency_indicators)}")
        
        if linguistic.trust_indicators:
            findings.append(f"Trust indicators found: {len(linguistic.trust_indicators)}")
        
        entity_types = Counter(e.label for e in entities)
        if entity_types:
            top_entity = entity_types.most_common(1)[0]
            findings.append(f"Most common entity type: {top_entity[0]} ({top_entity[1]} occurrences)")
        
        return findings
    
    def _extract_email_indicators(
        self, sender: str, subject: str, body: str
    ) -> Dict[str, Any]:
        """Extract email-specific threat indicators."""
        indicators = {
            'suspicious_sender': False,
            'sender_domain_issues': [],
            'subject_red_flags': [],
            'body_red_flags': []
        }
        
        # Check sender
        if '@' in sender:
            domain = sender.split('@')[1]
            if any(tld in domain for tld in ['.tk', '.ml', '.ga', '.cf']):
                indicators['sender_domain_issues'].append('suspicious_tld')
        
        # Check subject
        subject_lower = subject.lower()
        if 're:' in subject_lower and 'fw:' in subject_lower:
            indicators['subject_red_flags'].append('multiple_forward_replies')
        
        urgency_words = ['urgent', 'immediate', 'action required', 'alert']
        if any(word in subject_lower for word in urgency_words):
            indicators['subject_red_flags'].append('urgency_in_subject')
        
        return indicators
    
    def _assess_email_threat(
        self,
        subject_analysis: Dict,
        full_analysis: Dict,
        email_indicators: Dict
    ) -> Dict[str, Any]:
        """Assess overall email threat level."""
        score = 0.0
        factors = []
        
        # Factor in subject urgency
        if subject_analysis['sentiment']['dominant_emotion'] == 'urgency':
            score += 0.2
            factors.append('urgent_subject_line')
        
        # Factor in entity risk
        if subject_analysis['entities']['count'] > 5:
            score += 0.1
            factors.append('high_entity_density')
        
        # Factor in email-specific indicators
        if email_indicators['sender_domain_issues']:
            score += 0.3
            factors.append('suspicious_sender_domain')
        
        if email_indicators['subject_red_flags']:
            score += 0.15 * len(email_indicators['subject_red_flags'])
            factors.extend(email_indicators['subject_red_flags'])
        
        # Factor in manipulation
        manipulation = full_analysis['sentiment']['manipulation']
        if manipulation.get('urgency_manipulation', {}).get('score', 0) > 0.5:
            score += 0.2
            factors.append('urgency_manipulation')
        
        if manipulation.get('fear_appeal', {}).get('score', 0) > 0.5:
            score += 0.2
            factors.append('fear_appeal')
        
        return {
            'threat_score': min(score, 1.0),
            'risk_level': 'high' if score >= 0.7 else 'medium' if score >= 0.4 else 'low',
            'contributing_factors': factors
        }
    
    def _check_credential_requests(self, content: str) -> bool:
        """Check if content requests credentials."""
        credential_patterns = [
            r'\b(password|username|login|credential)\b',
            r'\b(verify.*account|confirm.*identity)\b',
            r'<input[^>]*type=["\']password["\']',
        ]
        return any(re.search(p, content, re.IGNORECASE) for p in credential_patterns)
    
    def _check_suspicious_forms(self, content: str) -> bool:
        """Check for suspicious form patterns."""
        suspicious_patterns = [
            r'<form[^>]*action=["\'][^"\']*(?:verify|login|auth|secure)[^"\']*["\']',
            r'<input[^>]*name=["\'].*(?:ssn|social|dob|birth)\b',
        ]
        return any(re.search(p, content, re.IGNORECASE) for p in suspicious_patterns)
    
    def _calculate_impersonation_score(
        self, analysis: Dict, brand_names: List[str]
    ) -> float:
        """Calculate brand impersonation score."""
        score = 0.0
        
        # Brand mentions increase score
        brand_mentions = analysis['entities']['brand_mentions']
        score += min(brand_mentions * 0.2, 0.4)
        
        # Authority claims increase score
        if analysis['linguistic']['authority_references']:
            score += 0.2
        
        # Excessive trust indicators may indicate impersonation
        if len(analysis['linguistic']['trust_indicators']) > 3:
            score += 0.15
        
        # Webpage indicators
        indicators = analysis.get('webpage_indicators', {})
        if indicators.get('title_brand_match'):
            score += 0.2
        
        return min(score, 1.0)


# Convenience function for quick analysis
def analyze_text(text: str, brand_names: Optional[List[str]] = None) -> Dict[str, Any]:
    """Quick function to analyze text without creating analyzer instance."""
    analyzer = NLPAnalyzer()
    return analyzer.analyze_text(text, brand_names)


if __name__ == '__main__':
    # Example usage
    analyzer = NLPAnalyzer()
    
    # Test text analysis
    test_text = """
    URGENT: Your Apple ID has been suspended!
    
    Dear Customer,
    
    We have detected suspicious activity on your account. Your Apple ID has been 
    temporarily suspended for security reasons. You must verify your account 
    immediately to prevent permanent suspension.
    
    Click here to verify: http://secure-appleid-verify.com/login
    
    Failure to respond within 24 hours will result in account termination.
    
    Sincerely,
    Apple Security Team
    """
    
    result = analyzer.analyze_text(test_text, brand_names=['apple', 'apple id'])
    
    print("=== NLP Analysis Results ===\n")
    print(f"Entities found: {result['entities']['count']}")
    print(f"Brand mentions: {result['entities']['brand_mentions']}")
    print(f"\nSentiment: {result['sentiment']['dominant_emotion']} "
          f"(polarity: {result['sentiment']['polarity']:.2f})")
    print(f"\nRisk Level: {result['summary']['risk_level']}")
    print(f"Risk Factors: {result['summary']['risk_factors']}")
    print(f"\nKey Findings:")
    for finding in result['summary']['key_findings']:
        print(f"  - {finding}")
