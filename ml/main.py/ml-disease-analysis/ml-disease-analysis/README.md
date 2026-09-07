# Disease Analysis - Machine Learning Module

A **standalone** Python/ML module providing disease risk prediction for 5
categories. It is fully independent of your existing Java project — the two
communicate only over a REST API (FastAPI), so you can run this on any
machine/port and call it from Java with a simple HTTP client.

| # | Category | Model file | Target |
|---|-----------|-----------|--------|
| 1 | Cardiology 🫀 | `models/cardiology` | Heart disease risk |
| 2 | Neurology 🧠 | `models/neurology` | Neurological / stroke risk |
| 3 | Diabetes Care | `models/diabetes` | Diabetes risk |
| 4 | Hematology | `models/hematology` | Blood / liver disorder risk |
| 5 | Nephrology | `models/nephrology` | Chronic kidney disease risk |

## Folder structure

```
ml-disease-analysis/
├── requirements.txt
├── README.md
├── data/                          # training CSVs (one per category)
│   ├── cardiology_heart.csv
│   ├── neurology_stroke.csv
│   ├── diabetes.csv
│   ├── hematology_liver.csv
│   └── nephrology_kidney.csv
├── src/                           # training code
│   ├── generate_sample_data.py    # creates the sample CSVs
│   ├── train_utils.py             # shared training/eval pipeline
│   ├── train_cardiology.py
│   ├── train_neurology.py
│   ├── train_diabetes.py
│   ├── train_hematology.py
│   ├── train_nephrology.py
│   └── train_all.py               # trains all 5 in one go
├── models/                        # saved models (created after training)
│   ├── cardiology/  {model.pkl, scaler.pkl, metadata.json}
│   ├── neurology/   {...}
│   ├── diabetes/    {...}
│   ├── hematology/  {...}
│   └── nephrology/  {...}
├── api/                           # FastAPI app
│   ├── main.py                    # routes / endpoints
│   ├── schemas.py                 # request & response models
│   └── model_loader.py            # loads models, runs predictions
└── tests/
    └── test_api.py                # smoke test hitting all 5 endpoints
```

## About the datasets

The five CSVs in `data/` are **synthetically generated** (see
`src/generate_sample_data.py`) with realistic value ranges and
correlations, using the **exact same column schema as well-known real
public datasets**, so the whole pipeline works immediately without any
internet download. When you're ready to use real data, download the
dataset, rename its columns to match the schema listed below, and drop it
into `data/` with the same filename — no other code changes are required.

| Category | Real dataset to use later |
|---|---|
| Cardiology | [UCI Heart Disease Dataset](https://archive.ics.uci.edu/dataset/45/heart+disease) |
| Neurology | [Stroke Prediction Dataset (Kaggle)](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset) |
| Diabetes | [Pima Indians Diabetes Dataset](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database) |
| Hematology | [Indian Liver Patient Dataset](https://archive.ics.uci.edu/dataset/225/ilpd+indian+liver+patient+dataset) |
| Nephrology | [UCI Chronic Kidney Disease Dataset](https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease) |

Exact column names expected by each training script are listed at the top
of that script (the `FEATURE_COLUMNS` list).

---

## Step-by-step: how to run

### 1. Create a virtual environment and install dependencies

```bash
cd ml-disease-analysis
python -m venv venv

# Activate it
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

### 2. Generate the sample training data

```bash
python src/generate_sample_data.py
```
This creates the 5 CSVs inside `data/`.

### 3. Train all 5 models

```bash
python src/train_all.py
```
This will, for **each** category:
- load and clean the data (missing-value handling),
- split into train/test sets,
- scale features,
- train a `RandomForestClassifier`,
- print accuracy / precision / recall / F1 / ROC-AUC + confusion matrix,
- save `model.pkl`, `scaler.pkl`, `metadata.json` into `models/<category>/`.

You can also train a single category on its own, e.g.:
```bash
python src/train_cardiology.py
```

### 4. Start the FastAPI server

Run this from the **project root** (not from inside `api/`):

```bash
uvicorn api.main:app --reload --port 8000
```

You should see all 5 models load:
```
[OK] Loaded model: cardiology  (13 features)
[OK] Loaded model: neurology  (9 features)
[OK] Loaded model: diabetes  (8 features)
[OK] Loaded model: hematology  (10 features)
[OK] Loaded model: nephrology  (14 features)
Uvicorn running on http://127.0.0.1:8000
```

### 5. Test it

**Option A — interactive docs (easiest):**
Open **http://127.0.0.1:8000/docs** in your browser. FastAPI auto-generates
a Swagger UI where you can try every endpoint with example values already
filled in.

**Option B — the included test script:**
In a second terminal (keep the server running):
```bash
python tests/test_api.py
```

**Option C — curl:**
```bash
curl -X POST http://127.0.0.1:8000/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{
    "pregnancies": 2, "glucose": 148, "blood_pressure": 72,
    "skin_thickness": 35, "insulin": 0, "bmi": 33.6,
    "diabetes_pedigree_function": 0.627, "age": 50
  }'
```

Example response (same shape for every category):
```json
{
  "category": "Diabetes Risk",
  "prediction": 1,
  "risk_label": "High Risk",
  "probability": 0.77,
  "risk_percentage": 77.0
}
```

## Endpoints reference

| Method | Path | Description |
|---|---|---|
| GET | `/` | Welcome / list of categories |
| GET | `/health` | Which models are currently loaded |
| GET | `/models` | Feature list + evaluation metrics for every model |
| POST | `/predict/cardiology` | Heart disease risk prediction |
| POST | `/predict/neurology` | Neurological / stroke risk prediction |
| POST | `/predict/diabetes` | Diabetes risk prediction |
| POST | `/predict/hematology` | Liver / blood disorder risk prediction |
| POST | `/predict/nephrology` | Chronic kidney disease risk prediction |

Request field names/types for each POST endpoint are documented in
`api/schemas.py` and visible live at `/docs`.

## Connecting from your Java project

Your Java backend does **not** need any of this code — it simply calls the
running API over HTTP, e.g. with Java's `HttpClient`, `RestTemplate`
(Spring), or `OkHttp`:

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:8000/predict/cardiology"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

Deploy this ML module as its own service (its own server/container/port),
keep the Java project completely separate, and just point Java at the ML
API's base URL (e.g. `http://ml-service:8000`).

## Notes / next steps

- **Class imbalance:** `class_weight="balanced"` is already set on every
  Random Forest, which helps when the "high risk" class is rarer (e.g.
  stroke).
- **Improving accuracy:** once you swap in the real public datasets, try
  increasing `n_estimators`, tuning `max_depth`, or trying
  `GradientBoostingClassifier` / `XGBoost` as a next step beyond Random Forest.
- **Retraining:** just rerun `python src/train_all.py` any time you update
  a CSV in `data/` — it will overwrite the saved model for that category.
- **Security:** this demo API has no authentication. Add an API key /
  JWT check in `api/main.py` before exposing it outside your local network.
