package com.miniproject.disease.controller;

import com.miniproject.disease.service.CurrentUserService;
import com.miniproject.disease.service.DashboardService;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final CurrentUserService currentUser;
    private final DashboardService dashboard;

    public DashboardController(CurrentUserService currentUser, DashboardService dashboard) {
        this.currentUser = currentUser;
        this.dashboard = dashboard;
    }

    @GetMapping
    public Map<String, Object> summary() {
        return dashboard.summary(currentUser.get());
    }
}
