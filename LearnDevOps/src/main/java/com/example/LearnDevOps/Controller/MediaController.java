package com.example.LearnDevOps.Controller;

import com.example.LearnDevOps.Entity.MediaEntity;
import com.example.LearnDevOps.Service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping
    public MediaEntity create(@RequestBody MediaEntity media){
        return mediaService.saveMedia(media);
    }

    @GetMapping
    public List<MediaEntity> list(){
        return mediaService.getAllMedia();
    }

    @GetMapping("/{id}")
    public MediaEntity get(@PathVariable Long id){
        return mediaService.getMediaById(id);
    }

    @PutMapping("/{id}")
    public MediaEntity update(@PathVariable Long id, @RequestBody MediaEntity media){
        media.setId(id);
        return mediaService.saveMedia(media);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        mediaService.deleteMedia(id);
    }
}

