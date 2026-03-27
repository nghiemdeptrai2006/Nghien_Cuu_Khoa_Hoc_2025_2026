package com.nckh.backend.modules.support;

public class SupportRequestInput {
    private String subject;
    private String details;

    public SupportRequestInput() {}

    public SupportRequestInput(String subject, String details) {
        this.subject = subject;
        this.details = details;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
