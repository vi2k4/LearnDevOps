package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.ReportEntity;
import com.example.LearnDevOps.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public ReportEntity save(ReportEntity entity){
        return reportRepository.save(entity);
    }

    public List<ReportEntity> getAll(){
        return reportRepository.findAll();
    }

    public ReportEntity getById(Long id){
        return reportRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        reportRepository.deleteById(id);
    }
}

