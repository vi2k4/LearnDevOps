package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Dto.ConversationRequestDto;
import com.example.LearnDevOps.Dto.ConversationResponseDto;
import com.example.LearnDevOps.Service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @PostMapping
    public ResponseEntity<ConversationResponseDto> create(@Valid @RequestBody ConversationRequestDto requestDto) {
        ConversationResponseDto response = conversationService.saveConversation(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ConversationResponseDto>> list() {
        List<ConversationResponseDto> response = conversationService.getAllConversations();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponseDto> get(@PathVariable Long id) {
        ConversationResponseDto response = conversationService.getConversationById(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConversationResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ConversationRequestDto requestDto) {
        ConversationResponseDto response = conversationService.updateConversation(id, requestDto);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        conversationService.deleteConversation(id);
        return ResponseEntity.noContent().build();
    }
}

