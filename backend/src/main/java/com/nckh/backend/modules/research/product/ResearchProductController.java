package com.nckh.backend.modules.research.product;

import com.nckh.backend.modules.auth.security.UserDetailsImpl;
import com.nckh.backend.common.dto.ApiResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
public class ResearchProductController {

    @Autowired
    private ResearchProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success(productService.getAllProducts(productType, keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(p -> ResponseEntity.ok((Object)ApiResponse.success(p)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error(404, "Product not found")));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ResearchProductRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Sản phẩm đã được tạo thành công", productService.createProduct(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ResearchProductRequest req) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", productService.updateProduct(id, req, userDetails.getId(), role)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            productService.deleteProduct(id, userDetails.getId(), role);
            return ResponseEntity.ok(ApiResponse.success("Đã xóa sản phẩm thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, e.getMessage()));
        }
    }
}
