package com.nckh.backend.modules.research.topic;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ResearchTopicService {

    @Autowired
    private ResearchTopicRepository topicRepo;

    @Autowired
    private UserRepository userRepo;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<ResearchTopic> getAllTopics(String status) {
        if (status != null && !status.isBlank()) {
            return topicRepo.findByStatus(status);
        }
        return topicRepo.findAll();
    }

    public Optional<ResearchTopic> getTopicById(Long id) {
        return topicRepo.findById(id);
    }

    public ResearchTopic createTopic(ResearchTopicRequest req) {
        ResearchTopic topic = new ResearchTopic();
        topic.setTopicCode(req.getTopicCode());
        topic.setTitle(req.getTitle());
        topic.setFieldArea(req.getFieldArea());
        topic.setLevel(req.getLevel());
        topic.setBudget(req.getBudget());
        topic.setStatus(req.getStatus() != null ? req.getStatus() : "PENDING");
        topic.setProgress(req.getProgress() != null ? req.getProgress() : 0);
        topic.setSubmittedAt(new Date());

        if (req.getLeaderId() != null) {
            userRepo.findById(req.getLeaderId()).ifPresent(topic::setLeader);
        }

        try {
            if (req.getStartDate() != null) topic.setStartDate(sdf.parse(req.getStartDate()));
            if (req.getEndDate() != null) topic.setEndDate(sdf.parse(req.getEndDate()));
        } catch (Exception ignored) {}

        return topicRepo.save(topic);
    }

    private void checkOwnership(ResearchTopic topic, Integer currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) return;
        if (topic.getLeader() != null && topic.getLeader().getId().equals(currentUserId)) return;
        throw new RuntimeException("Access Denied: You do not own this topic");
    }

    public ResearchTopic updateStatus(Long id, Map<String, String> body, Integer currentUserId, String currentUserRole) {
        ResearchTopic topic = topicRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        checkOwnership(topic, currentUserId, currentUserRole);

        if (body.containsKey("status")) topic.setStatus(body.get("status"));
        if (body.containsKey("progress")) topic.setProgress(Integer.parseInt(body.get("progress")));
        topic.setUpdatedAt(new Date());

        return topicRepo.save(topic);
    }

    public ResearchTopic updateTopic(Long id, ResearchTopicRequest req, Integer currentUserId, String currentUserRole) {
        ResearchTopic topic = topicRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        checkOwnership(topic, currentUserId, currentUserRole);

        if (req.getTitle() != null) topic.setTitle(req.getTitle());
        if (req.getFieldArea() != null) topic.setFieldArea(req.getFieldArea());
        if (req.getLevel() != null) topic.setLevel(req.getLevel());
        if (req.getBudget() != null) topic.setBudget(req.getBudget());
        if (req.getStatus() != null) topic.setStatus(req.getStatus());
        if (req.getProgress() != null) topic.setProgress(req.getProgress());
        topic.setUpdatedAt(new Date());

        return topicRepo.save(topic);
    }

    public void deleteTopic(Long id, Integer currentUserId, String currentUserRole) {
        ResearchTopic topic = topicRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        checkOwnership(topic, currentUserId, currentUserRole);
        
        topicRepo.deleteById(id);
    }

    public Map<String, Long> getStats() {
        return Map.of(
            "total", topicRepo.count(),
            "pending", topicRepo.countByStatus("PENDING"),
            "active", topicRepo.countByStatus("ACTIVE"),
            "delayed", topicRepo.countByStatus("DELAYED"),
            "completed", topicRepo.countByStatus("COMPLETED")
        );
    }
}
