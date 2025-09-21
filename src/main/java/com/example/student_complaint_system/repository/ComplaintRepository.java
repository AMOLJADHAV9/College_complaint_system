package com.example.student_complaint_system.repository;

import com.example.student_complaint_system.model.Complaint;
import com.example.student_complaint_system.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByStudentOrderBySubmissionDateDesc(User student);
    
    @Query(value = "{}", sort = "{ 'submissionDate': -1 }")
    List<Complaint> findAllComplaints();
    
    long countByStatus(Complaint.ComplaintStatus status);
}