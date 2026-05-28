package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Dto.UserResponseDto;
import com.example.LearnDevOps.Entity.UserEntity;
import com.example.LearnDevOps.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> me(Authentication authentication) {

        String id = authentication.getName();

        Optional<UserEntity> userOptional = userRepository.findById(Long.parseLong(id));

        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            UserResponseDto responseDto = new UserResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatar(),
                    user.getStatus(),
                    user.getCreatedAt()
            );
            return ResponseEntity.ok(responseDto);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<java.util.List<UserResponseDto>> list() {
        java.util.List<com.example.LearnDevOps.Entity.UserEntity> users = userRepository.findAll();
        java.util.List<UserResponseDto> response = users.stream()
                .map(u -> new UserResponseDto(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getAvatar(),
                        u.getStatus(),
                        u.getCreatedAt()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }
}

