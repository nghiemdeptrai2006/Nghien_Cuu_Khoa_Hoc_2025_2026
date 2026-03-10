# Phase 06: Frontend Integration & Test
Status: ⬜ Pending
Dependencies: phase-05-core-api.md

## Objective
Kết nối giao diện HTML/CSS/JS thuần hiện tại (`/ADMIN`, `/SINH VIEN`, `/GIANG VIEN`) với Java Backend API.

## Requirements
### Functional
- [ ] Tính năng Đăng nhập từ file HTML hoạt động, lưu JWT vào LocalStorage.
- [ ] Trang chủ gọi `fetch('/api/topics')` kèm Header Authorization Bearer Token.
- [ ] Hiển thị dữ liệu thực tế từ SQL Server lên màn hình thay vì chữ HTML tĩnh.

## Implementation Steps
1. [ ] Mở CORS trên Spring Boot (`@CrossOrigin(origins = "*")`).
2. [ ] Sửa file `trangchu.js` hoặc `auth.js` để gọi fetch POST.
3. [ ] Render DOM bằng Javascript.

## Test Criteria
- [ ] Đăng nhập thành công và trang tự động chuyển hướng.
- [ ] Mở thẻ Network (F12) không có lỗi CORS.

---
End of Plan.
