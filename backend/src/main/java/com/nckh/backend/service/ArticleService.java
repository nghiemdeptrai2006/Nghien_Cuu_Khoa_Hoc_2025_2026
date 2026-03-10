package com.nckh.backend.service;

import com.nckh.backend.dto.ArticleRequest;
import com.nckh.backend.model.Article;
import com.nckh.backend.model.User;
import com.nckh.backend.repository.ArticleRepository;
import com.nckh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<Article> getArticlesByAuthor(Integer authorId) {
        return articleRepository.findByAuthorId(authorId);
    }

    public Article createArticle(ArticleRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setJournalName(request.getJournalName());
        article.setPublishYear(request.getPublishYear());
        article.setDocumentUrl(request.getDocumentUrl());
        article.setAuthor(author);

        return articleRepository.save(article);
    }

    public Article updateArticle(Integer articleId, ArticleRequest request, String username) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        // Xác minh quyền
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        if (!article.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().getRoleName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bạn không có quyền sửa bài báo này.");
        }

        if (request.getTitle() != null) article.setTitle(request.getTitle());
        if (request.getJournalName() != null) article.setJournalName(request.getJournalName());
        if (request.getPublishYear() != null) article.setPublishYear(request.getPublishYear());
        if (request.getDocumentUrl() != null) article.setDocumentUrl(request.getDocumentUrl());

        return articleRepository.save(article);
    }

    public void deleteArticle(Integer articleId, String username) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User currentUser = userRepository.findByUsername(username).orElseThrow();
        if (!article.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().getRoleName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xoá bài báo này.");
        }

        articleRepository.delete(article);
    }
}
