package com.example.student_complaint_system.service;

import com.example.student_complaint_system.dto.ComplaintRequest;
import com.example.student_complaint_system.model.Complaint;
import com.example.student_complaint_system.model.User;
import com.example.student_complaint_system.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint submitComplaint(ComplaintRequest complaintRequest, User student) {
        Complaint complaint = new Complaint();
        complaint.setTitle(complaintRequest.getTitle());
        complaint.setDescription(complaintRequest.getDescription());
        complaint.setStudent(student);
        complaint.setStatus(Complaint.ComplaintStatus.PENDING);
        complaint.setSubmissionDate(LocalDateTime.now());
        
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByStudent(User student) {
        return complaintRepository.findByStudentOrderBySubmissionDateDesc(student);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllComplaints();
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id);
    }

    public long getTotalComplaintCount() {
        return complaintRepository.count();
    }

    public long getComplaintCountByStatus(Complaint.ComplaintStatus status) {
        return complaintRepository.countByStatus(status);
    }
}