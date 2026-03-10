package com.nckh.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "nvarchar(max)")
    private String title;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String major;
    
    private Integer publishYear;

    @Column(columnDefinition = "nvarchar(max)")
    private String fileUrl;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String coverUrl;

    @Column(name = "doc_type")
    private String type;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User uploader;

    private Date createdAt = new Date();

    public Document() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public Integer getPublishYear() { return publishYear; }
    public void setPublishYear(Integer publishYear) { this.publishYear = publishYear; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
