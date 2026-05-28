package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Dto.MessageRequestDto;
import com.example.LearnDevOps.Dto.MessageResponseDto;
import com.example.LearnDevOps.Entity.ConversationEntity;
import com.example.LearnDevOps.Entity.MessageEntity;
import com.example.LearnDevOps.Entity.UserEntity;
import com.example.LearnDevOps.Repository.ConversationRepository;
import com.example.LearnDevOps.Repository.MessageRepository;
import com.example.LearnDevOps.Repository.UserRepository;
import com.example.LearnDevOps.Exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public MessageResponseDto saveMessage(MessageRequestDto requestDto) {
        UserEntity sender = userRepository.findById(requestDto.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Sender not found with id: " + requestDto.getSenderId()));

        ConversationEntity conversation = conversationRepository.findById(requestDto.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found with id: " + requestDto.getConversationId()));

        MessageEntity message = new MessageEntity();
        message.setSender(sender);
        message.setConversation(conversation);
        message.setContent(requestDto.getContent());
        message.setType(requestDto.getType());
        message.setIsDeleted(requestDto.getIsDeleted() != null ? requestDto.getIsDeleted() : false);
        message.setIsEdited(requestDto.getIsEdited() != null ? requestDto.getIsEdited() : false);
        message.setCreatedAt(LocalDateTime.now());

        MessageEntity saved = messageRepository.save(message);
        return mapToResponseDto(saved);
    }

    public List<MessageResponseDto> getAllMessages() {
        return messageRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public MessageResponseDto getMessageById(Long id) {
        MessageEntity message = messageRepository.findById(id).orElse(null);
        return message != null ? mapToResponseDto(message) : null;
    }

    public List<MessageResponseDto> getByConversationId(Long conversationId) {
        return messageRepository.findByConversationId(conversationId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MessageResponseDto> getBySenderId(Long senderId) {
        return messageRepository.findBySenderId(senderId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public MessageResponseDto updateMessage(Long id, MessageRequestDto requestDto) {
        MessageEntity message = messageRepository.findById(id).orElse(null);
        if (message == null) {
            return null;
        }

        message.setContent(requestDto.getContent());
        message.setType(requestDto.getType());
        message.setIsDeleted(requestDto.getIsDeleted() != null ? requestDto.getIsDeleted() : message.getIsDeleted());
        message.setIsEdited(requestDto.getIsEdited() != null ? requestDto.getIsEdited() : true);

        MessageEntity updated = messageRepository.save(message);
        return mapToResponseDto(updated);
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    private MessageResponseDto mapToResponseDto(MessageEntity entity) {
        return new MessageResponseDto(
                entity.getId(),
                entity.getSender() != null ? entity.getSender().getId() : null,
                entity.getSender() != null ? entity.getSender().getUsername() : null,
                entity.getConversation() != null ? entity.getConversation().getId() : null,
                entity.getContent(),
                entity.getType(),
                entity.getIsDeleted(),
                entity.getIsEdited(),
                entity.getCreatedAt()
        );
    }
}

