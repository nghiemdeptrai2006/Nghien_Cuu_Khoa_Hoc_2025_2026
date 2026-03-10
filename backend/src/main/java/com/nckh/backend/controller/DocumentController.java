package com.nckh.backend.controller;

import com.nckh.backend.dto.DocumentResponse;
import com.nckh.backend.model.Document;
import com.nckh.backend.model.User;
import com.nckh.backend.repository.DocumentRepository;
import com.nckh.backend.repository.UserRepository;
import com.nckh.backend.security.UserDetailsImpl;
import com.nckh.backend.service.FileService;
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
    public ResponseEntity<List<DocumentResponse>> getDocuments(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) Integer publishYear) {
        
        List<Document> docs;

        if (type != null && major != null && publishYear != null) {
            docs = documentRepository.findByTypeAndMajorAndPublishYear(type, major, publishYear);
        } else if (major != null) {
            docs = documentRepository.findByMajor(major);
        } else if (publishYear != null) {
            docs = documentRepository.findByPublishYear(publishYear);
        } else if (type != null) {
            docs = documentRepository.findByType(type);
        } else {
            docs = documentRepository.findAll();
        }

        List<DocumentResponse> responseList = docs.stream()
                .map(DocumentResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    // 2. POST (Upload mới - Roles: ADMIN, GIẢNG VIÊN, SINH VIÊN)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("major") String major,
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
            doc.setPublishYear(publishYear);
            doc.setType(type);
            doc.setFileUrl(savedFileName);
            doc.setCoverUrl(savedCoverName);
            doc.setUploader(uploader);

            documentRepository.save(doc);

            return ResponseEntity.ok("Đăng tải tài liệu thành công: " + doc.getTitle());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi đăng tải: " + e.getMessage());
        }
    }

    // 3. GET Phục vụ file PDF / Word tải xuống và Render ảnh Bìa
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
}
