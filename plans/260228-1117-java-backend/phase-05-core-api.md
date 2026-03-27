# Phase 05: Core API (Entities & Controllers)
Status: ⬜ Pending
Dependencies: phase-04-spring-security.md

## Objective
Xây dựng các Entity JPA dựa trên cấu trúc CSDL SQL Server và viết cấu trúc Repository, Service, Controller cho Đề tài NCKH, Bài báo.

## Requirements
### Functional
- [ ] Các Class Entity (`User`, `Role`, `Topic`, `Article`) ánh xạ chuẩn với Data Tables.
- [ ] CRUD API cho Đề tài NCKH (`/api/topics`).
- [ ] CRUD API cho Bài báo (`/api/articles`).

## Implementation Steps
1. [ ] Viết classes trong package `model` có đánh dấu `@Entity`.
2. [ ] Kết nối khoá ngoại `@ManyToOne`, `@OneToMany`.
3. [ ] Tạo `TopicRepository`, `ArticleRepository` kế thừa `JpaRepository`.
4. [ ] Viết `TopicService` chứa logic nghiệp vụ và `TopicController` mở port cho frontend.

## Files to Create/Modify
- Toàn bộ source code trong `src/main/java/com/nckh/backend/...`

---
Next Phase: `phase-06-frontend-integration.md`
