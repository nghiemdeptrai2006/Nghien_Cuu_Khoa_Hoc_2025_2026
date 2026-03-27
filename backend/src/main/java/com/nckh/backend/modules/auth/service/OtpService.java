package com.nckh.backend.modules.auth.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String username) {
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(username, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    public boolean verifyOtp(String username, String otp) {
        OtpData data = otpStorage.get(username);
        if (data == null) return false;
        
        if (data.expiry.isBefore(LocalDateTime.now())) {
            otpStorage.remove(username);
            return false;
        }
        
        boolean isValid = data.otp.equals(otp);
        if (isValid) otpStorage.remove(username); // One-time use
        return isValid;
    }

    private static class OtpData {
        final String otp;
        final LocalDateTime expiry;

        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }
}
