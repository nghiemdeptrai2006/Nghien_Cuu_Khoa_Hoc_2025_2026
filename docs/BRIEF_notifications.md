# 💡 BRIEF: Hệ Thống Thông Báo (Notifications System)

**Ngày tạo:** 2026-03-22
**Trạng thái:** Brainstorming 🧠

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Người dùng (Admin, SV, GV) hiện tại không biết khi có sự kiện mới (yêu cầu hỗ trợ được trả lời, tài liệu mới được duyệt...) nếu không chủ động vào kiểm tra trang.

## 2. GIẢI PHÁP ĐỀ XUẤT
Xây dựng một hệ thống thông báo trung tâm với "nút hình chuông" hiển thị số lượng thông báo chưa đọc (Unread counts).

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Admin:** Nhận tin khi có Ticket hỗ trợ mới, tài liệu mới chờ duyệt.
- **Sinh viên:** Nhận tin khi Ticket được phản hồi, tài liệu mới thuộc chuyên ngành.
- **Giảng viên:** Nhận tin khi tài liệu được duyệt/từ chối.

## 4. TÍNH NĂNG ĐỀ XUẤT (BRAINSTORMING)

### 🚀 MVP (Bắt buộc có):
- [ ] Bảng `Notifications` trong Database.
- [ ] API lấy danh sách thông báo của người dùng hiện tại (`GET /api/notifications`).
- [ ] API đánh dấu "Đã đọc" (`PUT /api/notifications/{id}/read`).
- [ ] Logic tạo thông báo tự động khi có sự kiện (ví dụ: khi Admin trả lời Ticket).

### 🎁 Phase 2 (Làm sau):
- [ ] Real-time với WebSocket (Thông báo hiện lên ngay lập tức).
- [ ] Web Push Notifications (Thông báo trình duyệt).
- [ ] Gửi Email thông báo song song.

## 5. CÂU HỎI CẦN THẢO LUẬN
1. Anh muốn ưu tiên thông báo cho nhóm đối tượng nào trước (Admin hay Sinh viên)?
2. Các sự kiện (triggers) nào quan trọng nhất cần có thông báo ngay?
3. Anh chọn phương án kỹ thuật nào: Đơn giản (Polling) hay Xịn (Real-time)?

---
*Tài liệu đang được thảo luận cùng Antigravity.*
