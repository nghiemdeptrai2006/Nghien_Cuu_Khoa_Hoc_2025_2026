/* =========================================================
   MODAL FUNCTIONALITY (VIEW & EDIT DOCUMENT) - ADMIN
   ========================================================= */

// DOM Elements
const viewModal = document.getElementById('viewModal');
const editModal = document.getElementById('editModal');

// Open View Modal with dynamic data
function openViewModal(title, subject, meta) {
    document.getElementById('viewModalTitle').textContent = title;
    document.getElementById('viewModalSubject').querySelector('span').textContent = subject;
    document.getElementById('viewModalMeta').querySelector('span').textContent = meta;
    
    viewModal.classList.add('active');
}

// Close View Modal
function closeViewModal() {
    viewModal.classList.remove('active');
}

// Open Edit Modal with pre-filled data
function openEditModal(title, subject) {
    document.getElementById('editDocName').value = title;
    document.getElementById('editDocSubject').value = subject;
    
    editModal.classList.add('active');
}

// Close Edit Modal
function closeEditModal() {
    editModal.classList.remove('active');
}

// Handle clicks outside of modals to close them
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeViewModal();
        closeEditModal();
    }
});

// Save Changes Simulation
function saveDocument() {
    const newName = document.getElementById('editDocName').value;
    if(newName.trim() === '') {
        alert("⚠️ Tên tài liệu không được để trống!");
        return;
    }
    
    alert("✅ Đã cập nhật thành công tài liệu: " + newName);
    closeEditModal();
}
