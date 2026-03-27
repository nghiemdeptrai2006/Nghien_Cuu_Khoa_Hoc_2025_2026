package com.nckh.backend.modules.user;

public class SearchDTO {
    private String type; // USER, TOPIC, PAPER
    private String id;
    private String title;
    private String subtitle;
    private String url;

    public SearchDTO() {}

    public SearchDTO(String type, String id, String title, String subtitle, String url) {
        this.type = type;
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.url = url;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
