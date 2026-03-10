/* =========================================================
   SCIENTIFIC PAPER ACTION (ADMIN)
   ========================================================= */

const paperModal = document.getElementById('paperModal');

function openPaperModal() {
    document.getElementById('paperForm').reset();
    paperModal.classList.add('active');
}

function closePaperModal() {
    paperModal.classList.remove('active');
}

function addPaperAction() {
    alert("✅ Đã cập nhật Bài báo khoa học mới vào CSDL Hệ thống!");
    closePaperModal();
}

function viewPaper(id) {
    alert("🪟 [Tính năng Mở Rộng] - Mở PDF Preview trực tuyến cho bài báo " + id);
}

function approvePaper(id) {
    let check = confirm("⚠️ Ban Chủ Nhiệm Khoa xác nhận PHÊ DUYỆT TÍNH ĐIỂM cho Bài báo: " + id + " ?");
    if(check) {
        alert("✅ Đã đổi trạng thái thành công!");
    }
}

// Handle clicks outside of modals
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closePaperModal();
    }
});
