package com.nckh.backend.modules.research.paper;

import com.nckh.backend.modules.notification.NotificationService;
import com.nckh.backend.modules.research.topic.ResearchTopic;
import com.nckh.backend.modules.research.topic.ResearchTopicRepository;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ScientificPaperService {

    @Autowired
    private ScientificPaperRepository paperRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ResearchTopicRepository topicRepo;

    @Autowired
    private NotificationService notificationService;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<ScientificPaper> getAllPapers(String status, String journalType, String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return paperRepo.findByTitleContainingIgnoreCaseOrJournalNameContainingIgnoreCase(keyword, keyword);
        }
        
        if (status != null && !status.isEmpty() && journalType != null && !journalType.isEmpty()) {
            return paperRepo.findByStatusAndJournalType(status, journalType);
        } else if (status != null && !status.isEmpty()) {
            return paperRepo.findByStatus(status);
        } else if (journalType != null && !journalType.isEmpty()) {
            return paperRepo.findByJournalType(journalType);
        }
        return paperRepo.findAll();
    }

    public Optional<ScientificPaper> getPaperById(Long id) {
        return paperRepo.findById(id);
    }

    public ScientificPaper createPaper(ScientificPaperRequest req) {
        ScientificPaper paper = new ScientificPaper();
        paper.setTitle(req.getTitle());
        paper.setCoAuthors(req.getCoAuthors());
        paper.setJournalType(req.getJournalType());
        paper.setJournalName(req.getJournalName());
        paper.setStatus(req.getStatus() != null ? req.getStatus() : "PENDING");

        if (req.getLeadAuthorId() != null) {
            userRepo.findById(req.getLeadAuthorId()).ifPresent(paper::setLeadAuthor);
        }
        if (req.getTopicId() != null) {
            topicRepo.findById(req.getTopicId()).ifPresent(paper::setTopic);
        }

        try {
            if (req.getPublishedAt() != null)
                paper.setPublishedAt(sdf.parse(req.getPublishedAt()));
        } catch (Exception ignored) {}

        // Auto generate paper code if missing
        ScientificPaper saved = paperRepo.save(paper);
        if (saved.getPaperCode() == null || saved.getPaperCode().isEmpty()) {
            saved.setPaperCode("#BB-" + String.format("%03d", saved.getId()));
            return paperRepo.save(saved);
        }

        return saved;
    }

    private void checkOwnership(ScientificPaper paper, Integer currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) return;
        if (paper.getLeadAuthor() != null && paper.getLeadAuthor().getId().equals(currentUserId)) return;
        throw new RuntimeException("Access Denied: You do not own this paper");
    }

    @Transactional
    public ScientificPaper reviewPaper(Long id, Map<String, String> body, Integer currentUserId, String currentUserRole) {
        ScientificPaper paper = paperRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        checkOwnership(paper, currentUserId, currentUserRole);

        String oldStatus = paper.getStatus();
        if (body.containsKey("status")) paper.setStatus(body.get("status"));
        if (body.containsKey("reviewNote")) paper.setReviewNote(body.get("reviewNote"));

        ScientificPaper saved = paperRepo.save(paper);

        // Notify lead author if status changed
        if (body.containsKey("status") && !body.get("status").equals(oldStatus)) {
            String message = "Bài báo [" + paper.getTitle() + "] đã được cập nhật trạng thái: " + paper.getStatus();
            notificationService.createNotification(
                    paper.getLeadAuthor().getId(),
                    "Cập nhật trạng thái bài báo",
                    message,
                    "DOCUMENT",
                    "/giang-vien/quan-ly-bai-bao"
            );
        }

        return saved;
    }

    public void deletePaper(Long id, Integer currentUserId, String currentUserRole) {
        ScientificPaper paper = paperRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
        
        checkOwnership(paper, currentUserId, currentUserRole);
        
        paperRepo.deleteById(id);
    }

    public Map<String, Long> getStats() {
        return Map.of(
            "total", paperRepo.count(),
            "approved", paperRepo.countByStatus("APPROVED"),
            "pending", paperRepo.countByStatus("PENDING"),
            "revision", paperRepo.countByStatus("REVISION")
        );
    }
}
