package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.MessageReadEntity;
import com.example.LearnDevOps.Service.MessageReadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message-reads")
public class MessageReadController {

    @Autowired
    private MessageReadService messageReadService;

    @PostMapping
    public MessageReadEntity create(@RequestBody MessageReadEntity entity){
        return messageReadService.save(entity);
    }

    @GetMapping
    public List<MessageReadEntity> list(){
        return messageReadService.getAll();
    }

    @GetMapping("/{id}")
    public MessageReadEntity get(@PathVariable Long id){
        return messageReadService.getById(id);
    }

    @PutMapping("/{id}")
    public MessageReadEntity update(@PathVariable Long id, @RequestBody MessageReadEntity entity){
        entity.setId(id);
        return messageReadService.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        messageReadService.delete(id);
    }
}

