"""Train the Nephrology (kidney disease) risk model."""
import os
from train_utils import train_pipeline

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nephrology_kidney.csv")

FEATURE_COLUMNS = [
    "age", "bp", "sg", "al", "su", "bgr", "bu", "sc",
    "sod", "pot", "hemo", "pcv", "wc", "rc",
]
TARGET_COLUMN = "target"

if __name__ == "__main__":
    train_pipeline(
        csv_path=CSV_PATH,
        feature_columns=FEATURE_COLUMNS,
        target_column=TARGET_COLUMN,
        model_name="nephrology",
    )
