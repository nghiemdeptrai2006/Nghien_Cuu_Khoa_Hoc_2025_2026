package com.nckh.backend.controller;

import com.nckh.backend.dto.JwtResponse;
import com.nckh.backend.dto.LoginRequest;
import com.nckh.backend.security.JwtTokenProvider;
import com.nckh.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // Spring Security sẽ tự động gọi UserDetailsServiceImpl và so sánh mật khẩu BCrypt
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Tạo JWT Token
        String jwt = jwtTokenProvider.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Trả về JSON cho Client
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId().longValue(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                role
        ));
    }
}
