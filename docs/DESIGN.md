# 🎨 DESIGN: NCKH Database Schema (Hệ Quản Trị SQL Server)

Ngày tạo: 28/02/2026

---

## 1. CÁC ĐỐI TƯỢNG CẦN QUẢN LÝ
Trong hệ thống NCKH của mình, chúng ta cần lưu trữ 3 nhóm thông tin chính:
1. **Người dùng (Users):** Ai đang đăng nhập? (Là Sinh viên, Giảng viên hay Admin).
2. **Đề tài NCKH (Topics):** Các nghiên cứu đang được thực hiện.
3. **Bài báo (Articles):** Các bài viết khoa học đã được đăng.

---

## 2. SƠ ĐỒ LƯU TRỮ (DATABASE LÀM GÌ?)

💡 *Hãy tưởng tượng Database giống như các trang tính Excel có liên kết với nhau.*

```text
┌─────────────────────────────────────────────────────────────┐
│  🛡️ ROLES (Phân Quyền)                                      │
│  ├── ID (1: Admin, 2: GiangVien, 3: SinhVien)               │
│  └── Tên chức vụ                                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ 1 Quyền -> Gắn cho nhiều User
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  👤 USERS (Người dùng)                                      │
│  ├── Tên Đăng Nhập (Mã SV / Mã GV)                          │
│  ├── Mật khẩu (Từ chối lưu chữ thường, phải mã hóa)         │
│  └── Họ và Tên                                              │
└────────────────┬──────────┬─────────────────────────────────┘
                 │          │
    1 User -> Nhiều Đề tài  │ 1 User -> Nhiều Bài Báo
                 │          │
                 ▼          ▼
┌────────────────────────┐  ┌───────────────────────────────┐
│ 📚 TOPICS (Đề tài)     │  │ 📄 ARTICLES (Bài Báo)         │
│ ├── Tên đề tài         │  │ ├── Tên bài báo               │
│ ├── Mô tả ngắn         │  │ ├── Tên tạp chí xuất bản      │
│ ├── Trạng thái (Nháp/..)│  │ ├── Năm xuất bản              │
│ └── Mã người tạo (User)│  │ └── Mã tác giả (User)         │
└────────────────────────┘  └───────────────────────────────┘
```

---

## 3. CHECKLIST KIỂM TRA

### Hành trình Đăng nhập thành công:
✅ Hệ thống mở cửa API `/auth/login`.
✅ Mật khẩu "123456" gửi từ React/HTML được mã hóa tự động để so sánh.
✅ Server kiểm tra đúng `Username` và `Password` trong Database SQL Server.
✅ Trả về 1 chuỗi mã bí mật (gọi là JWT Token) + Quyền tương ứng (VD: `role: 2` tức là Giảng viên).

### Hành trình Hiển thị Dữ liệu:
✅ Bấm vào trang "Danh sách Đề tài".
✅ Giao diện gửi kèm Token bí mật lên Server.
✅ Server tra bảng `TOPICS` ghép với bảng `USERS` để ra được tên người lập đề tài.
✅ Gửi danh sách dạng chuẩn chữ về cho trình duyệt vẽ HTML.
