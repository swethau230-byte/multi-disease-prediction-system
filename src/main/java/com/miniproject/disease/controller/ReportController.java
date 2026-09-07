package com.miniproject.disease.controller;

import com.miniproject.disease.service.CurrentUserService;
import com.miniproject.disease.service.PdfReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final CurrentUserService currentUser;
    private final PdfReportService reports;

    public ReportController(CurrentUserService currentUser, PdfReportService reports) {
        this.currentUser = currentUser;
        this.reports = reports;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> pdf() {
        byte[] body = reports.userReport(currentUser.get());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=multi-disease-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(body);
    }
}
