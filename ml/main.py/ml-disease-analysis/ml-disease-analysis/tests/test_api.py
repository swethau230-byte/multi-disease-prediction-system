"""
test_api.py
------------
Quick smoke test for all 5 endpoints. Make sure the API is already running
(uvicorn api.main:app --reload --port 8000) before running this script.

Usage:
    python tests/test_api.py
"""
import requests

BASE_URL = "http://127.0.0.1:8000"

SAMPLES = {
    "cardiology": {
        "age": 58, "sex": 1, "cp": 2, "trestbps": 140, "chol": 289,
        "fbs": 0, "restecg": 1, "thalach": 140, "exang": 1,
        "oldpeak": 2.1, "slope": 1, "ca": 1, "thal": 2,
    },
    "neurology": {
        "age": 67, "hypertension": 1, "heart_disease": 1,
        "avg_glucose_level": 190.5, "bmi": 32.1, "ever_married": 1,
        "work_type": 0, "residence_type": 1, "smoking_status": 2,
    },
    "diabetes": {
        "pregnancies": 4, "glucose": 155, "blood_pressure": 78,
        "skin_thickness": 30, "insulin": 130, "bmi": 34.5,
        "diabetes_pedigree_function": 0.9, "age": 45,
    },
    "hematology": {
        "age": 52, "gender": 1, "total_bilirubin": 4.5,
        "direct_bilirubin": 2.1, "alkaline_phosphotase": 450,
        "alamine_aminotransferase": 120, "aspartate_aminotransferase": 150,
        "total_proteins": 6.0, "albumin": 2.5, "albumin_globulin_ratio": 0.7,
    },
    "nephrology": {
        "age": 63, "bp": 90, "sg": 1.01, "al": 3, "su": 1,
        "bgr": 210, "bu": 95, "sc": 3.8, "sod": 132, "pot": 5.2,
        "hemo": 9.8, "pcv": 30, "wc": 9800, "rc": 3.9,
    },
}


def main():
    print(f"Checking API health at {BASE_URL} ...")
    health = requests.get(f"{BASE_URL}/health").json()
    print(health, "\n")

    for category, payload in SAMPLES.items():
        resp = requests.post(f"{BASE_URL}/predict/{category}", json=payload)
        print(f"POST /predict/{category}  -> status {resp.status_code}")
        print(resp.json(), "\n")


if __name__ == "__main__":
    main()
