// Biến toàn cục
let currentUserType = 'admin';

// Hàm chọn loại người dùng
function selectUserType(userType) {
    // Cập nhật loại người dùng hiện tại
    currentUserType = userType;
    
    // Cập nhật giao diện cho các option
    const adminOption = document.getElementById('admin-option');
    const teacherOption = document.getElementById('teacher-option');
    
    if (userType === 'admin') {
        adminOption.classList.add('active');
        teacherOption.classList.remove('active');
        
        // Cập nhật tiêu đề form
        document.getElementById('form-title').textContent = 'ĐĂNG NHẬP QUẢN TRỊ VIÊN';
        document.getElementById('form-subtitle').textContent = 'Nhập thông tin tài khoản để truy cập toàn bộ hệ thống';
        
        // Cập nhật thông tin đăng nhập mẫu
        document.getElementById('demo-credentials').textContent = 'Admin: admin_uit | Mật khẩu: admin123';
        
        // Cập nhật gợi ý username
        document.getElementById('username-hint').innerHTML = '<i class="fas fa-info-circle"></i> <span>Đối với Admin: admin_xxx (ví dụ: admin_uit)</span>';
    } else {
        teacherOption.classList.add('active');
        adminOption.classList.remove('active');
        
        // Cập nhật tiêu đề form
        document.getElementById('form-title').textContent = 'ĐĂNG NHẬP GIẢNG VIÊN';
        document.getElementById('form-subtitle').textContent = 'Nhập thông tin tài khoản để truy cập dữ liệu giảng dạy';
        
        // Cập nhật thông tin đăng nhập mẫu
        document.getElementById('demo-credentials').textContent = 'Giảng viên: gv_nguyenvanA | Mật khẩu: teacher123';
        
        // Cập nhật gợi ý username
        document.getElementById('username-hint').innerHTML = '<i class="fas fa-info-circle"></i> <span>Đối với Giảng viên: gv_xxx (ví dụ: gv_nguyenvanA)</span>';
    }
    
    // Reset form
    document.getElementById('login-form').reset();
}

// Hàm hiển thị/ẩn mật khẩu
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}

// Hàm hiển thị modal thông báo
function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('notification-modal').style.display = 'flex';
}

// Hàm đóng modal
function closeModal() {
    document.getElementById('notification-modal').style.display = 'none';
}

// Hàm xử lý đăng nhập
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
        showModal('Lỗi đăng nhập', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
        return;
    }
    
    // Mô phỏng kiểm tra thông tin đăng nhập
    let isValid = false;
    let userRole = '';
    
    // Kiểm tra thông tin đăng nhập mẫu
    if (currentUserType === 'admin') {
        if (username === 'admin_uit' && password === 'admin123') {
            isValid = true;
            userRole = 'Quản trị viên';
        } else if (username.startsWith('admin_') && password.length >= 8) {
            isValid = true;
            userRole = 'Quản trị viên';
        }
    } else {
        if (username === 'gv_nguyenvanA' && password === 'teacher123') {
            isValid = true;
            userRole = 'Giảng viên';
        } else if (username.startsWith('gv_') && password.length >= 8) {
            isValid = true;
            userRole = 'Giảng viên';
        }
    }
    
    if (isValid) {
        // Hiển thị thông báo thành công
        showModal(
            'Đăng nhập thành công', 
            `Chào mừng ${userRole} ${username} đến với hệ thống Kho dữ liệu số Khoa Đào tạo Quốc tế.\n\nBạn sẽ được chuyển hướng đến trang quản lý trong 3 giây.`
        );
        
        // Nếu chọn "Ghi nhớ đăng nhập"
        if (remember) {
            localStorage.setItem('rememberedUser', JSON.stringify({
                username: username,
                userType: currentUserType
            }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Giả lập chuyển hướng sau 3 giây
        setTimeout(() => {
            // Trong thực tế, đây sẽ là chuyển hướng đến trang quản lý
            // window.location.href = `dashboard.html?user=${username}&role=${userRole}`;
            
            // Hiện tại chỉ hiển thị thông báo
            showModal(
                'Chuyển hướng', 
                'Trong hệ thống thực, bạn sẽ được chuyển đến:\n' +
                (currentUserType === 'admin' 
                    ? '- Trang quản trị toàn bộ hệ thống\n' +
                      '- Quản lý người dùng, dữ liệu, báo cáo\n' +
                      '- Cấu hình hệ thống và phân quyền'
                    : '- Trang giảng viên\n' +
                      '- Quản lý tài liệu giảng dạy\n' +
                      '- Xem thông tin sinh viên\n' +
                      '- Tải lên và quản lý học liệu')
            );
        }, 3000);
    } else {
        // Hiển thị thông báo lỗi
        showModal(
            'Đăng nhập thất bại', 
            'Tên đăng nhập hoặc mật khẩu không đúng.\n\n' +
            (currentUserType === 'admin' 
                ? 'Vui lòng kiểm tra lại thông tin đăng nhập của Quản trị viên.'
                : 'Vui lòng kiểm tra lại thông tin đăng nhập của Giảng viên.')
        );
    }
}

// Hàm khởi tạo
function init() {
    // Thiết lập sự kiện cho form đăng nhập
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Thiết lập sự kiện cho nút quên mật khẩu
    document.querySelector('.forgot-password').addEventListener('click', function(event) {
        event.preventDefault();
        showModal(
            'Quên mật khẩu', 
            'Vui lòng liên hệ với bộ phận hỗ trợ kỹ thuật:\n\n' +
            '- Email: support@utc.edu.vn\n' +
            '- Điện thoại: (024) 3766 3214 (số máy lẻ 123)\n\n' +
            'Hoặc đến trực tiếp phòng 301, tòa nhà A3, Trường Đại học Giao thông Vận tải.'
        );
    });
    
    // Kiểm tra nếu có thông tin đăng nhập đã lưu
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const user = JSON.parse(rememberedUser);
        selectUserType(user.userType);
        document.getElementById('username').value = user.username;
        document.getElementById('remember').checked = true;
    }
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('notification-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Khởi chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', init);