package com.example.student_complaint_system.dto;

import com.example.student_complaint_system.model.Complaint;
import lombok.Data;

@Data
public class ComplaintResponseDTO {
    private String id;
    private String title;
    private String description;
    private Complaint.ComplaintStatus status;
    private java.time.LocalDateTime submissionDate;
    private java.time.LocalDateTime resolutionDate;
    private String adminResponse;
    private String studentId;
    private String studentUsername;
    private String studentEmail;

    public static ComplaintResponseDTO fromComplaint(Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setSubmissionDate(complaint.getSubmissionDate());
        dto.setResolutionDate(complaint.getResolutionDate());
        dto.setAdminResponse(complaint.getAdminResponse());
        
        if (complaint.getStudent() != null) {
            dto.setStudentId(complaint.getStudent().getId());
            dto.setStudentUsername(complaint.getStudent().getUsername());
            dto.setStudentEmail(complaint.getStudent().getEmail());
        }
        
        return dto;
    }
}