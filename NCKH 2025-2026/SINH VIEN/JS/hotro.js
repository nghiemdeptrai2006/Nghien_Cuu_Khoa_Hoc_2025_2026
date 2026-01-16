/* =========================
   CẬP NHẬT THÔNG TIN CÁ NHÂN
========================= */
const updateBtn = document.querySelector(".support-card button");

updateBtn.addEventListener("click", () => {
  const card = updateBtn.closest(".support-card");
  const name = card.querySelector('input[type="text"]:not([disabled])');
  const email = card.querySelector('input[type="email"]');

  if (name.value.trim() === "") {
    alert("❌ Họ tên không được để trống");
    name.focus();
    return;
  }

  if (email.value.trim() === "") {
    alert("❌ Email không được để trống");
    email.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("❌ Email không đúng định dạng");
    email.focus();
    return;
  }

  alert("✅ Cập nhật thông tin thành công!");
});

/* =========================
   ĐỔI MẬT KHẨU
========================= */
const passwordCard = document.querySelectorAll(".support-card")[1];
const changePassBtn = passwordCard.querySelector("button");

changePassBtn.addEventListener("click", () => {
  const inputs = passwordCard.querySelectorAll("input");

  const oldPass = inputs[0].value.trim();
  const newPass = inputs[1].value.trim();
  const confirmPass = inputs[2].value.trim();

  if (!oldPass || !newPass || !confirmPass) {
    alert("❌ Vui lòng nhập đầy đủ mật khẩu");
    return;
  }

  if (newPass.length < 6) {
    alert("❌ Mật khẩu mới phải từ 6 ký tự trở lên");
    return;
  }

  if (newPass !== confirmPass) {
    alert("❌ Mật khẩu xác nhận không khớp");
    return;
  }

  alert("🔐 Đổi mật khẩu thành công!");
});

/* =========================
   GỬI YÊU CẦU HỖ TRỢ
========================= */
const supportCard = document.querySelectorAll(".support-card")[2];
const supportBtn = supportCard.querySelector("button");
const textarea = supportCard.querySelector("textarea");

supportBtn.addEventListener("click", () => {
  const content = textarea.value.trim();

  if (content === "") {
    alert("❌ Vui lòng nhập nội dung hỗ trợ");
    textarea.focus();
    return;
  }

  if (content.length < 10) {
    alert("❌ Nội dung phải ít nhất 10 ký tự");
    textarea.focus();
    return;
  }

  alert("📨 Yêu cầu hỗ trợ đã được gửi!");
  textarea.value = "";
});

/* =========================
   FAQ
========================= */
const faqBtn = document
  .querySelectorAll(".support-card")[3]
  .querySelector("button");

faqBtn.addEventListener("click", () => {
  alert(
    "📌 CÂU HỎI THƯỜNG GẶP\n\n" +
      "1. Kiểm tra quyền truy cập tài liệu\n" +
      "2. Đăng nhập lại hệ thống\n" +
      "3. Liên hệ bộ phận hỗ trợ nếu vẫn lỗi"
  );
});

/* =========================
   ĐĂNG XUẤT
========================= */
const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", () => {
  const ok = confirm("Bạn có chắc chắn muốn đăng xuất?");
  if (ok) {
    window.location.href = "../HTML/trangchu.html";
  }
});
