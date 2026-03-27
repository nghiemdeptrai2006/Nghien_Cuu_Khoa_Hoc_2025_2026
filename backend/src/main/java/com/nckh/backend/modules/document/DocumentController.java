package com.nckh.backend.modules.document;

import com.nckh.backend.modules.document.DocumentResponse;
import com.nckh.backend.modules.document.Document;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.document.DocumentRepository;
import com.nckh.backend.modules.user.UserRepository;
import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import com.nckh.backend.modules.document.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    // 1. GET danh sách (Có lọc)
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocuments(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Integer publishYear,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, name = "uploaderId") Long paramUploaderId) {
        
        List<Document> docs;

        if (keyword != null && !keyword.isEmpty()) {
            docs = documentRepository.findByTitleContainingIgnoreCase(keyword);
        } else if (type != null && major != null && level != null && publishYear != null) {
            docs = documentRepository.findByTypeAndMajorAndLevelAndPublishYear(type, major, level, publishYear);
        } else if (type != null && major != null && publishYear != null) {
            docs = documentRepository.findByTypeAndMajorAndPublishYear(type, major, publishYear);
        } else if (major != null) {
            docs = documentRepository.findByMajor(major);
        } else if (publishYear != null) {
            docs = documentRepository.findByPublishYear(publishYear);
        } else if (level != null) {
            docs = documentRepository.findByLevel(level);
        } else if (type != null) {
            docs = documentRepository.findByType(type);
        } else {
            docs = documentRepository.findAll();
        }

        // Apply additional filtering by uploaderId if present
        if (paramUploaderId != null) {
            docs = docs.stream()
                    .filter(d -> d.getUploader() != null && d.getUploader().getId().equals(paramUploaderId))
                    .collect(Collectors.toList());
        }

        List<DocumentResponse> responseList = docs.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseList));
    }

    // 1.1. GET Chi tiết bằng ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(doc -> ResponseEntity.ok(ApiResponse.success(new DocumentResponse(doc))))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error(404, "Không tìm thấy học liệu")));
    }

    // 2. POST (Upload mới - Roles: ADMIN, GIẢNG VIÊN, SINH VIÊN)
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<?>> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("major") String major,
            @RequestParam(value = "level", required = false) String level,
            @RequestParam("publishYear") Integer publishYear,
            @RequestParam("type") String type, // "GIAO_TRINH" hoặc "TAI_LIEU"
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "cover", required = false) MultipartFile cover) {

        try {
            // Xác thực ai đang upload
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User uploader = userRepository.findById(userDetails.getId()).orElse(null);

            // Lưu file vật lý xuống máy chủ
            String savedFileName = fileService.storeFile(file);
            String savedCoverName = (cover != null && !cover.isEmpty()) ? fileService.storeFile(cover) : null;

            // Ánh xạ Data vào Database Entity
            Document doc = new Document();
            doc.setTitle(title);
            doc.setMajor(major);
            doc.setLevel(level);
            doc.setPublishYear(publishYear);
            doc.setType(type);
            doc.setFileUrl(savedFileName);
            doc.setCoverUrl(savedCoverName);
            doc.setUploader(uploader);
            doc.setFileSize(file.getSize());
            doc.setFileType(getFileExtension(file.getOriginalFilename()));

            documentRepository.save(doc);

            return ResponseEntity.ok(ApiResponse.success("Đăng tải tài liệu thành công: " + doc.getTitle(), null));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Lỗi khi đăng tải: " + e.getMessage()));
        }
    }

    // 4. PUT (Cập nhật thông tin - Roles: ADMIN, GIẢNG VIÊN)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateDocument(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("major") String major,
            @RequestParam(value = "level", required = false) String level,
            @RequestParam("publishYear") Integer publishYear) {
        
        java.util.Optional<Document> docOpt = documentRepository.findById(id);
        if (docOpt.isPresent()) {
            Document doc = docOpt.get();
            
            // Security Check: Only Admin or the Uploader can update
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = doc.getUploader() != null && doc.getUploader().getId().equals(userDetails.getId());

            if (!isAdmin && !isOwner) {
                return ResponseEntity.status(403).body(ApiResponse.error(403, "Bạn không có quyền chỉnh sửa tài liệu này."));
            }

            doc.setTitle(title);
            doc.setMajor(major);
            doc.setLevel(level);
            doc.setPublishYear(publishYear);
            documentRepository.save(doc);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật tài liệu thành công", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "Không tìm thấy tài liệu"));
        }
    }

    // 5. DELETE (Xóa học liệu - Roles: ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteDocument(@PathVariable Long id) {
        java.util.Optional<Document> docOpt = documentRepository.findById(id);
        if (docOpt.isPresent()) {
            Document doc = docOpt.get();

            // Security Check: Only Admin or the Uploader can delete
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = doc.getUploader() != null && doc.getUploader().getId().equals(userDetails.getId());

            if (!isAdmin && !isOwner) {
                return ResponseEntity.status(403).body(ApiResponse.error(403, "Bạn không có quyền xóa tài liệu này."));
            }

            // Xóa file vật lý
            fileService.deleteFile(doc.getFileUrl());
            if (doc.getCoverUrl() != null) {
                fileService.deleteFile(doc.getCoverUrl());
            }
            // Xóa database
            documentRepository.delete(doc);
            return ResponseEntity.ok(ApiResponse.success("Xóa tài liệu thành công", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "Không tìm thấy tài liệu"));
        }
    }

    // 6. GET Phục vụ file PDF / Word tải xuống và Render ảnh Bìa
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("src/main/resources/static/uploads").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Xác định Content-Type dựa trên đuôi file
                String contentType = "application/octet-stream"; // Mặc định
                if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (fileName.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
    }
}
