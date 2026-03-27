package com.nckh.backend.modules.document;

import com.nckh.backend.modules.document.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByType(String type); // Tìm Giao trinh hoac Tai lieu
    List<Document> findByMajor(String major); // Lọc theo Ngành
    List<Document> findByLevel(String level); // Lọc theo Cấp độ
    List<Document> findByPublishYear(Integer year); // Lọc theo năm
    List<Document> findByTypeAndMajorAndLevelAndPublishYear(String type, String major, String level, Integer publishYear);
    List<Document> findByTypeAndMajorAndPublishYear(String type, String major, Integer publishYear);
    List<Document> findByTitleContainingIgnoreCase(String title);
}
