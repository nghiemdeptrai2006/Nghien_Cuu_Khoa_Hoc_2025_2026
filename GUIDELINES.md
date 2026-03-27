# 📖 HƯỚNG DẪN PHÁT TRIỂN KHO DỮ LIỆU SỐ

Tài liệu này cung cấp các tiêu chuẩn kỹ thuật giúp nhà phát triển tiếp theo hiểu rõ kiến trúc và cách duy trì dự án một cách đồng nhất.

---

##  1. Kiến trúc Hệ thống (Architecture)
Dự án được xây dựng theo mô hình **Modular Monolith**, phân chia theo các tầng (Layered Architecture):

- **Controller Layer:** Tiếp nhận Request, điều phối và trả Response. 
    - *Quy tắc:* Tuyệt đối không viết logic nghiệp vụ tại đây.
- **Service Layer:** Xử lý toàn bộ logic nghiệp vụ, quản lý Transaction.
- **Repository Layer:** Tương tác với Database qua Spring Data JPA.
- **Entity Layer:** Định nghĩa cấu trúc bảng trong SQL Server.

---

##  2. Các quy tắc "Vàng" (Coding Standards)

### A. Định dạng Phản hồi (API Response)
Tất cả các API **phải** trả về dữ liệu bọc trong class `ApiResponse<T>` để Frontend dễ dàng xử lý lỗi và dữ liệu.

```java
// Ví dụ dùng trong Controller
return ResponseEntity.ok(ApiResponse.success(data));
```

### B. Xử lý Tiếng Việt (Unicode Standard)
Hệ thống sử dụng SQL Server, do đó cần tuân thủ nghiêm ngặt để không bị lỗi dấu `?`:
1. **Database:** Luôn dùng kiểu dữ liệu `NVARCHAR` và Collation `Vietnamese_CI_AS`.
2. **Java Entity:** Sử dụng `@Column(columnDefinition = "nvarchar(...)")`.
3. **Frontend:** File JavaScript (`.js`) phải được lưu ở định dạng **UTF-8**.

### C. Phân chia Module
Mọi tính năng mới phải được đặt trong package `com.nckh.backend.modules.<tên_tính_năng>`. 
Ví dụ: `modules.support`, `modules.research`, `modules.user`.

---

##  3. Cách thêm một tính năng mới (Workflow)

Nếu bạn cần thêm một module mới, hãy thực hiện theo thứ tự:
1.  **Database:** Tạo bảng mới trong SQL Server (Nhớ dùng `NVARCHAR`).
2.  **Entity:** Khởi tạo class Java trong `modules.new_feature.entity`.
3.  **Repository:** Tạo interface kế thừa `JpaRepository`.
4.  **DTO:** Tạo các class Request/Response để hứng dữ liệu từ Frontend.
5.  **Service:** Viết logic nghiệp vụ và dùng `@Transactional` nếu có ghi/xóa dữ liệu.
6.  **Controller:** Khai báo Endpoint và gọi Service.

---

##  4. Môi trường phát triển (Environment)
- **Backend:** Java 21+ (Spring Boot 3.2.4).
- **Cổng mặc định:** `8080`.
- **Database:** SQL Server (Cấu hình trong `application.properties`).
- **Frontend:** HTML/JS Thuần (Chạy qua Live Server cổng `5501` hoặc `5500`).

---

##  5. Bảo mật (Security)
- Hệ thống dùng **JWT (JSON Web Token)** để xác thực.
- Phân quyền (Roles): `ROLE_ADMIN`, `ROLE_GIANGVIEN`, `ROLE_SINHVIEN`.
- Dùng `@PreAuthorize("hasRole('ADMIN')")` tại Controller để bảo vệ endpoint.

---

*Tài liệu này được biên soạn bởi Antigravity (AI) nhằm hỗ trợ duy trì chất lượng dự án.*
