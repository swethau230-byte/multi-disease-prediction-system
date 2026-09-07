# AI-Based Multi-Disease Prediction System

This mini project is a secure web-based application for early disease risk screening.

Diseases included:

- Heart Disease
- Diabetes
- Liver Disease

The implementation uses Java Spring Boot, Spring Security with JWT, Maven and MySQL. A separate static demo UI is also included in the final project zip for easy presentation without server setup.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Java Spring Boot |
| Security | Spring Security + JWT |
| Database | MySQL |
| ORM | Spring Data JPA |
| Build Tool | Maven |
| Reports | OpenPDF |
| API Testing | Postman |
| Frontend | Static HTML demo and Spring Boot static page |

## Modules

1. Authentication and User Management
2. Disease Prediction
3. Patient History
4. Dashboard and Reports

## Database Tables

- `users`: stores user ID, name, email, encrypted password and role.
- `patients`: stores patient ID, name, age and gender.
- `predictions`: stores disease type, input values, prediction result, recommendation and date.

## How to Run Spring Boot Version

1. Install Java 17+, Maven and MySQL.
2. Create a database named `multi_disease_db`.
3. Update `src/main/resources/application.properties` if your MySQL username/password is different.
4. Run:

```bash
mvn spring-boot:run
```

5. Open:

```text
http://localhost:8080
```

## API Endpoints

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}
```

Use the returned JWT token as:

```http
Authorization: Bearer YOUR_TOKEN
```

### Heart Disease Prediction

```http
POST /api/predictions/heart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientName": "Patient One",
  "gender": "Female",
  "age": 58,
  "bloodPressure": 145,
  "cholesterol": 250,
  "heartRate": 105,
  "chestPain": 2
}
```

### Diabetes Prediction

```http
POST /api/predictions/diabetes
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientName": "Patient Two",
  "gender": "Male",
  "age": 48,
  "glucose": 145,
  "bmi": 31,
  "insulin": 170,
  "bloodPressure": 142,
  "familyHistory": 1
}
```

### Liver Disease Prediction

```http
POST /api/predictions/liver
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientName": "Patient Three",
  "gender": "Female",
  "age": 45,
  "bilirubin": 1.6,
  "alkalinePhosphatase": 140,
  "sgpt": 62,
  "sgot": 48,
  "albumin": 3.2
}
```

### History, Dashboard and PDF Report

```http
GET /api/history
GET /api/history?disease=HEART
DELETE /api/history/{id}
GET /api/dashboard
GET /api/reports/pdf
```

## Note About Prediction Logic

This project uses explainable rule-based scoring to simulate disease risk prediction in Java. In future work, this logic can be replaced with trained machine learning models through Python microservices, ONNX Runtime, PMML or Weka.
