"""
main.py
--------
FastAPI REST API for the Disease Analysis ML module.

Exposes one prediction endpoint per disease category:
  POST /predict/cardiology
  POST /predict/neurology
  POST /predict/diabetes
  POST /predict/hematology
  POST /predict/nephrology

Plus:
  GET  /            -> health check / welcome
  GET  /health       -> readiness check (which models are loaded)
  GET  /models        -> metrics for every loaded model

Run with:
  uvicorn api.main:app --reload --port 8000
(run this from the project ROOT folder, not from inside api/)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.schemas import (
    CardiologyInput, NeurologyInput, DiabetesInput,
    HematologyInput, NephrologyInput, PredictionResponse,
)
from api.model_loader import load_all_models, get_registry, predict, CATEGORY_LABELS

app = FastAPI(
    title="Disease Analysis ML API",
    description=(
        "Standalone Machine Learning module for multi-category disease "
        "risk prediction (Cardiology, Neurology, Diabetes, Hematology, "
        "Nephrology). Intended to be called from an external application "
        "(e.g. a Java backend) over REST."
    ),
    version="1.0.0",
)

# Allow the API to be called from any origin (e.g. your Java backend / frontend).
# Tighten this in production to your actual domain(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    load_all_models()


def _risk_label(prediction: int) -> str:
    return "High Risk" if prediction == 1 else "Low Risk"


def _build_response(category: str, prediction: int, probability: float) -> PredictionResponse:
    return PredictionResponse(
        category=CATEGORY_LABELS[category],
        prediction=prediction,
        risk_label=_risk_label(prediction),
        probability=round(probability if prediction == 1 else 1 - probability, 4),
        risk_percentage=round(probability * 100, 2),
    )


@app.get("/")
def root():
    return {
        "message": "Disease Analysis ML API is running.",
        "categories": list(CATEGORY_LABELS.values()),
        "docs": "/docs",
    }


@app.get("/health")
def health():
    registry = get_registry()
    return {
        "status": "ok" if registry else "no models loaded",
        "loaded_models": list(registry.keys()),
    }


@app.get("/models")
def models_info():
    registry = get_registry()
    return {
        category: {
            "features": entry["feature_columns"],
            "metrics": entry["metrics"],
        }
        for category, entry in registry.items()
    }


# ---------------------------------------------------------------------
# 1. Cardiology
# ---------------------------------------------------------------------
@app.post("/predict/cardiology", response_model=PredictionResponse)
def predict_cardiology(data: CardiologyInput):
    try:
        pred, proba = predict("cardiology", data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _build_response("cardiology", pred, proba)


# ---------------------------------------------------------------------
# 2. Neurology
# ---------------------------------------------------------------------
@app.post("/predict/neurology", response_model=PredictionResponse)
def predict_neurology(data: NeurologyInput):
    try:
        pred, proba = predict("neurology", data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _build_response("neurology", pred, proba)


# ---------------------------------------------------------------------
# 3. Diabetes Care
# ---------------------------------------------------------------------
@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(data: DiabetesInput):
    try:
        pred, proba = predict("diabetes", data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _build_response("diabetes", pred, proba)


# ---------------------------------------------------------------------
# 4. Hematology
# ---------------------------------------------------------------------
@app.post("/predict/hematology", response_model=PredictionResponse)
def predict_hematology(data: HematologyInput):
    try:
        pred, proba = predict("hematology", data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _build_response("hematology", pred, proba)


# ---------------------------------------------------------------------
# 5. Nephrology
# ---------------------------------------------------------------------
@app.post("/predict/nephrology", response_model=PredictionResponse)
def predict_nephrology(data: NephrologyInput):
    try:
        pred, proba = predict("nephrology", data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _build_response("nephrology", pred, proba)
