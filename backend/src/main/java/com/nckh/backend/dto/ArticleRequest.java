package com.nckh.backend.dto;

public class ArticleRequest {
    private String title;
    private String journalName;
    private Integer publishYear;
    private String documentUrl;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJournalName() { return journalName; }
    public void setJournalName(String journalName) { this.journalName = journalName; }

    public Integer getPublishYear() { return publishYear; }
    public void setPublishYear(Integer publishYear) { this.publishYear = publishYear; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }
}
