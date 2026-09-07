"""
train_all.py
-------------
Runs all 5 training scripts one after another and prints a final summary.
Usage:  python src/train_all.py
"""
import json
import os
from train_utils import train_pipeline

import train_cardiology as cardio
import train_neurology as neuro
import train_diabetes as diab
import train_hematology as hema
import train_nephrology as nephro

MODULES = [
    ("cardiology", cardio),
    ("neurology", neuro),
    ("diabetes", diab),
    ("hematology", hema),
    ("nephrology", nephro),
]

if __name__ == "__main__":
    summary = {}
    for name, mod in MODULES:
        metrics = train_pipeline(
            csv_path=mod.CSV_PATH,
            feature_columns=mod.FEATURE_COLUMNS,
            target_column=mod.TARGET_COLUMN,
            model_name=name,
        )
        summary[name] = metrics

    print("\n" + "=" * 60)
    print("TRAINING SUMMARY - ALL MODELS")
    print("=" * 60)
    print(f"{'Model':15s} {'Accuracy':10s} {'Precision':10s} {'Recall':10s} {'F1':10s} {'ROC-AUC':10s}")
    for name, m in summary.items():
        print(f"{name:15s} {m['accuracy']:<10} {m['precision']:<10} "
              f"{m['recall']:<10} {m['f1_score']:<10} {m['roc_auc']:<10}")

    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    with open(os.path.join(models_dir, "training_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    print(f"\nSummary saved to {models_dir}/training_summary.json")
