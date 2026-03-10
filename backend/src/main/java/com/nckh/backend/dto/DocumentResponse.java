package com.nckh.backend.dto;

import com.nckh.backend.model.Document;
import java.util.Date;

public class DocumentResponse {
    private Long id;
    private String title;
    private String major;
    private Integer publishYear;
    private String fileUrl;
    private String coverUrl;
    private String type;
    private String uploaderName;
    private Date createdAt;

    public DocumentResponse(Document doc) {
        this.id = doc.getId();
        this.title = doc.getTitle();
        this.major = doc.getMajor();
        this.publishYear = doc.getPublishYear();
        this.fileUrl = doc.getFileUrl();
        this.coverUrl = doc.getCoverUrl();
        this.type = doc.getType();
        this.uploaderName = (doc.getUploader() != null) ? doc.getUploader().getFullName() : "Admin";
        this.createdAt = doc.getCreatedAt();
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMajor() { return major; }
    public Integer getPublishYear() { return publishYear; }
    public String getFileUrl() { return fileUrl; }
    public String getCoverUrl() { return coverUrl; }
    public String getType() { return type; }
    public String getUploaderName() { return uploaderName; }
    public Date getCreatedAt() { return createdAt; }
}
