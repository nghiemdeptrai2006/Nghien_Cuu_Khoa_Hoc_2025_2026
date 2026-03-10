package com.nckh.backend.controller;

import com.nckh.backend.dto.TopicRequest;
import com.nckh.backend.model.Topic;
import com.nckh.backend.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody TopicRequest request) {
        String username = getUsername();
        return ResponseEntity.ok(topicService.createTopic(request, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Integer id, @RequestBody TopicRequest request) {
        String username = getUsername();
        return ResponseEntity.ok(topicService.updateTopic(id, request, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Integer id) {
        String username = getUsername();
        topicService.deleteTopic(id, username);
        return ResponseEntity.ok().build();
    }

    private String getUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}
