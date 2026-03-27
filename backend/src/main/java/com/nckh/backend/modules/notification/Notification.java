package com.nckh.backend.modules.notification;

import com.nckh.backend.modules.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", columnDefinition = "nvarchar(255)", nullable = false)
    private String title;

    @Column(name = "message", columnDefinition = "nvarchar(MAX)", nullable = false)
    private String message;

    @Column(name = "type", length = 50)
    private String type = "GENERAL";

    @Column(name = "is_read")
    private boolean read = false;

    @Column(name = "link", length = 500)
    private String link;

    @Column(name = "created_at")
    private Date createdAt = new Date();

    public Notification() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
