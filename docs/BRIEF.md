# 💡 BRIEF: Hệ thống Quản lý Nghiên cứu Khoa học (NCKH)

**Ngày cập nhật:** 28/02/2026
**Tech Stack Mới:** Java Spring Boot & SQL Server

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Hiện tại, hệ thống NCKH đang là web tĩnh. Chuyển đổi thành Web Application hoàn chỉnh với Backend kết nối Database.

## 2. GIẢI PHÁP ĐỀ XUẤT
Nâng cấp hệ thống sử dụng hệ sinh thái Enterprise:
- **Frontend:** Kế thừa giao diện tĩnh (HTML/CSS/JS) hiện tại, tích hợp API (Fetch/Axios).
- **Backend:** Xây dựng API Server bằng **Java (Spring Boot)**, lập trình trên **IntelliJ IDEA**.
- **Database:** Sử dụng **Microsoft SQL Server**, quản lý qua **SQL Server Management Studio (SSMS)**.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Primary:** Giảng viên, Sinh viên, Nhà nghiên cứu.
- **Secondary:** Quản trị viên, Cán bộ khoa (phân hệ ADMIN).

## 4. TÍNH NĂNG (Giai đoạn 1 - MVP):
- [ ] **Database - Thiết kế:** Lên sơ đồ cơ sở dữ liệu (T-SQL) trên SQL Server.
- [ ] **Backend - Cấu trúc:** Khởi tạo Spring Boot Project (JPA/Hibernate, Spring Web).
- [ ] **Auth - Đăng nhập:** Xác thực người dùng bằng Spring Security (JWT).

## 5. CÔNG CỤ HIỆN CÓ
- ✅ **Đã cài đặt:** SQL Server Management Studio (SSMS), Java JDK (Version 25).
- ❌ **Cần cài đặt:** IntelliJ IDEA.

## 6. BƯỚC TIẾP THEO
→ Tải và cài đặt IntelliJ IDEA.
→ Chạy `/plan` để lên thiết kế các phase theo cấu trúc Spring Boot + SQL Server.
