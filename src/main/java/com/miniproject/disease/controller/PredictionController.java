package com.miniproject.disease.controller;

import com.miniproject.disease.entity.Prediction;
import com.miniproject.disease.entity.User;
import com.miniproject.disease.service.CurrentUserService;
import com.miniproject.disease.service.PredictionService;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {
    private final CurrentUserService currentUser;
    private final PredictionService predictionService;

    public PredictionController(CurrentUserService currentUser, PredictionService predictionService) {
        this.currentUser = currentUser;
        this.predictionService = predictionService;
    }


    @PostMapping("/heart")
    public Prediction heart(@RequestBody Map<String, Object> request) {
        User user = currentUser.get();
        return predictionService.predictHeart(user, request);
    }

    @PostMapping("/diabetes")
    public Prediction diabetes(@RequestBody Map<String, Object> request) {
        User user = currentUser.get();
        return predictionService.predictDiabetes(user, request);
    }

    @PostMapping("/liver")
    public Prediction liver(@RequestBody Map<String, Object> request) {
        User user = currentUser.get();
        return predictionService.predictLiver(user, request);
    }
}
