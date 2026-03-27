package com.nckh.backend.modules.research.product;

import com.nckh.backend.modules.research.product.ResearchProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchProductRepository extends JpaRepository<ResearchProduct, Long> {
    List<ResearchProduct> findTop5ByOrderByCreatedAtDesc();

    long countByOwner(com.nckh.backend.modules.user.User owner);

    List<ResearchProduct> findByProductType(String productType);

    // Search by product name or owner name
    List<ResearchProduct> findByProductNameContainingIgnoreCaseOrOwnerNameContainingIgnoreCase(String name, String owner);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM ResearchProduct p WHERE YEAR(p.issuedAt) = :year")
    long countByYear(int year);

    @org.springframework.data.jpa.repository.Query("SELECT u.department, COUNT(p) FROM ResearchProduct p JOIN p.owner u WHERE YEAR(p.issuedAt) = :year GROUP BY u.department")
    List<Object[]> countByDepartmentAndYear(int year);
}
