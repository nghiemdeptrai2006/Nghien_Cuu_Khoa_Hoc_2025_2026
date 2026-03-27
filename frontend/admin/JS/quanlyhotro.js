/* =========================================================
   SUPPORT MANAGEMENT LOGIC - ADMIN
   ========================================================= */

let allSupportRequests = [];
const viewModal = document.getElementById('viewModal');

document.addEventListener('DOMContentLoaded', () => {
    loadAdminSupportRequests().then(() => {
        // Check for deep-linking
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const autoId = urlParams.get('id') || hashParams.get('id');
        
        if (autoId) {
            viewSupportRequestById(autoId);
        }
    });
});

// =========================================================
// FETCH AND RENDER SUPPORT REQUESTS
// =========================================================
async function loadAdminSupportRequests() {
    const grid = document.getElementById('adminDocumentGrid');
    if (!grid) return;

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

    try {
        const response = await fetch('http://localhost:8080/api/support/requests', {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            allSupportRequests = await response.json();
            renderSupportRequests(allSupportRequests);
        } else {
            const err = await response.text();
            grid.innerHTML = `<p style="color: red; text-align: center; width: 100%;">Lỗi tải dữ liệu (${response.status}): ${err}</p>`;
        }
    } catch (e) {
        console.error("Failed to fetch support requests", e);
        grid.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Không thể kết nối đến Máy chủ API.</p>';
    }
}

function renderSupportRequests(requests) {
    const grid = document.getElementById('adminDocumentGrid');
    grid.innerHTML = '';

    if (!requests || requests.length === 0) {
        grid.innerHTML = '<p style="color: var(--gray-400); text-align: center; width: 100%; padding: 40px;">Chưa có yêu cầu hỗ trợ nào.</p>';
        return;
    }

    requests.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('stat-card'); // Use stat-card as base
        card.style.flexDirection = 'row';
        card.style.alignItems = 'center';
        card.style.padding = '20px';
        card.style.gap = '20px';
        
        const status = req.status;
        const statusClass = status === 'RESOLVED' ? 'success' : (status === 'PENDING' ? 'warning' : 'danger');
        card.classList.add(statusClass);

        const dateStr = new Date(req.createdAt).toLocaleString('vi-VN');
        const userName = req.user ? req.user.fullName : 'Ẩn danh';
        const userEmail = req.user ? req.user.email : '';

        card.innerHTML = `
            <div class="stat-icon" style="flex-shrink: 0; width: 56px; height: 56px; font-size: 24px;">
                <i class="fa-solid fa-headset"></i>
            </div>
            <div class="stat-info" style="flex: 1; min-width: 0;">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--dark); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${req.subject}">
                    ${req.subject}
                </h4>
                <p style="font-size: 14px; color: var(--gray-600); margin-bottom: 2px;">
                    <strong>Từ:</strong> ${userName}
                </p>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <span style="font-size: 13px; color: var(--gray-400);">${dateStr}</span>
                    <span class="badge" style="background: ${getStatusColor(status)}20; color: ${getStatusColor(status)}; border: none; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                        ${translateStatus(status).toUpperCase()}
                    </span>
                </div>
            </div>
            <div style="flex-shrink: 0;">
                <button onclick="viewRequestDetails(${req.id})" class="btn btn-outline" style="padding: 8px 12px; font-size: 13px;">
                    Chi tiết
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// =========================================================
// FILTER LOGIC
// =========================================================
function filterByStatus(status) {
    // Update UI Active State
    const buttons = document.querySelectorAll('.toolbar-left .btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') === `filterByStatus('${status}')`) {
            btn.classList.add('active');
        }
    });

    if (status === 'ALL') {
        renderSupportRequests(allSupportRequests);
    } else {
        const filtered = allSupportRequests.filter(r => r.status === status);
        renderSupportRequests(filtered);
    }
}

// =========================================================
// MODAL & ACTION LOGIC
// =========================================
function viewRequestDetails(id) {
    const req = allSupportRequests.find(r => r.id === id);
    if (!req) return;

    document.getElementById('viewUserName').textContent = req.user ? `${req.user.fullName} (${req.user.email})` : 'Ẩn danh';
    document.getElementById('viewSubject').textContent = req.subject;
    document.getElementById('viewDate').textContent = new Date(req.createdAt).toLocaleString('vi-VN');
    
    const statusLabel = document.getElementById('viewStatusLabel');
    statusLabel.textContent = translateStatus(req.status);
    statusLabel.style.background = getStatusColor(req.status);
    statusLabel.style.color = '#fff';

    document.getElementById('viewDetails').textContent = req.details || '(Không có nội dung chi tiết)';

    // Show/Hide Admin Actions based on status
    const actions = document.getElementById('adminActions');
    if (req.status === 'PENDING') {
        actions.style.display = 'flex';
        document.getElementById('btnResolve').onclick = () => updateRequestStatus(id, 'RESOLVED');
        document.getElementById('btnReject').onclick = () => updateRequestStatus(id, 'REJECTED');
    } else {
        actions.style.display = 'none';
    }

    viewModal.classList.add('active');
}

function closeViewModal() {
    viewModal.classList.remove('active');
}

// Fetch single request by ID and open modal (for deep-linking)
async function viewSupportRequestById(id) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:8080/api/support/requests/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const req = await res.json();
            // We need to ensure allSupportRequests is populated or at least this request is in it
            if (!allSupportRequests.find(r => r.id == id)) {
                allSupportRequests.push(req);
            }
            viewRequestDetails(parseInt(id));
        } else {
            console.error("Support request not found or unauthorized");
        }
    } catch (error) {
        console.error("Error fetching support details", error);
    }
}

async function updateRequestStatus(id, newStatus) {
    const confirmMsg = newStatus === 'RESOLVED' ? 'Xác nhận đã giải quyết yêu cầu này?' : 'Xác nhận từ chối yêu cầu này?';
    if (!confirm(confirmMsg)) return;

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

    try {
        const response = await fetch(`http://localhost:8080/api/support/requests/${id}/status?status=${newStatus}`, {
            method: 'PUT',
            headers: headers
        });

        if (response.ok) {
            alert('✅ Cập nhật trạng thái thành công!');
            closeViewModal();
            loadAdminSupportRequests(); // Refresh data
        } else {
            alert('❌ Cập nhật thất bại. Vui lòng thử lại.');
        }
    } catch (e) {
        console.error("Update error", e);
        alert('❌ Lỗi kết nối server.');
    }
}

// =========================================================
// HELPERS
// =========================================================
function getStatusColor(status) {
    switch (status) {
        case 'PENDING': return '#f39c12'; // Orange
        case 'RESOLVED': return '#27ae60'; // Green
        case 'REJECTED': return '#e74c3c'; // Red
        default: return '#7f8c8d'; // Gray
    }
}

function translateStatus(status) {
    switch (status) {
        case 'PENDING': return 'Đang chờ xử lý';
        case 'RESOLVED': return 'Đã giải quyết';
        case 'REJECTED': return 'Từ chối';
        default: return status;
    }
}

// Handle clicks outside of modal
window.addEventListener('click', (e) => {
    if (e.target === viewModal) closeViewModal();
});
