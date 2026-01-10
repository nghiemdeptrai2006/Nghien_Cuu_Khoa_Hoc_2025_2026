# 🚢 CNKH_2025: PHÁT TRIỂN BACKEND KHO DỮ LIỆU SỐ KĐTQT - UT-HCM

## Giới Thiệu Dự Án

Đây là kho lưu trữ chính thức cho dự án nghiên cứu và phát triển **Hệ thống Backend Kho Dữ liệu (Data Warehouse)** phục vụ công tác quản lý và phân tích dữ liệu cho **Khoa Đào tạo Quốc tế (KĐTQT)**, Trường Đại học Giao thông Vận tải (UTC-HCM).

Dự án tập trung xây dựng nền tảng backend mạnh mẽ, linh hoạt sử dụng ngôn ngữ **Java**, nhằm mục tiêu tích hợp dữ liệu từ nhiều hệ thống nguồn khác nhau của Khoa, chuẩn hóa và đưa vào Kho Dữ liệu để hỗ trợ các báo cáo thông minh và ra quyết định chiến lược.

---

## 🎯 MỤC TIÊU VÀ PHẠM VI CHÍNH

1.  **Phát triển Backend bằng Java:** Xây dựng các Module/Service bằng Java để quản lý luồng dữ liệu, logic nghiệp vụ, và cung cấp API truy vấn dữ liệu.
2.  **Thiết kế và Triển khai ETL/ELT:** Xây dựng các tác vụ (jobs) để **Trích xuất (Extract), Chuyển đổi (Transform)** dữ liệu thô từ các hệ thống quản lý hiện tại sang mô hình **Schema Ngôi Sao/Bông Tuyết** trong Kho Dữ liệu.
3.  **Tích hợp Hệ thống Nguồn:** Kết nối an toàn và hiệu quả với các Database quản lý sinh viên, học tập, và tài chính của KĐTQT.
4.  **Data API Services:** Cung cấp các **RESTful API** cho Frontend/Hệ thống BI (Business Intelligence) truy cập vào dữ liệu đã được tổng hợp, giúp phân tích hiệu suất đào tạo và dự báo.

## 🛠️ CÔNG NGHỆ VÀ MÔI TRƯỜNG

| Danh mục | Vai trò |
| :--- | :--- | :--- |
| **Backend Core** | Ngôn ngữ phát triển chính cho các Service. |
| **Framework** | Phát triển các API và Microservices. |
| **Data Warehouse** | Nền tảng lưu trữ chính cho Kho Dữ liệu. |
| **Data Access** | JDBC, JPA/Hibernate | Kết nối và thao tác với Database. |
| **Build Tool** | Quản lý dependencies và đóng gói dự án. |

---

## 📁 CẤU TRÚC DỰ ÁN

* **`src/main/java/`**: Mã nguồn Backend Java.
    * `.../controller/`: Xử lý yêu cầu API.
    * `.../service/`: Chứa toàn bộ Logic nghiệp vụ và các quy trình ETL/ELT.
    * `.../model/`: Các đối tượng dữ liệu (Entity, DTOs).
* **`src/main/resources/`**: File cấu hình (kết nối DB, properties, YAML).
* **`data_scripts/`**: Các script SQL (DDL/DML) để khởi tạo Schema Kho Dữ liệu và các bảng Dim/Fact.

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG (SETUP)

Thực hiện theo các bước sau để thiết lập và chạy Backend cục bộ:

1.  **Yêu cầu hệ thống:** Đã cài đặt JDK **[Phiên bản]** và **[Maven/Gradle]**.
2.  **Clone Repository:**
    ```bash
    git clone [https://github.com/nghiemdeptrai2006/CNKH_2025.git](https://github.com/nghiemdeptrai2006/CNKH_2025.git)
    cd CNKH_2025
    ```
3.  **Cấu hình Database:**
    * Cập nhật thông tin kết nối Database trong file `src/main/resources/application.properties` hoặc `application.yml`.
    * Chạy các script SQL trong thư mục `data_scripts/` để tạo các bảng cần thiết.
4.  **Build và Chạy:**
    ```bash
    # Ví dụ với Maven
    mvn clean install
    java -jar target/[tên file .jar]
    ```
---

## 📞 LIÊN HỆ

Mọi thắc mắc hoặc yêu cầu hỗ trợ về mã nguồn xin vui lòng liên hệ:
* **GitHub:** [@nghiemdeptrai2006]
* **Email:** [nguyentrongnghiem2006@gmail.com]
