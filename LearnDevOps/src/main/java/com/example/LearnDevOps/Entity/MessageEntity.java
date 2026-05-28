package com.example.LearnDevOps.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserEntity sender;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private ConversationEntity conversation;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String type;

    private Boolean isDeleted;

    private Boolean isEdited;

    private LocalDateTime createdAt;
}