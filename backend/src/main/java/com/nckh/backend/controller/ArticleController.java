package com.nckh.backend.controller;

import com.nckh.backend.dto.ArticleRequest;
import com.nckh.backend.model.Article;
import com.nckh.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody ArticleRequest request) {
        String username = getUsername();
        return ResponseEntity.ok(articleService.createArticle(request, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id, @RequestBody ArticleRequest request) {
        String username = getUsername();
        return ResponseEntity.ok(articleService.updateArticle(id, request, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Integer id) {
        String username = getUsername();
        articleService.deleteArticle(id, username);
        return ResponseEntity.ok().build();
    }

    private String getUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}
