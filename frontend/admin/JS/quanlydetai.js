/* =========================================================
   QUẢN LÝ ĐỀ TÀI NCKH - KẾT NỐI API BACKEND
   API: GET/POST/PUT /api/admin/topics
   ========================================================= */

const API_BASE = 'http://localhost:8080/api';

/* ========================= LOAD ĐỀ TÀI ========================= */
async function loadTopics(status) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const url = status ? (API_BASE + '/admin/topics?status=' + status) : (API_BASE + '/admin/topics');
        const res = await fetch(url, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!res.ok) throw new Error('Lỗi tải danh sách đề tài');
        const topics = (await res.json()).data;
        renderTopics(topics);
    } catch (err) {
        console.error('loadTopics error:', err);
    }
}

function renderTopics(topics) {
    const container = document.querySelector('.project-list.panel');
    if (!container) return;

    if (topics.length === 0) {
        container.innerHTML = '<div style="padding:30px;text-align:center;color:#6b7280">Không có đề tài nào.</div>';
        return;
    }

    var statusLabel = {
        PENDING: 'Chờ thẩm định', ACTIVE: 'Đang thực hiện',
        DELAYED: 'Quá hạn báo cáo', COMPLETED: 'Đã nghiệm thu', CANCELLED: 'Đã hủy'
    };
    var statusClass = {
        PENDING: 'status-pending', ACTIVE: 'status-active',
        DELAYED: 'status-delayed', COMPLETED: 'status-active', CANCELLED: 'status-delayed'
    };

    var html = '';
    for (var i = 0; i < topics.length; i++) {
        var t = topics[i];
        var leaderName = t.leader ? t.leader.fullName : 'Chưa có';
        var endDateStr = t.endDate ? new Date(t.endDate).toLocaleDateString('vi-VN') : '';
        var budgetStr = t.budget ? Number(t.budget).toLocaleString('vi-VN') + 'đ' : '';
        var sLabel = statusLabel[t.status] || t.status;
        var sClass = statusClass[t.status] || '';
        var isDanger = t.status === 'DELAYED' ? 'danger-alert' : '';
        var progress = t.progress || 0;

        var actionsHtml = '';
        if (t.status === 'PENDING') {
            actionsHtml += '<button class="btn-sm btn-approve" onclick="updateTopicStatus(' + t.id + ', \'ACTIVE\')"><i class="fa-solid fa-check"></i> Duyệt</button>';
            actionsHtml += '<button class="btn-sm btn-reject" onclick="updateTopicStatus(' + t.id + ', \'CANCELLED\')"><i class="fa-solid fa-xmark"></i> Hủy</button>';
        }
        if (t.status === 'DELAYED') {
            actionsHtml += '<button class="btn-sm btn-reminder" onclick="alert(\'Đã gửi nhắc nhở!\')"><i class="fa-solid fa-bell"></i> Lời nhắc</button>';
        }
        actionsHtml += '<button class="btn-sm btn-view" onclick="showTopicDetail(' + t.id + ')">Chi tiết <i class="fa-solid fa-arrow-right"></i></button>';

        var progressHtml = '';
        if (t.status === 'ACTIVE') {
            progressHtml = '<div class="progress-bar-container"><div class="progress-bar" style="width:' + progress + '%"></div><span class="progress-text">' + progress + '%</span></div>';
        }

        html += '<div class="project-item ' + isDanger + '">' +
            '<div class="proj-main">' +
            '<div class="proj-header">' +
            '<span class="proj-code">Mã ĐT: ' + (t.topicCode || 'N/A') + '</span>' +
            '<span class="proj-status ' + sClass + '">' + sLabel + '</span>' +
            '</div>' +
            '<h3 class="proj-title">' + t.title + '</h3>' +
            '<div class="proj-meta">' +
            '<span><i class="fa-solid fa-user"></i> Chủ nhiệm: ' + leaderName + '</span>' +
            (t.fieldArea ? '<span><i class="fa-solid fa-layer-group"></i> ' + t.fieldArea + '</span>' : '') +
            (budgetStr ? '<span><i class="fa-solid fa-sack-dollar"></i> ' + budgetStr + '</span>' : '') +
            (endDateStr ? '<span><i class="fa-solid fa-hourglass"></i> Hạn: ' + endDateStr + '</span>' : '') +
            '</div>' +
            progressHtml +
            '</div>' +
            '<div class="proj-actions">' + actionsHtml + '</div>' +
            '</div>';
    }

    container.innerHTML = html;
}

/* ========================= XEM CHI TIẾT ========================= */
function showTopicDetail(id) {
    var token = localStorage.getItem('token');
    fetch(API_BASE + '/admin/topics/' + id, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(r) { return r.json(); })
    .then(function(t) {
        alert('ID: ' + t.id + '\nMã: ' + (t.topicCode || 'N/A') + '\nTên: ' + t.title +
            '\nChủ nhiệm: ' + (t.leader ? t.leader.fullName : 'N/A') +
            '\nLĩnh vực: ' + (t.fieldArea || 'N/A') +
            '\nTrạng thái: ' + (t.status || 'N/A') +
            '\nTiến độ: ' + (t.progress || 0) + '%');
    })
    .catch(function() { alert('Không thể tải chi tiết đề tài!'); });
}

/* ========================= CẬP NHẬT TRẠNG THÁI ========================= */
async function updateTopicStatus(id, newStatus) {
    var label = newStatus === 'ACTIVE' ? 'PHÊ DUYỆT' : 'HỦY';
    if (!confirm('Xác nhận ' + label + ' đề tài này?')) return;

    var token = localStorage.getItem('token');
    try {
        var res = await fetch(API_BASE + '/admin/topics/' + id + '/status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error();
        alert(newStatus === 'ACTIVE' ? '✅ Đề tài đã được phê duyệt!' : '❌ Đề tài đã bị hủy!');
        loadTopics();
    } catch (e) {
        alert('❌ Không thể cập nhật. Kiểm tra kết nối backend!');
    }
}

/* ========================= GIỮ HÀM CŨ ========================= */
function updateStatus(projectId, action) {
    alert('Đề tài ' + projectId + ': Vui lòng dùng nút Duyệt/Hủy trong danh sách.');
}

function sendWarning() {
    alert('🔔 Đã gửi email nhắc nhở tới chủ nhiệm đề tài!');
}

/* ========================= TẠO ĐỀ TÀI MỚI ========================= */
function openTopicModal() {
    document.getElementById('topicForm').reset();
    document.getElementById('topicModal').classList.add('active');
}

function closeTopicModal() {
    document.getElementById('topicModal').classList.remove('active');
}

async function saveTopic() {
    const title = document.getElementById('topicTitle').value;
    const topicCode = document.getElementById('topicCode').value;
    const fieldArea = document.getElementById('fieldArea').value;
    const level = document.getElementById('topicLevel').value;
    const leaderId = document.getElementById('leaderId').value;
    const budget = document.getElementById('budget').value;
    const endDate = document.getElementById('endDate').value;

    if (!title || !fieldArea || !leaderId) {
        alert('⚠️ Vui lòng điền đầy đủ các trường bắt buộc (*)');
        return;
    }

    const token = localStorage.getItem('token');
    const reqBody = {
        title, topicCode, fieldArea, level,
        leaderId: parseInt(leaderId),
        budget: budget ? parseFloat(budget) : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        status: 'PENDING'
    };

    try {
        const res = await fetch(API_BASE + '/admin/topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(reqBody)
        });

        if (res.ok) {
            alert('✅ Tạo đề tài mới thành công!');
            closeTopicModal();
            loadTopics();
        } else {
            const err = await res.json();
            alert('❌ Lỗi: ' + (err.message || 'Không thể tạo đề tài'));
        }
    } catch (e) {
        alert('❌ Lỗi kết nối server!');
    }
}

/* ========================= KHỞI TẠO ========================= */
document.addEventListener('DOMContentLoaded', function() {
    loadTopics();

    // Xử lý nút mở modal
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const autoId = urlParams.get('id') || hashParams.get('id');
    
    if (autoId) {
        showTopicDetail(autoId);
    } else if (urlParams.get('action') === 'add') {
        openTopicModal();
    }

    var filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            var val = filterSelect.value;
            var statusMap = { all: '', pending: 'PENDING', active: 'ACTIVE', delayed: 'DELAYED', completed: 'COMPLETED' };
            loadTopics(statusMap[val] || '');
        });
    }


});
