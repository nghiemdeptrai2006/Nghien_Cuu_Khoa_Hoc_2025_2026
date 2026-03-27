/* ===============================
   AUTH.JS - Shared Authentication
   Kết nối với backend Spring Boot
================================ */

const API_BASE = 'http://localhost:8080/api';
console.log(">>> [STABLE] auth.js loaded from root /shared/js/");

/**
 * Đăng nhập qua backend API
 * @param {string} username - Email hoặc mã sinh viên
 * @param {string} password - Mật khẩu
 * @returns {Promise<{token, role, fullName}>}
 */
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi server: ${response.status}`);
    }

    const apiResponse = await response.json();
    const data = apiResponse.data;

    // Lưu token vào localStorage
    if (data && data.token) localStorage.setItem('token', data.token);
    if (data && data.role)  localStorage.setItem('role', data.role);
    if (data && data.fullName) localStorage.setItem('fullName', data.fullName);

    return data || apiResponse; // Return data if exists, else the whole response for cases like REQUIRES_OTP

  } catch (error) {
    // Nếu backend chưa chạy hoặc lỗi Server (DB down) → dùng chế độ demo offline để cứu cánh
    if (
      (error.name === 'TypeError' && error.message.includes('fetch')) ||
      error.message.includes('500') || 
      error.message.includes('server')
    ) {
      console.warn("Đang chuyển sang chế độ Demo do lỗi Backend:", error.message);
      return loginOfflineDemo(username, password);
    }
    throw error;
  }
}

/**
 * Chế độ demo khi backend chưa chạy
 * Xoá hàm này khi backend đã hoạt động ổn định
 */
function loginOfflineDemo(username, password) {
  const DEMO_ACCOUNTS = [
    { username: 'admin@utc.edu.vn',      password: '123456', role: 'ROLE_ADMIN',     fullName: 'Quản trị viên' },
    { username: 'giangvien@utc.edu.vn',  password: '123456', role: 'ROLE_GIANGVIEN', fullName: 'Giảng viên Demo' },
    { username: 'gv01',                  password: '123456', role: 'ROLE_GIANGVIEN', fullName: 'Giảng viên gv01' },
    { username: 'SV01',                  password: '123456', role: 'ROLE_SINHVIEN',  fullName: 'Sinh viên Demo' },
  ];

  // Thêm tài khoản sinh viên thật từ DB mẫu
  const studentAccounts = [
    'sv241224484','sv241224485','sv241224486','sv241224487','sv241224488',
  ];
  studentAccounts.forEach(sv => {
    DEMO_ACCOUNTS.push({ username: sv, password: '123456', role: 'ROLE_SINHVIEN', fullName: 'Sinh viên ' + sv });
  });

  const account = DEMO_ACCOUNTS.find(
    acc => acc.username.toLowerCase() === username.toLowerCase() && acc.password === password
  );

  if (!account) {
    throw new Error(
      'Backend chưa khởi động và tài khoản không có trong danh sách demo.\n' +
      'Vui lòng dùng tài khoản mẫu: SV01 | 123456\n' +
      'Hoặc khởi động backend tại localhost:8080'
    );
  }

  // Kiểm tra nếu là ADMIN hoặc GIẢNG VIÊN thì yêu cầu OTP (giả lập)
  if (account.role === 'ROLE_ADMIN' || account.role === 'ROLE_GIANGVIEN') {
    console.log(">>> [Demo Mode] OTP required for:", account.username);
    return {
      status: "REQUIRES_OTP",
      username: account.username,
      message: "[DEMO] Vui lòng nhập mã OTP (Bất kỳ 6 số nào cũng được trong chế độ Demo)"
    };
  }

  // Tạo fake token
  const token = 'demo_' + btoa(account.username + ':' + Date.now());
  localStorage.setItem('token', token);
  localStorage.setItem('role', account.role);
  localStorage.setItem('fullName', account.fullName);

  return { token, role: account.role, fullName: account.fullName };
}

/**
 * Lấy token hiện tại
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Kiểm tra đã đăng nhập chưa
 */
function isLoggedIn() {
  return !!getToken();
}

/**
 * Đăng xuất
 */
function logout() {
  localStorage.clear(); 
  // Root-relative path to ensures it works from any subdirectory
  window.location.href = window.location.origin + "/frontend/auth/index.html";
}

/**
 * Fetch có kèm Authorization header
 */
async function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...(options.headers || {})
    }
  });
}
