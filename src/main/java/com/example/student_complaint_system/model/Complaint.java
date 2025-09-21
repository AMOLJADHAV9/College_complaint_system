package com.example.student_complaint_system.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("status")
    private ComplaintStatus status = ComplaintStatus.PENDING;
    
    @Field("submission_date")
    private LocalDateTime submissionDate;
    
    @Field("resolution_date")
    private LocalDateTime resolutionDate;
    
    @Field("admin_response")
    private String adminResponse;
    
    @DBRef
    @Field("student")
    private User student;
    
    public enum ComplaintStatus {
        PENDING,
        IN_PROGRESS,
        RESOLVED,
        REJECTED
    }
}