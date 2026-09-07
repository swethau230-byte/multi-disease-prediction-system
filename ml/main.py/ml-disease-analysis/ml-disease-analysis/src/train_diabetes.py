"""Train the Diabetes Care risk model."""
import os
from train_utils import train_pipeline

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "diabetes.csv")

FEATURE_COLUMNS = [
    "pregnancies", "glucose", "blood_pressure", "skin_thickness",
    "insulin", "bmi", "diabetes_pedigree_function", "age",
]
TARGET_COLUMN = "target"

if __name__ == "__main__":
    train_pipeline(
        csv_path=CSV_PATH,
        feature_columns=FEATURE_COLUMNS,
        target_column=TARGET_COLUMN,
        model_name="diabetes",
    )
