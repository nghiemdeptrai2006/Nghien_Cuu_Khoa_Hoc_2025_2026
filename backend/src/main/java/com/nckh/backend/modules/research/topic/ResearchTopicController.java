package com.nckh.backend.modules.research.topic;

import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/topics")
public class ResearchTopicController {

    @Autowired
    private ResearchTopicService topicService;

    @GetMapping
    public ResponseEntity<?> getAllTopics(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(topicService.getAllTopics(status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id)
                .map(t -> ResponseEntity.ok((Object)ApiResponse.success(t)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error(404, "Topic not found")));
    }

    @PostMapping
    public ResponseEntity<?> createTopic(@RequestBody ResearchTopicRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đề tài đã được tạo thành công", topicService.createTopic(req)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", topicService.updateStatus(id, body, userDetails.getId(), role)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable Long id, @RequestBody ResearchTopicRequest req) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return ResponseEntity.ok(ApiResponse.success("Cập nhật đề tài thành công", topicService.updateTopic(id, req, userDetails.getId(), role)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            topicService.deleteTopic(id, userDetails.getId(), role);
            return ResponseEntity.ok(ApiResponse.success("Đã xóa đề tài thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(ApiResponse.success(topicService.getStats()));
    }
}
