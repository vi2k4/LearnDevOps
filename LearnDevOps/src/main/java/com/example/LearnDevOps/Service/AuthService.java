package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Dto.AuthResponseDto;
import com.example.LearnDevOps.Dto.RegisterDto;
import com.example.LearnDevOps.Dto.UserResponseDto;
import com.example.LearnDevOps.Entity.UserEntity;
import com.example.LearnDevOps.Exception.DuplicateEmailException;
import com.example.LearnDevOps.Exception.InvalidPasswordException;
import com.example.LearnDevOps.Exception.UserNotFoundException;
import com.example.LearnDevOps.Repository.UserRepository;
import com.example.LearnDevOps.Security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponseDto register(RegisterDto registerDto) {

        UserEntity existedUser = userRepository.findByEmail(registerDto.getEmail());

        if (existedUser != null) {
            throw new DuplicateEmailException("Email already exists: " + registerDto.getEmail());
        }

        UserEntity user = new UserEntity();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setAvatar(registerDto.getAvatar());
        user.setCreatedAt(LocalDateTime.now());

        UserEntity savedUser = userRepository.save(user);

        UserResponseDto userResponseDto = mapToUserResponseDto(savedUser);

        return new AuthResponseDto(
                "Register success",
                null,
                userResponseDto
        );
    }

    public AuthResponseDto login(String email, String password) {

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        boolean checkPassword = passwordEncoder.matches(password, user.getPassword());

        if (!checkPassword) {
            throw new InvalidPasswordException("Invalid password for email: " + email);
        }

        String token = jwtService.generateToken(String.valueOf(user.getId()));
        UserResponseDto userResponseDto = mapToUserResponseDto(user);

        return new AuthResponseDto(
                "Login success",
                token,
                userResponseDto
        );
    }

    private UserResponseDto mapToUserResponseDto(UserEntity user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatar(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}