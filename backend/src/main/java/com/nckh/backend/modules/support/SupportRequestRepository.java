package com.nckh.backend.modules.support;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Integer> {
    List<SupportRequest> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<SupportRequest> findAllByOrderByCreatedAtDesc();
}
