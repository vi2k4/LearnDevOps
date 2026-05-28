package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<MessageEntity, Long> {

    List<MessageEntity>
    findByConversationId(Long conversationId);

    List<MessageEntity>
    findBySenderId(Long senderId);
}