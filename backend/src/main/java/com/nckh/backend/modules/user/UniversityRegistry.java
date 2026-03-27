package com.nckh.backend.modules.user;

import jakarta.persistence.*;

@Entity
@Table(name = "UniversityRegistry")
public class UniversityRegistry {

    @Id
    @Column(length = 50)
    private String id; // Staff/Student ID (e.g. GV001)

    @Column(nullable = false, columnDefinition = "nvarchar(100)")
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 30)
    private String role; // teacher, student

    @Column(columnDefinition = "nvarchar(200)")
    private String department;

    public UniversityRegistry() {}

    public UniversityRegistry(String id, String fullName, String email, String role, String department) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.department = department;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
