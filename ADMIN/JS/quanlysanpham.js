/* =========================================================
   SCIENTIFIC PRODUCT ACTION (ADMIN)
   ========================================================= */

const productModal = document.getElementById('productModal');

function openProductModal() {
    document.getElementById('productForm').reset();
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
}

function addProductAction() {
    alert("✅ Đã cập nhật Sản phẩm NCKH mới vào Kho dữ liệu số!");
    closeProductModal();
}

function printCert() {
    alert("🖨️ Đang tải mẫu Phôi Chứng nhận Điện tử...");
}

// Intercept Approve buttons
document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', function() {
        let rs = confirm("⚠️ Ban Quản Lý xác nhận TỰ ĐỘNG CẤP CHỨNG NHẬN cho Giải pháp này?");
        if(rs) {
            alert("✅ Hệ thống đã sinh Mã QR Quyết định và cập nhật trạng thái!");
            this.parentElement.innerHTML = '<button class="btn-sm btn-view" style="flex:1;"><i class="fa-solid fa-eye"></i> Xem Quyết định</button>';
        }
    });
});

// Handle clicks outside of modals
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeProductModal();
    }
});
