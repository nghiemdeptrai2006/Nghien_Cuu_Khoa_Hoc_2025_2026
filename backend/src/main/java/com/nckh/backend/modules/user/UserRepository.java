package com.nckh.backend.modules.user;

import com.nckh.backend.modules.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    java.util.List<User> findByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(String fullName, String username);
    
    long countByRole_RoleName(String roleName);
    
    java.util.List<User> findTop5ByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u.department FROM User u WHERE u.department IS NOT NULL")
    java.util.List<String> findUniqueDepartments();
}

