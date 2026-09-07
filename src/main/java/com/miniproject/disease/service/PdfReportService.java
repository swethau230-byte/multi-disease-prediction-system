package com.miniproject.disease.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.miniproject.disease.entity.Prediction;
import com.miniproject.disease.entity.User;
import com.miniproject.disease.repository.PredictionRepository;
import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

@Service
public class PdfReportService {
    private final PredictionRepository predictions;

    public PdfReportService(PredictionRepository predictions) {
        this.predictions = predictions;
    }

    public byte[] userReport(User user) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, output);
        document.open();
        document.add(new Paragraph("AI-Based Multi-Disease Prediction Report"));
        document.add(new Paragraph("User: " + user.getName() + " (" + user.getEmail() + ")"));
        document.add(new Paragraph(" "));
        for (Prediction prediction : predictions.findByUserOrderByCreatedAtDesc(user)) {
            document.add(new Paragraph("Disease: " + prediction.getDiseaseType()));
            document.add(new Paragraph("Result: " + prediction.getPredictionResult()));
            document.add(new Paragraph("Recommendation: " + prediction.getRecommendation()));
            document.add(new Paragraph("Date: " + prediction.getCreatedAt()));
            document.add(new Paragraph("Inputs: " + prediction.getInputValues()));
            document.add(new Paragraph(" "));
        }
        document.close();
        return output.toByteArray();
    }
}
