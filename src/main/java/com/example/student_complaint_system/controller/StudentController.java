package com.example.student_complaint_system.controller;

import com.example.student_complaint_system.dto.ComplaintRequest;
import com.example.student_complaint_system.dto.ComplaintResponseDTO;
import com.example.student_complaint_system.model.Complaint;
import com.example.student_complaint_system.model.User;
import com.example.student_complaint_system.service.ComplaintService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private ComplaintService complaintService;

    /**
     * Get all complaints submitted by the authenticated student
     */
    @GetMapping("/complaints")
    public ResponseEntity<?> getMyComplaints(@AuthenticationPrincipal User student) {
        logger.info("Getting complaints for student: {} with ID: {}", 
                   student.getUsername(), student.getId());
        
        try {
            List<Complaint> complaints = complaintService.getComplaintsByStudent(student);
            List<ComplaintResponseDTO> complaintDTOs = complaints.stream()
                    .map(ComplaintResponseDTO::fromComplaint)
                    .collect(Collectors.toList());
            
            logger.info("Found {} complaints for student {}", complaints.size(), student.getUsername());
            return ResponseEntity.ok(complaintDTOs);
        } catch (Exception e) {
            logger.error("Error fetching complaints for student {}: {}", student.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch complaints: " + e.getMessage()));
        }
    }

    /**
     * Get complaint statistics for the authenticated student
     */
    @GetMapping("/complaints/stats")
    public ResponseEntity<?> getMyComplaintStats(@AuthenticationPrincipal User student) {
        try {
            List<Complaint> complaints = complaintService.getComplaintsByStudent(student);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", complaints.size());
            stats.put("pending", complaints.stream()
                    .filter(c -> c.getStatus() == Complaint.ComplaintStatus.PENDING)
                    .count());
            stats.put("inProgress", complaints.stream()
                    .filter(c -> c.getStatus() == Complaint.ComplaintStatus.IN_PROGRESS)
                    .count());
            stats.put("resolved", complaints.stream()
                    .filter(c -> c.getStatus() == Complaint.ComplaintStatus.RESOLVED)
                    .count());
            stats.put("rejected", complaints.stream()
                    .filter(c -> c.getStatus() == Complaint.ComplaintStatus.REJECTED)
                    .count());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching complaint stats for student {}: {}", student.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch complaint statistics: " + e.getMessage()));
        }
    }

    /**
     * Get details of a specific complaint submitted by the student
     */
    @GetMapping("/complaints/{id}")
    public ResponseEntity<?> getMyComplaintDetails(@PathVariable String id, 
                                                   @AuthenticationPrincipal User student) {
        try {
            return complaintService.getComplaintById(id)
                    .map(complaint -> {
                        // Ensure the authenticated user is the owner of the complaint
                        if (!complaint.getStudent().getId().equals(student.getId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body(Map.of("message", "Access denied. You can only view your own complaints."));
                        }
                        return ResponseEntity.ok(ComplaintResponseDTO.fromComplaint(complaint));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching complaint details for student {}: {}", student.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch complaint details: " + e.getMessage()));
        }
    }

    /**
     * Submit a new complaint
     */
    @PostMapping("/complaints")
    public ResponseEntity<?> submitComplaint(@Valid @RequestBody ComplaintRequest complaintRequest,
                                             @AuthenticationPrincipal User student) {
        try {
            logger.info("Student {} submitting new complaint: {}", student.getUsername(), complaintRequest.getTitle());
            
            Complaint newComplaint = complaintService.submitComplaint(complaintRequest, student);
            
            logger.info("Complaint submitted successfully with ID: {} by student: {}", 
                       newComplaint.getId(), student.getUsername());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ComplaintResponseDTO.fromComplaint(newComplaint));
        } catch (Exception e) {
            logger.error("Failed to submit complaint by student {}: {}", student.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to submit complaint: " + e.getMessage()));
        }
    }
}