package com.example.LearnDevOps.Controller;


import com.example.LearnDevOps.Security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/")
public class API {

    @Autowired
    public JwtService jwtService;
    @GetMapping("name")
    public String getUsername(){
        return "success";
    }
}
