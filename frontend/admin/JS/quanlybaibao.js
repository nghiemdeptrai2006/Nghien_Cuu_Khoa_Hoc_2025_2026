/* =========================================================
   QUẢN LÝ BÀI BÁO KHOA HỌC - KẾT NỐI API BACKEND
   API: GET/POST/PUT /api/admin/papers
   ========================================================= */

const API_BASE = 'http://localhost:8080/api';
const paperModal = document.getElementById('paperModal');

/* ========================= LOAD BÀI BÁO ========================= */
async function loadPapers(journalType = '') {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const url = journalType ? `${API_BASE}/admin/papers?journalType=${journalType}` : `${API_BASE}/admin/papers`;
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const papers = (await res.json()).data || [];
        renderPapers(papers);
    } catch (err) {
        console.error('loadPapers error:', err);
        const tbody = document.querySelector('.data-table tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:red">Lỗi tải dữ liệu. Vui lòng kiểm tra Server Backend hoặc đăng nhập lại.</td></tr>`;
        }
    }
}

function renderPapers(papers) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    if (papers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#6b7280">Không có bài báo nào.</td></tr>';
        return;
    }

    const typeLabel = {
        ISI_SCOPUS: 'ISI/Scopus', INTERNATIONAL: 'Quốc tế', DOMESTIC: 'Trong nước', CONFERENCE: 'Hội thảo'
    };
    const typeClass = {
        ISI_SCOPUS: 'type-isi', INTERNATIONAL: 'type-isi', DOMESTIC: 'type-dom', CONFERENCE: 'type-conf'
    };
    const statusLabel = {
        PENDING: 'Chờ Thẩm Định', APPROVED: 'Đã Phê Duyệt', REVISION: 'Cần Sửa', REJECTED: 'Từ Chối'
    };
    const statusClass = {
        PENDING: 'status-pending', APPROVED: 'status-active', REVISION: 'status-locked', REJECTED: 'status-locked'
    };

    tbody.innerHTML = papers.map(p => `
        <tr>
            <td><strong>#${p.paperCode || p.id}</strong></td>
            <td>
                <strong>${p.title}</strong><br>
                <span style="font-size:0.85rem;color:#6b7280">
                    <i class="fa-regular fa-calendar"></i>
                    ${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : 'N/A'} |
                    Tạp chí: ${p.journalName || 'N/A'}
                </span>
            </td>
            <td>
                <div class="user-info">
                    <span>${p.leadAuthor ? p.leadAuthor.fullName : (p.coAuthors || 'N/A')}</span>
                </div>
            </td>
            <td><span class="badge-type ${typeClass[p.journalType] || ''}">${typeLabel[p.journalType] || p.journalType}</span></td>
            <td><span class="status-indicator ${statusClass[p.status] || ''}">${statusLabel[p.status] || p.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon view" title="Xem chi tiết" onclick="viewPaper(${p.id})"><i class="fa-solid fa-eye"></i></button>
                    ${p.status === 'PENDING' ? `
                        <button class="btn-icon edit" title="Phê duyệt" onclick="reviewPaper(${p.id}, 'APPROVED')"><i class="fa-solid fa-check-double"></i></button>
                        <button class="btn-icon lock" title="Yêu cầu sửa" onclick="reviewPaper(${p.id}, 'REVISION')"><i class="fa-solid fa-paper-plane"></i></button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

/* ========================= DUYỆT / TỪ CHỐI BÀI BÁO ========================= */
async function reviewPaper(id, status) {
    const label = status === 'APPROVED' ? 'PHÊ DUYỆT' : 'YÊU CẦU CHỈNH SỬA';
    let reviewNote = '';
    if (status === 'REVISION') {
        reviewNote = prompt('Nhập ghi chú yêu cầu chỉnh sửa:');
        if (reviewNote === null) return;
    }
    if (!confirm(`Xác nhận ${label} bài báo này?`)) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_BASE}/admin/papers/${id}/review`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status, reviewNote })
        });
        if (!res.ok) throw new Error();
        alert(status === 'APPROVED' ? '✅ Bài báo đã được phê duyệt!' : '📝 Đã gửi yêu cầu chỉnh sửa!');
        loadPapers();
    } catch {
        alert('❌ Không thể cập nhật. Kiểm tra kết nối backend!');
    }
}

function viewPaper(id) {
    alert(`Xem chi tiết bài báo ID: ${id}\n(Tính năng sẽ mở popup chi tiết)`);
}

/* ========================= THÊM BÀI BÁO MỚI ========================= */
function openPaperModal() {
    document.getElementById('paperForm').reset();
    paperModal.classList.add('active');
}

function closePaperModal() {
    paperModal.classList.remove('active');
}

async function addPaperAction() {
    const token = localStorage.getItem('token');
    const form = document.getElementById('paperForm');
    const inputs = form.querySelectorAll('input, select');

    const title = inputs[0]?.value?.trim();
    const journalTypeRaw = form.querySelector('select')?.value || '';

    const journalTypeMap = {
        'Tạp chí Quốc tế (ISI, Scopus)': 'ISI_SCOPUS',
        'Tạp chí Quốc tế (Khác)': 'INTERNATIONAL',
        'Tạp chí Trong nước (Thuộc danh mục HĐGS)': 'DOMESTIC',
        'Hội thảo Quốc gia / Quốc tế': 'CONFERENCE'
    };

    if (!title) { alert('Vui lòng nhập tên bài báo!'); return; }

    try {
        const res = await fetch(`${API_BASE}/admin/papers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                title,
                journalType: journalTypeMap[journalTypeRaw] || 'DOMESTIC',
                status: 'PENDING'
            })
        });
        if (!res.ok) throw new Error();
        alert('✅ Đã đăng tải bài báo thành công!');
        closePaperModal();
        loadPapers();
    } catch {
        alert('❌ Không thể đăng tải. Kiểm tra kết nối backend!');
    }
}

/* ========================= KHỞI TẠO ========================= */
document.addEventListener('DOMContentLoaded', () => {
    loadPapers().then(() => {
        // Check for deep-linking
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const autoId = urlParams.get('id') || hashParams.get('id');
        
        if (autoId) {
            viewPaper(autoId);
        }
    });

    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const v = filterSelect.value;
            const map = { isi: 'ISI_SCOPUS', domestic: 'DOMESTIC', conference: 'CONFERENCE' };
            loadPapers(v === 'all' ? '' : (map[v] || ''));
        });
    }

    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal-overlay')) closePaperModal();
    });
});


