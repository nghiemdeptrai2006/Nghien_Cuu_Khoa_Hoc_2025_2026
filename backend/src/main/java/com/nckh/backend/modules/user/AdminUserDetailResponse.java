package com.nckh.backend.modules.user;

public class AdminUserDetailResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String role;
    private boolean enabled;
    private String email;
    private long topicCount;
    private long paperCount;
    private long productCount;

    public AdminUserDetailResponse() {}

    public AdminUserDetailResponse(Integer id, String username, String fullName, String role, boolean enabled, 
                                 String email, long topicCount, long paperCount, long productCount) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
        this.email = email;
        this.topicCount = topicCount;
        this.paperCount = paperCount;
        this.productCount = productCount;
    }

    // Getters and Setters
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

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public long getTopicCount() { return topicCount; }
    public void setTopicCount(long topicCount) { this.topicCount = topicCount; }

    public long getPaperCount() { return paperCount; }
    public void setPaperCount(long paperCount) { this.paperCount = paperCount; }

    public long getProductCount() { return productCount; }
    public void setProductCount(long productCount) { this.productCount = productCount; }
}
