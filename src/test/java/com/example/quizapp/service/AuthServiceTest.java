package com.example.quizapp.service;

import com.example.quizapp.dao.UserRepository;
import com.example.quizapp.model.Role;
import com.example.quizapp.model.User;
import com.example.quizapp.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerReturnsBadRequestWhenUsernameAlreadyExists() {
        when(userRepository.findByUsername("ali")).thenReturn(Optional.of(new User()));

        var response = authService.register("ali", "password", Role.ROLE_STUDENT);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username already taken", response.getBody());
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerHashesPasswordAndSavesUser() {
        when(userRepository.findByUsername("ali")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("hashed");

        var response = authService.register("ali", "password", Role.ROLE_TEACHER);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Registered successfully", response.getBody());
        verify(userRepository).save(argThat(user ->
            user.getUsername().equals("ali") &&
            user.getPassword().equals("hashed") &&
            user.getRole() == Role.ROLE_TEACHER
        ));
    }

    @Test
    void loginReturnsUnauthorizedWhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        var response = authService.login("unknown", "password");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void loginReturnsUnauthorizedWhenPasswordDoesNotMatch() {
        User user = new User();
        user.setUsername("ali");
        user.setPassword("hashed");
        user.setRole(Role.ROLE_STUDENT);

        when(userRepository.findByUsername("ali")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed")).thenReturn(false);

        var response = authService.login("ali", "wrongpass");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void loginReturnsTokenOnSuccess() {
        User user = new User();
        user.setUsername("ali");
        user.setPassword("hashed");
        user.setRole(Role.ROLE_TEACHER);

        when(userRepository.findByUsername("ali")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken("ali", Role.ROLE_TEACHER)).thenReturn("token123");

        var response = authService.login("ali", "password");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("token123", response.getBody());
    }
}
