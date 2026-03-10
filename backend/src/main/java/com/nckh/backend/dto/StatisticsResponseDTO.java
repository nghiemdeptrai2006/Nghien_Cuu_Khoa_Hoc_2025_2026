package com.nckh.backend.dto;

public class StatisticsResponseDTO {
    private long documentCount;
    private long studentCount;
    private long teacherCount;

    public StatisticsResponseDTO() {
    }

    public StatisticsResponseDTO(long documentCount, long studentCount, long teacherCount) {
        this.documentCount = documentCount;
        this.studentCount = studentCount;
        this.teacherCount = teacherCount;
    }

    public long getDocumentCount() {
        return documentCount;
    }

    public void setDocumentCount(long documentCount) {
        this.documentCount = documentCount;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(long studentCount) {
        this.studentCount = studentCount;
    }

    public long getTeacherCount() {
        return teacherCount;
    }

    public void setTeacherCount(long teacherCount) {
        this.teacherCount = teacherCount;
    }
}
