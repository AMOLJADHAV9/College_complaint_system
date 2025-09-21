package com.example.student_complaint_system.controller;

import com.example.student_complaint_system.dto.AuthResponse;
import com.example.student_complaint_system.dto.LoginRequest;
import com.example.student_complaint_system.dto.SignupRequest;
import com.example.student_complaint_system.model.User;
import com.example.student_complaint_system.security.JwtUtil;
import com.example.student_complaint_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.createUser(signupRequest);
            
            // Generate JWT token for the new user
            String jwt = jwtUtil.generateToken(user.getUsername());
            
            // Create response with user info (excluding password)
            User responseUser = User.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
            
            return ResponseEntity.ok(new AuthResponse(jwt, responseUser));
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/admin/signup")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.createAdmin(signupRequest);
            
            // Generate JWT token for the new admin
            String jwt = jwtUtil.generateToken(user.getUsername());
            
            // Create response with user info (excluding password)
            User responseUser = User.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
            
            return ResponseEntity.ok(new AuthResponse(jwt, responseUser));
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Admin registration failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            User user = (User) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(user.getUsername());
            
            // Create response with user info (excluding password)
            User responseUser = User.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
            
            return ResponseEntity.ok(new AuthResponse(jwt, responseUser));
            
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (AuthenticationException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Authentication failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateJwt(token)) {
                    String username = jwtUtil.getUsernameFromJwt(token);
                    User user = userService.findByUsername(username);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("username", user.getUsername());
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Invalid token");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
                }
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "No token provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Token verification failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
