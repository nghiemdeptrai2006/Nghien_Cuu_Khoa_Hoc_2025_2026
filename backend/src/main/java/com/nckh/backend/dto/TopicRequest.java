package com.nckh.backend.dto;

public class TopicRequest {
    private String title;
    private String description;
    // Status can default to DRAFT, but we allow user to specify
    private String status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
