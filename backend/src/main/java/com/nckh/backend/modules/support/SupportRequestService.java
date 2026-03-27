package com.nckh.backend.modules.support;

import com.nckh.backend.modules.notification.NotificationService;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SupportRequestService {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public SupportRequest createRequest(String username, SupportRequestInput input) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest request = new SupportRequest();
        request.setUser(user);
        request.setSubject(input.getSubject());
        request.setDetails(input.getDetails());
        
        return supportRequestRepository.save(request);
    }

    public List<SupportRequest> getMyRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return supportRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<SupportRequest> getAllRequests() {
        return supportRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public SupportRequest getRequestById(Integer id) {
        return supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    @Transactional
    public SupportRequest updateStatus(Integer id, String status) {
        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        
        SupportRequest saved = supportRequestRepository.save(request);

        // Notify user
        String message = "Yêu cầu hỗ trợ của bạn [" + request.getSubject() + "] đã được chuyển sang trạng thái: " + status;
        notificationService.createNotification(
                request.getUser().getId(),
                "Cập nhật trạng thái hỗ trợ",
                message,
                "SUPPORT",
                "/sinh-vien/support"
        );

        return saved;
    }
}
