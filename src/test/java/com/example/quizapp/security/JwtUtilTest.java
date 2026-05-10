package com.example.quizapp.security;

import com.example.quizapp.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret",
            "7a2f4d8e1b5c9f3a6d0e4b7c2f5a8d1e4b7c0f3a6d9e2b5c8f1a4d7e0b3c6f9");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    void generateTokenReturnsNonNullToken() {
        String token = jwtUtil.generateToken("ali", Role.ROLE_TEACHER);
        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractUsernameReturnsCorrectUsername() {
        String token = jwtUtil.generateToken("ali", Role.ROLE_TEACHER);
        assertEquals("ali", jwtUtil.extractUsername(token));
    }

    @Test
    void extractRoleReturnsFullRoleWithPrefix() {
        String token = jwtUtil.generateToken("ali", Role.ROLE_TEACHER);
        assertEquals("ROLE_TEACHER", jwtUtil.extractRole(token));
    }

    @Test
    void validateTokenReturnsTrueForValidToken() {
        String token = jwtUtil.generateToken("ali", Role.ROLE_TEACHER);
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void validateTokenReturnsFalseForTamperedToken() {
        String token = jwtUtil.generateToken("ali", Role.ROLE_TEACHER);
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";
        assertFalse(jwtUtil.validateToken(tampered));
    }

    @Test
    void tokenRoundTripPreservesStudentRole() {
        String token = jwtUtil.generateToken("student1", Role.ROLE_STUDENT);
        assertEquals("student1", jwtUtil.extractUsername(token));
        assertEquals("ROLE_STUDENT", jwtUtil.extractRole(token));
    }
}
