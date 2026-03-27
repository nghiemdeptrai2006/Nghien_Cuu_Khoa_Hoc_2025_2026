/* ===============================
   CẤU HÌNH CHUNG
================================ */
let currentUserType = "student";

const ROUTES = {
  admin: "../admin/HTML/trangchu.html",
  teacher: "../giang-vien/HTML-GiangVien/trangchu.html",
  student: "../sinh-vien/HTML/trangchu.html", // Updated from giaotrinh.html to trangchu.html as per latest view
};

/* ===============================
   CHỌN LOẠI NGƯỜI DÙNG
================================ */
function selectUserType(userType) {
  currentUserType = userType;
  document.querySelectorAll(".option-card").forEach((el) => el.classList.remove("active"));
  document.getElementById(`${userType}-option`).classList.add("active");

  const title = document.getElementById("form-title");
  const subtitle = document.getElementById("form-subtitle");
  const demo = document.getElementById("demo-credentials");
  const hint = document.getElementById("username-hint");
  const usernameLabel = document.getElementById("username-label");
  const usernameInput = document.getElementById("username");
  const adminCodeGroup = document.getElementById("admin-code-group");
  const adminCodeInput = document.getElementById("admin-code");

  if (userType === "admin") {
    title.textContent = "ĐĂNG NHẬP QUẢN TRỊ VIÊN";
    subtitle.textContent = "Hệ thống bảo mật cấp 2";
    demo.textContent = "Tài khoản: admin@utc.edu.vn | Mật khẩu: Admin123";
    hint.innerHTML = "Tài khoản mẫu: <b>admin@utc.edu.vn</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-envelope"></i> Email Quản trị viên';
    if (usernameInput) { usernameInput.placeholder = "Ví dụ: admin@utc.edu.vn"; usernameInput.type = "text"; }
    // admin-code đã được chuyển thành OTP qua email, không dùng nữa
    if (adminCodeGroup) adminCodeGroup.style.display = "none"; 
    if (adminCodeInput) adminCodeInput.required = false;
  }
  if (userType === "teacher") {
    title.textContent = "ĐĂNG NHẬP GIẢNG VIÊN";
    subtitle.textContent = "Quản lý tài liệu giảng dạy";
    demo.textContent = "Tài khoản: GV01 | Mật khẩu: 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>GV01</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-chalkboard-teacher"></i> Tài khoản Giảng viên';
    if (usernameInput) { usernameInput.placeholder = "Nhập mã giảng viên"; usernameInput.type = "text"; }
    if (adminCodeGroup) adminCodeGroup.style.display = "none";
    if (adminCodeInput) adminCodeInput.required = false;
  }
  if (userType === "student") {
    title.textContent = "ĐĂNG NHẬP SINH VIÊN";
    subtitle.textContent = "Truy cập kho dữ liệu số";
    demo.textContent = "SV01 | 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>SV01</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-user"></i> Mã sinh viên';
    if (usernameInput) { usernameInput.placeholder = "Nhập mã sinh viên"; usernameInput.type = "text"; }
    if (adminCodeGroup) adminCodeGroup.style.display = "none";
    if (adminCodeInput) adminCodeInput.required = false;
  }
  document.getElementById("login-form").reset();
}

/* ===============================
   HIỆN / ẨN MẬT KHẨU
================================ */
function togglePasswordVisibility() {
  const password = document.getElementById("password");
  const icon = document.querySelector(".toggle-password i");
  if (password.type === "password") {
    password.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    password.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

/* ===============================
   MODAL
================================ */
function showModal(title, message) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("notification-modal").style.display = "flex";
}
function closeModal() {
  document.getElementById("notification-modal").style.display = "none";
}

/* ===============================
   ĐĂNG NHẬP EXTERNAL
================================ */
function loginWithOffice365() {
  showModal("Đăng nhập Office 365", "Tính năng đang được phát triển.");
}

/* -----------------------------------------------
   OTP CONFIGURATION (Backend-Driven)
----------------------------------------------- */
let pendingGooglePayload = null;
let pendingLoginData = null;

function openOtpModal(username) {
  console.log(">>> Opening OTP Modal for:", username);
  document.getElementById('otp-target-email').textContent = username;
  document.getElementById('otp-input').value = '';
  document.getElementById('otp-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('otp-input').focus(), 100);
}

function closeOtpModal() {
  document.getElementById('otp-modal').style.display = 'none';
  pendingLoginData = null;
  pendingGooglePayload = null;
}

async function verifyOtp() {
  const inputCode = document.getElementById('otp-input').value.trim();
  if (!inputCode || inputCode.length !== 6) { 
    showModal('Lỗi', 'Vui lòng nhập đúng mã 6 chữ số.'); 
    return; 
  }

  const username = pendingLoginData ? pendingLoginData.username : (pendingGooglePayload ? pendingGooglePayload.email : null);

  if (!username) {
    showModal('Lỗi', 'Không tìm thấy thông tin tài khoản đang xác thực.');
    closeOtpModal();
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, otp: inputCode })
    });

    if (response.ok) {
      const apiResponse = (await response.json()).data;
      const data = apiResponse.data;
      saveLoginData(data.token, data.role, data.username, data.fullName);
      closeOtpModal();
      redirectAfterLogin(data.role);
    } else {
      const err = await response.text();
      showModal("Lỗi xác thực", err || "Mã OTP không chính xác hoặc đã hết hạn.");
    }
  } catch (error) {
    showModal("Lỗi kết nối", "Không thể xác thực OTP. Vui lòng thử lại sau.");
  }
}

function resendOtp(e) {
  e.preventDefault();
  showModal("Thông báo", "Mã mới đang được gửi lại. Vui lòng kiểm tra email.");
}

/* ===============================
   GOOGLE LOGIN
================================ */
async function handleGoogleCredentialResponse(googleResponse) {
  try {
    const responsePayload = decodeJwtResponse(googleResponse.credential);
    console.log(">>> Google ID Token Payload:", responsePayload);

    const res = await fetch("http://localhost:8080/api/auth/google", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: responsePayload.email,
        name: responsePayload.name,
        userType: currentUserType
      })
    });

    if (res.ok) {
      const data = (await res.json()).data;
      console.log(">>> Google login response data:", data);

      /* OTP disabled
      if (data.status === 'REQUIRES_OTP') {
        console.log(">>> OTP required for Google user:", responsePayload.email);
        pendingGooglePayload = responsePayload;
        openOtpModal(responsePayload.email);
        return;
      }
      */

      saveLoginData(data.token, data.role, responsePayload.email, responsePayload.name);
      redirectAfterLogin(data.role);
    } else {
      handleGoogleOffline(responsePayload);
    }
  } catch (error) {
    console.error("Google login error:", error);
    handleGoogleOffline({});
  }
}

function saveLoginData(token, role, username, fullName) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('username', username);
  localStorage.setItem('fullName', fullName);
}

function redirectAfterLogin(role) {
  const roleRouteMap = {
    'ROLE_ADMIN': ROUTES.admin,
    'ROLE_GIANGVIEN': ROUTES.teacher,
    'ROLE_SINHVIEN': ROUTES.student
  };
  const redirectUrl = roleRouteMap[role] || ROUTES[currentUserType] || ROUTES.student;
  showModal("Đăng nhập thành công", "Chuyển hướng sau 1 giây...");
  setTimeout(() => { window.location.href = redirectUrl; }, 1000);
}

function handleGoogleOffline(payload) {
  let role = 'ROLE_SINHVIEN';
  if (currentUserType === 'teacher') role = 'ROLE_GIANGVIEN';
  else if (currentUserType === 'admin') role = 'ROLE_ADMIN';
  
  /* OTP disabled
  if (role === 'ROLE_ADMIN' || role === 'ROLE_GIANGVIEN') {
    console.log(">>> [Demo Mode Google] OTP required for:", payload.email);
    pendingGooglePayload = payload;
    openOtpModal(payload.email || "demo@gmail.com");
    return;
  }
  */

  const token = 'demo_google_' + btoa(payload.email || "demo");
  saveLoginData(token, role, payload.email, payload.name);
  redirectAfterLogin(role);
}

function decodeJwtResponse(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

/* ===============================
   XỬ LÝ ĐĂNG NHẬP THƯỜNG
================================ */
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  if (!username || !password) {
    showModal("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu");
    return;
  }

  if (remember) {
    localStorage.setItem("savedUserType", currentUserType);
    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password);
  } else {
    localStorage.removeItem("savedUserType");
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedPassword");
  }

  try {
    const data = await login(username, password);
    
    console.log(">>> Login response data:", data);

    /* OTP disabled
    if (data.status === "REQUIRES_OTP") {
      console.log(">>> OTP required for user:", username);
      alert("Hệ thống yêu cầu xác thực OTP! Đang mở khung nhập mã...");
      pendingLoginData = { ...data, username };
      openOtpModal(username);
      return;
    }
    */

    saveLoginData(data.token, data.role, username, data.fullName);
    redirectAfterLogin(data.role);
  } catch (error) {
    showModal("Đăng nhập thất bại", error.message || "Tài khoản hoặc mật khẩu không chính xác.");
  }
}

/* ===============================
   QUÊN MẬT KHẨU
================================ */
function openForgotPasswordModal() {
  document.getElementById("recovery-email").value = "";
  document.getElementById("forgot-password-modal").style.display = "flex";
}
function closeForgotPasswordModal() {
  document.getElementById("forgot-password-modal").style.display = "none";
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}
function sendRecoveryEmail() {
  const email = document.getElementById("recovery-email").value.trim();
  if (!email) { showModal("Lỗi", "Vui lòng nhập email của bạn."); return; }
  if (!validateEmail(email)) { showModal("Lỗi", "Vui lòng nhập đúng định dạng email."); return; }
  closeForgotPasswordModal();
  showModal("Thành công", "Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.");
}

/* ===============================
   THỐNG KÊ
================================ */
function fetchStatistics() {
  fetch("http://localhost:8080/api/public/stats")
    .then((r) => r.json())
    .then((data) => {
      animateValue("doc-count", 0, data.documentCount, 1500, "+");
      animateValue("student-count", 0, data.studentCount, 1500, "+");
      animateValue("teacher-count", 0, data.teacherCount, 1500, "+");
    })
    .catch(() => {
      document.getElementById("doc-count").textContent = "500+";
      document.getElementById("student-count").textContent = "1,200+";
      document.getElementById("teacher-count").textContent = "50+";
    });
}

function animateValue(id, start, end, duration, suffix) {
  suffix = suffix || "";
  let obj = document.getElementById(id);
  if (!obj) return;
  if (start === end) { obj.textContent = end + suffix; return; }
  let range = end - start, current = start;
  let increment = Math.max(1, Math.floor(range / (duration / 50)));
  let stepTime = Math.max(20, Math.abs(Math.floor(duration / range)));
  let timer = setInterval(function() {
    current += increment;
    if (current >= end) { current = end; clearInterval(timer); }
    obj.innerHTML = current.toLocaleString('vi-VN') + suffix;
  }, stepTime);
}

/* ===============================
   KHỞI TẠO
================================ */
function init() {
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
  document.querySelector(".forgot-password")?.addEventListener("click", (e) => {
    e.preventDefault(); openForgotPasswordModal();
  });

  const savedUserType = localStorage.getItem("savedUserType");
  selectUserType(savedUserType || currentUserType);

  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");
  if (savedUsername && savedPassword) {
    const uField = document.getElementById("username");
    const pField = document.getElementById("password");
    const rField = document.getElementById("remember");
    if (uField) uField.value = savedUsername;
    if (pField) pField.value = savedPassword;
    if (rField) rField.checked = true;
  }

  fetchStatistics();

  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("notification-modal")) closeModal();
    if (e.target === document.getElementById("forgot-password-modal")) closeForgotPasswordModal();
    if (e.target === document.getElementById("otp-modal")) closeOtpModal();
  });
}

document.addEventListener("DOMContentLoaded", init);


