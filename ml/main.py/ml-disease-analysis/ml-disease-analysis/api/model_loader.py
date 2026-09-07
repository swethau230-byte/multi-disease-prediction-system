"""
model_loader.py
-----------------
Loads all trained models, scalers, and metadata once at API startup and
exposes a single `predict()` helper used by every endpoint.
"""
import os
import json
import joblib

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

CATEGORY_LABELS = {
    "cardiology": "Heart Disease Risk",
    "neurology": "Neurological / Stroke Risk",
    "diabetes": "Diabetes Risk",
    "hematology": "Liver / Blood Disorder Risk",
    "nephrology": "Chronic Kidney Disease Risk",
}

_registry = {}


def load_all_models():
    """Loads model.pkl, scaler.pkl and metadata.json for every category."""
    for category in CATEGORY_LABELS:
        model_dir = os.path.join(MODELS_DIR, category)
        model_path = os.path.join(model_dir, "model.pkl")
        scaler_path = os.path.join(model_dir, "scaler.pkl")
        meta_path = os.path.join(model_dir, "metadata.json")

        if not os.path.exists(model_path):
            print(f"[WARN] No trained model found for '{category}' at {model_path}. "
                  f"Run the training script first.")
            continue

        with open(meta_path) as f:
            metadata = json.load(f)

        _registry[category] = {
            "model": joblib.load(model_path),
            "scaler": joblib.load(scaler_path),
            "feature_columns": metadata["feature_columns"],
            "metrics": metadata.get("metrics", {}),
        }
        print(f"[OK] Loaded model: {category}  ({len(_registry[category]['feature_columns'])} features)")

    return _registry


def get_registry():
    return _registry


def predict(category: str, input_dict: dict):
    """
    Runs a prediction for the given category using the input dict (field
    names must match the feature_columns used during training).
    Returns (prediction, probability_of_positive_class).
    """
    if category not in _registry:
        raise ValueError(f"No model loaded for category '{category}'")

    entry = _registry[category]
    feature_columns = entry["feature_columns"]

    # Build the feature row in the EXACT order used during training
    try:
        row = [input_dict[col] for col in feature_columns]
    except KeyError as e:
        raise ValueError(f"Missing required field: {e}")

    scaled = entry["scaler"].transform([row])
    prediction = int(entry["model"].predict(scaled)[0])
    probability = float(entry["model"].predict_proba(scaled)[0][1])  # P(class=1)

    return prediction, probability
