package com.example.LearnDevOps.Repository;

import com.example.LearnDevOps.Entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository
        extends JpaRepository<ReportEntity, Long> {
}