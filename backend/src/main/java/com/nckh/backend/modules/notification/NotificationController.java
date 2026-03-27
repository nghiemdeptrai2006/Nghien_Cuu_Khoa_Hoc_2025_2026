package com.nckh.backend.modules.notification;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace(); // Log ra console backend
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("LỖI BACKEND: " + e.getMessage());
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        // 🟢 CÁCH 1: Lấy trực tiếp ID từ UserDetailsImpl (Chính xác nhất)
        if (principal instanceof UserDetailsImpl) {
            return userRepository.findById(((UserDetailsImpl) principal).getId()).orElse(null);
        }

        // 🟡 CÁCH 2: Tìm theo Name (Username hoặc Email)
        String name = authentication.getName();
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy người dùng (Vui lòng đăng nhập lại)");
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.ok(Map.of("count", 0L));
        }
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-global")
    public ResponseEntity<?> sendGlobalNotification(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String message = payload.get("message");
        String type = payload.get("type");
        String link = payload.get("link");

        if (title == null || message == null) {
            return ResponseEntity.badRequest().body("Tiêu đề và nội dung không được để trống");
        }

        notificationService.sendGlobalNotification(title, message, type, link);
        return ResponseEntity.ok().build();
    }
}
