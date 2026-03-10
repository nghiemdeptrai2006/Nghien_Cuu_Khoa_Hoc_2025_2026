/* ===============================
   CẤU HÌNH CHUNG
================================ */
let currentUserType = "student"; // mặc định Sinh viên

// ROUTE ĐÚNG THEO CÂY THƯ MỤC CỦA BẠN
const ROUTES = {
  admin: "../ADMIN/HTML/trangchu.html",
  teacher: "../GIANG VIEN/HTML-GiangVien/trangchu.html",
  student: "../SINH VIEN/HTML/giaotrinh.html",
};

/* ===============================
   CHỌN LOẠI NGƯỜI DÙNG
================================ */
function selectUserType(userType) {
  currentUserType = userType;

  document.querySelectorAll(".option-card").forEach((el) => {
    el.classList.remove("active");
  });
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
    demo.textContent = "Email: admin@utc.edu.vn | Mật khẩu: 123456 | Code: 9999";
    hint.innerHTML = "Tài khoản mẫu: <b>admin@utc.edu.vn</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-envelope"></i> Email Quản trị viên';
    if (usernameInput) {
      usernameInput.placeholder = "Ví dụ: admin@utc.edu.vn";
      usernameInput.type = "email";
    }
    if (adminCodeGroup) adminCodeGroup.style.display = "block";
    if (adminCodeInput) adminCodeInput.required = true;
  }

  if (userType === "teacher") {
    title.textContent = "ĐĂNG NHẬP GIẢNG VIÊN";
    subtitle.textContent = "Quản lý tài liệu giảng dạy";
    demo.textContent = "Email: giangvien@utc.edu.vn | Mật khẩu: 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>giangvien@utc.edu.vn</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-envelope"></i> Email Giảng viên';
    if (usernameInput) {
      usernameInput.placeholder = "Ví dụ: giangvien@utc.edu.vn";
      usernameInput.type = "email";
    }
    if (adminCodeGroup) adminCodeGroup.style.display = "none";
    if (adminCodeInput) adminCodeInput.required = false;
  }

  if (userType === "student") {
    title.textContent = "ĐĂNG NHẬP SINH VIÊN";
    subtitle.textContent = "Truy cập kho dữ liệu số";
    demo.textContent = "SV01 | 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>SV01</b>";
    if (usernameLabel) usernameLabel.innerHTML = '<i class="fas fa-user"></i> Mã sinh viên';
    if (usernameInput) {
      usernameInput.placeholder = "Nhập mã sinh viên";
      usernameInput.type = "text";
    }
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
  showModal("Đăng nhập Office 365", "Tính năng đang được phát triển. Đang kết nối đến hệ thống Microsoft...");
}

function handleGoogleCredentialResponse(response) {
  // Decode JWT token from Google
  const responsePayload = decodeJwtResponse(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  // In a real application, you would send this token to your backend
  // For the MVP, we will simulate a successful login and redirect
  showModal("Thành công", `Đăng nhập Google thành công với email: ${responsePayload.email}`);
  
  // Fake login as student for demonstration
  setTimeout(() => {
    localStorage.setItem('token', 'fake-google-token');
    localStorage.setItem('role', 'STUDENT'); // Or determine based on email domain
    localStorage.setItem('username', responsePayload.email);
    window.location.href = '../SINH VIEN/HTML/trangchu.html';
  }, 2000);
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
   XỬ LÝ ĐĂNG NHẬP
================================ */
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;
  const adminCode = document.getElementById("admin-code").value.trim();

  // Validate admin
  if (currentUserType === "admin") {
    if (!username || !password) {
      showModal("Lỗi", "Vui lòng nhập đầy đủ Email và mật khẩu");
      return;
    }
    if (!validateEmail(username)) {
      showModal("Lỗi", "Vui lòng nhập định dạng Email quản trị viên hợp lệ");
      return;
    }
    if (!adminCode) {
      showModal("Lỗi bảo mật", "Vui lòng nhập Mã Code Quản Trị Hệ Thống.");
      return;
    }
    // Hardcode an admin code check just for demo/MVP
    if (adminCode !== "9999" && adminCode !== "admin123") {
      showModal("Lỗi bảo mật", "Thất bại! Mã Code Quản Trị Hệ Thống không hợp lệ.");
      return;
    }
  } else if (currentUserType === "teacher") {
    if (!username || !password) {
      showModal("Lỗi", "Vui lòng nhập đầy đủ Email và mật khẩu");
      return;
    }
    if (!validateEmail(username)) {
      showModal("Lỗi", "Vui lòng nhập định dạng Email giảng viên hợp lệ");
      return;
    }
  } else {
    if (!username || !password) {
      showModal("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }
  }

  // Handle Remember Me
  if (remember) {
    localStorage.setItem("savedUserType", currentUserType);
    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password); // Simple save for MVP
  } else {
    localStorage.removeItem("savedUserType");
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedPassword");
  }

  try {
    // Sử dụng hàm login() từ file shared/js/auth.js
    const data = await login(username, password);
    
    let redirectUrl = "";
    
    // Kiểm tra Role từ Backend gửi về
    switch(data.role) {
      case "ROLE_ADMIN":
        redirectUrl = ROUTES.admin;
        break;
      case "ROLE_GIANGVIEN":
        redirectUrl = ROUTES.teacher;
        break;
      case "ROLE_SINHVIEN":
        redirectUrl = ROUTES.student;
        break;
      default:
        throw new Error("Không xác định được quyền hạn của tài khoản.");
    }

    // Lưu tuỳ chọn Ghi nhớ (nếu cần cho form sau này)
    if (remember) {
      localStorage.setItem("rememberedUser", JSON.stringify({ username, role: currentUserType }));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    // Hiển thị loading...
    showModal("Đăng nhập thành công", `Xin chào ${data.fullName}! Đang chuyển hướng...`);

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);

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
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function sendRecoveryEmail() {
  const email = document.getElementById("recovery-email").value.trim();
  
  if (!email) {
    showModal("Lỗi", "Vui lòng nhập địa chỉ email của bạn.");
    return;
  }

  if (!validateEmail(email)) {
    showModal("Lỗi", "Vui lòng nhập định dạng email hợp lệ.");
    return;
  }

  // Đóng modal quên mật khẩu
  closeForgotPasswordModal();
  
  // Hiển thị thông báo đang gửi (giả lập Backend)
  showModal("Đang xử lý", `Đang gửi email khôi phục đến ${email}...`);
  
  // Giả lập sau 2 giây gửi thành công
  setTimeout(() => {
    showModal(
      "Thành công",
      `Mật khẩu mới đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư đến hoặc mục thư rác.`
    );
  }, 2000);
}

// Fetch Statistics From Backend
function fetchStatistics() {
  // Use setTimeout or real fetch based on whether backend is actually running.
  // We will call the real API here.
  fetch("http://localhost:8080/api/public/stats")
    .then((response) => response.json())
    .then((data) => {
      animateValue("doc-count", 0, data.documentCount, 1500, "+");
      animateValue("student-count", 0, data.studentCount, 1500, "+");
      animateValue("teacher-count", 0, data.teacherCount, 1500, "+");
    })
    .catch((error) => {
      console.error("Lỗi khi tải thống kê:", error);
      // Fallback
      document.getElementById("doc-count").textContent = "500+";
      document.getElementById("student-count").textContent = "1,200+";
      document.getElementById("teacher-count").textContent = "50+";
    });
}

function animateValue(id, start, end, duration, suffix = "") {
  if (start === end) {
    document.getElementById(id).textContent = end + suffix;
    return;
  }
  let obj = document.getElementById(id);
  let range = end - start;
  let current = start;
  let increment = end > start ? Math.max(1, Math.floor(range / (duration / 50))) : -1;
  let stepTime = Math.abs(Math.floor(duration / range)) || 50;
  
  if (stepTime < 20) stepTime = 20;

  let timer = setInterval(function() {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    // Format number with commas
    obj.innerHTML = current.toLocaleString('vi-VN') + suffix;
  }, stepTime);
}

/* ===============================
   KHỞI TẠO
================================ */
function init() {
  document.getElementById("login-form").addEventListener("submit", handleLogin);

  document.querySelector(".forgot-password")?.addEventListener("click", (e) => {
    e.preventDefault();
    openForgotPasswordModal();
  });

  // Load saved credentials if any
  const savedUserType = localStorage.getItem("savedUserType");
  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");

  if (savedUserType) {
    selectUserType(savedUserType); // Use existing selectUserType to update UI
  } else {
    selectUserType(currentUserType); // Initialize with default or current
  }

  if (savedUsername && savedPassword) {
    document.getElementById("username").value = savedUsername;
    document.getElementById("password").value = savedPassword;
    document.getElementById("remember").checked = true;
  }

  // Fetch statistics
  fetchStatistics();

  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("notification-modal")) {
      closeModal();
    }
    if (e.target === document.getElementById("forgot-password-modal")) {
      closeForgotPasswordModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
