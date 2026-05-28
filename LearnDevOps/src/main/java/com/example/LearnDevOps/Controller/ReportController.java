package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.ReportEntity;
import com.example.LearnDevOps.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ReportEntity create(@RequestBody ReportEntity entity){
        return reportService.save(entity);
    }

    @GetMapping
    public List<ReportEntity> list(){
        return reportService.getAll();
    }

    @GetMapping("/{id}")
    public ReportEntity get(@PathVariable Long id){
        return reportService.getById(id);
    }

    @PutMapping("/{id}")
    public ReportEntity update(@PathVariable Long id, @RequestBody ReportEntity entity){
        entity.setId(id);
        return reportService.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        reportService.delete(id);
    }
}

