document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('toggle-btn');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // ==========================================
    // MODULE XÁC THỰC VÀ HIỂN THỊ DỮ LIỆU TỪ API
    // ==========================================
    const token = getToken();
    if (!token) {
        // Chưa đăng nhập, ném về trang ngoài cùng
        alert("Bạn cần đăng nhập để truy cập trang Quản trị!");
        window.location.href = "../../Dangnhap_wedIned/index.html"; 
    } else {
        // Đã đăng nhập, hiển thị tên
        displayUserInfo();

        // Load dữ liệu bảng điều khiển từ Backend
        loadDashboardData();
    }

    // Xử lý nút Đăng xuất
    const logoutBtn = document.querySelector('.sidebar-footer a');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    async function loadDashboardData() {
        try {
            const topics = await fetchTopics();
            console.log("Danh sách đề tài load từ API:", topics);
            
            // Tìm và sửa số lượng hiển thị trên thẻ (ví dụ thẻ Đầu tiên chứa số 1254)
            const topicCountEl = document.querySelector('.stat-card.primary h3');
            if (topicCountEl) {
                topicCountEl.textContent = topics.length; // Thay số ảo bằng số lượng từ Database
            }

            // TODO: Call fetchArticles() tương tự để sửa con số Bài báo
            
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    }

    // Optional: Auto collapse on smaller screens
    const checkScreenSize = () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    };

    // ==========================================
    // MODULE TOPNAV DROPDOWN (THÔNG BÁO & PROFILE)
    // ==========================================
    const notifBtn = document.querySelector('.notifications');
    const profileBtn = document.querySelector('.user-profile');

    if(notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifBtn.classList.toggle('active');
            if(profileBtn) profileBtn.classList.remove('active');
        });
    }

    if(profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileBtn.classList.toggle('active');
            if(notifBtn) notifBtn.classList.remove('active');
        });
    }

    // Đóng dropdown khi click ra ngoài
    window.addEventListener('click', (e) => {
        if(notifBtn && notifBtn.classList.contains('active')) {
            notifBtn.classList.remove('active');
        }
        if(profileBtn && profileBtn.classList.contains('active')) {
            profileBtn.classList.remove('active');
        }
    });
    
    // Ngăn chặn đóng dropdown khi click chuột vào trong các popup
    const notifDropdown = document.querySelector('.notif-dropdown');
    const profileDropdown = document.querySelector('.profile-dropdown');
    if(notifDropdown) notifDropdown.addEventListener('click', e => e.stopPropagation());
    if(profileDropdown) profileDropdown.addEventListener('click', e => e.stopPropagation());



    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check
});
