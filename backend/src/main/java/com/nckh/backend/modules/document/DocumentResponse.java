package com.nckh.backend.modules.document;

import com.nckh.backend.modules.document.Document;
import java.util.Date;

public class DocumentResponse {
    private Long id;
    private String title;
    private String major;
    private Integer publishYear;
    private String fileUrl;
    private String coverUrl;
    private String type;
    private String level;
    private String uploaderName;
    private Long fileSize;
    private String fileType;
    private Date createdAt;

    public DocumentResponse(Document doc) {
        this.id = doc.getId();
        this.title = doc.getTitle();
        this.major = doc.getMajor();
        this.publishYear = doc.getPublishYear();
        this.fileUrl = doc.getFileUrl();
        this.coverUrl = doc.getCoverUrl();
        this.type = doc.getType();
        this.level = doc.getLevel();
        this.uploaderName = (doc.getUploader() != null) ? doc.getUploader().getFullName() : "Admin";
        this.fileSize = doc.getFileSize();
        this.fileType = doc.getFileType();
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
    public Long getFileSize() { return fileSize; }
    public String getFileType() { return fileType; }
    public Date getCreatedAt() { return createdAt; }
}
