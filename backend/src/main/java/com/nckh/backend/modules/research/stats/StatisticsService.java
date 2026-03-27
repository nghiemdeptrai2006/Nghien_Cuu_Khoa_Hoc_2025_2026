package com.nckh.backend.modules.research.stats;

import com.nckh.backend.modules.document.DocumentRepository;
import com.nckh.backend.modules.user.UserRepository;
import com.nckh.backend.modules.research.topic.ResearchTopicRepository;
import com.nckh.backend.modules.research.paper.ScientificPaperRepository;
import com.nckh.backend.modules.research.product.ResearchProductRepository;
import com.nckh.backend.modules.research.topic.ResearchTopic;
import com.nckh.backend.modules.research.paper.ScientificPaper;
import com.nckh.backend.modules.research.product.ResearchProduct;
import com.nckh.backend.modules.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResearchTopicRepository topicRepository;

    @Autowired
    private ScientificPaperRepository paperRepository;

    @Autowired
    private ResearchProductRepository productRepository;

    public StatisticsResponseDTO getStatistics() {
        return getReportStatistics(Calendar.getInstance().get(Calendar.YEAR), null);
    }

    public StatisticsResponseDTO getReportStatistics(Integer year, String department) {
        if (year == null) year = Calendar.getInstance().get(Calendar.YEAR);
        
        StatisticsResponseDTO dto = new StatisticsResponseDTO();
        dto.setDocumentCount(documentRepository.count());
        dto.setStudentCount(userRepository.countByRole_RoleName("ROLE_SINHVIEN"));
        dto.setTeacherCount(userRepository.countByRole_RoleName("ROLE_GIANGVIEN"));
        dto.setTotalUserCount(dto.getStudentCount() + dto.getTeacherCount());
        dto.setFaculties(userRepository.findUniqueDepartments());

        // Basic Counts for the specific year
        dto.setTopicCount(topicRepository.countByYear(year));
        dto.setPaperCount(paperRepository.countByYear(year));
        dto.setProductCount(productRepository.countByYear(year));
        dto.setDelayedTopicCount(topicRepository.countByStatusNotAndEndDateBefore("COMPLETED", new Date()));

        // Calculate Trends (Current Year vs Previous Year)
        long topicsPrevYear = topicRepository.countByYear(year - 1);
        if (topicsPrevYear > 0) {
            dto.setTopicTrend(((double)(dto.getTopicCount() - topicsPrevYear) / topicsPrevYear) * 100);
        } else if (dto.getTopicCount() > 0) {
            dto.setTopicTrend(100.0);
        }

        long prodPrevYear = paperRepository.countByYear(year - 1) + productRepository.countByYear(year - 1);
        long prodCurrYear = dto.getPaperCount() + dto.getProductCount();
        if (prodPrevYear > 0) {
            dto.setProductTrend(((double)(prodCurrYear - prodPrevYear) / prodPrevYear) * 100);
        } else if (prodCurrYear > 0) {
            dto.setProductTrend(100.0);
        }

        // Charts: Topics by Faculty
        Map<String, Long> topicsByFaculty = new HashMap<>();
        topicRepository.countByDepartmentAndYear(year).forEach(res -> 
            topicsByFaculty.put((String)res[0], (Long)res[1])
        );
        dto.setTopicsByFaculty(topicsByFaculty);

        // Charts: Product Composition
        Map<String, Long> prodComposition = new HashMap<>();
        prodComposition.put("Bài báo", dto.getPaperCount());
        prodComposition.put("Sản phẩm", dto.getProductCount());
        dto.setProductComposition(prodComposition);

        // Recent Activities logic (kept similar but filtered if needed)
        List<ActivityDTO> activities = new ArrayList<>();
        topicRepository.findTop5ByOrderByCreatedAtDesc().forEach(t -> 
            activities.add(new ActivityDTO("TOPIC", "CREATED", 
                "Đề tài mới: <strong>" + t.getTitle() + "</strong>", 
                t.getCreatedAt(), "blue"))
        );
        paperRepository.findTop5ByOrderByCreatedAtDesc().forEach(p -> 
            activities.add(new ActivityDTO("PAPER", "CREATED", 
                "Bài báo mới: <strong>" + p.getTitle() + "</strong>", 
                p.getCreatedAt(), "green"))
        );
        userRepository.findTop5ByOrderByCreatedAtDesc().forEach(u -> 
            activities.add(new ActivityDTO("USER", "CREATED", 
                "Thành viên mới: <strong>" + u.getFullName() + "</strong>", 
                u.getCreatedAt(), "orange"))
        );
        activities.sort((a, b) -> {
            Date d1 = a.getTimestamp();
            Date d2 = b.getTimestamp();
            if (d1 == null && d2 == null) return 0;
            if (d1 == null) return 1;
            if (d2 == null) return -1;
            return d2.compareTo(d1); // Descending order
        });
        dto.setRecentActivities(activities.stream().limit(10).collect(Collectors.toList()));

        return dto;
    }
}

