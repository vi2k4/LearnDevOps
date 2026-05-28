package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.UserEntity;
import com.example.LearnDevOps.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserEntity saveUser(UserEntity user){

        return userRepository.save(user);
    }

    public List<UserEntity> getAllUsers(){

        return userRepository.findAll();
    }

    public UserEntity getUserById(Long id){

        return userRepository.findById(id)
                .orElse(null);
    }

    public UserEntity getByEmail(String email){

        return userRepository.findByEmail(email);
    }

    public UserEntity getByUsername(String username){

        return userRepository.findByUsername(username);
    }

    public void deleteUser(Long id){

        userRepository.deleteById(id);
    }
}