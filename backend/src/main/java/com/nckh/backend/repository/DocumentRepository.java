package com.nckh.backend.repository;

import com.nckh.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByType(String type); // Tìm Giao trinh hoac Tai lieu
    List<Document> findByMajor(String major); // Lọc theo Ngành
    List<Document> findByPublishYear(Integer year); // Lọc theo năm
    List<Document> findByTypeAndMajorAndPublishYear(String type, String major, Integer publishYear);
}
