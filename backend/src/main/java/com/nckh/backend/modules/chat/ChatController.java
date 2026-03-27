package com.nckh.backend.modules.chat;

import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private UserRepository userRepository;

    // Send a message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload, Authentication auth) {
        UserDetailsImpl currentUser = (UserDetailsImpl) auth.getPrincipal();
        Integer receiverId = (Integer) payload.get("receiverId");
        String content = (String) payload.get("content");

        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }

        ChatMessage message = chatMessageService.sendMessage(currentUser.getId(), receiverId, content);
        return ResponseEntity.ok(message);
    }

    // Get conversation history with specific user
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getHistory(@PathVariable Integer userId, Authentication auth) {
        UserDetailsImpl currentUser = (UserDetailsImpl) auth.getPrincipal();
        List<ChatMessage> history = chatMessageService.getConversation(currentUser.getId(), userId);
        
        // Auto-mark as read when history is fetched
        chatMessageService.markAsRead(currentUser.getId(), userId);
        
        return ResponseEntity.ok(history);
    }

    // Admin: Get list of users who have sent messages
    @GetMapping("/admin/conversations")
    public ResponseEntity<?> getConversations(Authentication auth) {
        UserDetailsImpl currentUser = (UserDetailsImpl) auth.getPrincipal();
        // Return user info for each active conversation
        List<Integer> userIds = chatMessageService.getActiveConversations(currentUser.getId());
        
        List<Map<String, Object>> userList = userIds.stream().map(id -> {
            User u = userRepository.findById(id).orElse(null);
            Map<String, Object> map = new HashMap<>();
            if (u != null) {
                map.put("id", u.getId());
                map.put("username", u.getUsername());
                map.put("fullName", u.getFullName());
                map.put("role", u.getRole() != null ? u.getRole().getRoleName() : "USER");
                map.put("lastSeen", u.getLastSeen());
            }
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }
    
    // Helper to find "the" Admin ID (usually ID 1 or first user with ADMIN role)
    // For simplicity, we can just return the first admin found
    @GetMapping("/admin-id")
    public ResponseEntity<?> getAdminId() {
        User admin = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && (
                        "ADMIN".equalsIgnoreCase(u.getRole().getRoleName()) ||
                        "ROLE_ADMIN".equalsIgnoreCase(u.getRole().getRoleName())
                ))
                .findFirst()
                .orElse(null);
        if (admin != null) {
            return ResponseEntity.ok(Map.of("adminId", admin.getId()));
        }
        return ResponseEntity.notFound().build();
    }
}
