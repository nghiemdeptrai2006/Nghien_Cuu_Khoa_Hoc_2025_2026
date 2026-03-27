package com.nckh.backend.modules.auth.dto;

public class GoogleLoginRequest {
    private String email;
    private String name;
    private String userType; // "student", "teacher", "admin"

    public GoogleLoginRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}
