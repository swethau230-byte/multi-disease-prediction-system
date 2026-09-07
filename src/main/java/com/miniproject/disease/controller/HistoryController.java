package com.miniproject.disease.controller;

import com.miniproject.disease.entity.Prediction;
import com.miniproject.disease.entity.User;
import com.miniproject.disease.repository.PredictionRepository;
import com.miniproject.disease.service.CurrentUserService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
public class HistoryController {
    private final PredictionRepository predictions;
    private final CurrentUserService currentUser;

    public HistoryController(PredictionRepository predictions, CurrentUserService currentUser) {
        this.predictions = predictions;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Prediction> history(@RequestParam(required = false) String disease) {
        User user = currentUser.get();
        if (disease == null || disease.isBlank()) {
            return predictions.findByUserOrderByCreatedAtDesc(user);
        }
        return predictions.findByUserAndDiseaseTypeContainingIgnoreCaseOrderByCreatedAtDesc(user, disease);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Prediction prediction = predictions.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prediction not found"));
        if (!prediction.getUser().getId().equals(currentUser.get().getId())) {
            throw new IllegalArgumentException("Cannot delete another user's record");
        }
        predictions.delete(prediction);
    }
}
