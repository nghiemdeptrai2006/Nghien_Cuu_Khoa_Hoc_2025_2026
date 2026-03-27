package com.nckh.backend.modules.research.stats;

import java.util.List;
import java.util.Map;

public class StatisticsResponseDTO {
    private long documentCount;
    private long studentCount;
    private long teacherCount;
    private long totalUserCount;
    
    private long topicCount;
    private long paperCount;
    private long productCount;
    private long delayedTopicCount;
    
    private Map<String, Long> topicsByStatus;
    private Map<String, Long> papersByStatus;
    private Map<String, Long> productsByStatus;
    private Map<String, Long> fieldAreaStats;
    private Map<String, Long> topicsByFaculty;
    private Map<String, Long> productComposition;
    private List<String> faculties;
    private double topicTrend;
    private double productTrend;
    private List<ActivityDTO> recentActivities;

    public StatisticsResponseDTO() {
    }

    public StatisticsResponseDTO(long documentCount, long studentCount, long teacherCount) {
        this.documentCount = documentCount;
        this.studentCount = studentCount;
        this.teacherCount = teacherCount;
        this.totalUserCount = studentCount + teacherCount;
    }

    public long getDocumentCount() { return documentCount; }
    public void setDocumentCount(long documentCount) { this.documentCount = documentCount; }

    public long getStudentCount() { return studentCount; }
    public void setStudentCount(long studentCount) { this.studentCount = studentCount; }

    public long getTeacherCount() { return teacherCount; }
    public void setTeacherCount(long teacherCount) { this.teacherCount = teacherCount; }

    public long getTotalUserCount() { return totalUserCount; }
    public void setTotalUserCount(long totalUserCount) { this.totalUserCount = totalUserCount; }

    public long getTopicCount() { return topicCount; }
    public void setTopicCount(long topicCount) { this.topicCount = topicCount; }

    public long getPaperCount() { return paperCount; }
    public void setPaperCount(long paperCount) { this.paperCount = paperCount; }

    public long getProductCount() { return productCount; }
    public void setProductCount(long productCount) { this.productCount = productCount; }

    public long getDelayedTopicCount() { return delayedTopicCount; }
    public void setDelayedTopicCount(long delayedTopicCount) { this.delayedTopicCount = delayedTopicCount; }

    public Map<String, Long> getTopicsByStatus() { return topicsByStatus; }
    public void setTopicsByStatus(Map<String, Long> topicsByStatus) { this.topicsByStatus = topicsByStatus; }

    public Map<String, Long> getPapersByStatus() { return papersByStatus; }
    public void setPapersByStatus(Map<String, Long> papersByStatus) { this.papersByStatus = papersByStatus; }

    public Map<String, Long> getProductsByStatus() { return productsByStatus; }
    public void setProductsByStatus(Map<String, Long> productsByStatus) { this.productsByStatus = productsByStatus; }

    public Map<String, Long> getFieldAreaStats() { return fieldAreaStats; }
    public void setFieldAreaStats(Map<String, Long> fieldAreaStats) { this.fieldAreaStats = fieldAreaStats; }

    public List<ActivityDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }

    public Map<String, Long> getTopicsByFaculty() { return topicsByFaculty; }
    public void setTopicsByFaculty(Map<String, Long> topicsByFaculty) { this.topicsByFaculty = topicsByFaculty; }

    public Map<String, Long> getProductComposition() { return productComposition; }
    public void setProductComposition(Map<String, Long> productComposition) { this.productComposition = productComposition; }

    public List<String> getFaculties() { return faculties; }
    public void setFaculties(List<String> faculties) { this.faculties = faculties; }

    public double getTopicTrend() { return topicTrend; }
    public void setTopicTrend(double topicTrend) { this.topicTrend = topicTrend; }

    public double getProductTrend() { return productTrend; }
    public void setProductTrend(double productTrend) { this.productTrend = productTrend; }
}

