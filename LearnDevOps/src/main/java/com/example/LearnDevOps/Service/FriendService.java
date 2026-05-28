package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.FriendEntity;
import com.example.LearnDevOps.Repository.FriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepository;

    public FriendEntity saveFriend(FriendEntity friend){
        return friendRepository.save(friend);
    }

    public List<FriendEntity> getAllFriends(){
        return friendRepository.findAll();
    }

    public FriendEntity getFriendById(Long id){
        return friendRepository.findById(id).orElse(null);
    }

    public List<FriendEntity> getByUserId(Long userId){
        return friendRepository.findByUserId(userId);
    }

    public void deleteFriend(Long id){
        friendRepository.deleteById(id);
    }
}

