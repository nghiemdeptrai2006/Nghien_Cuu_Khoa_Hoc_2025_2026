-- =========================================================================
-- SCRIPT TẠO DATABASE: NCKH_DB
-- HỆ QUẢN TRỊ: Microsoft SQL Server (T-SQL)
-- MỤC ĐÍCH: Dùng cho Backend Java Spring Boot
-- =========================================================================

-- 1. TẠO DATABASE (NẾU CHƯA CÓ)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'NCKH_DB')
BEGIN
    CREATE DATABASE NCKH_DB;
END
GO

USE NCKH_DB;
GO

-- 2. TẠO BẢNG: Roles (Phân quyền)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        id INT PRIMARY KEY,
        role_name NVARCHAR(50) UNIQUE NOT NULL
    );
END
GO

-- 3. TẠO BẢNG: Users (Người dùng)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL, -- Lưu mk đã băm bằng BCrypt
        full_name NVARCHAR(100) NOT NULL,
        role_id INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (role_id) REFERENCES Roles(id)
    );
END
GO

-- 4. TẠO BẢNG: Topics (Đề tài NCKH)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Topics' AND xtype='U')
BEGIN
    CREATE TABLE Topics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED
        author_id INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (author_id) REFERENCES Users(id)
    );
END
GO

-- 5. TẠO BẢNG: Articles (Bài báo Khoa học)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Articles' AND xtype='U')
BEGIN
    CREATE TABLE Articles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        journal_name NVARCHAR(150),
        publish_year INT,
        document_url VARCHAR(255),
        author_id INT NOT NULL,
        FOREIGN KEY (author_id) REFERENCES Users(id)
    );
END
GO

-- =========================================================================
-- MỤC LỤC DỮ LIỆU MẪU (SEED DATA)
-- =========================================================================

-- Chèn 3 Quyền cơ bản (nếu chưa có)
IF NOT EXISTS (SELECT * FROM Roles WHERE id = 1)
BEGIN
    INSERT INTO Roles (id, role_name) VALUES 
    (1, 'ROLE_ADMIN'),
    (2, 'ROLE_GIANGVIEN'),
    (3, 'ROLE_SINHVIEN');
END

-- Chèn Người dùng mẫu
-- Chú ý: password_hash ở đây là chuỗi đã mã hóa BCrypt của chữ: "123456"
-- (Phía Java Spring Security sẽ tự hiểu mã này)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin')
BEGIN
    INSERT INTO Users (username, password_hash, full_name, role_id) VALUES 
    ('admin', '$2a$10$wE4I/2qD2oW5.k.B1WbZ9.UOM0M2Z.80e2S1.a7HqGZ6X.dY1zN0m', N'Quản Trị Viên Khoa', 1),
    ('GV01', '$2a$10$wE4I/2qD2oW5.k.B1WbZ9.UOM0M2Z.80e2S1.a7HqGZ6X.dY1zN0m', N'Giảng Viên Test', 2),
    ('SV01', '$2a$10$wE4I/2qD2oW5.k.B1WbZ9.UOM0M2Z.80e2S1.a7HqGZ6X.dY1zN0m', N'Sinh Viên Test', 3);
END
GO

-- Chèn Đề tài mẫu
IF NOT EXISTS (SELECT * FROM Topics WHERE author_id = 2)
BEGIN
    INSERT INTO Topics (title, description, status, author_id) VALUES 
    (N'Nghiên cứu ứng dụng AI trong giảng dạy', N'Đề tài cấp Khoa năm 2026.', 'APPROVED', 2),
    (N'Đồ án Tốt nghiệp CNTT', N'Nghiên cứu Web App cho Sinh Viên.', 'SUBMITTED', 3);
END
GO
