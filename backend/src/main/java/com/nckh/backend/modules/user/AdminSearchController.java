package com.nckh.backend.modules.user;
 
import com.nckh.backend.common.dto.ApiResponse;
import com.nckh.backend.modules.document.DocumentRepository;
import com.nckh.backend.modules.research.paper.ScientificPaperRepository;
import com.nckh.backend.modules.research.product.ResearchProductRepository;
import com.nckh.backend.modules.research.topic.ResearchTopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.ArrayList;
import java.util.List;
 
@RestController
@RequestMapping("/api/admin/search")
public class AdminSearchController {
 
    @Autowired
    private UserRepository userRepository;
 
    @Autowired
    private ResearchTopicRepository topicRepository;
 
    @Autowired
    private ScientificPaperRepository scientificPaperRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ResearchProductRepository researchProductRepository;
 
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SearchDTO>>> search(
            @RequestParam String query,
            @RequestParam(required = false) String scope) {
        
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.ok(ApiResponse.success(new ArrayList<>()));
        }
 
        String q = query.trim();
        List<SearchDTO> results = new ArrayList<>();
        
        boolean isGlobal = (scope == null || scope.isEmpty() || "GLOBAL".equalsIgnoreCase(scope));
 
        // 1. Search Users
        if (isGlobal || "USER".equalsIgnoreCase(scope)) {
            userRepository.findByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(q, q)
                    .stream().limit(5).forEach(u -> results.add(new SearchDTO(
                            "USER",
                            u.getId().toString(),
                            u.getFullName(),
                            "Người dùng: " + (u.getUsername() != null ? u.getUsername() : ""),
                            "quanlynguoidung.html#id=" + u.getId()
                    )));
        }
 
        // 2. Search Topics
        if (isGlobal || "TOPIC".equalsIgnoreCase(scope)) {
            topicRepository.findByTitleContainingIgnoreCase(q)
                    .stream().limit(5).forEach(t -> results.add(new SearchDTO(
                            "TOPIC",
                            t.getId().toString(),
                            t.getTitle(),
                            "Đề tài - Trạng thái: " + (t.getStatus() != null ? t.getStatus() : ""),
                            "quanlydetai.html#id=" + t.getId()
                    )));
        }
 
        // 3. Search Papers
        if (isGlobal || "PAPER".equalsIgnoreCase(scope)) {
            scientificPaperRepository.findByTitleContainingIgnoreCase(q).stream().limit(5).forEach(paper -> {
                results.add(new SearchDTO(
                    "PAPER",
                    paper.getId().toString(),
                    paper.getTitle(),
                    "Bài báo khoa học",
                    "quanlybaibao.html#id=" + paper.getId()
                ));
            });
        }
 
        // 4. Search Documents (Tai lieu, Giao trinh, Luan van)
        if (isGlobal || "DOCUMENT".equalsIgnoreCase(scope) || "TAI_LIEU".equalsIgnoreCase(scope) || 
            "GIAO_TRINH".equalsIgnoreCase(scope) || "LUAN_VAN".equalsIgnoreCase(scope)) {
            
            documentRepository.findByTitleContainingIgnoreCase(q).stream().limit(5).forEach(doc -> {
                String type = doc.getType() != null ? doc.getType().toUpperCase() : "TAI_LIEU";
                
                // Filter by specific sub-scope if requested
                if (!isGlobal && !"DOCUMENT".equalsIgnoreCase(scope)) {
                    if (!scope.equalsIgnoreCase(type)) {
                        return;
                    }
                }
 
                String category = "Học liệu";
                String url = "quanlytailieu.html#id=" + doc.getId();
 
                if ("GIAO_TRINH".equals(type)) {
                    category = "Giáo trình";
                    url = "quanlygiaotrinh.html#id=" + doc.getId();
                } else if ("LUAN_VAN".equals(type)) {
                    category = "Luận văn";
                    url = "quanlyluanvan.html#id=" + doc.getId();
                }
 
                results.add(new SearchDTO(
                    type, 
                    doc.getId().toString(),
                    doc.getTitle(),
                    category,
                    url
                ));
            });
        }
 
        // 5. Search Research Products
        if (isGlobal || "PRODUCT".equalsIgnoreCase(scope)) {
            researchProductRepository.findByProductNameContainingIgnoreCaseOrOwnerNameContainingIgnoreCase(q, q).stream().limit(5).forEach(product -> {
                results.add(new SearchDTO(
                    "PRODUCT",
                    product.getId().toString(),
                    product.getProductName(),
                    "Sản phẩm NCKH",
                    "quanlysanpham.html#id=" + product.getId()
                ));
            });
        }
 
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
