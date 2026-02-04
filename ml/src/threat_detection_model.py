"""
TensorFlow-based anomaly detection model for brand impersonation detection.
Implements Autoencoder and Isolation Forest approaches for detecting anomalous domains.
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Model
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import json
import os
from typing import List, Dict, Tuple, Optional, Union
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DetectionResult:
    """Result from threat detection."""
    domain: str
    brand_name: str
    is_threat: bool
    threat_score: float
    confidence: float
    technique: Optional[str]
    features: Dict
    model_type: str

class ThreatDetectionModel:
    """Base class for threat detection models."""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.scaler = StandardScaler()
        self.feature_names = []
        self.is_trained = False
    
    def preprocess_features(self, features: List[Dict]) -> np.ndarray:
        """Convert feature dictionaries to numpy array."""
        if not features:
            return np.array([])
        
        # Ensure consistent feature order
        if not self.feature_names and features:
            self.feature_names = list(features[0].keys())
        
        X = np.array([[f.get(name, 0) for name in self.feature_names] for f in features])
        return X
    
    def save(self, path: str):
        """Save model to disk."""
        raise NotImplementedError
    
    def load(self, path: str):
        """Load model from disk."""
        raise NotImplementedError
    
    def predict(self, features: Dict) -> DetectionResult:
        """Predict if a domain is a threat."""
        raise NotImplementedError


class AutoencoderThreatModel(ThreatDetectionModel):
    """Autoencoder-based anomaly detection for brand impersonation."""
    
    def __init__(self, input_dim: int = 25, encoding_dim: int = 12, 
                 model_path: Optional[str] = None):
        super().__init__(model_path)
        self.input_dim = input_dim
        self.encoding_dim = encoding_dim
        self.autoencoder = None
        self.encoder = None
        self.threshold = 0.5
        self.history = None
        
    def build_model(self) -> Model:
        """Build the autoencoder architecture."""
        # Input layer
        input_layer = layers.Input(shape=(self.input_dim,))
        
        # Encoder
        encoded = layers.Dense(64, activation='relu')(input_layer)
        encoded = layers.BatchNormalization()(encoded)
        encoded = layers.Dropout(0.2)(encoded)
        
        encoded = layers.Dense(32, activation='relu')(encoded)
        encoded = layers.BatchNormalization()(encoded)
        encoded = layers.Dropout(0.2)(encoded)
        
        encoded = layers.Dense(self.encoding_dim, activation='relu', name='bottleneck')(encoded)
        
        # Decoder
        decoded = layers.Dense(32, activation='relu')(encoded)
        decoded = layers.BatchNormalization()(decoded)
        decoded = layers.Dropout(0.2)(decoded)
        
        decoded = layers.Dense(64, activation='relu')(decoded)
        decoded = layers.BatchNormalization()(decoded)
        
        decoded = layers.Dense(self.input_dim, activation='linear', name='output')(decoded)
        
        # Create models
        self.autoencoder = Model(input_layer, decoded)
        self.encoder = Model(input_layer, encoded)
        
        # Compile
        self.autoencoder.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return self.autoencoder
    
    def train(self, X_train: np.ndarray, X_val: Optional[np.ndarray] = None,
              epochs: int = 100, batch_size: int = 32, 
              threshold_percentile: float = 95) -> Dict:
        """Train the autoencoder on legitimate samples."""
        
        if self.autoencoder is None:
            self.input_dim = X_train.shape[1]
            self.build_model()
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Create validation data
        validation_data = None
        if X_val is not None:
            X_val_scaled = self.scaler.transform(X_val)
            validation_data = (X_val_scaled, X_val_scaled)
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss' if X_val is not None else 'loss',
                patience=10,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss' if X_val is not None else 'loss',
                factor=0.5,
                patience=5,
                min_lr=1e-6
            )
        ]
        
        # Train
        logger.info("Training autoencoder...")
        self.history = self.autoencoder.fit(
            X_train_scaled, X_train_scaled,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=validation_data,
            callbacks=callbacks,
            verbose=1
        )
        
        # Calculate reconstruction error threshold on training data
        reconstructions = self.autoencoder.predict(X_train_scaled, verbose=0)
        mse = np.mean(np.power(X_train_scaled - reconstructions, 2), axis=1)
        self.threshold = np.percentile(mse, threshold_percentile)
        
        self.is_trained = True
        
        return {
            'final_loss': self.history.history['loss'][-1],
            'threshold': self.threshold,
            'epochs_trained': len(self.history.history['loss'])
        }
    
    def predict(self, features: Dict, brand_name: str = "") -> DetectionResult:
        """Predict if a domain is a threat using reconstruction error."""
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        # Preprocess
        X = self.preprocess_features([features])
        X_scaled = self.scaler.transform(X)
        
        # Reconstruct
        reconstruction = self.autoencoder.predict(X_scaled, verbose=0)
        mse = np.mean(np.power(X_scaled - reconstruction, 2))
        
        # Calculate threat score (normalized by threshold)
        threat_score = min(mse / (self.threshold + 1e-10), 1.0)
        
        # Determine if threat
        is_threat = mse > self.threshold
        
        # Confidence based on distance from threshold
        confidence = min(abs(mse - self.threshold) / (self.threshold + 1e-10), 1.0)
        
        # Detect technique
        technique = self._detect_technique(features)
        
        return DetectionResult(
            domain=features.get('domain', ''),
            brand_name=brand_name,
            is_threat=is_threat,
            threat_score=float(threat_score),
            confidence=float(confidence),
            technique=technique,
            features=features,
            model_type='autoencoder'
        )
    
    def predict_batch(self, features_list: List[Dict], 
                     brand_names: List[str] = None) -> List[DetectionResult]:
        """Predict batch of domains."""
        if brand_names is None:
            brand_names = [''] * len(features_list)
        
        results = []
        for features, brand in zip(features_list, brand_names):
            results.append(self.predict(features, brand))
        return results
    
    def _detect_technique(self, features: Dict) -> Optional[str]:
        """Detect the impersonation technique from features."""
        techniques = []
        
        if features.get('has_homoglyph', 0):
            techniques.append('homoglyph')
        
        if features.get('suspicious_tld', 0):
            techniques.append('suspicious_tld')
        
        if features.get('hyphen_count', 0) > 1:
            techniques.append('combo_squatting')
        
        if features.get('has_phishing_keyword', 0):
            techniques.append('phishing_keyword')
        
        if features.get('levenshtein_distance', 0) <= 2 and features.get('levenshtein_distance', 0) > 0:
            techniques.append('typosquatting')
        
        if features.get('max_char_repetition', 0) > 2:
            techniques.append('character_repetition')
        
        return ','.join(techniques) if techniques else None
    
    def save(self, path: str):
        """Save model to disk."""
        os.makedirs(path, exist_ok=True)
        
        # Save Keras model
        self.autoencoder.save(os.path.join(path, 'autoencoder.keras'))
        
        # Save scaler
        joblib.dump(self.scaler, os.path.join(path, 'scaler.joblib'))
        
        # Save config
        config = {
            'input_dim': self.input_dim,
            'encoding_dim': self.encoding_dim,
            'threshold': float(self.threshold),
            'feature_names': self.feature_names,
            'model_type': 'autoencoder'
        }
        with open(os.path.join(path, 'config.json'), 'w') as f:
            json.dump(config, f, indent=2)
        
        logger.info(f"Model saved to {path}")
    
    def load(self, path: str):
        """Load model from disk."""
        # Load config
        with open(os.path.join(path, 'config.json'), 'r') as f:
            config = json.load(f)
        
        self.input_dim = config['input_dim']
        self.encoding_dim = config['encoding_dim']
        self.threshold = config['threshold']
        self.feature_names = config['feature_names']
        
        # Load Keras model
        self.autoencoder = keras.models.load_model(os.path.join(path, 'autoencoder.keras'))
        
        # Rebuild encoder from loaded model
        self.encoder = Model(
            inputs=self.autoencoder.input,
            outputs=self.autoencoder.get_layer('bottleneck').output
        )
        
        # Load scaler
        self.scaler = joblib.load(os.path.join(path, 'scaler.joblib'))
        
        self.is_trained = True
        logger.info(f"Model loaded from {path}")


class IsolationForestThreatModel(ThreatDetectionModel):
    """Isolation Forest based anomaly detection."""
    
    def __init__(self, contamination: float = 0.1, 
                 n_estimators: int = 100,
                 model_path: Optional[str] = None):
        super().__init__(model_path)
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.model = IsolationForest(
            n_estimators=n_estimators,
            contamination=contamination,
            random_state=42,
            n_jobs=-1
        )
    
    def train(self, X_train: np.ndarray) -> Dict:
        """Train the isolation forest."""
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        logger.info("Training isolation forest...")
        self.model.fit(X_train_scaled)
        
        self.is_trained = True
        
        # Calculate anomaly scores on training data
        scores = self.model.decision_function(X_train_scaled)
        
        return {
            'mean_score': float(np.mean(scores)),
            'std_score': float(np.std(scores))
        }
    
    def predict(self, features: Dict, brand_name: str = "") -> DetectionResult:
        """Predict if a domain is a threat."""
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        # Preprocess
        X = self.preprocess_features([features])
        X_scaled = self.scaler.transform(X)
        
        # Get anomaly score (negative = more anomalous)
        anomaly_score = self.model.decision_function(X_scaled)[0]
        is_anomaly = self.model.predict(X_scaled)[0] == -1
        
        # Convert to threat score (0-1)
        threat_score = 1.0 - (anomaly_score + 0.5)  # Normalize
        threat_score = max(0.0, min(1.0, threat_score))
        
        # Confidence
        confidence = abs(anomaly_score)
        
        # Detect technique
        technique = self._detect_technique(features)
        
        return DetectionResult(
            domain=features.get('domain', ''),
            brand_name=brand_name,
            is_threat=is_anomaly,
            threat_score=float(threat_score),
            confidence=float(confidence),
            technique=technique,
            features=features,
            model_type='isolation_forest'
        )
    
    def _detect_technique(self, features: Dict) -> Optional[str]:
        """Detect the impersonation technique from features."""
        techniques = []
        
        if features.get('has_homoglyph', 0):
            techniques.append('homoglyph')
        
        if features.get('suspicious_tld', 0):
            techniques.append('suspicious_tld')
        
        if features.get('hyphen_count', 0) > 1:
            techniques.append('combo_squatting')
        
        if features.get('has_phishing_keyword', 0):
            techniques.append('phishing_keyword')
        
        if features.get('levenshtein_distance', 0) <= 2 and features.get('levenshtein_distance', 0) > 0:
            techniques.append('typosquatting')
        
        return ','.join(techniques) if techniques else None
    
    def save(self, path: str):
        """Save model to disk."""
        os.makedirs(path, exist_ok=True)
        
        # Save isolation forest model
        joblib.dump(self.model, os.path.join(path, 'isolation_forest.joblib'))
        
        # Save scaler
        joblib.dump(self.scaler, os.path.join(path, 'scaler.joblib'))
        
        # Save config
        config = {
            'contamination': self.contamination,
            'n_estimators': self.n_estimators,
            'feature_names': self.feature_names,
            'model_type': 'isolation_forest'
        }
        with open(os.path.join(path, 'config.json'), 'w') as f:
            json.dump(config, f, indent=2)
        
        logger.info(f"Model saved to {path}")
    
    def load(self, path: str):
        """Load model from disk."""
        # Load config
        with open(os.path.join(path, 'config.json'), 'r') as f:
            config = json.load(f)
        
        self.contamination = config['contamination']
        self.n_estimators = config['n_estimators']
        self.feature_names = config['feature_names']
        
        # Load model
        self.model = joblib.load(os.path.join(path, 'isolation_forest.joblib'))
        
        # Load scaler
        self.scaler = joblib.load(os.path.join(path, 'scaler.joblib'))
        
        self.is_trained = True
        logger.info(f"Model loaded from {path}")


class EnsembleThreatModel:
    """Ensemble of multiple threat detection models."""
    
    def __init__(self, models: Optional[List[ThreatDetectionModel]] = None):
        self.models = models or []
        self.weights = []
    
    def add_model(self, model: ThreatDetectionModel, weight: float = 1.0):
        """Add a model to the ensemble."""
        self.models.append(model)
        self.weights.append(weight)
    
    def predict(self, features: Dict, brand_name: str = "") -> DetectionResult:
        """Predict using ensemble of models."""
        if not self.models:
            raise ValueError("No models in ensemble")
        
        # Get predictions from all models
        predictions = [model.predict(features, brand_name) for model in self.models]
        
        # Weighted average of threat scores
        total_weight = sum(self.weights)
        weighted_score = sum(
            p.threat_score * w for p, w in zip(predictions, self.weights)
        ) / total_weight
        
        # Majority vote for is_threat
        threat_votes = sum(1 for p in predictions if p.is_threat)
        is_threat = threat_votes >= len(self.models) / 2
        
        # Average confidence
        avg_confidence = sum(p.confidence for p in predictions) / len(predictions)
        
        # Combine techniques
        all_techniques = set()
        for p in predictions:
            if p.technique:
                all_techniques.update(p.technique.split(','))
        technique = ','.join(sorted(all_techniques)) if all_techniques else None
        
        return DetectionResult(
            domain=features.get('domain', ''),
            brand_name=brand_name,
            is_threat=is_threat,
            threat_score=float(weighted_score),
            confidence=float(avg_confidence),
            technique=technique,
            features=features,
            model_type='ensemble'
        )


if __name__ == '__main__':
    # Example usage
    from dataset_generator import BrandImpersonationDataset
    
    # Generate dataset
    generator = BrandImpersonationDataset(random_seed=42)
    dataset = generator.generate_dataset(n_samples=5000, impersonation_ratio=0.3)
    
    # Split into train and test
    train_size = int(len(dataset) * 0.8)
    train_data = dataset[:train_size]
    test_data = dataset[train_size:]
    
    # Prepare features
    X_train = np.array([list(s.features.values()) for s in train_data])
    y_train = np.array([s.label for s in train_data])
    
    # Train on only legitimate samples for anomaly detection
    X_train_legitimate = X_train[y_train == 0]
    
    # Train autoencoder
    print("Training Autoencoder...")
    autoencoder = AutoencoderThreatModel(input_dim=X_train.shape[1])
    metrics = autoencoder.train(X_train_legitimate, epochs=50)
    print(f"Training complete: {metrics}")
    
    # Train isolation forest
    print("\nTraining Isolation Forest...")
    iso_forest = IsolationForestThreatModel(contamination=0.3)
    metrics = iso_forest.train(X_train)
    print(f"Training complete: {metrics}")
    
    # Test on a few samples
    print("\nTesting predictions:")
    for sample in test_data[:10]:
        result = autoencoder.predict(sample.features, sample.brand_name)
        print(f"{sample.domain}: threat={result.is_threat}, score={result.threat_score:.3f}, technique={result.technique}")
    
    # Save models
    autoencoder.save('models/autoencoder')
    iso_forest.save('models/isolation_forest')
