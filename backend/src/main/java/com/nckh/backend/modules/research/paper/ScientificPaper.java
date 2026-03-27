package com.nckh.backend.modules.research.paper;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.research.topic.ResearchTopic;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "[ScientificPapers]")
public class ScientificPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paper_code", length = 30, unique = true)
    private String paperCode;

    @Column(name = "title", columnDefinition = "nvarchar(1000)", nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lead_author_id")
    private User leadAuthor;

    @Column(name = "co_authors", columnDefinition = "nvarchar(500)")
    private String coAuthors;

    @Column(name = "journal_type", length = 50, nullable = false)
    private String journalType;
    // ISI_SCOPUS, INTERNATIONAL, DOMESTIC, CONFERENCE

    @Column(name = "journal_name", columnDefinition = "nvarchar(300)")
    private String journalName;

    @Temporal(TemporalType.DATE)
    @Column(name = "published_at")
    private Date publishedAt;

    @Column(name = "attachment_path", columnDefinition = "nvarchar(500)")
    private String attachmentPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private ResearchTopic topic;

    @Column(name = "status", length = 30)
    private String status = "PENDING";
    // PENDING, APPROVED, REVISION, REJECTED

    @Column(name = "review_note", columnDefinition = "nvarchar(1000)")
    private String reviewNote;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @Column(name = "created_at")
    private Date createdAt = new Date();

    public ScientificPaper() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaperCode() { return paperCode; }
    public void setPaperCode(String paperCode) { this.paperCode = paperCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public User getLeadAuthor() { return leadAuthor; }
    public void setLeadAuthor(User leadAuthor) { this.leadAuthor = leadAuthor; }

    public String getCoAuthors() { return coAuthors; }
    public void setCoAuthors(String coAuthors) { this.coAuthors = coAuthors; }

    public String getJournalType() { return journalType; }
    public void setJournalType(String journalType) { this.journalType = journalType; }

    public String getJournalName() { return journalName; }
    public void setJournalName(String journalName) { this.journalName = journalName; }

    public Date getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Date publishedAt) { this.publishedAt = publishedAt; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }

    public ResearchTopic getTopic() { return topic; }
    public void setTopic(ResearchTopic topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReviewNote() { return reviewNote; }
    public void setReviewNote(String reviewNote) { this.reviewNote = reviewNote; }

    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
