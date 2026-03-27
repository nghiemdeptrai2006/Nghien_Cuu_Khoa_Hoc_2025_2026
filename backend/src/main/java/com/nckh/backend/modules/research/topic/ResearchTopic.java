package com.nckh.backend.modules.research.topic;

import com.nckh.backend.modules.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "[Topics]")
public class ResearchTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient // DB không có cột này
    private String topicCode;

    @Column(name = "title", columnDefinition = "nvarchar(500)", nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id") // Sửa lại đúng với schema.sql (author_id)
    private User leader;

    @Transient
    private String fieldArea;

    @Transient
    private String level; // Khoa / Truong / Bo

    @Transient
    private BigDecimal budget;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_at", insertable = false, updatable = false) // Map tạm thời để tránh lỗi nếu không có start_date
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_at", insertable = false, updatable = false)
    private Date endDate;

    @Transient
    private Date submittedAt;

    @Column(name = "status", length = 30, nullable = false)
    private String status = "PENDING";
    // PENDING, ACTIVE, DELAYED, COMPLETED, CANCELLED

    @Transient
    private Integer progress = 0; // 0-100

    @Column(name = "created_at")
    private Date createdAt = new Date();

    @Transient
    private Date updatedAt = new Date();

    public ResearchTopic() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTopicCode() { return topicCode; }
    public void setTopicCode(String topicCode) { this.topicCode = topicCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }

    public String getFieldArea() { return fieldArea; }
    public void setFieldArea(String fieldArea) { this.fieldArea = fieldArea; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public Date getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Date submittedAt) { this.submittedAt = submittedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
