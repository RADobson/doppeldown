"""
Demo script for ML threat detection system.
Shows how to use the ML components for brand impersonation detection.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from dataset_generator import BrandImpersonationDataset
from threat_detection_model import AutoencoderThreatModel, IsolationForestThreatModel
from realtime_scorer import RealTimeThreatScorer
import numpy as np

def print_separator(title=""):
    """Print a separator line."""
    width = 60
    if title:
        print(f"\n{'='*width}")
        print(f" {title}")
        print(f"{'='*width}")
    else:
        print(f"\n{'='*width}")


def demo_dataset_generation():
    """Demonstrate dataset generation."""
    print_separator("DATASET GENERATION DEMO")
    
    generator = BrandImpersonationDataset(random_seed=42)
    
    # Generate a small dataset
    print("\nGenerating 500 samples...")
    dataset = generator.generate_dataset(n_samples=500, impersonation_ratio=0.5)
    
    print(f"Total samples: {len(dataset)}")
    print(f"Impersonation samples: {sum(1 for s in dataset if s.label == 1)}")
    print(f"Legitimate samples: {sum(1 for s in dataset if s.label == 0)}")
    
    # Show some examples
    print("\n--- Sample Impersonation Techniques ---")
    from collections import Counter
    techniques = Counter(s.technique for s in dataset)
    for tech, count in techniques.most_common(10):
        print(f"  {tech}: {count} samples")
    
    # Show individual examples
    print("\n--- Sample Domains ---")
    threats = [s for s in dataset if s.label == 1][:5]
    for s in threats:
        print(f"  {s.domain} (technique: {s.technique})")
    
    return dataset


def demo_feature_extraction(dataset):
    """Demonstrate feature extraction."""
    print_separator("FEATURE EXTRACTION DEMO")
    
    # Show features for a sample
    sample = dataset[0]
    print(f"\nDomain: {sample.domain}")
    print(f"Brand: {sample.brand_name}")
    print(f"Label: {'Threat' if sample.label else 'Legitimate'}")
    print(f"Technique: {sample.technique}")
    
    print("\n--- Extracted Features ---")
    for feature_name, value in list(sample.features.items())[:15]:
        print(f"  {feature_name}: {value:.4f}" if isinstance(value, float) else f"  {feature_name}: {value}")
    
    return sample.features


def demo_model_training(dataset):
    """Demonstrate model training."""
    print_separator("MODEL TRAINING DEMO")
    
    # Prepare data
    X = np.array([list(s.features.values()) for s in dataset])
    y = np.array([s.label for s in dataset])
    X_legitimate = X[y == 0]
    
    print(f"\nTraining data shape: {X.shape}")
    print(f"Legitimate samples for autoencoder: {len(X_legitimate)}")
    
    # Train autoencoder
    print("\n--- Training Autoencoder ---")
    autoencoder = AutoencoderThreatModel(input_dim=X.shape[1])
    metrics = autoencoder.train(X_legitimate, epochs=30, batch_size=32)
    print(f"Training complete!")
    print(f"  Final loss: {metrics['final_loss']:.6f}")
    print(f"  Anomaly threshold: {metrics['threshold']:.6f}")
    print(f"  Epochs trained: {metrics['epochs_trained']}")
    
    # Train isolation forest
    print("\n--- Training Isolation Forest ---")
    iso_forest = IsolationForestThreatModel(contamination=0.3)
    metrics = iso_forest.train(X)
    print(f"Training complete!")
    print(f"  Mean score: {metrics['mean_score']:.4f}")
    print(f"  Std score: {metrics['std_score']:.4f}")
    
    return autoencoder, iso_forest


def demo_predictions(autoencoder, iso_forest, dataset):
    """Demonstrate threat predictions."""
    print_separator("PREDICTION DEMO")
    
    # Test on known threats
    test_samples = [s for s in dataset if s.label == 1][:5]
    test_samples += [s for s in dataset if s.label == 0][:2]
    
    print("\n--- Autoencoder Predictions ---")
    for sample in test_samples:
        result = autoencoder.predict(sample.features, sample.brand_name)
        print(f"\n  {sample.domain}")
        print(f"    True label: {'Threat' if sample.label else 'Legitimate'}")
        print(f"    Predicted: {'Threat' if result.is_threat else 'Legitimate'}")
        print(f"    Threat score: {result.threat_score:.3f}")
        print(f"    Confidence: {result.confidence:.3f}")
        if result.technique:
            print(f"    Detected techniques: {result.technique}")
    
    print("\n--- Isolation Forest Predictions ---")
    for sample in test_samples[:3]:
        result = iso_forest.predict(sample.features, sample.brand_name)
        print(f"\n  {sample.domain}")
        print(f"    True label: {'Threat' if sample.label else 'Legitimate'}")
        print(f"    Predicted: {'Threat' if result.is_threat else 'Legitimate'}")
        print(f"    Threat score: {result.threat_score:.3f}")


def demo_realtime_scorer():
    """Demonstrate real-time threat scoring."""
    print_separator("REAL-TIME SCORING DEMO")
    
    print("\nInitializing Real-Time Threat Scorer...")
    print("(This may take a moment to train default models)")
    
    scorer = RealTimeThreatScorer()
    
    # Test domains
    test_domains = [
        ("google.com", "google"),
        ("g00gle.com", "google"),
        ("googIe.com", "google"),
        ("google-security.com", "google"),
        ("secure-google-login.com", "google"),
        ("gooogle.com", "google"),
        ("microsoft.com", "microsoft"),
        ("micr0soft.com", "microsoft"),
        ("paypa1.com", "paypal"),
        ("amazon-verify.com", "amazon"),
    ]
    
    print("\n--- Domain Scoring Results ---")
    print(f"{'Domain':<35} {'Score':>8} {'Risk':>10} {'Time (ms)':>10}")
    print("-" * 65)
    
    for domain, brand in test_domains:
        result = scorer.score_domain(domain, brand)
        print(f"{result.domain:<35} {result.threat_score:>8.3f} {result.risk_level:>10} {result.scan_duration_ms:>10.2f}")
    
    # Show detailed results for threats
    print("\n--- Detailed Threat Analysis ---")
    for domain, brand in test_domains:
        result = scorer.score_domain(domain, brand)
        if result.is_threat:
            print(f"\n  {domain}:")
            print(f"    Risk Level: {result.risk_level.upper()}")
            print(f"    Confidence: {result.confidence:.3f}")
            print(f"    Techniques: {', '.join(result.detected_techniques)}")
            print(f"    Recommendations:")
            for rec in result.recommendations:
                print(f"      - {rec}")


def demo_social_scoring():
    """Demonstrate social media threat scoring."""
    print_separator("SOCIAL MEDIA SCORING DEMO")
    
    scorer = RealTimeThreatScorer()
    
    # Test social profiles
    test_profiles = [
        ("google", "twitter", "google"),
        ("google123", "twitter", "google"),
        ("google_official", "instagram", "google"),
        ("google_official_fake", "facebook", "google"),
        ("gooogle", "tiktok", "google"),
        ("_google", "linkedin", "google"),
        ("microsoft", "twitter", "microsoft"),
        ("microsoft_tech", "twitter", "microsoft"),
    ]
    
    print("\n--- Social Media Profile Scoring ---")
    print(f"{'Platform':<12} {'Username':<25} {'Score':>8} {'Risk':>10}")
    print("-" * 60)
    
    for username, platform, brand in test_profiles:
        result = scorer.score_social_profile(username, platform, brand)
        display_name = f"@{username}"
        print(f"{platform:<12} {display_name:<25} {result.threat_score:>8.3f} {result.risk_level:>10}")


def demo_batch_scoring():
    """Demonstrate batch scoring."""
    print_separator("BATCH SCORING DEMO")
    
    scorer = RealTimeThreatScorer()
    
    # Generate many variants
    generator = BrandImpersonationDataset()
    brand = "apple"
    
    variants = [
        f"{brand}.com",
        f"{brand}-support.com",
        f"{brand}id.com",
        f"{brand}verify.com",
        f"secure-{brand}.com",
        f"{brand}-login.net",
        f"{brand}store.xyz",
        f"my{brand}.com",
        f"{brand}security.tk",
        f"{brand}cloud.co",
    ]
    
    print(f"\nBatch scoring {len(variants)} domains for brand '{brand}'...")
    
    import time
    start = time.time()
    results = scorer.batch_score_domains(variants, brand)
    elapsed = (time.time() - start) * 1000
    
    print(f"\n--- Batch Results ---")
    print(f"Total time: {elapsed:.2f}ms")
    print(f"Average per domain: {elapsed/len(variants):.2f}ms")
    print(f"Threats detected: {sum(1 for r in results if r.is_threat)}")
    
    print(f"\n{'Domain':<30} {'Score':>8} {'Risk':>10}")
    print("-" * 50)
    for result in results:
        print(f"{result.domain:<30} {result.threat_score:>8.3f} {result.risk_level:>10}")


def main():
    """Run all demos."""
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║     DoppelDown ML Threat Detection System Demo            ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    
    # Run demos
    dataset = demo_dataset_generation()
    demo_feature_extraction(dataset)
    
    print("\n[Training models on sample data...]")
    autoencoder, iso_forest = demo_model_training(dataset)
    
    demo_predictions(autoencoder, iso_forest, dataset)
    demo_realtime_scorer()
    demo_social_scoring()
    demo_batch_scoring()
    
    print_separator("DEMO COMPLETE")
    print("\nTo use this in production:")
    print("  1. Train models: python src/train.py")
    print("  2. Start API: python src/api_server.py")
    print("  3. Integrate with doppeldown scan system")
    print("\nSee ml/README.md for more details.")
    print_separator()


if __name__ == "__main__":
    main()
