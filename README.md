# 🚀 HỆ THỐNG KHO DỮ LIỆU SỐ (E-REPOSITORY)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://www.oracle.com/java/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red.svg)](https://www.microsoft.com/en-us/sql-server/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Hệ thống Kho Dữ Liệu Số** là một nền tảng toàn diện giúp số hóa quy trình quản lý tài liệu, giáo trình, luận văn và hỗ trợ sinh viên/giảng viên trong môi trường giáo dục điện tử.

---

## ✨ Tính Năng Cốt Lõi

### 👨‍💼 Quản Trị Viên (Admin)
- **Quản lý Người dùng:** Cấp phát tài khoản, phân quyền (Sinh viên, Giảng viên).
- **Duyệt Đề tài/Bài báo:** Tiếp nhận và phê duyệt các hồ sơ NCKH trực tuyến.
- **Thống kê & Báo cáo:** Dashboard số liệu thực tế về các hoạt động khoa học.
- **Hệ thống Hỗ trợ:** Xử lý các Ticket/Yêu cầu từ người dùng với trạng thái thời gian thực.

### 🎓 Sinh Viên & Giảng Viên
- **Đăng ký Đề tài:** Gửi hồ sơ NCKH nhanh chóng.
- **Tra cứu Tài liệu:** Tìm kiếm tài liệu, giáo trình, luận văn qua công cụ Search thông minh.
- **Gửi Hỗ trợ:** Ticket hỗ trợ kỹ thuật/nghiệp vụ tích hợp Unicode chuẩn xác.

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Backend** | Spring Boot 3.x, Spring Security (JWT), Spring Data JPA |
| **Database** | Microsoft SQL Server (Transact-SQL) |
| **Frontend** | Vanilla HTML5, CSS3 (Modern UI), JavaScript (ES6+) |
| **Mail** | Gmail SMTP Server Integration |

---

## 📁 Cấu Trúc Dự Án
```bash
.
├── backend/            # Spring Boot Source Code (Java 21/25)
├── database/           # SQL Scripts (Schema, Triggers, Data)
├── docs/               # Tài liệu đặc tả, thiết kế API
├── frontend/           # HTML, CSS, JS (Client side - No Framework)
│   ├── admin/          # Giao diện Quản trị viên & Dashboard
│   ├── giang-vien/     # Giao diện Quản lý chuyên môn
│   └── sinh-vien/      # Giao diện Tra cứu & Gửi hỗ trợ
└── GUIDELINES.md       # Tiêu chuẩn lập trình & Quy tắc Unicode
```

---

## 📥 Hướng Dẫn Cài Đặt

### 1. Cơ sở dữ liệu
- Mở **SQL Server Management Studio (SSMS)**.
- Tạo database mới tên `NCKH_DB`.
- Chạy script tại `database/schema.sql` để khởi tạo cấu trúc.

### 2. Cấu hình Backend
- Truy cập `backend/src/main/resources/application.properties`.
- Cấu hình lại thông tin kết nối SQL Server (User/Pass/Port).
- Mở terminal tại thư mục `backend` và chạy lệnh:
  ```bash
  mvnw spring-boot:run
  ```

### 3. Khởi chạy Frontend
- Mở thư mục `frontend` bằng VS Code.
- Sử dụng extension **Live Server** (chuột phải vào `index.html` -> `Open with Live Server`).
- Đảm bảo port chạy là `5501` hoặc `5500` để khớp với CORS của Backend.

---

## 🔑 Tài Khoản Thử Nghiệm

- **Admin:** `admin@utc.edu.vn` / `Admin123`
- **Giảng viên:** `GV01` / `123456`
- **Sinh viên:** `SV01` / `123456`

---

## 📖 Hướng Dẫn Phát Triển (For Developers)

Nếu bạn là nhà phát triển muốn đóng góp hoặc tiếp quản dự án, vui lòng đọc kỹ tài liệu:
👉 [**GUIDELINES.MD (Tiêu chuẩn lập trình)**](GUIDELINES.md)

---

## 🤝 Đóng Góp
Mọi ý tưởng đóng góp hoặc báo lỗi xin vui lòng tạo **Issue** hoặc gửi **Pull Request**.

---
*Phát triển bởi đội ngũ NCKH 2025-2026.*
