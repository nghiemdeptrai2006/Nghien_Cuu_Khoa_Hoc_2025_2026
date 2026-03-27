# 💡 BRIEF: GIẢI THÍCH CẤU TRÚC THƯ MỤC (MODULAR ARCHITECTURE)

**Ngày cập nhật:** 2026-03-17
**Trạng thái:** Brainstorming & Documentation

---

## 1. TẠI SAO CÓ NHIỀU THƯ MỤC TRÙNG TÊN?
Anh thấy các thư mục như `auth`, `user`, `research` xuất hiện ở nhiều nơi là vì dự án đang được tổ chức theo mô hình **Modular & Layered Architecture** (Kiến trúc phân tầng và module). 

Cụ thể, dự án được chia thành 2 phần lớn:
1.  **Frontend (Giao diện):** Những gì người dùng thấy.
2.  **Backend (Xử lý):** Luồng xử lý dữ liệu và bảo mật.

## 2. PHÂN BIỆT FRONTEND VS BACKEND
| Thư mục | Mục đích | Ví dụ |
|---------|----------|-------|
| `frontend/auth` | Chứa trang Đăng nhập, script xử lý nhập liệu, gọi API. | `login.html`, `script.js` |
| `backend/.../modules/auth` | Chứa logic kiểm tra mật khẩu, tạo mã JWT, gửi mail OTP. | `AuthController.java`, `EmailService.java` |

*Ví dụ: Khi anh đăng nhập, `frontend/auth` sẽ thu thập email, còn `backend/modules/auth` sẽ là nơi thực sự kiểm tra xem email đó có đúng không.*

## 3. LÝ DO DÙNG "MODULES" TRONG BACKEND
Thay vì để tất cả file ở một chỗ dẫn đến rối rắm, backend được chia thành các **Module** riêng biệt theo nghiệp vụ:
- `auth`: Chuyên về bảo mật & đăng nhập.
- `user`: Chuyên về quản lý thông tin người dùng.
- `document`: Chuyên về quản lý file tài liệu.
- `research`: Chuyên về các đề tài, bài báo khoa học.

**⚠️ Lưu ý về các thư mục cũ:**
Một số thư mục cũ ở ngoài (như `com.nckh.backend.auth` cũ) đang trong quá trình chuyển hoặc đã dọn dẹp sạch để đưa vào thư mục `modules` mới nhằm chuẩn hóa mã nguồn.

## 4. CHUẨN HÓA TÊN THƯ MỤC FRONTEND
- Em đã chuyển các thư mục có dấu cách và viết hoa (`GIANG VIEN`, `SINH VIEN`) sang dạng chuẩn `giang-vien`, `sinh-vien`.
- Việc này giúp hệ thống hoạt động ổn định hơn trên mọi máy tính (Windows/Linux) và tránh lỗi khi link các file với nhau.

## 5. BƯỚC TIẾP THEO
→ Anh cứ tiếp tục làm việc trong các thư mục tương ứng.
→ Nếu thấy thư mục nào trống (Empty), đó là kết quả của việc em đã dời code vào module mới cho ngăn nắp. 

Anh thấy cấu trúc này có giúp anh dễ quản lý code hơn không ạ? 🚀 🎉 Riverside
