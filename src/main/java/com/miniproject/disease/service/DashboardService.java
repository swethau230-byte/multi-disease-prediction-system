package com.miniproject.disease.service;

import com.miniproject.disease.entity.User;
import com.miniproject.disease.repository.PredictionRepository;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final PredictionRepository predictions;

    public DashboardService(PredictionRepository predictions) {
        this.predictions = predictions;
    }

    public Map<String, Object> summary(User user) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalPredictions", predictions.countByUser(user));
        data.put("heartPredictions", predictions.countByUserAndDiseaseType(user, "HEART"));
        data.put("diabetesPredictions", predictions.countByUserAndDiseaseType(user, "DIABETES"));
        data.put("liverPredictions", predictions.countByUserAndDiseaseType(user, "LIVER"));
        data.put("monthlyPredictions", predictions.countByUserAndCreatedAtAfter(user, LocalDateTime.now().minusDays(30)));
        return data;
    }
}
