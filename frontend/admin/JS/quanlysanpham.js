/* =========================================================
   QUẢN LÝ SẢN PHẨM NCKH - KẾT NỐI API BACKEND
   API: GET/POST/PUT /api/admin/products
   ========================================================= */

const API_BASE = 'http://localhost:8080/api';

/* ========================= LOAD SẢN PHẨM ========================= */
async function loadProducts(productType = '') {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const url = productType ? `${API_BASE}/admin/products?productType=${productType}` : `${API_BASE}/admin/products`;
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const products = (await res.json()).data || [];
        renderProducts(products);
    } catch (err) {
        console.error('loadProducts error:', err);
        const grid = document.querySelector('.product-grid');
        if (grid) {
            grid.innerHTML = '<div style="padding:30px;text-align:center;color:red;grid-column:1/-1">Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối Server Backend hoặc thử đăng nhập lại.</div>';
        }
    }
}

function renderProducts(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div style="padding:30px;text-align:center;color:#6b7280;grid-column:1/-1">Chưa có sản phẩm NCKH nào.</div>';
        return;
    }

    const typeConfig = {
        PATENT: { icon: 'fa-lightbulb', label: 'Bằng Sáng Chế', cls: 'type-patent' },
        SOLUTION: { icon: 'fa-hammer', label: 'Giải pháp Hữu ích', cls: 'type-solution' },
        BOOK_REFERENCE: { icon: 'fa-book', label: 'Sách Chuyên Khảo', cls: 'type-book' },
        BOOK_TEXTBOOK: { icon: 'fa-book', label: 'Giáo trình', cls: 'type-book' },
        SOFTWARE: { icon: 'fa-code', label: 'Phần Mềm NCKH', cls: 'type-software' },
        OTHER: { icon: 'fa-box', label: 'Khác', cls: 'type-patent' }
    };

    grid.innerHTML = products.map(p => {
        const cfg = typeConfig[p.productType] || typeConfig.OTHER;
        return `
        <div class="product-card">
            <div class="prd-type ${cfg.cls}"><i class="fa-solid ${cfg.icon}"></i> ${cfg.label}</div>
            <div class="prd-info">
                <h3>${p.productName}</h3>
                <p class="authors"><i class="fa-regular fa-user"></i> <strong>Chủ sở hữu:</strong> ${p.owner ? p.owner.fullName : (p.ownerName || 'N/A')}</p>
                <p class="issue-date"><i class="fa-regular fa-calendar-check"></i> <strong>Cấp/Xuất bản:</strong> ${p.issuedAt ? new Date(p.issuedAt).toLocaleDateString('vi-VN') : p.publisher || 'N/A'}</p>
                <p class="license"><i class="fa-solid fa-fingerprint"></i> <strong>Số hiệu:</strong> ${p.serialNumber || 'Chưa có'}</p>
                <p style="font-size:0.8rem;margin-top:4px">
                    <span style="padding:2px 8px;border-radius:99px;background:${p.status==='CERTIFIED'?'#d1fae5':'#fef3c7'};color:${p.status==='CERTIFIED'?'#065f46':'#92400e'}">
                        ${p.status === 'CERTIFIED' ? '✅ Đã chứng nhận' : '⏳ Đang chờ cấp'}
                    </span>
                </p>
            </div>
            <div class="prd-footer">
                ${p.status === 'PENDING' ? `
                    <button class="btn-sm btn-approve" style="flex:1" onclick="certifyProduct(${p.id})">
                        <i class="fa-solid fa-stamp"></i> Ra Quyết Định Cấp
                    </button>
                ` : `
                    <button class="btn-sm btn-view" onclick="alert('ID:${p.id} | ${p.productName}')">
                        <i class="fa-solid fa-eye"></i> Xem Quyết định
                    </button>
                `}
                <button class="btn-sm btn-edit" title="Chỉnh sửa" onclick="alert('Chỉnh sửa sản phẩm ID: ${p.id}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

/* ========================= XÁC NHẬN CẤP CHỨNG NHẬN ========================= */
async function certifyProduct(id) {
    if (!confirm('Xác nhận cấp chứng nhận cho sản phẩm này?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_BASE}/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: 'CERTIFIED' })
        });
        if (!res.ok) throw new Error();
        alert('✅ Đã cấp chứng nhận thành công!');
        loadProducts();
    } catch {
        alert('❌ Không thể cập nhật!');
    }
}

/* ========================= MODAL THÊM SẢN PHẨM ========================= */
function openProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

async function addProductAction() {
    const token = localStorage.getItem('token');
    const form = document.getElementById('productForm');
    const productName = form.querySelector('input[type="text"]')?.value?.trim();
    const productTypeRaw = form.querySelector('select')?.value || '';
    const serialNumber = form.querySelectorAll('input[type="text"]')[1]?.value?.trim();
    const issuedAt = form.querySelector('input[type="date"]')?.value;
    const statusRadio = form.querySelector('input[name="prdState"]:checked');
    const status = statusRadio?.value === 'pending' ? 'PENDING' : 'CERTIFIED';

    const typeMap = {
        'Bằng Sáng Chế (Patents)': 'PATENT',
        'Giải pháp hữu ích': 'SOLUTION',
        'Sách Chuyên Khảo': 'BOOK_REFERENCE',
        'Sách Giáo trình / Tham khảo': 'BOOK_TEXTBOOK',
        'Sản phẩm Phần mềm / Ứng dụng': 'SOFTWARE',
        'Khác (Mô hình, Vật liệu...)': 'OTHER'
    };

    if (!productName) { alert('Vui lòng nhập tên sản phẩm!'); return; }

    try {
        const res = await fetch(`${API_BASE}/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                productName,
                productType: typeMap[productTypeRaw] || 'OTHER',
                serialNumber: serialNumber || null,
                issuedAt: issuedAt || null,
                status
            })
        });
        if (!res.ok) throw new Error();
        alert('✅ Đã đăng ký sản phẩm NCKH thành công!');
        closeProductModal();
        loadProducts();
    } catch {
        alert('❌ Không thể lưu. Kiểm tra kết nối backend!');
    }
}

function printCert() {
    alert('🖨️ Chức năng in phôi chứng nhận sẽ mở cửa sổ in PDF.');
}

/* ========================= KHỞI TẠO ========================= */
document.addEventListener('DOMContentLoaded', () => {
    loadProducts().then(() => {
        // Check for deep-linking
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const autoId = urlParams.get('id') || hashParams.get('id');
        
        if (autoId) {
            // Find product and trigger view or highlight
            const product = document.querySelector(`button[onclick*="ID:${autoId}"]`);
            if (product) {
                product.click();
            } else {
                // If not in the current list, we could fetch it, but alert for now as per current JS structure
                alert('ID:' + autoId + ' | Đang xem chi tiết sản phẩm...');
            }
        }
    });

    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const v = filterSelect.value;
            const map = { patent: 'PATENT', solution: 'SOLUTION', book: 'BOOK_REFERENCE', software: 'SOFTWARE' };
            loadProducts(v === 'all' ? '' : (map[v] || ''));
        });
    }

    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal-overlay')) closeProductModal();
    });
});


