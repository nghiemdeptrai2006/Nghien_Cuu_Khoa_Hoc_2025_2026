package com.nckh.backend.service;

import com.nckh.backend.dto.StatisticsResponseDTO;
import com.nckh.backend.repository.DocumentRepository;
import com.nckh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    public StatisticsResponseDTO getStatistics() {
        long documentCount = documentRepository.count();
        long studentCount = userRepository.countByRole_RoleName("STUDENT");
        long teacherCount = userRepository.countByRole_RoleName("TEACHER");

        return new StatisticsResponseDTO(documentCount, studentCount, teacherCount);
    }
}
