package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.UserBlockEntity;
import com.example.LearnDevOps.Repository.UserBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserBlockService {

    @Autowired
    private UserBlockRepository userBlockRepository;

    public UserBlockEntity save(UserBlockEntity entity){
        return userBlockRepository.save(entity);
    }

    public List<UserBlockEntity> getAll(){
        return userBlockRepository.findAll();
    }

    public UserBlockEntity getById(Long id){
        return userBlockRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        userBlockRepository.deleteById(id);
    }
}

