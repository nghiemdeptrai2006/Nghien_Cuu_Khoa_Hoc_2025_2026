# Phase 02: Database Schema (T-SQL)
Status: ⬜ Pending
Dependencies: phase-01-setup.md

## Objective
Thiết kế kiến trúc cơ sở dữ liệu trên Microsoft SQL Server để lưu trữ thông tin Người dùng, Đề tài NCKH, và Bài báo khoa học.

## Requirements
### Functional
- [ ] Script T-SQL tạo các bảng: `Roles`, `Users`, `Topics`, `Articles`.
- [ ] Định nghĩa Primary Keys, Foreign Keys chuẩn xác.
- [ ] Script chèn (Seed) dữ liệu mẫu cơ bản để test.

## Implementation Steps
1. [ ] Mở query mới trong SSMS trỏ vào `NCKH_DB`.
2. [ ] Chạy lệnh `CREATE TABLE` do AI cung cấp.
3. [ ] Chạy lệnh `INSERT` dữ liệu mẫu (1 Admin, 1 Giảng Viên, 1 Sinh viên).

## Files to Create/Modify
- `database/schema.sql` (Lưu lại kịch bản SQL Server).

---
Next Phase: `phase-03-backend-foundation.md`
