package com.example.LearnDevOps.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {

    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long conversationId;
    private String content;
    private String type;
    private Boolean isDeleted;
    private Boolean isEdited;
    private LocalDateTime createdAt;
}

