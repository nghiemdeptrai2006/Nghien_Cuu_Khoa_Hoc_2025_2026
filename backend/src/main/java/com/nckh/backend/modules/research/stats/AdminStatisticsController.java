package com.nckh.backend.modules.research.stats;

import com.nckh.backend.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StatisticsResponseDTO>> getAdminStatistics() {
        StatisticsResponseDTO stats = statisticsService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StatisticsResponseDTO>> getReportStatistics(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String department) {
        StatisticsResponseDTO stats = statisticsService.getReportStatistics(year, department);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}


