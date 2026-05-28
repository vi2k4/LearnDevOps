package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.UserBlockEntity;
import com.example.LearnDevOps.Service.UserBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-blocks")
public class UserBlockController {

    @Autowired
    private UserBlockService userBlockService;

    @PostMapping
    public UserBlockEntity create(@RequestBody UserBlockEntity entity){
        return userBlockService.save(entity);
    }

    @GetMapping
    public List<UserBlockEntity> list(){
        return userBlockService.getAll();
    }

    @GetMapping("/{id}")
    public UserBlockEntity get(@PathVariable Long id){
        return userBlockService.getById(id);
    }

    @PutMapping("/{id}")
    public UserBlockEntity update(@PathVariable Long id, @RequestBody UserBlockEntity entity){
        entity.setId(id);
        return userBlockService.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        userBlockService.delete(id);
    }
}

