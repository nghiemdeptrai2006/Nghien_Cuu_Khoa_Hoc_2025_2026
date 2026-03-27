package com.nckh.backend.modules.support;

import com.nckh.backend.modules.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "[SupportRequests]")
public class SupportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "subject", columnDefinition = "nvarchar(255)")
    private String subject;

    @Column(name = "details", columnDefinition = "nvarchar(MAX)")
    private String details;

    @Column(name = "status", length = 50)
    private String status = "PENDING";

    @Column(name = "created_at")
    private Date createdAt = new Date();

    public SupportRequest() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
