"""
Training script for the ML threat detection models.
Trains and evaluates autoencoder and isolation forest models.
"""

import numpy as np
import json
import os
import argparse
import logging
from datetime import datetime
from typing import Dict, List
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns

from dataset_generator import BrandImpersonationDataset
from threat_detection_model import (
    AutoencoderThreatModel,
    IsolationForestThreatModel,
    EnsembleThreatModel
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelTrainer:
    """Trainer for threat detection models."""
    
    def __init__(self, output_dir: str = "models"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "plots"), exist_ok=True)
        
    def prepare_data(self, dataset_path: str = None, n_samples: int = 20000):
        """Prepare training and test data."""
        
        if dataset_path and os.path.exists(dataset_path):
            logger.info(f"Loading dataset from {dataset_path}")
            with open(dataset_path, 'r') as f:
                import json
                data = json.load(f)
                
            from dataclasses import dataclass
            @dataclass
            class Sample:
                domain: str
                brand_name: str
                label: int
                technique: str
                features: Dict
                
            dataset = [Sample(**item) for item in data]
        else:
            logger.info("Generating synthetic dataset...")
            generator = BrandImpersonationDataset(random_seed=42)
            dataset = generator.generate_dataset(
                n_samples=n_samples, 
                impersonation_ratio=0.5
            )
            
            # Save dataset
            generator.save_dataset(
                dataset, 
                os.path.join(self.output_dir, "training_dataset.json")
            )
        
        # Split features and labels
        X = np.array([list(s.features.values()) for s in dataset])
        y = np.array([s.label for s in dataset])
        
        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Separate legitimate samples for autoencoder training
        X_train_legitimate = X_train[y_train == 0]
        
        logger.info(f"Training samples: {len(X_train)} (legitimate: {len(X_train_legitimate)})")
        logger.info(f"Test samples: {len(X_test)}")
        logger.info(f"Feature count: {X.shape[1]}")
        
        return X_train, X_test, y_train, y_test, X_train_legitimate, dataset
    
    def train_autoencoder(self, X_train_legitimate: np.ndarray, 
                         X_val: np.ndarray = None,
                         epochs: int = 100,
                         batch_size: int = 32) -> AutoencoderThreatModel:
        """Train autoencoder model."""
        logger.info("\n=== Training Autoencoder ===")
        
        model = AutoencoderThreatModel(
            input_dim=X_train_legitimate.shape[1],
            encoding_dim=12
        )
        
        metrics = model.train(
            X_train_legitimate,
            X_val=X_val,
            epochs=epochs,
            batch_size=batch_size,
            threshold_percentile=95
        )
        
        logger.info(f"Training complete: {metrics}")
        
        # Save model
        model_path = os.path.join(self.output_dir, "autoencoder")
        model.save(model_path)
        
        return model
    
    def train_isolation_forest(self, X_train: np.ndarray,
                              contamination: float = 0.3) -> IsolationForestThreatModel:
        """Train isolation forest model."""
        logger.info("\n=== Training Isolation Forest ===")
        
        model = IsolationForestThreatModel(
            contamination=contamination,
            n_estimators=100
        )
        
        metrics = model.train(X_train)
        
        logger.info(f"Training complete: {metrics}")
        
        # Save model
        model_path = os.path.join(self.output_dir, "isolation_forest")
        model.save(model_path)
        
        return model
    
    def evaluate_model(self, model, X_test: np.ndarray, y_test: np.ndarray,
                      model_name: str) -> Dict:
        """Evaluate model performance."""
        logger.info(f"\n=== Evaluating {model_name} ===")
        
        # Get predictions
        predictions = []
        scores = []
        
        for i, x in enumerate(X_test):
            # Convert to feature dict
            feature_dict = {f"feature_{j}": x[j] for j in range(len(x))}
            
            try:
                result = model.predict(feature_dict)
                predictions.append(1 if result.is_threat else 0)
                scores.append(result.threat_score)
            except Exception as e:
                logger.warning(f"Prediction error: {e}")
                predictions.append(0)
                scores.append(0.0)
        
        predictions = np.array(predictions)
        scores = np.array(scores)
        
        # Calculate metrics
        report = classification_report(y_test, predictions, output_dict=True)
        
        try:
            auc = roc_auc_score(y_test, scores)
        except:
            auc = 0.5
        
        cm = confusion_matrix(y_test, predictions)
        
        metrics = {
            'model_name': model_name,
            'accuracy': report['accuracy'],
            'precision': report['1']['precision'] if '1' in report else 0,
            'recall': report['1']['recall'] if '1' in report else 0,
            'f1_score': report['1']['f1-score'] if '1' in report else 0,
            'auc_roc': auc,
            'confusion_matrix': cm.tolist(),
            'true_positives': int(cm[1, 1]) if cm.shape == (2, 2) else 0,
            'false_positives': int(cm[0, 1]) if cm.shape == (2, 2) else 0,
            'true_negatives': int(cm[0, 0]) if cm.shape == (2, 2) else 0,
            'false_negatives': int(cm[1, 0]) if cm.shape == (2, 2) else 0,
        }
        
        logger.info(f"Accuracy: {metrics['accuracy']:.3f}")
        logger.info(f"Precision: {metrics['precision']:.3f}")
        logger.info(f"Recall: {metrics['recall']:.3f}")
        logger.info(f"F1 Score: {metrics['f1_score']:.3f}")
        logger.info(f"AUC-ROC: {metrics['auc_roc']:.3f}")
        
        # Save confusion matrix plot
        self._plot_confusion_matrix(cm, model_name)
        
        # Save ROC curve
        self._plot_roc_curve(y_test, scores, model_name, auc)
        
        return metrics
    
    def _plot_confusion_matrix(self, cm: np.ndarray, model_name: str):
        """Plot and save confusion matrix."""
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=['Legitimate', 'Threat'],
                   yticklabels=['Legitimate', 'Threat'])
        plt.title(f'Confusion Matrix - {model_name}')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, "plots", f"{model_name}_confusion_matrix.png"))
        plt.close()
    
    def _plot_roc_curve(self, y_true: np.ndarray, y_scores: np.ndarray,
                       model_name: str, auc: float):
        """Plot and save ROC curve."""
        fpr, tpr, _ = roc_curve(y_true, y_scores)
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.3f})')
        plt.plot([0, 1], [0, 1], 'k--', label='Random')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title(f'ROC Curve - {model_name}')
        plt.legend(loc='lower right')
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, "plots", f"{model_name}_roc_curve.png"))
        plt.close()
    
    def run_full_training(self, epochs: int = 100, 
                         contamination: float = 0.3,
                         dataset_path: str = None,
                         n_samples: int = 20000):
        """Run full training pipeline."""
        
        logger.info("=" * 60)
        logger.info("Starting ML Threat Detection Model Training")
        logger.info("=" * 60)
        
        # Prepare data
        X_train, X_test, y_train, y_test, X_train_legitimate, dataset = self.prepare_data(
            dataset_path, n_samples
        )
        
        # Store feature names for model compatibility
        if dataset:
            feature_names = list(dataset[0].features.keys())
            with open(os.path.join(self.output_dir, "feature_names.json"), 'w') as f:
                json.dump(feature_names, f)
        
        # Train models
        autoencoder = self.train_autoencoder(
            X_train_legitimate, 
            epochs=epochs
        )
        
        iso_forest = self.train_isolation_forest(
            X_train, 
            contamination=contamination
        )
        
        # Evaluate models
        results = {}
        results['autoencoder'] = self.evaluate_model(
            autoencoder, X_test, y_test, "autoencoder"
        )
        results['isolation_forest'] = self.evaluate_model(
            iso_forest, X_test, y_test, "isolation_forest"
        )
        
        # Save results
        with open(os.path.join(self.output_dir, "evaluation_results.json"), 'w') as f:
            json.dump(results, f, indent=2)
        
        # Create summary report
        self._create_summary_report(results)
        
        logger.info("\n" + "=" * 60)
        logger.info("Training Complete!")
        logger.info(f"Models saved to: {self.output_dir}")
        logger.info("=" * 60)
        
        return results
    
    def _create_summary_report(self, results: Dict):
        """Create summary report of training results."""
        report_path = os.path.join(self.output_dir, "training_report.txt")
        
        with open(report_path, 'w') as f:
            f.write("=" * 60 + "\n")
            f.write("ML Threat Detection Training Report\n")
            f.write(f"Generated: {datetime.now().isoformat()}\n")
            f.write("=" * 60 + "\n\n")
            
            for model_name, metrics in results.items():
                f.write(f"\n{model_name.upper()}\n")
                f.write("-" * 40 + "\n")
                f.write(f"Accuracy:  {metrics['accuracy']:.3f}\n")
                f.write(f"Precision: {metrics['precision']:.3f}\n")
                f.write(f"Recall:    {metrics['recall']:.3f}\n")
                f.write(f"F1 Score:  {metrics['f1_score']:.3f}\n")
                f.write(f"AUC-ROC:   {metrics['auc_roc']:.3f}\n")
                f.write(f"\nConfusion Matrix:\n")
                f.write(f"  True Negatives:  {metrics['true_negatives']}\n")
                f.write(f"  False Positives: {metrics['false_positives']}\n")
                f.write(f"  False Negatives: {metrics['false_negatives']}\n")
                f.write(f"  True Positives:  {metrics['true_positives']}\n")
        
        logger.info(f"Summary report saved to {report_path}")


def main():
    parser = argparse.ArgumentParser(description="Train ML threat detection models")
    parser.add_argument("--output-dir", default="models", help="Output directory for models")
    parser.add_argument("--dataset", default=None, help="Path to existing dataset JSON")
    parser.add_argument("--n-samples", type=int, default=20000, help="Number of samples to generate")
    parser.add_argument("--epochs", type=int, default=100, help="Training epochs for autoencoder")
    parser.add_argument("--contamination", type=float, default=0.3, 
                       help="Expected proportion of anomalies (isolation forest)")
    
    args = parser.parse_args()
    
    trainer = ModelTrainer(output_dir=args.output_dir)
    trainer.run_full_training(
        epochs=args.epochs,
        contamination=args.contamination,
        dataset_path=args.dataset,
        n_samples=args.n_samples
    )


if __name__ == "__main__":
    main()
