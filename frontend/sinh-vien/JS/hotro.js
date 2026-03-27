/* =========================
   HỖ TRỢ JS & TÍCH HỢP BACKEND
========================= */

const API_BASE_URL = 'http://localhost:8080/api';

// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  // CẬP NHẬT TÊN NGƯỜI DÙNG TỪ LOCALSTORAGE CHO HEADER
  const fullName = localStorage.getItem('fullName');
  const profileSpan = document.querySelector('.user-profile-menu span');
  if (fullName && profileSpan) {
    profileSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${fullName}`;
  }

  // LẤY DỮ LIỆU USER CHO FORM
  fetchUserProfile();
});

// Hàm lấy thông tin User từ backend
function fetchUserProfile() {
  const token = localStorage.getItem('token');
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
const profileCard = document.querySelector(".profile-card");
if (profileCard) {
  const updateBtn = profileCard.querySelector(".btn-update");
  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      const name = profileCard.querySelector('input[type="text"]:not([disabled])');
      const email = profileCard.querySelector('input[type="email"]');

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

      const token = localStorage.getItem('token');
      if(!token) return;

      fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          fullName: name.value.trim(),
          email: email.value.trim()
        })
      })
      .then(response => {
        if(!response.ok) throw new Error("Cập nhật thất bại!");
        alert("✅ Cập nhật thông tin thành công!");
        
        const userStr = localStorage.getItem('user_info');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userObj.fullName = name.value.trim();
          localStorage.setItem('user_info', JSON.stringify(userObj));
        }
      })
      .catch(err => {
        alert("❌ Lỗi mạng hoặc server!");
        console.error(err);
      });
    });
  }
}

/* =========================
   ĐỔI MẬT KHẨU
========================= */
const passwordCard = document.querySelector(".password-card");
if (passwordCard) {
  const changePassBtn = passwordCard.querySelector(".btn-password");

  if (changePassBtn) {
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

      const token = localStorage.getItem('token');
      
      fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8'
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
  }
}

/* =========================
   GỬI YÊU CẦU HỖ TRỢ
========================= */
const helpCard = document.querySelector(".help-card");
if (helpCard) {
  const supportBtn = helpCard.querySelector(".btn-help");
  const textarea = helpCard.querySelector("textarea");

  if (supportBtn && textarea) {
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

      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/support/requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          subject: "Yêu cầu hỗ trợ sinh viên", 
          details: content
        })
      })
      .then(response => {
        if (response.ok) {
          alert("✅ Yêu cầu hỗ trợ đã được gửi thành công!");
          textarea.value = "";
        } else {
          alert("❌ Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
        }
      })
      .catch(err => {
        alert("❌ Lỗi kết nối server!");
      });
    });
  }
}

/* =========================
   FAQ
========================= */
const faqCard = document.querySelector(".faq-card");
if (faqCard) {
  const faqBtn = faqCard.querySelector(".btn-faq");
  const faqModal = document.getElementById("faqModal");

  if (faqBtn) {
    // Note: onclick is removed from HTML to use this listener
    faqBtn.addEventListener("click", () => {
      if (faqModal) {
        openFaqModal();
      }
    });
  }
}

// Hàm mở Modal
function openFaqModal() {
  const faqModal = document.getElementById("faqModal");
  if (faqModal) {
    faqModal.classList.add("active");
  }
}

// Hàm đóng Modal
function closeFaqModal() {
  const faqModal = document.getElementById("faqModal");
  if (faqModal) {
    faqModal.classList.remove("active");
  }
}

/* =========================
   ĐĂNG XUẤT
========================= */
const logoutBtn = document.querySelector(".btn-logout-alt");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const ok = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (ok) {
      logout();
    }
  });
}

// Global logout() is now provided by /shared/js/auth.js
