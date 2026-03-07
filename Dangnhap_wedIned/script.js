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

  if (userType === "admin") {
    title.textContent = "ĐĂNG NHẬP QUẢN TRỊ VIÊN";
    subtitle.textContent = "Quản lý toàn bộ hệ thống";
    demo.textContent = "admin | 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>admin</b>";
  }

  if (userType === "teacher") {
    title.textContent = "ĐĂNG NHẬP GIẢNG VIÊN";
    subtitle.textContent = "Quản lý tài liệu giảng dạy";
    demo.textContent = "GV01 | 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>GV01</b>";
  }

  if (userType === "student") {
    title.textContent = "ĐĂNG NHẬP SINH VIÊN";
    subtitle.textContent = "Truy cập kho dữ liệu số";
    demo.textContent = "SV01 | 123456";
    hint.innerHTML = "Tài khoản mẫu: <b>SV01</b>";
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
   XỬ LÝ ĐĂNG NHẬP
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
   KHỞI TẠO
================================ */
function init() {
  document.getElementById("login-form").addEventListener("submit", handleLogin);

  document.querySelector(".forgot-password")?.addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      "Quên mật khẩu",
      "Email: support@utc.edu.vn\nĐiện thoại: 024 3766 3214"
    );
  });

  const saved = localStorage.getItem("rememberedUser");
  if (saved) {
    const user = JSON.parse(saved);
    selectUserType(user.role);
    document.getElementById("username").value = user.username;
    document.getElementById("remember").checked = true;
  }

  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("notification-modal")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
