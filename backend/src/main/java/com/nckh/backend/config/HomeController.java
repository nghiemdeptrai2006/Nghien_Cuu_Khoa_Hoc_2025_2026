package com.nckh.backend.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "Running");
        status.put("message", "NCKH Backend API is online.");
        status.put("frontend_url", "http://localhost:5501");
        return status;
    }
}
