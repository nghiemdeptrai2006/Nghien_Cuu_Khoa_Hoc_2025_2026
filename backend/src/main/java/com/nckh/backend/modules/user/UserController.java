package com.nckh.backend.modules.user;

import com.nckh.backend.modules.auth.dto.ChangePasswordRequest;
import com.nckh.backend.modules.user.UpdateProfileRequest;
import com.nckh.backend.modules.user.UserProfileResponse;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.nckh.backend.modules.research.topic.ResearchTopicRepository researchTopicRepository;

    @Autowired
    private com.nckh.backend.modules.research.paper.ScientificPaperRepository scientificPaperRepository;

    @Autowired
    private com.nckh.backend.modules.research.product.ResearchProductRepository researchProductRepository;

    @Autowired
    private UniversityRegistryRepository universityRegistryRepository;

    @GetMapping("/check-university/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UniversityRegistry>> checkUniversityRegistry(@PathVariable String id) {
        Optional<UniversityRegistry> user = universityRegistryRepository.findByIdIgnoreCase(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(user.get()));
        }
        return ResponseEntity.ok(ApiResponse.error(404, "User not found in University Registry."));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminUserDetailResponse>> getUserById(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        long topicCount = researchTopicRepository.countByLeader(user);
        long paperCount = scientificPaperRepository.countByLeadAuthor(user);
        long productCount = researchProductRepository.countByOwner(user);

        AdminUserDetailResponse response = new AdminUserDetailResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().getRoleName(),
                user.isEnabled(),
                user.getEmail() != null ? user.getEmail() : user.getUsername() + "@st.utc.edu.vn", 
                topicCount,
                paperCount,
                productCount
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        List<AdminUserResponse> users = userRepository.findAll().stream()
                .map(u -> new AdminUserResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getFullName(),
                        u.getRole().getRoleName(),
                        u.isEnabled(),
                        u.getLastSeen()
                )).toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        
        return ResponseEntity.ok(ApiResponse.success("User status updated to: " + (user.isEnabled() ? "Enabled" : "Disabled"), null));
    }

    @PostMapping("/admin/lecturer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLecturer(@RequestBody CreateLecturerRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        
        Role role = roleRepository.findByRoleName("ROLE_GIANGVIEN")
                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_GIANGVIEN not found."));
        user.setRole(role);
        user.setCreatedAt(new java.util.Date());
        user.setEnabled(true);

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Lecturer account created successfully", null));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Error: Username is already taken!"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        
        String pass = request.getPassword();
        if (pass == null || pass.trim().isEmpty()) pass = "123456";
        user.setPasswordHash(passwordEncoder.encode(pass));
        user.setFullName(request.getFullName());
        
        final String roleName;
        if ("teacher".equalsIgnoreCase(request.getRole())) {
            roleName = "ROLE_GIANGVIEN";
        } else if ("admin".equalsIgnoreCase(request.getRole())) {
            roleName = "ROLE_ADMIN";
        } else {
            roleName = "ROLE_SINHVIEN";
        }
        
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));
        user.setRole(role);
        user.setCreatedAt(new java.util.Date());
        user.setEnabled(true);

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User account created successfully", null));
    }

    @PutMapping("/admin/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        user.setPasswordHash(passwordEncoder.encode("123456")); // Default password
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password reset to default (123456) successfully", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        return ResponseEntity.ok(ApiResponse.success(new UserProfileResponse(
                user.getId().longValue(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail() != null ? user.getEmail() : user.getUsername() + "@st.utc.edu.vn", 
                user.getRole().getRoleName()
        )));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", null));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Error: Incorrect current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
