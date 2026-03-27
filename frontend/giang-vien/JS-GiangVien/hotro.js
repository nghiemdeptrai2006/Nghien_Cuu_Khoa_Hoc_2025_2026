document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra trạng thái Đăng nhập bằng Token
    const token = typeof getToken === 'function' ? getToken() : null;
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập Cổng Giảng Viên!");
        window.location.href = "../../auth/index.html"; 
        return;
    }

    // 2. Tải và hiển thị thông tin thực tế từ Backend
    loadUserProfile();

    // 3. Xử lý sự kiện Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
        });
    }

    // 4. Lắng nghe sự kiện click các nút Submit
    setupEventHandlers();
});

async function loadUserProfile() {
    try {
        const response = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            const user = result.data;
            
            // Cập nhật Header
            const userNameDisplay = document.querySelector('.user-profile-menu span');
            if (userNameDisplay) {
                userNameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${user.fullName}`;
            }

            // Cập nhật Form Thông tin cá nhân
            const nameInput = document.querySelector('.section-account input[type="text"]');
            const emailInput = document.querySelector('.section-account input[type="email"]');
            if (nameInput) nameInput.value = user.fullName;
            if (emailInput) emailInput.value = user.email || (user.username + "@edu.vn");
        }
    } catch (error) {
        console.error("Lỗi tải profile:", error);
    }
}

function setupEventHandlers() {
    // Gửi Yêu cầu hỗ trợ
    const btnSubmitHelp = document.querySelector('.btn-submit-help');
    if (btnSubmitHelp) {
        btnSubmitHelp.addEventListener('click', async () => {
            const subject = document.querySelector('.form-select').value;
            const details = document.querySelector('textarea').value;

            if (!details.trim()) {
                alert("Vui lòng nhập mô tả chi tiết vấn đề!");
                return;
            }

            try {
                const response = await fetch('/api/support/requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ subject, details })
                });
                
                if (response.ok) {
                    alert("Yêu cầu của bạn đã được gửi thành công!");
                    document.querySelector('textarea').value = "";
                } else {
                    alert("Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
                }
            } catch (error) {
                alert("Có lỗi xảy ra khi gửi yêu cầu.");
            }
        });
    }

    // Cập nhật Hồ sơ
    const btnUpdateProfile = document.querySelector('.btn-submit-main');
    if (btnUpdateProfile) {
        btnUpdateProfile.addEventListener('click', async () => {
            const fullName = document.querySelector('.section-account input[type="text"]').value;
            
            try {
                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ fullName })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert("Cập nhật thông tin thành công!");
                    loadUserProfile();
                }
            } catch (error) {
                alert("Lỗi cập nhật hồ sơ.");
            }
        });
    }

    // Đổi mật khẩu
    const btnChangePassword = document.querySelector('.btn-submit-secondary');
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', async () => {
            const inputs = document.querySelectorAll('.section-security input');
            const currentPassword = inputs[0].value;
            const newPassword = inputs[1].value;
            const confirmPassword = inputs[2].value;

            if (newPassword !== confirmPassword) {
                alert("Mật khẩu mới không khớp!");
                return;
            }

            try {
                const response = await fetch('/api/users/change-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });
                
                if (response.ok) {
                    alert("Đổi mật khẩu thành công!");
                    inputs.forEach(i => i.value = "");
                } else {
                    const error = await response.text();
                    alert(error || "Đổi mật khẩu thất bại.");
                }
            } catch (error) {
                alert("Lỗi đổi mật khẩu.");
            }
        });
    }
}


