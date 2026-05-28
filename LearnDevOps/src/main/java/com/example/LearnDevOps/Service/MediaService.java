package com.example.LearnDevOps.Service;

import com.example.LearnDevOps.Entity.MediaEntity;
import com.example.LearnDevOps.Repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    public MediaEntity saveMedia(MediaEntity media){
        return mediaRepository.save(media);
    }

    public List<MediaEntity> getAllMedia(){
        return mediaRepository.findAll();
    }

    public MediaEntity getMediaById(Long id){
        return mediaRepository.findById(id).orElse(null);
    }

    public void deleteMedia(Long id){
        mediaRepository.deleteById(id);
    }
}

