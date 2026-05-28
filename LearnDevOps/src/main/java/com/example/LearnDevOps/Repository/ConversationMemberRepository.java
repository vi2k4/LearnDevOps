package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.ConversationMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationMemberRepository
        extends JpaRepository<ConversationMemberEntity, Long> {

    List<ConversationMemberEntity>
    findByUserId(Long userId);

    List<ConversationMemberEntity>
    findByConversationId(Long conversationId);
}