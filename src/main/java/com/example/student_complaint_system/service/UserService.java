package com.example.student_complaint_system.service;

import com.example.student_complaint_system.model.User;
import com.example.student_complaint_system.repository.UserRepository;
import com.example.student_complaint_system.dto.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    
    public User createUser(SignupRequest signupRequest) {
        // Check if username already exists
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        
        // Create new user
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .build();
        
        return userRepository.save(user);
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    
    public User createAdmin(SignupRequest signupRequest) {
        // Check if username already exists
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        
        // Create new admin user
        User admin = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(User.UserRole.ADMIN)
                .build();
        
        return userRepository.save(admin);
    }
}
