package com.nckh.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
public class FileService {

    // Đường dẫn thư mục tĩnh lấy từ config tĩnh
    private final Path fileStorageLocation = Paths.get("src/main/resources/static/uploads").toAbsolutePath().normalize();

    public FileService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        
        // Làm sạch và xử lý tên File tránh lỗi Font chữ
        String originalFileName = org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename());
        String safeFileName = removeAccents(originalFileName);
        
        // Tạo unique fileName kết hợp UUID
        String fileName = UUID.randomUUID().toString() + "_" + safeFileName;

        try {
            if(fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file vào thư mục đích (thay thế nếu tồn tại cùng tên)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private String removeAccents(String str) {
        if (str == null) return null;
        String temp = Normalizer.normalize(str, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("")
               .replaceAll("Đ", "D").replaceAll("đ", "d")
               .replaceAll("\\s+", "_") // Thay dấu cách bằng gạch dưới
               .replaceAll("[^a-zA-Z0-9_\\.-]+", ""); // Xóa ký tự lạ
    }
}
