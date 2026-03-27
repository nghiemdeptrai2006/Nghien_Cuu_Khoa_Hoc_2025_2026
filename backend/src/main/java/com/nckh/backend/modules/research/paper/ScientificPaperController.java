package com.nckh.backend.modules.research.paper;

import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/papers")
public class ScientificPaperController {

    @Autowired
    private ScientificPaperService paperService;

    @GetMapping
    public ResponseEntity<?> getAllPapers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String journalType,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success(paperService.getAllPapers(status, journalType, keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaperById(@PathVariable Long id) {
        return paperService.getPaperById(id)
                .map(p -> ResponseEntity.ok((Object)ApiResponse.success(p)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error(404, "Paper not found")));
    }

    @PostMapping
    public ResponseEntity<?> createPaper(@RequestBody ScientificPaperRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Bài báo đã được tạo thành công", paperService.createPaper(req)));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewPaper(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return ResponseEntity.ok(ApiResponse.success("Đánh giá bài báo thành công", paperService.reviewPaper(id, body, userDetails.getId(), role)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaper(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            paperService.deletePaper(id, userDetails.getId(), role);
            return ResponseEntity.ok(ApiResponse.success("Đã xóa bài báo thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(ApiResponse.success(paperService.getStats()));
    }
}
