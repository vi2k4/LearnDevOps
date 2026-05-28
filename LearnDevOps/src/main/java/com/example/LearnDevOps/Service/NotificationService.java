package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.NotificationEntity;
import com.example.LearnDevOps.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public NotificationEntity save(NotificationEntity entity){
        return notificationRepository.save(entity);
    }

    public List<NotificationEntity> getAll(){
        return notificationRepository.findAll();
    }

    public NotificationEntity getById(Long id){
        return notificationRepository.findById(id).orElse(null);
    }

    public List<NotificationEntity> getByUserId(Long userId){
        return notificationRepository.findByUserId(userId);
    }

    public void delete(Long id){
        notificationRepository.deleteById(id);
    }
}

