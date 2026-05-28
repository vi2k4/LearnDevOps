package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Dto.MessageRequestDto;
import com.example.LearnDevOps.Dto.MessageResponseDto;
import com.example.LearnDevOps.Service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class MessageWebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Valid @Payload MessageRequestDto requestDto, SimpMessageHeaderAccessor headerAccessor) {
        Long senderId = resolveSenderId(headerAccessor, requestDto.getSenderId());

        MessageRequestDto normalizedRequest = new MessageRequestDto(
                senderId,
                requestDto.getConversationId(),
                requestDto.getContent(),
                requestDto.getType(),
                requestDto.getIsDeleted(),
                requestDto.getIsEdited()
        );

        MessageResponseDto saved = messageService.saveMessage(normalizedRequest);
        String conversationTopic = "/topic/conversations/" + saved.getConversationId();

        messagingTemplate.convertAndSend(conversationTopic, saved);
        messagingTemplate.convertAndSend("/topic/messages", saved);
    }

    private Long resolveSenderId(SimpMessageHeaderAccessor headerAccessor, Long fallbackSenderId) {
        if (headerAccessor != null && headerAccessor.getSessionAttributes() != null) {
            Object sessionUserId = headerAccessor.getSessionAttributes().get("userId");
            if (sessionUserId != null) {
                try {
                    return Long.valueOf(String.valueOf(sessionUserId));
                } catch (NumberFormatException ignored) {
                    // fall back to payload sender id below
                }
            }
        }

        return fallbackSenderId;
    }
}