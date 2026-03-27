# Phase 04: Spring Security (Auth & JWT)
Status: ⬜ Pending
Dependencies: phase-03-backend-foundation.md

## Objective
Tích hợp Spring Security vào dự án để hỗ trợ đăng nhập và cấp phát JWT token, cũng như phân quyền truy cập API.

## Requirements
### Functional
- [ ] API `POST /api/auth/login` cấp phát JWT chứa Role.
- [ ] Filter giải mã JWT cho mọi request gửi tới `/api/**`.
- [ ] Cấu hình xác thực Method Security (`@PreAuthorize("hasRole('ADMIN')")`).

## Implementation Steps
1. [ ] Cài đặt dependency: `jjwt-api`, `jjwt-impl`, `jjwt-jackson`, `spring-boot-starter-security`.
2. [ ] Viết `JwtTokenProvider` để sinh và kiểm tra Token.
3. [ ] Viết `JwtAuthenticationFilter` để chặn request, kiểm tra Header `Authorization`.
4. [ ] Viết `SecurityConfig` (SecurityFilterChain) cho phép `/api/auth/login` public và khoá chặn các đường dẫn khác.

## Files to Create/Modify
- `security/JwtTokenProvider.java`
- `security/JwtAuthenticationFilter.java`
- `config/SecurityConfig.java`
- `controller/AuthController.java`

---
Next Phase: `phase-05-core-api.md`
