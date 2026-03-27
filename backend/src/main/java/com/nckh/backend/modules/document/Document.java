package com.nckh.backend.modules.document;

import com.nckh.backend.modules.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "[Documents]")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "nvarchar(max)")
    private String title;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String major;
    
    @Column(name = "publish_year")
    private Integer publishYear;

    @Column(name = "file_url", columnDefinition = "nvarchar(max)")
    private String fileUrl;
    
    @Column(name = "cover_url", columnDefinition = "nvarchar(max)")
    private String coverUrl;

    @Column(name = "doc_type")
    private String type;

    @Column(name = "doc_level", columnDefinition = "nvarchar(50)")
    private String level;

    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type", columnDefinition = "nvarchar(50)")
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User uploader;

    @Column(name = "created_at")
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

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
