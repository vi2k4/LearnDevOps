package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Dto.ConversationRequestDto;
import com.example.LearnDevOps.Dto.ConversationResponseDto;
import com.example.LearnDevOps.Entity.ConversationEntity;
import com.example.LearnDevOps.Repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    public ConversationResponseDto saveConversation(ConversationRequestDto requestDto) {
        ConversationEntity conversation = new ConversationEntity();
        conversation.setType(requestDto.getType());
        conversation.setName(requestDto.getName());
        conversation.setCreatedAt(LocalDateTime.now());
        
        ConversationEntity saved = conversationRepository.save(conversation);
        return mapToResponseDto(saved);
    }

    public List<ConversationResponseDto> getAllConversations() {
        return conversationRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ConversationResponseDto getConversationById(Long id) {
        ConversationEntity conversation = conversationRepository.findById(id).orElse(null);
        return conversation != null ? mapToResponseDto(conversation) : null;
    }

    public ConversationResponseDto updateConversation(Long id, ConversationRequestDto requestDto) {
        ConversationEntity conversation = conversationRepository.findById(id).orElse(null);
        if (conversation == null) {
            return null;
        }
        
        conversation.setType(requestDto.getType());
        conversation.setName(requestDto.getName());
        
        ConversationEntity updated = conversationRepository.save(conversation);
        return mapToResponseDto(updated);
    }

    public void deleteConversation(Long id) {
        conversationRepository.deleteById(id);
    }

    private ConversationResponseDto mapToResponseDto(ConversationEntity entity) {
        return new ConversationResponseDto(
                entity.getId(),
                entity.getType(),
                entity.getName(),
                entity.getCreatedAt()
        );
    }
}

