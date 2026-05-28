package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.NotificationEntity;
import com.example.LearnDevOps.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public NotificationEntity create(@RequestBody NotificationEntity entity){
        return notificationService.save(entity);
    }

    @GetMapping
    public List<NotificationEntity> list(){
        return notificationService.getAll();
    }

    @GetMapping("/{id}")
    public NotificationEntity get(@PathVariable Long id){
        return notificationService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<NotificationEntity> byUser(@PathVariable Long userId){
        return notificationService.getByUserId(userId);
    }

    @PutMapping("/{id}")
    public NotificationEntity update(@PathVariable Long id, @RequestBody NotificationEntity entity){
        entity.setId(id);
        return notificationService.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        notificationService.delete(id);
    }
}

