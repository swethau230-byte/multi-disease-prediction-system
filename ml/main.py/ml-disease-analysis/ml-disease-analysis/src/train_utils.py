"""
train_utils.py
---------------
Shared, reusable training pipeline used by every train_<category>.py script.

Pipeline steps (same for every disease category):
  1. Load CSV
  2. Handle missing values (median for numeric columns)
  3. Split into train/test sets (stratified)
  4. Scale features with StandardScaler
  5. Train a RandomForestClassifier
  6. Evaluate: accuracy, precision, recall, f1, confusion matrix, ROC-AUC
  7. Save: model.pkl, scaler.pkl, feature_columns.json  -> models/<name>/
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report, roc_auc_score,
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


def train_pipeline(
    csv_path: str,
    feature_columns: list,
    target_column: str,
    model_name: str,
    n_estimators: int = 300,
    max_depth: int = 8,
    random_state: int = 42,
):
    """
    Trains a RandomForestClassifier on the given CSV and saves the model,
    scaler, and metadata into models/<model_name>/

    Returns a dict of evaluation metrics.
    """
    print(f"\n{'=' * 60}\nTraining model: {model_name}\n{'=' * 60}")

    # 1. Load data
    df = pd.read_csv(csv_path)

    # 2. Handle missing values -> fill numeric columns with column median
    for col in feature_columns:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())

    X = df[feature_columns].copy()
    y = df[target_column].copy()

    # 3. Train/test split (stratified so class balance is preserved)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state, stratify=y
    )

    # 4. Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 5. Train Random Forest (beginner-friendly, robust, no scaling strictly
    #    required for trees, but we scale anyway for consistency/future models)
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_leaf=3,
        random_state=random_state,
        class_weight="balanced",
        n_jobs=-1,
    )
    model.fit(X_train_scaled, y_train)

    # 6. Evaluate
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    metrics = {
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0), 4),
        "roc_auc": round(roc_auc_score(y_test, y_proba), 4),
    }

    print("Evaluation metrics:")
    for k, v in metrics.items():
        print(f"  {k:10s}: {v}")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Feature importance (helpful for explainability)
    importances = sorted(
        zip(feature_columns, model.feature_importances_),
        key=lambda x: x[1], reverse=True,
    )
    print("Top feature importances:")
    for feat, imp in importances[:5]:
        print(f"  {feat:30s}: {imp:.4f}")

    # 7. Save artifacts
    out_dir = os.path.join(MODELS_DIR, model_name)
    os.makedirs(out_dir, exist_ok=True)

    joblib.dump(model, os.path.join(out_dir, "model.pkl"))
    joblib.dump(scaler, os.path.join(out_dir, "scaler.pkl"))

    meta = {
        "model_name": model_name,
        "feature_columns": feature_columns,
        "target_column": target_column,
        "metrics": metrics,
        "n_train_samples": len(X_train),
        "n_test_samples": len(X_test),
    }
    with open(os.path.join(out_dir, "metadata.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"\nSaved model artifacts to: {out_dir}")
    return metrics
