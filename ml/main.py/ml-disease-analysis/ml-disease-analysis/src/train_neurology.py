"""Train the Neurology (neurological / stroke) risk model."""
import os
from train_utils import train_pipeline

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "neurology_stroke.csv")

FEATURE_COLUMNS = [
    "age", "hypertension", "heart_disease", "avg_glucose_level", "bmi",
    "ever_married", "work_type", "residence_type", "smoking_status",
]
TARGET_COLUMN = "target"

if __name__ == "__main__":
    train_pipeline(
        csv_path=CSV_PATH,
        feature_columns=FEATURE_COLUMNS,
        target_column=TARGET_COLUMN,
        model_name="neurology",
    )
