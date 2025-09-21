package com.example.student_complaint_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.example.student_complaint_system.model.User;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private User user;
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
        this.tokenType = "Bearer";
    }
}