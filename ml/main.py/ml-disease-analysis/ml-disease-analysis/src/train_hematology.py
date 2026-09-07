"""Train the Hematology (blood / liver-related analysis) risk model."""
import os
from train_utils import train_pipeline

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "hematology_liver.csv")

FEATURE_COLUMNS = [
    "age", "gender", "total_bilirubin", "direct_bilirubin",
    "alkaline_phosphotase", "alamine_aminotransferase",
    "aspartate_aminotransferase", "total_proteins", "albumin",
    "albumin_globulin_ratio",
]
TARGET_COLUMN = "target"

if __name__ == "__main__":
    train_pipeline(
        csv_path=CSV_PATH,
        feature_columns=FEATURE_COLUMNS,
        target_column=TARGET_COLUMN,
        model_name="hematology",
    )
