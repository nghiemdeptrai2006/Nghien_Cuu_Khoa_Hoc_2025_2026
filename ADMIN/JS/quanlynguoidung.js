/* =========================================================
   USER MANAGEMENT ACTION (ADMIN)
   ========================================================= */

// DOM Elements
const userModal = document.getElementById('userModal');
const userModalTitle = document.getElementById('userModalTitle');

// Form Input Elements
const nameInput = document.getElementById('userName');
const idInput = document.getElementById('userId');
const emailInput = document.getElementById('userEmail');
const roleSelect = document.getElementById('userRole');
const passInput = document.getElementById('userPassword');

// Open Modal - Can act as Add New or Edit
function openUserModal(actionType, id = '', name = '', email = '', role = 'student') {
    // Reset form first
    document.getElementById('userForm').reset();
    
    if(actionType === 'add') {
        userModalTitle.textContent = "Thêm Người dùng mới";
    } else if (actionType === 'edit') {
        userModalTitle.textContent = "Sửa thông tin Người dùng: " + id;
        
        // Populate inputs
        nameInput.value = name;
        idInput.value = id;
        idInput.setAttribute('disabled', 'true'); // Prevent ID edit
        emailInput.value = email;
        roleSelect.value = role;
    }
    
    userModal.classList.add('active');
}

// Close Modal
function closeUserModal() {
    userModal.classList.remove('active');
    idInput.removeAttribute('disabled'); // Reset for next use
}

// Handle clicks outside of modals
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeUserModal();
    }
});

// Save Data (Simulation)
function saveUser() {
    // Basic validation
    if(nameInput.value.trim() === '' || emailInput.value.trim() === '') {
        alert('⚠️ Vui lòng nhập đủ các thông tin bắt buộc (*)!');
        return;
    }
    
    let isEditing = idInput.hasAttribute('disabled');
    if(isEditing) {
        alert('✅ Cập nhật thông tin thành công cho tài khoản: ' + emailInput.value);
    } else {
        alert('✅ Đã tạo mới tài khoản thành công!');
    }
    
    closeUserModal();
}

function viewUser(id) {
    alert("🪟 Tính năng xem chi tiết hồ sơ tài khoản " + id + ".\n(Sẽ mở một trang Thông tin Cá nhân dạng Popup)");
}
