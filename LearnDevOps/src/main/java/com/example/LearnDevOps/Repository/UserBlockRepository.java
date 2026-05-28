package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.UserBlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBlockRepository
        extends JpaRepository<UserBlockEntity, Long> {

    List<UserBlockEntity>
    findByBlockerId(Long blockerId);
}