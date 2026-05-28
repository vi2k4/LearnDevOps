package com.example.LearnDevOps.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestDto {

    @NotNull(message = "Sender ID is required")
    private Long senderId;

    @NotNull(message = "Conversation ID is required")
    private Long conversationId;

    @NotBlank(message = "Content is required")
    private String content;

    private String type;
    private Boolean isDeleted;
    private Boolean isEdited;
}

