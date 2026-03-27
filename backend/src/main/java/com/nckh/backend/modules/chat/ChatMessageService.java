package com.nckh.backend.modules.chat;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessage sendMessage(Integer senderId, Integer receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage message = new ChatMessage(sender, receiver, content);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getConversation(Integer userId1, Integer userId2) {
        List<ChatMessage> messages = chatMessageRepository.findConversation(userId1, userId2);
        
        // Mark as read if user is one of the participants (optional logic for later)
        return messages;
    }

    @Transactional
    public void markAsRead(Integer receiverId, Integer senderId) {
        List<ChatMessage> unread = chatMessageRepository.findUnreadMessages(receiverId);
        for (ChatMessage m : unread) {
            if (m.getSender().getId().equals(senderId)) {
                m.setRead(true);
            }
        }
        chatMessageRepository.saveAll(unread);
    }

    public List<Integer> getActiveConversations(Integer userId) {
        return chatMessageRepository.findAllInteractedUserIds(userId);
    }
}
