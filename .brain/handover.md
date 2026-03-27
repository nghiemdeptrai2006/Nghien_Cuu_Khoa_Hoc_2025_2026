━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT: OTP & EMAIL FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Sửa lỗi mail OTP không gửi về được (Admin & Giảng viên)
🔢 Đến bước: Debug SMTP Handshake (Giai đoạn cuối)

✅ ĐÃ XONG:
   - Nâng cấp OTP lên 6 chữ số (Sync Frontend & Backend) ✓
   - Điền App Password thật vào application.properties ✓
   - Thêm bộ logs "Siêu chi tiết" (Mega Logs) ✓
   - Mở cửa (Whitelist) cho endpoint test-mail ✓
   - Sửa lỗi 403 Forbidden khi chạy test-mail ✓
   - Build thành công toàn bộ hệ thống ✓

⏳ CÒN LẠI:
   - User cần Restart Backend và chạy link test-mail.
   - Kiểm tra log Console để tìm nguyên nhân Google chặn (nếu vẫn không có mail).
   - Dọn dẹp các dòng log dư thừa sau khi fix xong.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Chuyển hẳn sang dùng OTP 6 số để bảo mật hơn.
   - Sử dụng `spring.mail.override-receiver=true` để hứmg toàn bộ mail về email test của dev.
   - Bật `mail.debug=true` để soi từng bước SMTP.

⚠️ LƯU Ý CHO SESSION SAU:
   - Link test nhanh: http://localhost:8080/api/auth/test-mail?to=nguyentrongnghiem2006@gmail.com
   - Nếu log có chữ "AuthenticationFailed", chứng tỏ App Password có vấn đề.
   - Nếu log có chữ "Connection timed out", chứng tỏ do Firewall/Cổng 587 bị chặn.

📁 FILES QUAN TRỌNG:
   - [application.properties](file:///c:/Users/ADMIN/Downloads/Nghien_Cuu_Khoa_Hoc_2025_2026-main/backend/src/main/resources/application.properties)
   - [EmailService.java](file:///c:/Users/ADMIN/Downloads/Nghien_Cuu_Khoa_Hoc_2025_2026-main/backend/src/main/java/com/nckh/backend/auth/EmailService.java)
   - [AuthController.java](file:///c:/Users/ADMIN/Downloads/Nghien_Cuu_Khoa_Hoc_2025_2026-main/backend/src/main/java/com/nckh/backend/auth/AuthController.java)
   - [.brain/session.json](file:///c:/Users/ADMIN/Downloads/Nghien_Cuu_Khoa_Hoc_2025_2026-main/.brain/session.json) (Lưu tiến độ)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Riverside
