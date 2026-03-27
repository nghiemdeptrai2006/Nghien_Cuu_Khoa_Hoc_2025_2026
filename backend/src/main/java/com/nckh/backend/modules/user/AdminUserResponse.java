package com.nckh.backend.modules.user;

import java.util.Date;

public class AdminUserResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String role;
    private boolean enabled;
    private Date lastSeen;

    public AdminUserResponse() {}

    public AdminUserResponse(Integer id, String username, String fullName, String role, boolean enabled, Date lastSeen) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
        this.lastSeen = lastSeen;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Date getLastSeen() { return lastSeen; }
    public void setLastSeen(Date lastSeen) { this.lastSeen = lastSeen; }
}
