"""Train the Cardiology (heart disease) risk model."""
import os
from train_utils import train_pipeline

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "cardiology_heart.csv")

FEATURE_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]
TARGET_COLUMN = "target"

if __name__ == "__main__":
    train_pipeline(
        csv_path=CSV_PATH,
        feature_columns=FEATURE_COLUMNS,
        target_column=TARGET_COLUMN,
        model_name="cardiology",
    )
