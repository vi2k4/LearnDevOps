package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository
        extends JpaRepository<ConversationEntity, Long> {
}