package com.nckh.backend.modules.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.override-receiver:false}")
    private boolean overrideReceiver;

    @Value("${spring.mail.test-receiver:}")
    private String testReceiver;

    @Value("${spring.mail.username}")
    private String smtpUsername;

    @PostConstruct
    public void init() {
        System.out.println(">>> [INIT] Modular EmailService starting...");
        System.out.println(">>> [INIT] JavaMailSender Bean: " + (mailSender != null ? "INJECTED ✅" : "NULL ❌"));
        System.out.println(">>> [INIT] SMTP Config: " + smtpUsername);
        System.out.println(">>> [INIT] Redirect Active: " + overrideReceiver + " | To: " + testReceiver);
    }

    public void sendOtp(String to, String otp) {
        System.out.println(">>> [SERVICE] Processing OTP for: " + to);
        String recipient = to;
        
        if (overrideReceiver && testReceiver != null && !testReceiver.isEmpty()) {
            System.err.println(">>> [SERVICE] REDIRECT ACTIVE: " + to + " -> " + testReceiver);
            recipient = testReceiver;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(smtpUsername);
        message.setTo(recipient);
        message.setSubject("Mã xác thực OTP - Hệ thống NCKH");
        message.setText("Mã xác thực của bạn là: " + otp + "\n\nMã này sẽ hết hạn sau 5 phút.");
        
        try {
            System.out.println(">>> [SMTP] Handshaking with Google for: " + recipient);
            if (mailSender == null) {
                throw new RuntimeException("JavaMailSender is NOT initialized!");
            }
            mailSender.send(message);
            System.err.println(">>> [SMTP SUCCESS] Mail delivered to: " + recipient);
        } catch (Exception e) {
            System.err.println(">>> [SMTP ERROR] FAILED: " + e.getMessage());
            e.printStackTrace();
            System.err.println(">>> [BACKUP OTP] " + recipient + " Code: " + otp);
        }
    }
}
