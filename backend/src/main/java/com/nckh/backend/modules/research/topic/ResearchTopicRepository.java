package com.nckh.backend.modules.research.topic;

import com.nckh.backend.modules.research.topic.ResearchTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchTopicRepository extends JpaRepository<ResearchTopic, Long> {
    long countByStatusNotAndEndDateBefore(String status, java.util.Date date);
    
    List<ResearchTopic> findByTitleContainingIgnoreCase(String title);
    
    List<ResearchTopic> findTop5ByOrderByCreatedAtDesc();

    long countByLeader(com.nckh.backend.modules.user.User leader);

    List<ResearchTopic> findByStatus(String status);
    long countByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT u.department, COUNT(t) FROM ResearchTopic t JOIN t.leader u WHERE YEAR(t.startDate) = :year GROUP BY u.department")
    List<Object[]> countByDepartmentAndYear(int year);

    @org.springframework.data.jpa.repository.Query("SELECT u.department, COUNT(t) FROM ResearchTopic t JOIN t.leader u GROUP BY u.department")
    List<Object[]> countByDepartment();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM ResearchTopic t WHERE YEAR(t.createdAt) = :year")
    long countByYear(int year);
}

