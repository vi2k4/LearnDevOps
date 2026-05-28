package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Dto.AuthResponseDto;
import com.example.LearnDevOps.Dto.LoginDto;
import com.example.LearnDevOps.Dto.RegisterDto;
import com.example.LearnDevOps.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth/")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterDto registerDto) {
        AuthResponseDto response = authService.register(registerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        AuthResponseDto response = authService.login(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(response);
    }
}


