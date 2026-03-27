package com.nckh.backend.modules.research.product;

import com.nckh.backend.modules.research.topic.ResearchTopic;
import com.nckh.backend.modules.research.topic.ResearchTopicRepository;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ResearchProductService {

    @Autowired
    private ResearchProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ResearchTopicRepository topicRepo;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<ResearchProduct> getAllProducts(String productType, String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return productRepo.findByProductNameContainingIgnoreCaseOrOwnerNameContainingIgnoreCase(keyword, keyword);
        }
        if (productType != null && !productType.isEmpty()) {
            return productRepo.findByProductType(productType);
        }
        return productRepo.findAll();
    }

    public Optional<ResearchProduct> getProductById(Long id) {
        return productRepo.findById(id);
    }

    public ResearchProduct createProduct(ResearchProductRequest req) {
        ResearchProduct product = new ResearchProduct();
        product.setProductName(req.getProductName());
        product.setProductType(req.getProductType());
        product.setOwnerName(req.getOwnerName());
        product.setSerialNumber(req.getSerialNumber());
        product.setPublisher(req.getPublisher());
        product.setIssuingAuthority(req.getIssuingAuthority());
        product.setStatus(req.getStatus() != null ? req.getStatus() : "CERTIFIED");

        if (req.getOwnerId() != null) {
            userRepo.findById(req.getOwnerId()).ifPresent(product::setOwner);
        }
        if (req.getTopicId() != null) {
            topicRepo.findById(req.getTopicId()).ifPresent(product::setTopic);
        }

        try {
            if (req.getIssuedAt() != null)
                product.setIssuedAt(sdf.parse(req.getIssuedAt()));
        } catch (Exception ignored) {}

        return productRepo.save(product);
    }

    private void checkOwnership(ResearchProduct product, Integer currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) return;
        if (product.getOwner() != null && product.getOwner().getId().equals(currentUserId)) return;
        throw new RuntimeException("Access Denied: You do not own this product");
    }

    public ResearchProduct updateProduct(Long id, ResearchProductRequest req, Integer currentUserId, String currentUserRole) {
        ResearchProduct product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        checkOwnership(product, currentUserId, currentUserRole);

        if (req.getProductName() != null) product.setProductName(req.getProductName());
        if (req.getStatus() != null) product.setStatus(req.getStatus());
        if (req.getSerialNumber() != null) product.setSerialNumber(req.getSerialNumber());
        if (req.getOwnerName() != null) product.setOwnerName(req.getOwnerName());
        if (req.getPublisher() != null) product.setPublisher(req.getPublisher());
        if (req.getIssuingAuthority() != null) product.setIssuingAuthority(req.getIssuingAuthority());

        try {
            if (req.getIssuedAt() != null)
                product.setIssuedAt(sdf.parse(req.getIssuedAt()));
        } catch (Exception ignored) {}

        return productRepo.save(product);
    }

    public void deleteProduct(Long id, Integer currentUserId, String currentUserRole) {
        ResearchProduct product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        checkOwnership(product, currentUserId, currentUserRole);
        
        productRepo.deleteById(id);
    }
}
