package com.miniproject.disease.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miniproject.disease.entity.Patient;
import com.miniproject.disease.entity.Prediction;
import com.miniproject.disease.entity.User;
import com.miniproject.disease.repository.PatientRepository;
import com.miniproject.disease.repository.PredictionRepository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class PredictionService {

    private final PredictionRepository predictions;
    private final PatientRepository patients;
    private final ObjectMapper mapper;

    // Python ML API
    private final RestClient mlClient =
            RestClient.create("http://127.0.0.1:8000");

    public PredictionService(
            PredictionRepository predictions,
            PatientRepository patients,
            ObjectMapper mapper) {

        this.predictions = predictions;
        this.patients = patients;
        this.mapper = mapper;
    }


    public Prediction predictHeart(User user, Map<String, Object> request) {

        Map<String, Object> mlRequest = new HashMap<>();

        mlRequest.put("age", number(request, "age"));
        mlRequest.put("sex", number(request, "sex"));
        mlRequest.put("cp", number(request, "cp"));
        mlRequest.put("trestbps", number(request, "trestbps"));
        mlRequest.put("chol", number(request, "chol"));
        mlRequest.put("fbs", number(request, "fbs"));
        mlRequest.put("restecg", number(request, "restecg"));
        mlRequest.put("thalach", number(request, "thalach"));
        mlRequest.put("exang", number(request, "exang"));
        mlRequest.put("oldpeak", number(request, "oldpeak"));
        mlRequest.put("slope", number(request, "slope"));
        mlRequest.put("ca", number(request, "ca"));
        mlRequest.put("thal", number(request, "thal"));

        // Call Python ML API
        Map<?, ?> mlResponse = mlClient
                .post()
                .uri("/predict/cardiology")
                .body(mlRequest)
                .retrieve()
                .body(Map.class);

        if (mlResponse == null) {
            throw new IllegalStateException("ML API returned empty response");
        }

        // Get risk label safely
        Object riskLabel = mlResponse.get("risk_label");

        String result = riskLabel != null
                ? riskLabel.toString()
                : "Unknown";

        // Get risk percentage
        double riskPercentage = 0.0;

        Object riskValue = mlResponse.get("risk_percentage");

        if (riskValue instanceof Number) {
            riskPercentage = ((Number) riskValue).doubleValue();
        } else if (riskValue != null) {
            riskPercentage = Double.parseDouble(riskValue.toString());
        }

        String recommendation;

        if (result.equalsIgnoreCase("High Risk")) {

            recommendation =
                    "Please consult a cardiologist and undergo appropriate cardiac evaluation.";

        } else if (result.equalsIgnoreCase("Medium Risk")) {

            recommendation =
                    "Schedule a medical checkup and monitor cardiovascular health regularly.";

        } else {

            recommendation =
                    "Maintain a healthy lifestyle and continue routine preventive health screening.";
        }

        return save(
                user,
                request,
                "HEART",
                result + " (" + String.format("%.2f", riskPercentage) + "% risk)",
                recommendation
        );
    }

    public Prediction predictDiabetes(
            User user,
            Map<String, Object> request) {

        double glucose = number(request, "glucose");
        double bmi = number(request, "bmi");
        double insulin = number(request, "insulin");
        double bloodPressure = number(request, "bloodPressure");
        double familyHistory = number(request, "familyHistory");

        int score = 0;

        if (glucose >= 126) score++;
        if (bmi >= 30) score++;
        if (insulin >= 160) score++;
        if (bloodPressure >= 140) score++;
        if (familyHistory >= 1) score++;

        String result =
                score >= 3
                        ? "High Diabetes Risk"
                        : score >= 2
                          ? "Medium Diabetes Risk"
                          : "Low Diabetes Risk";

        String recommendation =
                result.equals("High Diabetes Risk")
                        ? "Consult a diabetologist and check fasting glucose, HbA1c and lipid profile."
                        : result.equals("Medium Diabetes Risk")
                          ? "Reduce sugar intake, track weight and repeat glucose screening."
                          : "Maintain healthy diet, exercise and routine blood sugar screening.";

        return save(
                user,
                request,
                "DIABETES",
                result,
                recommendation
        );
    }



    public Prediction predictLiver(
            User user,
            Map<String, Object> request) {

        double bilirubin = number(request, "bilirubin");
        double alkalinePhosphatase =
                number(request, "alkalinePhosphatase");
        double sgpt = number(request, "sgpt");
        double sgot = number(request, "sgot");
        double albumin = number(request, "albumin");

        int score = 0;

        if (bilirubin >= 1.2) score++;
        if (alkalinePhosphatase >= 120) score++;
        if (sgpt >= 56) score++;
        if (sgot >= 40) score++;
        if (albumin < 3.5) score++;

        String result =
                score >= 3
                        ? "High Liver Risk"
                        : score >= 2
                          ? "Medium Liver Risk"
                          : "Low Liver Risk";

        String recommendation =
                result.equals("High Liver Risk")
                        ? "Consult a hepatologist and take liver function tests with ultrasound."
                        : result.equals("Medium Liver Risk")
                          ? "Review medicines and repeat liver function screening."
                          : "Maintain balanced diet, hydration and periodic liver health checkups.";

        return save(
                user,
                request,
                "LIVER",
                result,
                recommendation
        );
    }


    private Prediction save(
            User user,
            Map<String, Object> request,
            String diseaseType,
            String result,
            String recommendation) {

        Prediction prediction = new Prediction();

        prediction.setUser(user);
        prediction.setPatient(patientFrom(request));
        prediction.setDiseaseType(diseaseType);
        prediction.setInputValues(json(request));
        prediction.setPredictionResult(result);
        prediction.setRecommendation(recommendation);

        return predictions.save(prediction);
    }


    private Patient patientFrom(
            Map<String, Object> request) {

        if (!request.containsKey("patientName")) {
            return null;
        }

        Patient patient = new Patient();

        patient.setName(
                String.valueOf(request.get("patientName"))
        );

        patient.setAge(
                request.containsKey("age")
                        ? (int) number(request, "age")
                        : null
        );

        patient.setGender(
                String.valueOf(
                        request.getOrDefault(
                                "gender",
                                "Not specified"
                        )
                )
        );

        return patients.save(patient);
    }



    private double number(
            Map<String, Object> request,
            String key) {

        Object value = request.get(key);

        if (value == null) {
            throw new IllegalArgumentException(
                    "Missing input: " + key
            );
        }

        if (value instanceof Number number) {
            return number.doubleValue();
        }

        return Double.parseDouble(value.toString());
    }


    private String json(
            Map<String, Object> request) {

        try {
            return mapper.writeValueAsString(request);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException(
                    "Invalid input values",
                    ex
            );
        }
    }
}