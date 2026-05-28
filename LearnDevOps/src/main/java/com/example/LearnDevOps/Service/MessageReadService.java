package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.MessageReadEntity;
import com.example.LearnDevOps.Repository.MessageReadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageReadService {

    @Autowired
    private MessageReadRepository messageReadRepository;

    public MessageReadEntity save(MessageReadEntity entity){
        return messageReadRepository.save(entity);
    }

    public List<MessageReadEntity> getAll(){
        return messageReadRepository.findAll();
    }

    public MessageReadEntity getById(Long id){
        return messageReadRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        messageReadRepository.deleteById(id);
    }
}

