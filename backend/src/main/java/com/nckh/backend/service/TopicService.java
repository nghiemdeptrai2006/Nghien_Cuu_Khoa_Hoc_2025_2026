package com.nckh.backend.service;

import com.nckh.backend.dto.TopicRequest;
import com.nckh.backend.model.Topic;
import com.nckh.backend.model.User;
import com.nckh.backend.repository.TopicRepository;
import com.nckh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public List<Topic> getTopicsByAuthor(Integer authorId) {
        return topicRepository.findByAuthorId(authorId);
    }

    public Topic createTopic(TopicRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = new Topic();
        topic.setTitle(request.getTitle());
        topic.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            topic.setStatus(request.getStatus());
        }
        topic.setAuthor(author);

        return topicRepository.save(topic);
    }

    public Topic updateTopic(Integer topicId, TopicRequest request, String username) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        // Xác minh chỉ tác giả hoặc admin mới được sửa
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        if (!topic.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().getRoleName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bạn không có quyền sửa đề tài này.");
        }

        if (request.getTitle() != null) topic.setTitle(request.getTitle());
        if (request.getDescription() != null) topic.setDescription(request.getDescription());
        if (request.getStatus() != null) topic.setStatus(request.getStatus());

        return topicRepository.save(topic);
    }

    public void deleteTopic(Integer topicId, String username) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        User currentUser = userRepository.findByUsername(username).orElseThrow();
        if (!topic.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().getRoleName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xoá đề tài này.");
        }

        topicRepository.delete(topic);
    }
}
