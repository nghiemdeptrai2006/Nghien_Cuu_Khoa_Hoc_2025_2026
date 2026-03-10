// URL gốc của Backend Java Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Xử lý đăng nhập
 */
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Sai tài khoản hoặc mật khẩu!');
        }

        const data = await response.json();
        
        // Lưu Token và thông tin user vào trình duyệt
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_info', JSON.stringify({
            id: data.id,
            username: data.username,
            fullName: data.fullName,
            role: data.role
        }));

        return data;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        throw error;
    }
}

/**
 * Láy token hiện tại
 */
function getToken() {
    return localStorage.getItem('jwt_token');
}

/**
 * Lấy danh sách Đề tài NCKH (có gửi kèm Token)
 */
async function fetchTopics() {
    const token = getToken();
    if (!token) {
        throw new Error('Vui lòng đăng nhập trước!');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/topics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            // Token hết hạn hoặc không hợp lệ -> Xoá đi và bắt login
            logout();
            throw new Error('Phiên đăng nhập hết hạn!');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        throw error;
    }
}

/**
 * Đăng xuất
 */
function logout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    window.location.href = "../../Dangnhap_wedIned/index.html"; 
}

/**
 * Hiển thị tên người dùng lên giao diện
 */
function displayUserInfo() {
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        // Tìm element có id là 'user-name-display' để gắn tên
        const displayEl = document.getElementById('user-name-display');
        if (displayEl) {
            displayEl.textContent = `Xin chào, ${user.fullName}`;
        }
    }
}
