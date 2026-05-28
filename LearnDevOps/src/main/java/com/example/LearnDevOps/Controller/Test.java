package com.example.LearnDevOps.Controller;


import com.example.LearnDevOps.Entity.UserEntity;
import com.example.LearnDevOps.Repository.UserRepository;
import com.example.LearnDevOps.Security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth/")

public class Test {
    @Autowired
    public JwtService jwtService;

    @Autowired
    public UserRepository userRepository;

    @GetMapping("/token")
    public String getToken(){
        return jwtService.generateToken("admin") ;
    }
    @GetMapping("/hello")
    public String getUser(){
        return "Vai dan";
    }

    @GetMapping("/test-db")
    public String test(){

        long count = userRepository.count();

        return "OKLAAAA " + count;
    }

    @GetMapping("/test1")
    public UserEntity test1(){

        return userRepository.findByEmail(
                "test@gmail.com"
        );
    }

}
