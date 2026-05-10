package com.example.quizapp.controller;

import com.example.quizapp.model.Role;
import com.example.quizapp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return authService.register(request.username(), request.password(), request.role());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return authService.login(request.username(), request.password());
    }

    public record RegisterRequest(String username, String password, Role role) {}
    public record LoginRequest(String username, String password) {}
}
