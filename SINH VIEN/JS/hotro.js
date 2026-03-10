/* =========================
   HỖ TRỢ JS & TÍCH HỢP BACKEND
========================= */

const API_BASE_URL = 'http://localhost:8080/api';

// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  // Lấy dữ liệu user
  fetchUserProfile();
});

// Hàm lấy thông tin User từ backend
function fetchUserProfile() {
  const token = localStorage.getItem('jwt_token');
  if (!token) return;

  fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("Không thể lấy thông tin user.");
    return response.json();
  })
  .then(data => {
    // Cập nhật lên UI
    const nameInput = document.querySelector('.support-card input[type="text"]:not([disabled])');
    const idInput = document.querySelector('.support-card input[disabled]');
    const emailInput = document.querySelector('.support-card input[type="email"]');

    if(nameInput) nameInput.value = data.fullName || '';
    if(idInput) idInput.value = data.username || '';
    if(emailInput) emailInput.value = data.email || '';
  })
  .catch(err => console.error(err));
}

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

  const token = localStorage.getItem('jwt_token');
  if(!token) return;

  fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fullName: name.value.trim(),
      email: email.value.trim()
    })
  })
  .then(response => {
    if(!response.ok) throw new Error("Cập nhật thất bại!");
    alert("✅ Cập nhật thông tin thành công!");
    
    // Cập nhật lại tên trên LocalStorage & Header
    const userStr = localStorage.getItem('user_info');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      userObj.fullName = name.value.trim();
      localStorage.setItem('user_info', JSON.stringify(userObj));
      // Reload page để hiển thị tên mới nếu cần, hoặc tự update DOM (nếu có header)
    }
  })
  .catch(err => {
    alert("❌ Lỗi mạng hoặc server!");
    console.error(err);
  });
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

  const token = localStorage.getItem('jwt_token');
  
  fetch(`${API_BASE_URL}/users/change-password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPassword: oldPass,
      newPassword: newPass
    })
  })
  .then(async response => {
    if (response.ok) {
      alert("🔐 Đổi mật khẩu thành công! Vui lòng Đăng nhập lại.");
      logout();
    } else {
      const errText = await response.text();
      alert("❌ " + errText);
    }
  })
  .catch(err => {
    alert("❌ Lỗi mạng kết nối tới máy chủ.");
  });
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

  // Frontend giả lập gửi yêu cầu hỗ trợ (Chưa có backend Support Ticket)
  alert("📨 Yêu cầu hỗ trợ đã được gửi cho Quản trị viên!");
  textarea.value = "";
});

/* =========================
   FAQ
========================= */
const faqBtn = document
  .querySelectorAll(".support-card")[3]
  .querySelector("button");

const faqModal = document.getElementById("faqModal");

if (faqBtn) {
  faqBtn.addEventListener("click", () => {
    if (faqModal) {
      faqModal.classList.add("active");
    }
  });
}

// Hàm đóng Modal
function closeFaqModal() {
  if (faqModal) {
    faqModal.classList.remove("active");
  }
}


/* =========================
   ĐĂNG XUẤT
========================= */
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const ok = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (ok) {
      logout();
    }
  });
}

function logout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
  window.location.href = '../../Dangnhap_wedIned/index.html'; 
}
