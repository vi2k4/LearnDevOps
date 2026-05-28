package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Dto.MessageRequestDto;
import com.example.LearnDevOps.Dto.MessageResponseDto;
import com.example.LearnDevOps.Service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> create(@Valid @RequestBody MessageRequestDto requestDto) {
        MessageResponseDto response = messageService.saveMessage(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MessageResponseDto>> list() {
        List<MessageResponseDto> response = messageService.getAllMessages();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageResponseDto> get(@PathVariable Long id) {
        MessageResponseDto response = messageService.getMessageById(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<MessageResponseDto>> byConversation(@PathVariable Long conversationId) {
        List<MessageResponseDto> response = messageService.getByConversationId(conversationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<MessageResponseDto>> bySender(@PathVariable Long senderId) {
        List<MessageResponseDto> response = messageService.getBySenderId(senderId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody MessageRequestDto requestDto) {
        MessageResponseDto response = messageService.updateMessage(id, requestDto);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}

