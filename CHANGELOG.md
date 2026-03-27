# Changelog - Kho Dữ Liệu Số


## [2026-03-22] - Session 5 (Unicode & Schema Perfection)

### ✅ Fixed
- **Tiếng Việt (Unicode)**: Khắc phục triệt để lỗi phông chữ `?` tại module Hỗ trợ bằng cách đồng bộ `CharacterEncodingFilter` + `mvnw` properties + `NVARCHAR` DB mapping.
- **Lỗi JDBC**: Giải quyết lỗi `The conversion from varchar to NCHAR is unsupported` bằng cách chuẩn hóa Entity `SupportRequest.java` và nâng cấp schema DB an toàn.
- **Lỗi Biên dịch**: Khôi phục các field bị mất trong `ResearchTopic.java`, sửa lỗi `Invalid column name 'start_date'`.

### 🎨 Changed
- **Entity Hardening**: Áp dụng `columnDefinition = "nvarchar(...)"` chuẩn cho toàn bộ các trường nhập liệu Tiếng Việt.
- **JSON Security**: Ép kiểu UTF-8 cho `MappingJackson2HttpMessageConverter`.

### 🧹 Cleanup
- **Dọn dẹp dự án**: Xóa hơn 17 file SQL và Java tạm (fix scripts) để làm sạch code base.
- **GUIDELINES.md**: Tạo bộ khung tiêu chuẩn lập trình để người sau tiếp quản dự án dễ dàng.

---

### ✅ Added
- **Google Login Fallback (SV01)**: Sinh viên chưa có tài khoản vẫn đăng nhập bằng Google được (fallback SV01)
- **GoogleLoginRequest.java**: Thêm field `userType` để frontend phân biệt student/teacher/admin
- **ResearchTopic Entity + API**: CRUD đề tài NCKH với filter, stats (`/api/admin/topics/**`)
- **ScientificPaper Entity + API**: Bài báo khoa học - duyệt/từ chối, filter theo tạp chí (`/api/admin/papers/**`)
- **ResearchProduct Entity + API**: Sản phẩm NCKH - bằng sáng chế, sách, phần mềm (`/api/admin/products/**`)
- **3 bảng DB mới**: `ResearchTopics`, `ScientificPapers`, `ResearchProducts` trong SQL Server
- **.brain/ folder**: brain.json và session.json để lưu context dự án

### 🔌 Connected (Frontend → API)
- `ADMIN/JS/quanlydetai.js` → `GET/POST/PUT /api/admin/topics` (load, duyệt/hủy, lọc)
- `ADMIN/JS/quanlybaibao.js` → `GET/POST/PUT /api/admin/papers` (load, duyệt, thêm mới)
- `ADMIN/JS/quanlysanpham.js` → `GET/POST/PUT /api/admin/products` (load, cấp chứng nhận)
- `ADMIN/JS/trangchu.js` → `/api/admin/topics/stats` + `/api/admin/papers/stats` (Dashboard số liệu thật)
- `SINH VIEN/JS/luanvan.js` → `GET /api/documents?type=LUAN_VAN` (load luận văn thật từ DB)

### 🐛 Fixed
- Google Login: frontend gửi thêm `userType` để backend xử lý đúng theo role
- `quanlydetai.js`: Lỗi syntax template literal lồng nhau → viết lại bằng ES5 string concatenation

---

## [2026-03-11] - Session 3

### ✅ Added
- **Admin Google Login 2FA**: Sau khi Google xác thực, Admin nhận OTP 5 số qua Gmail (EmailJS)
- **shared/js/auth.js**: Tạo mới - hàm `login()` kết nối backend + offline demo fallback
- **Inline Search trang chủ Sinh viên**: Kết quả hiện ngay tại trang, gồm tất cả loại tài liệu + người đăng
- **Modal OTP**: UI modal đẹp để nhập mã xác thực thay vì `prompt()`

### 🎨 Changed
- **Redesign Sinh Viên trang chủ**: Hero gradient navy đậm, search box pill shape, feature cards với hover animation, stats section vàng
- **Redesign Giảng Viên trang chủ**: Banner hero navy-green, dashboard cards premium với CTA button pill
- **Đăng nhập Admin**: Xóa ô "Mã Code Quản Trị" cứng → thay bằng OTP email ngẫu nhiên

### 🐛 Fixed
- Google Login luôn redirect về trang sinh viên → giờ đúng theo `currentUserType`
- `handleGoogleCredentialResponse` Admin bypass 2FA → giờ bắt buộc nhập OTP
- `handleSearch` trang chủ dùng `alert()` → redirect → inline results

### ⚙️ Config
- EmailJS: `service_x7ouffq` / `template_03v04ni` / key `D3OtXZ6gGeH4kE2Jq`
- Admin OTP email: `nguyentrongnghiem2006@gmail.com`

---

## [2026-03-10] - Session 2

### 🎨 Changed
- Redesign Sinh viên UI thành super masterpiece với glassmorphism

---

## [2026-03-09] - Session 1

### ✅ Added
- Backend registration design (Java classes, SecurityUtil, UserDAO)
- Frontend-Backend communication protocol via Spring Boot
