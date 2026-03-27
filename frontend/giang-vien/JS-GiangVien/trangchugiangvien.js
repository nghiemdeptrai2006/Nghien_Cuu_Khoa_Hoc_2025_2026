document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra trạng thái Đăng nhập bằng Token
    const token = typeof getToken === 'function' ? getToken() : null;
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập Cổng Giảng Viên!");
        window.location.href = "../../auth/index.html"; 
        return;
    }

    // 2. Tải và hiển thị thông tin Giảng viên từ LocalStorage
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        
        // Cập nhật tên trên Header (Góc phải trên cùng)
        const userNameDisplay = document.querySelector('.user-profile-menu span');
        if (userNameDisplay) {
            userNameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${user.fullName}`;
        }

        // Cập nhật thẻ Banner chào mừng (Dành riêng cho Trang chủ)
        const welcomeTitle = document.querySelector('.hero h2');
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `Xin chào, <span class="gradient-text">${user.fullName} 👋</span>`;
        }
    }

    // 3. Xử lý sự kiện Mobile Menu (Header Menu Toggle)
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
        });
    }

    // 4. Xử lý Đăng xuất (Dùng class .logout-link)
    const logoutBtns = document.querySelectorAll('.logout-link');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logout === 'function') {
                logout();
            } else {
                console.warn('Global logout() not found, using fallback.');
                localStorage.clear();
                window.location.href = "../../auth/index.html";
            }
        });
    });
});
