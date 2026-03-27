# 💡 BRIEF: OTP Email Fix System

**Ngày tạo:** 2026-03-14
**Trạng thái:** Brainstorming & Debugging

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Người dùng đã cấu hình App Password nhưng mã OTP vẫn không gửi về email khi đăng nhập với quyền Admin hoặc Giảng viên.

## 2. GIẢI PHÁP ĐỀ XUẤT (CÁC GIẢ THUYẾT)
1. **Giả thuyết A (Authentication):** Mã App Password `wqknzesscqlmqtlz` bị sai hoặc không khớp với email `nguyentrongnghiem2006@gmail.com`.
2. **Giả thuyết B (Logic Trigger):** Backend không nhận diện đúng Role của User nên không bao giờ gọi hàm `sendOtp`.
3. **Giả thuyết C (Network):** Cổng 587 bị chặn bởi Firewall hoặc ISP.
4. **Giả thuyết D (Restart):** User chưa thực sự Restart Backend sau khi thay đổi file `.properties`.

## 3. CÁC BƯỚC KIỂM TRA (MVP Debug)
- [ ] Kiểm tra Logs Console để tìm dòng `[CRITICAL LOG]` hoặc `DEBUG SMTP`.
- [ ] Kiểm tra xem Role thực tế được in ra là gì.
- [ ] Thử bỏ `override-receiver` để gửi trực tiếp về email của User.

## 4. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Thấp (nếu là lỗi config), Trung bình (nếu là lỗi SMTP/Mạng).
- **Rủi ro:** Google chặn tạm thời do thử quá nhiều lần.

## 5. BƯỚC TIẾP THEO
→ Yêu cầu User gửi Logs Console (Phần bắt đầu bằng `>>>` và `DEBUG SMTP`).
→ Tối ưu hóa lại file `AuthController.java` để chắc chắn 100% trigger được gọi.
