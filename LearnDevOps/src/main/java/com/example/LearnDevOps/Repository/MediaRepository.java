package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.MediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository
        extends JpaRepository<MediaEntity, Long> {
}