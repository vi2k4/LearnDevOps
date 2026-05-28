package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<UserEntity, Long> {

    UserEntity findByEmail(String email);

    UserEntity findByUsername(String username);
}