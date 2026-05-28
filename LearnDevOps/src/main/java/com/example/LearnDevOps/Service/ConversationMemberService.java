package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.ConversationMemberEntity;
import com.example.LearnDevOps.Repository.ConversationMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationMemberService {

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    public ConversationMemberEntity saveMember(ConversationMemberEntity member){
        return conversationMemberRepository.save(member);
    }

    public List<ConversationMemberEntity> getAllMembers(){
        return conversationMemberRepository.findAll();
    }

    public ConversationMemberEntity getMemberById(Long id){
        return conversationMemberRepository.findById(id).orElse(null);
    }

    public void deleteMember(Long id){
        conversationMemberRepository.deleteById(id);
    }
}

