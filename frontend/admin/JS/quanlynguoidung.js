/* =========================================================
   USER MANAGEMENT ACTION (ADMIN)
   ========================================================= */

// Pagination State
let allUsers = [];
let currentPage = 1;
const usersPerPage = 5;

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
        idInput.setAttribute('disabled', 'true');
        const checkBtn = document.getElementById('check-id-btn');
        if (checkBtn) checkBtn.style.display = 'none';
        emailInput.value = email;
        roleSelect.value = role;
    }
    
    userModal.classList.add('active');
}

// Close Modal
function closeUserModal() {
    userModal.classList.remove('active');
    idInput.removeAttribute('disabled');
    document.getElementById('check-id-btn').style.display = 'block'; // Show check button for next time
}

async function checkExistingUser() {
    const id = idInput.value.trim().toUpperCase();
    if (!id) {
        alert('⚠️ Vui lòng nhập Mã định danh trước!');
        return;
    }

    const btn = document.getElementById('check-id-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang check...';
    btn.setAttribute('disabled', 'true');

    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`http://localhost:8080/api/users/check-university/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const apiRes = await res.json();
        
        if (apiRes.status === 'success') {
            const foundUser = apiRes.data;
            nameInput.value = foundUser.fullName;
            emailInput.value = foundUser.email;
            roleSelect.value = foundUser.role;
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'status-msg success';
            successMsg.style.fontSize = '12px';
            successMsg.style.marginTop = '5px';
            successMsg.style.color = '#10b981';
            successMsg.innerHTML = '<i class="fa-solid fa-check"></i> Đã tìm thấy tài khoản trong hệ thống Nhà trường!';
            idInput.parentElement.after(successMsg);
            
            // Highlight pre-filled fields
            [nameInput, emailInput, roleSelect].forEach(el => {
                el.style.borderColor = '#10b981';
                el.style.backgroundColor = '#f0fdf4';
            });

            setTimeout(() => {
                successMsg.remove();
                [nameInput, emailInput, roleSelect].forEach(el => {
                    el.style.borderColor = '';
                    el.style.backgroundColor = '';
                });
            }, 3000);

        } else {
            alert('❌ Không tìm thấy ID này trong hệ thống Nhà trường. Vui lòng nhập thủ công.');
        }
    } catch (e) {
        alert('❌ Lỗi kết nối máy chủ!');
    } finally {
        btn.innerHTML = originalContent;
        btn.removeAttribute('disabled');
    }
}

// Handle clicks outside of modals
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeUserModal();
    }
});

// Save Data (Persist to Backend)
async function saveUser() {
    const name = nameInput.value.trim();
    const username = idInput.value.trim(); // ID input is used as username
    const email = emailInput.value.trim();
    const role = roleSelect.value;
    const password = passInput.value.trim();

    if(!name || !username) {
        alert('⚠️ Vui lòng nhập đủ các thông tin bắt buộc (*)!');
        return;
    }
    
    const isEditing = idInput.hasAttribute('disabled');
    const token = localStorage.getItem('token');
    
    if (isEditing) {
        // Edit logic NOT yet implemented in backend as a generic PUT /api/users/admin/${id}
        // But for this task, focus on ADDing users
        alert('Tính năng sửa đang được hoàn thiện. Vui lòng thử Thêm mới.');
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/users/admin", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                username: username,
                password: password || "123456",
                fullName: name,
                role: role
            })
        });

        const apiRes = await res.json();
        if (apiRes.status === 'success') {
            alert('✅ Đã tạo mới tài khoản thành công!');
            closeUserModal();
            
            // Re-fetch and jump to last page
            await fetchUsers();
            currentPage = Math.ceil(allUsers.length / usersPerPage);
            updateUI();
        } else {
            alert('❌ Lỗi: ' + (apiRes.message || "Không thể tạo tài khoản."));
        }
    } catch (e) {
        alert('❌ Lỗi kết nối backend!');
    }
}

async function fetchUsers() {
    const token = localStorage.getItem('token');
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu thực tế...</td></tr>';

    try {
        const res = await fetch("http://localhost:8080/api/users/admin/all", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const apiRes = await res.json();
        
        if (apiRes.status === 'success') {
            allUsers = apiRes.data;
            // Go to the page where the newest user might be (the last page) if a user was recently added
            // or just stay on currentPage.
            renderUserTable();
            renderPagination();
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Không thể tải danh sách (Lỗi API).</td></tr>';
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Lỗi kết nối máy chủ backend.</td></tr>';
    }
}

function renderUserTable() {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Calculate slice for current page
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const pageUsers = allUsers.slice(startIndex, endIndex);

    if (pageUsers.length === 0 && allUsers.length > 0) {
        currentPage = 1;
        renderUserTable();
        return;
    }

    pageUsers.forEach(user => {
        const roleMap = { 'ROLE_ADMIN': 'Quản trị', 'ROLE_GIANGVIEN': 'Giảng viên', 'ROLE_SINHVIEN': 'Sinh viên' };
        const roleClass = { 'ROLE_ADMIN': 'role-admin', 'ROLE_GIANGVIEN': 'role-teacher', 'ROLE_SINHVIEN': 'role-student' };
        
        const tr = document.createElement('tr');
        const displayEmail = user.username.includes('@') ? user.username : user.username + '@st.utc.edu.vn';
        const onlineStatus = getOnlineStatus(user.lastSeen);
        
        tr.innerHTML = `
            <td><strong>#${user.username}</strong></td>
            <td>
                <div class="user-info">
                    <div class="user-avatar" style="position:relative;">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff" alt="${user.fullName.charAt(0)}">
                        <span class="online-dot ${onlineStatus.dotClass}" title="${onlineStatus.label}"></span>
                    </div>
                    <div>
                        <strong>${user.fullName}</strong>
                        <span>ID: ${user.id}</span>
                    </div>
                </div>
            </td>
            <td>${displayEmail}</td>
            <td><span class="badge-role ${roleClass[user.role] || ''}">${roleMap[user.role] || user.role}</span></td>
            <td>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="status-indicator ${user.enabled ? 'status-active' : 'status-locked'}">${user.enabled ? 'Hoạt động' : 'Đã khóa'}</span>
                    <small style="color: ${onlineStatus.color}; font-size: 11px;">${onlineStatus.label}</small>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon view" title="Xem chi tiết" onclick="viewUser(${user.id})"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-icon edit" title="Sửa" onclick="openUserModal('edit', '${user.id}', '${user.fullName}', '${displayEmail}', '${user.role.replace('ROLE_', '').toLowerCase()}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon ${user.enabled ? 'lock' : 'unlock'}" title="${user.enabled ? 'Khóa' : 'Mở khóa'}" onclick="toggleStatus(${user.id})">
                        <i class="fa-solid ${user.enabled ? 'fa-lock' : 'fa-unlock'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function getOnlineStatus(lastSeenStr) {
    if (!lastSeenStr) {
        return { label: '⚪ Offline', color: '#94a3b8', dotClass: 'dot-offline' };
    }
    const lastSeen = new Date(lastSeenStr);
    const diffMs = Date.now() - lastSeen.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMin <= 5) {
        return { label: '🟢 Đang online', color: '#10b981', dotClass: 'dot-online' };
    } else if (diffMin < 60) {
        return { label: `⚫ Offline ${diffMin} phút trước`, color: '#f59e0b', dotClass: 'dot-away' };
    } else {
        return { label: '⚪ Offline', color: '#94a3b8', dotClass: 'dot-offline' };
    }
}

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    paginationContainer.innerHTML = '';

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i> Trước';
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; updateUI(); } };
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.className = 'page-numbers';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => { currentPage = i; updateUI(); };
        pageNumbersDiv.appendChild(pageBtn);
    }
    paginationContainer.appendChild(pageNumbersDiv);

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = `page-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
    nextBtn.innerHTML = 'Sau <i class="fa-solid fa-chevron-right"></i>';
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; updateUI(); } };
    paginationContainer.appendChild(nextBtn);
}

function updateUI() {
    renderUserTable();
    renderPagination();
}

async function toggleStatus(id) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:8080/api/users/admin/${id}/status`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchUsers();
        } else {
            alert('❌ Không thể cập nhật trạng thái.');
        }
    } catch (e) {
        alert('❌ Lỗi kết nối.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers().then(() => {
        // Check for #id=123 or ?id=123 in URL to auto-open view modal
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const autoId = urlParams.get('id') || hashParams.get('id');
        
        if (autoId) {
            viewUser(autoId);
        }
    });
});

const profileModal = document.getElementById('profileModal');
let currentProfileData = null;

async function viewUser(id) {
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`http://localhost:8080/api/users/admin/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const apiRes = await res.json();
            currentProfileData = apiRes.data;
            renderUserProfile(currentProfileData);
            profileModal.classList.add('active');
        } else {
            alert('❌ Không tìm thấy thông tin chi tiết người dùng.');
        }
    } catch (e) {
        alert('❌ Lỗi kết nối máy chủ!');
    }
}

function openEditFromProfile() {
    if (!currentProfileData) return;
    closeProfileModal();
    
    const roleMap = { 'ROLE_ADMIN': 'admin', 'ROLE_GIANGVIEN': 'teacher', 'ROLE_SINHVIEN': 'student' };
    const roleValue = roleMap[currentProfileData.role] || 'student';
    
    openUserModal('edit', 
        currentProfileData.id, 
        currentProfileData.fullName, 
        currentProfileData.email, 
        roleValue
    );
}


function renderUserProfile(user) {
    document.getElementById('p-full-name').textContent = user.fullName;
    document.getElementById('p-username').textContent = '#' + (user.username || user.id);
    document.getElementById('p-email').textContent = user.email || (user.username + '@st.utc.edu.vn');
    document.getElementById('p-topic-count').textContent = user.topicCount;
    document.getElementById('p-paper-count').textContent = user.paperCount;
    document.getElementById('p-product-count').textContent = user.productCount;
    
    const roleBadge = document.getElementById('p-role-badge');
    const roleMap = { 'ROLE_ADMIN': 'Quản trị viên', 'ROLE_GIANGVIEN': 'Giảng viên / Nghiên cứu viên', 'ROLE_SINHVIEN': 'Sinh viên / Học viên' };
    roleBadge.textContent = roleMap[user.role] || user.role;
    
    const statusVal = document.getElementById('p-status');
    statusVal.textContent = user.enabled ? 'Đang hoạt động' : 'Đã khóa';
    statusVal.style.color = user.enabled ? '#10b981' : '#ef4444';

    // Set Avatar Initial
    const avatarContainer = document.getElementById('p-avatar-container');
    const initial = user.fullName.charAt(0).toUpperCase();
    avatarContainer.innerHTML = `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=256" alt="${initial}">`;
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

// Global click to close profile modal
window.addEventListener('click', function(event) {
    if (event.target === profileModal) {
        closeProfileModal();
    }
    if (event.target === userModal) {
        closeUserModal();
    }
});



