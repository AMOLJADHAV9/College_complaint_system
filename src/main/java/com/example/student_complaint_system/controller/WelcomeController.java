package com.example.student_complaint_system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return "index";
    }

    @GetMapping("/student/dashboard")
    public String studentDashboard() {
        return "student/dashboard";
    }

    @GetMapping("/student/profile")
    public String studentProfile() {
        return "student/profile";
    }

    @GetMapping("/welcome")
    @ResponseBody
    public String welcomeJson() {
        return "{\n" +
                "  \"message\": \"Welcome to Student Complaint System API\",\n" +
                "  \"status\": \"running\",\n" +
                "  \"version\": \"1.0.0\",\n" +
                "  \"endpoints\": {\n" +
                "    \"auth\": {\n" +
                "      \"signup\": \"POST /api/auth/signup\",\n" +
                "      \"login\": \"POST /api/auth/login\"\n" +
                "    }\n" +
                "  }\n" +
                "}";
    }
}