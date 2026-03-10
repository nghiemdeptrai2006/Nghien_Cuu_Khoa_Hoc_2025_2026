package com.nckh.backend.controller;

import com.nckh.backend.dto.StatisticsResponseDTO;
import com.nckh.backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/stats")
    public ResponseEntity<StatisticsResponseDTO> getStatistics() {
        StatisticsResponseDTO stats = statisticsService.getStatistics();
        return ResponseEntity.ok(stats);
    }
}
