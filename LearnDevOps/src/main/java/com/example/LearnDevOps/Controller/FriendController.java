package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.FriendEntity;
import com.example.LearnDevOps.Service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @PostMapping
    public FriendEntity create(@RequestBody FriendEntity friend){
        return friendService.saveFriend(friend);
    }

    @GetMapping
    public List<FriendEntity> list(){
        return friendService.getAllFriends();
    }

    @GetMapping("/{id}")
    public FriendEntity get(@PathVariable Long id){
        return friendService.getFriendById(id);
    }

    @GetMapping("/user/{userId}")
    public List<FriendEntity> byUser(@PathVariable Long userId){
        return friendService.getByUserId(userId);
    }

    @PutMapping("/{id}")
    public FriendEntity update(@PathVariable Long id, @RequestBody FriendEntity friend){
        friend.setId(id);
        return friendService.saveFriend(friend);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        friendService.deleteFriend(id);
    }
}

