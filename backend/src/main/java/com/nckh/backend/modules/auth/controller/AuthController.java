package com.nckh.backend.modules.auth.controller;

import com.nckh.backend.modules.auth.dto.*;
import com.nckh.backend.modules.auth.service.EmailService;
import com.nckh.backend.modules.auth.service.OtpService;
import com.nckh.backend.modules.auth.security.JwtTokenProvider;
import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    OtpService otpService;

    @Autowired
    EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println(">>> [DEBUG LOGIN] Attempt for: " + loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String roleOrig = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
            String roleRaw = roleOrig.toUpperCase();
            
            System.err.println(">>> [DEBUG ROLE] User: " + userDetails.getUsername() + " | Authorities: " + userDetails.getAuthorities());
            
            boolean containsAdmin = roleRaw.contains("ADMIN");
            boolean containsGiangVien = roleRaw.contains("GIANGVIEN");
            boolean containsLecturer = roleRaw.contains("LECTURER");
            boolean isStaff = containsAdmin || containsGiangVien || containsLecturer;
            
            System.err.println(">>> [DEBUG MASK] Admin: " + containsAdmin + " | GiangVien: " + containsGiangVien + " | Lecturer: " + containsLecturer);
            System.err.println(">>> [DEBUG MASK] FINAL isStaff: " + isStaff);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateJwtToken(authentication);

            return ResponseEntity.ok(ApiResponse.success(new JwtResponse(
                    jwt,
                    userDetails.getId().longValue(),
                    userDetails.getUsername(),
                    userDetails.getFullName(),
                    roleOrig
            )));
        } catch (Exception e) {
            System.err.println(">>> [DEBUG ERROR] " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Tài khoản hoặc mật khẩu không chính xác."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<?>> verifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");
        System.out.println(">>> [DEBUG VERIFY] For: " + username + " with OTP: " + otp);

        if (otpService.verifyOtp(username, otp)) {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String jwt = jwtTokenProvider.generateTokenForUsername(user.getUsername());
                return ResponseEntity.ok(ApiResponse.success(new JwtResponse(
                        jwt,
                        user.getId().longValue(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getRole().getRoleName()
                )));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(401, "Mã OTP không chính xác"));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<?>> googleLogin(@RequestBody GoogleLoginRequest request) {
        String email = request.getEmail();
        System.out.println(">>> [DEBUG GOOGLE] Email: " + email);
        
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Email không hợp lệ."));
        }

        Optional<User> userOpt = userRepository.findByUsername(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String jwt = jwtTokenProvider.generateTokenForUsername(user.getUsername());
            return ResponseEntity.ok(ApiResponse.success(new JwtResponse(jwt, user.getId().longValue(), user.getUsername(), user.getFullName(), user.getRole().getRoleName())));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Tài khoản chưa được đăng ký trong hệ thống."));
    }

    @GetMapping("/test-mail")
    public ResponseEntity<ApiResponse<?>> testMail(@RequestParam String to) {
        System.out.println(">>> [DEBUG TEST] Manual mail trigger to: " + to);
        try {
            emailService.sendOtp(to, "123456");
            return ResponseEntity.ok(ApiResponse.success("Test mail requested. Check console for result.", null));
        } catch (Exception e) {
            System.err.println(">>> [DEBUG TEST ERROR] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Test mail failed: " + e.getMessage()));
        }
    }
}
