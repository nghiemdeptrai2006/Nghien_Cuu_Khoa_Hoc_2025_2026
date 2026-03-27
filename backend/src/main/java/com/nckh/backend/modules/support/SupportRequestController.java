package com.nckh.backend.modules.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/support/requests")
public class SupportRequestController {

    @Autowired
    private SupportRequestService supportRequestService;

    @PostMapping(consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
    public ResponseEntity<SupportRequest> createRequest(Authentication authentication, @RequestBody SupportRequestInput input) {
        return ResponseEntity.ok(supportRequestService.createRequest(authentication.getName(), input));
    }

    @GetMapping("/my")
    public ResponseEntity<List<SupportRequest>> getMyRequests(Authentication authentication) {
        return ResponseEntity.ok(supportRequestService.getMyRequests(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupportRequest>> getAllRequests() {
        return ResponseEntity.ok(supportRequestService.getAllRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportRequest> getRequestById(@PathVariable Integer id) {
        return ResponseEntity.ok(supportRequestService.getRequestById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportRequest> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(supportRequestService.updateStatus(id, status));
    }
}
