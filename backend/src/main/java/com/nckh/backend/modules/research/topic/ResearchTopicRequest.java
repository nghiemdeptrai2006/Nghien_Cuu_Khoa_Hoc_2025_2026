package com.nckh.backend.modules.research.topic;

import java.math.BigDecimal;

public class ResearchTopicRequest {
    private String topicCode;
    private String title;
    private Integer leaderId;
    private String fieldArea;
    private String level;
    private BigDecimal budget;
    private String startDate;
    private String endDate;
    private String status;
    private Integer progress;

    public ResearchTopicRequest() {}

    public String getTopicCode() { return topicCode; }
    public void setTopicCode(String topicCode) { this.topicCode = topicCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getLeaderId() { return leaderId; }
    public void setLeaderId(Integer leaderId) { this.leaderId = leaderId; }

    public String getFieldArea() { return fieldArea; }
    public void setFieldArea(String fieldArea) { this.fieldArea = fieldArea; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
}
