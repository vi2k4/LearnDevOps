package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.FriendEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository
        extends JpaRepository<FriendEntity, Long> {

    List<FriendEntity>
    findByUserId(Long userId);
}