/* ===============================
   CẤU HÌNH CHUNG
================================ */
let currentUserType = "student"; // mặc định Sinh viên

// ROUTE ĐÚNG THEO CÂY THƯ MỤC CỦA BẠN
const ROUTES = {
  admin: "../Admin/html-admin/index.html",
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
    demo.textContent = "admin_uit | admin123";
    hint.innerHTML = "Tài khoản dạng <b>admin_xxx</b>";
  }

  if (userType === "teacher") {
    title.textContent = "ĐĂNG NHẬP GIẢNG VIÊN";
    subtitle.textContent = "Quản lý tài liệu giảng dạy";
    demo.textContent = "gv_nguyenvana | teacher123";
    hint.innerHTML = "Tài khoản dạng <b>gv_xxx</b>";
  }

  if (userType === "student") {
    title.textContent = "ĐĂNG NHẬP SINH VIÊN";
    subtitle.textContent = "Truy cập kho dữ liệu số";
    demo.textContent = "sv20231234 | sv123456";
    hint.innerHTML = "Tài khoản dạng <b>sv_xxx</b>";
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
function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  if (!username || !password) {
    showModal("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu");
    return;
  }

  let isValid = false;
  let redirectUrl = "";

  // ===== ADMIN =====
  if (
    currentUserType === "admin" &&
    username.startsWith("admin_") &&
    password.length >= 8
  ) {
    isValid = true;
    redirectUrl = ROUTES.admin;
  }

  // ===== GIẢNG VIÊN =====
  if (
    currentUserType === "teacher" &&
    username.startsWith("gv_") &&
    password.length >= 8
  ) {
    isValid = true;
    redirectUrl = ROUTES.teacher;
  }

  // ===== SINH VIÊN =====
  if (
    currentUserType === "student" &&
    username.startsWith("sv") &&
    password.length >= 6
  ) {
    isValid = true;
    redirectUrl = ROUTES.student;
  }

  if (!isValid) {
    showModal(
      "Đăng nhập thất bại",
      "Sai tài khoản hoặc mật khẩu.\nVui lòng kiểm tra lại."
    );
    return;
  }

  // Lưu đăng nhập
  if (remember) {
    localStorage.setItem(
      "rememberedUser",
      JSON.stringify({ username, role: currentUserType })
    );
  } else {
    localStorage.removeItem("rememberedUser");
  }

  showModal("Đăng nhập thành công", "Đang chuyển hướng...");

  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 2000);
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
