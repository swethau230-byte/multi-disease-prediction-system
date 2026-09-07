"""
schemas.py
-----------
Pydantic models describing the request body for each disease category's
prediction endpoint, plus a shared response schema.
"""
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------
# 1. Cardiology
# ---------------------------------------------------------------------
class CardiologyInput(BaseModel):
    age: float = Field(..., example=54, description="Age in years")
    sex: int = Field(..., example=1, description="1 = male, 0 = female")
    cp: int = Field(..., example=0, description="Chest pain type (0-3)")
    trestbps: float = Field(..., example=130, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., example=246, description="Serum cholesterol (mg/dl)")
    fbs: int = Field(..., example=0, description="Fasting blood sugar > 120 mg/dl (1=true, 0=false)")
    restecg: int = Field(..., example=1, description="Resting ECG results (0-2)")
    thalach: float = Field(..., example=150, description="Max heart rate achieved")
    exang: int = Field(..., example=0, description="Exercise induced angina (1=yes, 0=no)")
    oldpeak: float = Field(..., example=1.0, description="ST depression induced by exercise")
    slope: int = Field(..., example=1, description="Slope of peak exercise ST segment (0-2)")
    ca: int = Field(..., example=0, description="Number of major vessels colored (0-3)")
    thal: int = Field(..., example=2, description="Thalassemia (0-2)")


# ---------------------------------------------------------------------
# 2. Neurology
# ---------------------------------------------------------------------
class NeurologyInput(BaseModel):
    age: float = Field(..., example=67)
    hypertension: int = Field(..., example=0, description="1 = yes, 0 = no")
    heart_disease: int = Field(..., example=0, description="1 = yes, 0 = no")
    avg_glucose_level: float = Field(..., example=105.5)
    bmi: float = Field(..., example=28.1)
    ever_married: int = Field(..., example=1, description="1 = yes, 0 = no")
    work_type: int = Field(..., example=0, description="0=private,1=self-employed,2=govt,3=never worked")
    residence_type: int = Field(..., example=1, description="1 = urban, 0 = rural")
    smoking_status: int = Field(..., example=0, description="0=never,1=formerly,2=smokes")


# ---------------------------------------------------------------------
# 3. Diabetes Care
# ---------------------------------------------------------------------
class DiabetesInput(BaseModel):
    pregnancies: int = Field(..., example=2)
    glucose: float = Field(..., example=120)
    blood_pressure: float = Field(..., example=70)
    skin_thickness: float = Field(..., example=20)
    insulin: float = Field(..., example=80)
    bmi: float = Field(..., example=28.5)
    diabetes_pedigree_function: float = Field(..., example=0.47)
    age: int = Field(..., example=33)


# ---------------------------------------------------------------------
# 4. Hematology
# ---------------------------------------------------------------------
class HematologyInput(BaseModel):
    age: float = Field(..., example=45)
    gender: int = Field(..., example=1, description="1 = male, 0 = female")
    total_bilirubin: float = Field(..., example=1.2)
    direct_bilirubin: float = Field(..., example=0.4)
    alkaline_phosphotase: float = Field(..., example=200)
    alamine_aminotransferase: float = Field(..., example=35, description="ALT (SGPT)")
    aspartate_aminotransferase: float = Field(..., example=40, description="AST (SGOT)")
    total_proteins: float = Field(..., example=6.8)
    albumin: float = Field(..., example=3.3)
    albumin_globulin_ratio: float = Field(..., example=1.0)


# ---------------------------------------------------------------------
# 5. Nephrology
# ---------------------------------------------------------------------
class NephrologyInput(BaseModel):
    age: float = Field(..., example=55)
    bp: float = Field(..., example=80, description="Blood pressure")
    sg: float = Field(..., example=1.02, description="Urine specific gravity")
    al: int = Field(..., example=0, description="Albumin (0-4)")
    su: int = Field(..., example=0, description="Sugar (0-4)")
    bgr: float = Field(..., example=120, description="Blood glucose random")
    bu: float = Field(..., example=40, description="Blood urea")
    sc: float = Field(..., example=1.1, description="Serum creatinine")
    sod: float = Field(..., example=140, description="Sodium")
    pot: float = Field(..., example=4.5, description="Potassium")
    hemo: float = Field(..., example=13.5, description="Hemoglobin")
    pcv: float = Field(..., example=42, description="Packed cell volume")
    wc: float = Field(..., example=8000, description="White blood cell count")
    rc: float = Field(..., example=5.0, description="Red blood cell count")


# ---------------------------------------------------------------------
# Shared response schema
# ---------------------------------------------------------------------
class PredictionResponse(BaseModel):
    category: str
    prediction: int = Field(..., description="0 = low risk, 1 = high risk / positive")
    risk_label: str
    probability: float = Field(..., description="Model confidence for the predicted class (0-1)")
    risk_percentage: float = Field(..., description="Probability of high risk / positive class, as %")
