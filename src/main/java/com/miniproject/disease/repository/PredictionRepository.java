package com.miniproject.disease.repository;

import com.miniproject.disease.entity.Prediction;
import com.miniproject.disease.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserOrderByCreatedAtDesc(User user);
    List<Prediction> findByUserAndDiseaseTypeContainingIgnoreCaseOrderByCreatedAtDesc(User user, String diseaseType);
    long countByUser(User user);
    long countByUserAndDiseaseType(User user, String diseaseType);
    long countByUserAndCreatedAtAfter(User user, LocalDateTime createdAt);
}
