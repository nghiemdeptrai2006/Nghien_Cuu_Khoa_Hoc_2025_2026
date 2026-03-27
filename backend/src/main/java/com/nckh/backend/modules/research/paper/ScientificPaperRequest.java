package com.nckh.backend.modules.research.paper;

public class ScientificPaperRequest {
    private String title;
    private Integer leadAuthorId;
    private String coAuthors;
    private String journalType;
    private String journalName;
    private String publishedAt;
    private Long topicId;
    private String status;
    private String reviewNote;

    public ScientificPaperRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getLeadAuthorId() { return leadAuthorId; }
    public void setLeadAuthorId(Integer leadAuthorId) { this.leadAuthorId = leadAuthorId; }

    public String getCoAuthors() { return coAuthors; }
    public void setCoAuthors(String coAuthors) { this.coAuthors = coAuthors; }

    public String getJournalType() { return journalType; }
    public void setJournalType(String journalType) { this.journalType = journalType; }

    public String getJournalName() { return journalName; }
    public void setJournalName(String journalName) { this.journalName = journalName; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReviewNote() { return reviewNote; }
    public void setReviewNote(String reviewNote) { this.reviewNote = reviewNote; }
}
