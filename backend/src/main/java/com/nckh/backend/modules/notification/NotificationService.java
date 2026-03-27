package com.nckh.backend.modules.notification;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách thông báo của người dùng (mới nhất lên đầu)
     */
    public List<Notification> getNotificationsForUser(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Đếm số lượng thông báo chưa đọc
     */
    public long getUnreadCount(Integer userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * Tạo thông báo mới (Dùng cho các module khác gọi sang)
     */
    @Transactional
    public Notification createNotification(Integer userId, String title, String message, String type, String link) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type != null ? type : "GENERAL");
        notification.setLink(link);
        
        return notificationRepository.save(notification);
    }

    /**
     * Đánh dấu 1 thông báo là đã đọc
     */
    @Transactional
    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Đánh dấu toàn bộ thông báo của user là đã đọc
     */
    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    /**
     * Gửi thông báo cho TẤT CẢ người dùng trong hệ thống
     */
    @Transactional
    public void sendGlobalNotification(String title, String message, String type, String link) {
        List<User> allUsers = userRepository.findAll();
        List<Notification> notifications = allUsers.stream().map(user -> {
            Notification n = new Notification();
            n.setUser(user);
            n.setTitle(title);
            n.setMessage(message);
            n.setType(type != null ? type : "SYSTEM");
            n.setLink(link);
            return n;
        }).collect(Collectors.toList());
        
        notificationRepository.saveAll(notifications);
    }
}
