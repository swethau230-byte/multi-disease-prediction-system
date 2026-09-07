"""
generate_sample_data.py
------------------------
Generates realistic, ready-to-use CSV datasets for all 5 disease categories.

IMPORTANT:
These datasets are SYNTHETICALLY generated (with realistic value ranges and
correlations to the target) so that the whole pipeline runs out-of-the-box
without needing internet access. The column schema of each file matches a
well-known real public dataset, so you can drop in the real data later
with ZERO code changes. Recommended real sources:

  1. Cardiology  -> UCI Heart Disease Dataset
     https://archive.ics.uci.edu/dataset/45/heart+disease
  2. Neurology   -> Stroke Prediction Dataset (Kaggle)
     https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset
  3. Diabetes    -> Pima Indians Diabetes Dataset
     https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database
  4. Hematology  -> Indian Liver Patient Dataset (ILPD)
     https://archive.ics.uci.edu/dataset/225/ilpd+indian+liver+patient+dataset
  5. Nephrology  -> UCI Chronic Kidney Disease Dataset
     https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease

To use real data: download the CSV, rename its columns to match the schema
used in each train_*.py file (see the FEATURE list in each script), and
place it in the data/ folder with the same filename. Everything else
(training, scaling, API) will keep working unchanged.
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)


def save(df, name):
    path = os.path.join(DATA_DIR, name)
    df.to_csv(path, index=False)
    print(f"Saved {path}  shape={df.shape}")


# ---------------------------------------------------------------------
# 1. CARDIOLOGY - Heart Disease (schema: UCI Heart Disease dataset)
# ---------------------------------------------------------------------
def generate_cardiology(n=900):
    age = np.random.randint(29, 78, n)
    sex = np.random.randint(0, 2, n)  # 1 = male, 0 = female
    cp = np.random.randint(0, 4, n)  # chest pain type
    trestbps = np.random.normal(131, 17, n).clip(90, 200)  # resting BP
    chol = np.random.normal(246, 51, n).clip(120, 570)  # cholesterol
    fbs = np.random.binomial(1, 0.15, n)  # fasting blood sugar > 120
    restecg = np.random.randint(0, 3, n)
    thalach = np.random.normal(149, 23, n).clip(70, 202)  # max heart rate
    exang = np.random.binomial(1, 0.33, n)  # exercise induced angina
    oldpeak = np.random.exponential(1.0, n).clip(0, 6.2)
    slope = np.random.randint(0, 3, n)
    ca = np.random.randint(0, 4, n)  # number of major vessels
    thal = np.random.randint(0, 3, n)

    risk_score = (
        0.03 * age + 1.2 * sex + 0.5 * cp + 0.01 * trestbps + 0.008 * chol
        + 0.5 * fbs - 0.02 * thalach + 1.1 * exang + 0.6 * oldpeak
        + 0.4 * ca + 0.3 * thal + np.random.normal(0, 1.5, n)
    )
    target = (risk_score > np.percentile(risk_score, 55)).astype(int)

    df = pd.DataFrame({
        "age": age.round(0), "sex": sex, "cp": cp,
        "trestbps": trestbps.round(1), "chol": chol.round(1), "fbs": fbs,
        "restecg": restecg, "thalach": thalach.round(1), "exang": exang,
        "oldpeak": oldpeak.round(2), "slope": slope, "ca": ca, "thal": thal,
        "target": target,
    })
    save(df, "cardiology_heart.csv")


# ---------------------------------------------------------------------
# 2. NEUROLOGY - Stroke Risk (schema: Stroke Prediction Dataset)
# ---------------------------------------------------------------------
def generate_neurology(n=900):
    age = np.random.randint(1, 90, n)
    hypertension = np.random.binomial(1, 0.18, n)
    heart_disease = np.random.binomial(1, 0.12, n)
    avg_glucose_level = np.random.normal(106, 45, n).clip(55, 280)
    bmi = np.random.normal(28.5, 7.5, n).clip(12, 55)
    ever_married = np.random.binomial(1, 0.65, n)
    work_type = np.random.randint(0, 4, n)  # 0 private,1 self-emp,2 govt,3 never worked
    residence_type = np.random.binomial(1, 0.5, n)  # 1 urban, 0 rural
    smoking_status = np.random.randint(0, 3, n)  # 0 never,1 formerly,2 smokes

    risk_score = (
        0.04 * age + 1.3 * hypertension + 1.5 * heart_disease
        + 0.01 * avg_glucose_level + 0.03 * bmi + 0.4 * smoking_status
        + np.random.normal(0, 1.8, n)
    )
    target = (risk_score > np.percentile(risk_score, 82)).astype(int)  # stroke is rarer

    df = pd.DataFrame({
        "age": age, "hypertension": hypertension, "heart_disease": heart_disease,
        "avg_glucose_level": avg_glucose_level.round(1), "bmi": bmi.round(1),
        "ever_married": ever_married, "work_type": work_type,
        "residence_type": residence_type, "smoking_status": smoking_status,
        "target": target,
    })
    save(df, "neurology_stroke.csv")


# ---------------------------------------------------------------------
# 3. DIABETES CARE (schema: Pima Indians Diabetes Dataset)
# ---------------------------------------------------------------------
def generate_diabetes(n=900):
    pregnancies = np.random.poisson(3.3, n).clip(0, 17)
    glucose = np.random.normal(120, 32, n).clip(44, 199)
    blood_pressure = np.random.normal(69, 19, n).clip(24, 122)
    skin_thickness = np.random.normal(20, 16, n).clip(0, 99)
    insulin = np.random.exponential(80, n).clip(0, 846)
    bmi = np.random.normal(32, 7.9, n).clip(0, 67)
    dpf = np.random.exponential(0.47, n).clip(0.08, 2.5)
    age = np.random.randint(21, 81, n)

    risk_score = (
        0.02 * glucose + 0.015 * blood_pressure + 0.06 * bmi
        + 0.8 * dpf + 0.03 * age + 0.1 * pregnancies
        + 0.005 * insulin + np.random.normal(0, 2.0, n)
    )
    target = (risk_score > np.percentile(risk_score, 65)).astype(int)

    df = pd.DataFrame({
        "pregnancies": pregnancies, "glucose": glucose.round(1),
        "blood_pressure": blood_pressure.round(1),
        "skin_thickness": skin_thickness.round(1), "insulin": insulin.round(1),
        "bmi": bmi.round(1), "diabetes_pedigree_function": dpf.round(3),
        "age": age, "target": target,
    })
    save(df, "diabetes.csv")


# ---------------------------------------------------------------------
# 4. HEMATOLOGY - Liver/Blood analysis (schema: Indian Liver Patient Dataset)
# ---------------------------------------------------------------------
def generate_hematology(n=900):
    age = np.random.randint(4, 90, n)
    gender = np.random.binomial(1, 0.75, n)  # 1 = male
    total_bilirubin = np.random.exponential(3.0, n).clip(0.1, 75)
    direct_bilirubin = (total_bilirubin * np.random.uniform(0.2, 0.6, n)).clip(0.1, 20)
    alkphos = np.random.normal(290, 240, n).clip(60, 2110)
    sgpt = np.random.exponential(80, n).clip(10, 2000)  # ALT
    sgot = np.random.exponential(110, n).clip(10, 4900)  # AST
    total_proteins = np.random.normal(6.5, 1.1, n).clip(2.7, 9.6)
    albumin = np.random.normal(3.1, 0.8, n).clip(0.9, 5.5)
    ag_ratio = (albumin / (total_proteins - albumin + 0.1)).clip(0.1, 2.8)

    risk_score = (
        0.15 * total_bilirubin + 0.2 * direct_bilirubin + 0.004 * alkphos
        + 0.006 * sgpt + 0.004 * sgot - 0.5 * albumin - 0.3 * ag_ratio
        + 0.01 * age + np.random.normal(0, 1.5, n)
    )
    target = (risk_score > np.percentile(risk_score, 50)).astype(int)  # 1 = liver disease risk

    df = pd.DataFrame({
        "age": age, "gender": gender,
        "total_bilirubin": total_bilirubin.round(2),
        "direct_bilirubin": direct_bilirubin.round(2),
        "alkaline_phosphotase": alkphos.round(1),
        "alamine_aminotransferase": sgpt.round(1),
        "aspartate_aminotransferase": sgot.round(1),
        "total_proteins": total_proteins.round(2),
        "albumin": albumin.round(2),
        "albumin_globulin_ratio": ag_ratio.round(2),
        "target": target,
    })
    save(df, "hematology_liver.csv")


# ---------------------------------------------------------------------
# 5. NEPHROLOGY - Chronic Kidney Disease (schema: UCI CKD Dataset, numeric subset)
# ---------------------------------------------------------------------
def generate_nephrology(n=900):
    age = np.random.randint(2, 90, n)
    bp = np.random.normal(76, 13, n).clip(50, 180)  # blood pressure
    sg = np.random.choice([1.005, 1.010, 1.015, 1.020, 1.025], n)  # specific gravity
    al = np.random.randint(0, 5, n)  # albumin
    su = np.random.randint(0, 5, n)  # sugar
    bgr = np.random.normal(148, 74, n).clip(22, 490)  # blood glucose random
    bu = np.random.normal(57, 50, n).clip(1.5, 391)  # blood urea
    sc = np.random.exponential(3.0, n).clip(0.4, 76)  # serum creatinine
    sod = np.random.normal(137, 10, n).clip(4.5, 163)  # sodium
    pot = np.random.normal(4.6, 3.2, n).clip(2.5, 47)  # potassium
    hemo = np.random.normal(12.5, 2.9, n).clip(3.1, 17.8)  # hemoglobin
    pcv = np.random.normal(38, 8.4, n).clip(9, 54)  # packed cell volume
    wc = np.random.normal(8400, 2900, n).clip(2200, 26400)  # wbc count
    rc = np.random.normal(4.7, 1.0, n).clip(2.1, 8.0)  # rbc count

    risk_score = (
        0.02 * age + 0.02 * bp - 300 * (sg - 1.02) + 0.6 * al + 0.3 * su
        + 0.006 * bgr + 0.02 * bu + 0.5 * sc - 0.4 * pot - 0.3 * hemo
        - 0.05 * pcv + np.random.normal(0, 2.0, n)
    )
    target = (risk_score > np.percentile(risk_score, 45)).astype(int)  # 1 = CKD risk

    df = pd.DataFrame({
        "age": age, "bp": bp.round(1), "sg": sg, "al": al, "su": su,
        "bgr": bgr.round(1), "bu": bu.round(1), "sc": sc.round(2),
        "sod": sod.round(1), "pot": pot.round(2), "hemo": hemo.round(2),
        "pcv": pcv.round(1), "wc": wc.round(0), "rc": rc.round(2),
        "target": target,
    })
    save(df, "nephrology_kidney.csv")


if __name__ == "__main__":
    generate_cardiology()
    generate_neurology()
    generate_diabetes()
    generate_hematology()
    generate_nephrology()
    print("\nAll sample datasets generated successfully in data/")
