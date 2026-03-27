package com.nckh.backend.modules.research.paper;

import com.nckh.backend.modules.research.paper.ScientificPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScientificPaperRepository extends JpaRepository<ScientificPaper, Long> {
    List<ScientificPaper> findTop5ByOrderByCreatedAtDesc();

    long countByLeadAuthor(com.nckh.backend.modules.user.User author);
    
    List<ScientificPaper> findByTitleContainingIgnoreCase(String title);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM ScientificPaper p WHERE YEAR(p.publishedAt) = :year")
    long countByYear(int year);

    @org.springframework.data.jpa.repository.Query("SELECT u.department, COUNT(p) FROM ScientificPaper p JOIN p.leadAuthor u WHERE YEAR(p.publishedAt) = :year GROUP BY u.department")
    List<Object[]> countByDepartmentAndYear(int year);
    List<ScientificPaper> findByStatus(String status);
    long countByStatus(String status);
    List<ScientificPaper> findByJournalType(String journalType);
    
    // Search by title, journal name, or author name
    List<ScientificPaper> findByTitleContainingIgnoreCaseOrJournalNameContainingIgnoreCase(String title, String journal);
    
    // Multi-filter
    List<ScientificPaper> findByStatusAndJournalType(String status, String journalType);
}

