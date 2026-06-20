package com.community.productcommunity.controller;

import com.community.productcommunity.dto.AuthResponse;
import com.community.productcommunity.dto.LoginRequest;
import com.community.productcommunity.dto.RegisterRequest;
import com.community.productcommunity.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;



    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registrationRequest) {
        return ResponseEntity.ok(userService.registerUser(registrationRequest));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.authenticateUser(loginRequest.getEmail(),loginRequest.getPassword()));
    }
}
