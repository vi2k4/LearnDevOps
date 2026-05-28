package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.ConversationMemberEntity;
import com.example.LearnDevOps.Service.ConversationMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation-members")
public class ConversationMemberController {

    @Autowired
    private ConversationMemberService conversationMemberService;

    @PostMapping
    public ConversationMemberEntity create(@RequestBody ConversationMemberEntity member){
        return conversationMemberService.saveMember(member);
    }

    @GetMapping
    public List<ConversationMemberEntity> list(){
        return conversationMemberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ConversationMemberEntity get(@PathVariable Long id){
        return conversationMemberService.getMemberById(id);
    }

    @PutMapping("/{id}")
    public ConversationMemberEntity update(@PathVariable Long id, @RequestBody ConversationMemberEntity member){
        member.setId(id);
        return conversationMemberService.saveMember(member);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        conversationMemberService.deleteMember(id);
    }
}

