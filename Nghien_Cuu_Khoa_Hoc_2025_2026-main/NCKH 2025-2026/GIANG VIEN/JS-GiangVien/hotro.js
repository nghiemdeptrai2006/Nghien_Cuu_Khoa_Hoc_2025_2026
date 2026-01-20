// ================= HOTRO.JS =================
// Chỉ xử lý logic cho trang Hỗ trợ giảng viên

document.addEventListener("DOMContentLoaded", function () {
  xuLyCapNhatThongTin();
  xuLyDoiMatKhau();
  xuLyHoTroKyThuat();
});

// ================= CẬP NHẬT THÔNG TIN =================
function xuLyCapNhatThongTin() {
  const btnCapNhat = document.querySelector(
    ".doc-card:nth-of-type(1) .doc-actions a"
  );

  btnCapNhat.addEventListener("click", function (e) {
    e.preventDefault();

    const hoTen = document.querySelector(
      ".doc-card:nth-of-type(1) input[type='text']"
    ).value;

    const email = document.querySelector(
      ".doc-card:nth-of-type(1) input[type='email']"
    ).value;

    const sdt = document.querySelector(
      ".doc-card:nth-of-type(1) input[type='text']:nth-of-type(2)"
    ).value;

    if (!hoTen || !email || !sdt) {
      alert("Vui lòng nhập đầy đủ thông tin cá nhân.");
      return;
    }

    alert("Cập nhật thông tin cá nhân thành công!");
    // Sau này có thể gọi fetch() để gửi lên server
  });
}

// ================= ĐỔI MẬT KHẨU =================
function xuLyDoiMatKhau() {
  const btnDoiMK = document.querySelector(
    ".doc-card:nth-of-type(2) .doc-actions a"
  );

  btnDoiMK.addEventListener("click", function (e) {
    e.preventDefault();

    const mkCu = document.querySelector(
      ".doc-card:nth-of-type(2) input:nth-of-type(1)"
    ).value;

    const mkMoi = document.querySelector(
      ".doc-card:nth-of-type(2) input:nth-of-type(2)"
    ).value;

    const xacNhan = document.querySelector(
      ".doc-card:nth-of-type(2) input:nth-of-type(3)"
    ).value;

    if (!mkCu || !mkMoi || !xacNhan) {
      alert("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (mkMoi !== xacNhan) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (mkMoi.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    alert("Đổi mật khẩu thành công!");
  });
}

// ================= HỖ TRỢ KỸ THUẬT =================
function xuLyHoTroKyThuat() {
  const btnGui = document.querySelector(
    ".doc-card:nth-of-type(3) .doc-actions a"
  );

  btnGui.addEventListener("click", function (e) {
    e.preventDefault();

    const noiDung = document.querySelector(
      ".doc-card:nth-of-type(3) textarea"
    ).value;

    if (!noiDung.trim()) {
      alert("Vui lòng nhập nội dung cần hỗ trợ.");
      return;
    }

    alert("Yêu cầu hỗ trợ đã được gửi!");
    document.querySelector(
      ".doc-card:nth-of-type(3) textarea"
    ).value = "";
  });
}
