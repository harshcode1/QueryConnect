package com.community.productcommunity.service;

import com.community.productcommunity.dto.AuthResponse;
import com.community.productcommunity.dto.RegisterRequest;
import com.community.productcommunity.exception.AuthenticationFailedException;
import com.community.productcommunity.exception.EmailAlreadyExistException;
import com.community.productcommunity.model.User;
import com.community.productcommunity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new EmailAlreadyExistException("Email already in use");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getFirstName(), savedUser.getLastName());

        return new AuthResponse(token, savedUser.getEmail(), savedUser.getId());
    }

    public AuthResponse authenticateUser(String email, String password) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            // Generate JWT token
            String token = jwtService.generateToken(user.getEmail(), user.getFirstName(), user.getLastName());

            // Return authentication response with token and user details
            return new AuthResponse(token, user.getEmail(), user.getId());

        } catch (Exception e) {
            throw new AuthenticationFailedException("Invalid email or password");
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
