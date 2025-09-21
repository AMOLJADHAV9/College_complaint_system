package com.example.student_complaint_system.controller;

import com.example.student_complaint_system.dto.ComplaintResponseDTO;
import com.example.student_complaint_system.model.Complaint;
import com.example.student_complaint_system.model.User;
import com.example.student_complaint_system.service.ComplaintService;
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
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints(@AuthenticationPrincipal User admin) {
        System.out.println("Admin user: " + admin.getUsername());
        System.out.println("Admin role: " + admin.getRole());
        System.out.println("Admin authorities: " + admin.getAuthorities());
        
        // Check if user is admin
        if (admin.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admin role required."));
        }
        
        List<Complaint> complaints = complaintService.getAllComplaints();
        List<ComplaintResponseDTO> complaintDTOs = complaints.stream()
                .map(ComplaintResponseDTO::fromComplaint)
                .collect(Collectors.toList());
        return ResponseEntity.ok(complaintDTOs);
    }

    @GetMapping("/complaints/stats")
    public ResponseEntity<?> getComplaintStats(@AuthenticationPrincipal User admin) {
        // Check if user is admin
        if (admin.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admin role required."));
        }
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", complaintService.getTotalComplaintCount());
        stats.put("pending", complaintService.getComplaintCountByStatus(Complaint.ComplaintStatus.PENDING));
        stats.put("inProgress", complaintService.getComplaintCountByStatus(Complaint.ComplaintStatus.IN_PROGRESS));
        stats.put("resolved", complaintService.getComplaintCountByStatus(Complaint.ComplaintStatus.RESOLVED));
        stats.put("rejected", complaintService.getComplaintCountByStatus(Complaint.ComplaintStatus.REJECTED));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<?> getComplaintDetails(@PathVariable String id, @AuthenticationPrincipal User admin) {
        // Check if user is admin
        if (admin.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admin role required."));
        }
        
        return complaintService.getComplaintById(id)
                .map(complaint -> ResponseEntity.ok(ComplaintResponseDTO.fromComplaint(complaint)))
                .orElse(ResponseEntity.notFound().build());
    }
}