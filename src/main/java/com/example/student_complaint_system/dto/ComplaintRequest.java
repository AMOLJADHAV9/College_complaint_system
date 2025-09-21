package com.example.student_complaint_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    // Default constructor
    public ComplaintRequest() {
    }

    // Constructor with parameters
    public ComplaintRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }
}