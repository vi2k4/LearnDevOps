package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.MessageReadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageReadRepository
        extends JpaRepository<MessageReadEntity, Long> {

    List<MessageReadEntity>
    findByUserId(Long userId);

    List<MessageReadEntity>
    findByMessageId(Long messageId);
}