package com.example.student_complaint_system.controller;

import com.example.student_complaint_system.dto.ComplaintRequest;
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

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintController.class);

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<?> submitComplaint(@Valid @RequestBody ComplaintRequest complaintRequest,
                                             @AuthenticationPrincipal User authenticatedUser) {
        try {
            Complaint newComplaint = complaintService.submitComplaint(complaintRequest, authenticatedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newComplaint);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit complaint: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMyComplaints(@AuthenticationPrincipal User authenticatedUser) {
        logger.info("Getting complaints for user: {} with ID: {}", 
                   authenticatedUser.getUsername(), authenticatedUser.getId());
        
        List<Complaint> complaints = complaintService.getComplaintsByStudent(authenticatedUser);
        
        logger.info("Found {} complaints for user {}", complaints.size(), authenticatedUser.getUsername());
        
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintDetails(@PathVariable String id,
                                                        @AuthenticationPrincipal User authenticatedUser) {
        Complaint complaint = complaintService.getComplaintById(id).orElse(null);
        
        if (complaint == null) {
            return ResponseEntity.notFound().build();
        }

        // Ensure the authenticated user is the owner of the complaint
        if (!complaint.getStudent().getId().equals(authenticatedUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(complaint);
    }
    
    // Test endpoint to create a sample complaint for demonstration
    @PostMapping("/test/sample")
    public ResponseEntity<?> createSampleComplaint(@AuthenticationPrincipal User authenticatedUser) {
        try {
            logger.info("Creating sample complaint for user: {} with ID: {}", 
                       authenticatedUser.getUsername(), authenticatedUser.getId());
            
            // Create a simple test complaint
            ComplaintRequest testRequest = new ComplaintRequest(
                "Test Network Issue",
                "This is a sample complaint to test the dashboard functionality. The WiFi connectivity in the computer lab is intermittent and affects students during practical sessions."
            );
            
            Complaint savedComplaint = complaintService.submitComplaint(testRequest, authenticatedUser);
            
            logger.info("Created sample complaint with ID: {} for user: {}", 
                       savedComplaint.getId(), authenticatedUser.getUsername());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComplaint);
        } catch (Exception e) {
            logger.error("Failed to create sample complaint: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create sample complaint: " + e.getMessage());
        }
    }
}