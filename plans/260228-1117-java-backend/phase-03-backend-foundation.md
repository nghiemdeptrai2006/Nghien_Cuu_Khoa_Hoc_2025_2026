# Phase 03: Backend Foundation (Spring Boot Init)
Status: ⬜ Pending
Dependencies: phase-02-database.md

## Objective
Khởi tạo cấu trúc dự án Spring Boot, kết nối CSDL SQL Server thông qua Hibernate/JPA.

## Requirements
### Functional
- [ ] Ứng dụng Spring Boot chạy trên port `8080`.
- [ ] Ứng dụng kết nối thành công tới `NCKH_DB` trong SQL Server.

## Implementation Steps
1. [ ] Mở trình duyệt vào Spring Initializr (https://start.spring.io/).
2. [ ] Khởi tạo project với các dependency: **Spring Web**, **Spring Data JPA**, **MS SQL Server Driver**, **Lombok**.
3. [ ] Mở project bằng IntelliJ IDEA.
4. [ ] Cấu hình file `application.properties` để trỏ tới SQL Server.
5. [ ] Tạo cấu trúc thư mục chuẩn: `model`, `repository`, `service`, `controller`.

## Files to Create/Modify
- `src/main/resources/application.properties`
- Cấu trúc thư mục code Java.

---
Next Phase: `phase-04-spring-security.md`
