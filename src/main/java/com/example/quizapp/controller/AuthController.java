package com.example.quizapp.controller;

import com.example.quizapp.model.Role;
import com.example.quizapp.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request.username(), request.password(), request.role());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.username(), request.password());
    }

    @GetMapping("/guest")
    public ResponseEntity<String> guest() {
        return authService.guestLogin();
    }

    public record RegisterRequest(@NotBlank String username, @NotBlank String password, @NotNull Role role) {}
    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
}
