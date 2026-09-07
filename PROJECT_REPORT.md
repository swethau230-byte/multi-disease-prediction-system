# Mini Project Report

## Title

AI-Based Multi-Disease Prediction System for Early Detection of Heart Disease, Diabetes, and Liver Disease

## Abstract

Healthcare applications can help users identify disease risk at an early stage by collecting medical parameters and providing fast prediction results. This project develops a secure web-based multi-disease prediction system for heart disease, diabetes and liver disease. The system is implemented using Java Spring Boot, Spring Security with JWT authentication, Maven and MySQL. Users can register, log in, submit medical values, view prediction history, check dashboard statistics and download a report.

## Objective

The objective of this project is to build a secure and user-friendly disease prediction system that supports early risk analysis for heart disease, diabetes and liver disease. The system also maintains patient prediction history and provides dashboard-based reporting.

## Existing System

Many existing disease prediction systems focus on only one disease or use standalone tools. Some research implementations use Python and Streamlit, which are suitable for rapid prototyping but may need adaptation for enterprise-style web applications.

## Proposed System

The proposed system uses Java Spring Boot as the backend framework and JWT authentication for secure API access. It provides separate prediction modules for heart disease, diabetes and liver disease. MySQL stores users, patient details and prediction records. A dashboard summarizes total and disease-wise predictions, and the report module generates PDF reports.

## Architecture

```text
User
  |
  v
Spring Boot Web Application
  |
  v
JWT Authentication
  |
  v
Disease Prediction Module
  |
  v
MySQL Database
  |
  v
Dashboard and PDF Reports
```

## Modules

### Authentication and User Management

This module provides register and login features. Passwords are encrypted using BCrypt. After login, users receive a JWT token, which must be passed for protected APIs.

### Disease Prediction

This module contains three prediction APIs:

- Heart Disease: age, blood pressure, cholesterol, heart rate and chest pain.
- Diabetes: fasting glucose, BMI, insulin, blood pressure and family history.
- Liver Disease: bilirubin, alkaline phosphatase, SGPT, SGOT and albumin.

### Patient History

Prediction records are saved in the database. Users can view previous predictions, search by disease type and delete their own records.

### Dashboard and Reports

The dashboard provides total predictions, disease-wise counts and monthly prediction counts. The report module generates a PDF file containing user prediction history.

## Algorithms Used

The current Java implementation uses rule-based risk scoring. Each medical parameter is checked against common risk thresholds. Based on the total score, the system returns results such as High Risk, Medium Risk, Low Risk, High Diabetes Risk or High Liver Risk.

## Future Enhancement

The prediction logic can be upgraded using trained machine learning models. Options include a Python ML microservice, ONNX Runtime, PMML, Weka or a REST-based prediction service. Additional enhancements include doctor login, admin analytics, email alerts and chart-based frontend dashboards.

## Conclusion

The project successfully implements a secure multi-disease prediction system using Java Spring Boot, JWT, Maven and MySQL. It supports disease prediction, history management, dashboard statistics and PDF report generation, making it suitable as a complete mini project foundation.
