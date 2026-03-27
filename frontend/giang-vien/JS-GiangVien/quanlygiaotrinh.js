let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra trạng thái Đăng nhập bằng Token
    const token = typeof getToken === 'function' ? getToken() : null;
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập Cổng Giảng Viên!");
        window.location.href = "../../auth/index.html"; 
        return;
    }

    // 2. Tải và hiển thị thông tin Giảng viên từ LocalStorage
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        const userNameDisplay = document.querySelector('.user-profile-menu span');
        if (userNameDisplay) {
            userNameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${user.fullName}`;
        }
    }

    // 3. Xử lý sự kiện Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
        });
    }

    // 4. Đóng modal khi click ra ngoài
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeViewModal();
            closeEditModal();
            closeUploadModal();
            closeFolderModal();
        }
    });

    // 5. Load dữ liệu khởi tạo
    loadDocuments();
});

/* =========================================================
   SỬ LÝ LOAD DỮ LIỆU GIÁO TRÌNH
   ========================================================= */
const documentListContainer = document.getElementById("documentList");

async function loadDocuments() {
  if (!documentListContainer) return;

  try {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    let url = `http://localhost:8080/api/documents?type=GIAO_TRINH`;
    
    if (userInfo && userInfo.id) {
        url += `&uploaderId=${userInfo.id}`;
    }

    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      renderDocuments(result.data || []); 
    } else {
      console.error("Lỗi khi load giáo trình:", response.status);
      documentListContainer.innerHTML = "<div class='error-msg'>Không thể tải danh sách giáo trình.</div>";
    }
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
    documentListContainer.innerHTML = "<div class='error-msg'>Lỗi kết nối máy chủ. Vui lòng thử lại sau.</div>";
  }
}

function renderDocuments(documents) {
  documentListContainer.innerHTML = ""; 

  if (documents.length === 0) {
    documentListContainer.innerHTML = `
        <div style='grid-column: 1/-1; text-align:center; padding: 60px 0;'>
            <i class="fas fa-folder-open fa-3x" style="color: #cbd5e1; margin-bottom: 20px;"></i>
            <p style='color:#64748b; font-weight: 600;'>Bạn chưa đăng tải giáo trình nào.</p>
        </div>`;
    return;
  }

  documents.forEach(doc => {
    const defaultCover = "https://placehold.co/300x400/4F46E5/FFFFFF?text=Giáo+Trình";
    
    // Xử lý URL file và ảnh bìa
    const encodedCoverUrl = doc.coverUrl ? encodeURIComponent(doc.coverUrl) : '';
    const encodedFileUrl = doc.fileUrl ? encodeURIComponent(doc.fileUrl) : '';

    const coverImage = doc.coverUrl ? `http://localhost:8080/api/documents/files/${encodedCoverUrl}` : defaultCover;
    const fileUrl = doc.fileUrl ? `http://localhost:8080/api/documents/files/${encodedFileUrl}` : "#";

    const card = document.createElement("div");
    card.className = "premium-card doc-card";
    
    card.innerHTML = `
      <div class="doc-cover">
         <img src="${coverImage}" alt="Bìa" onerror="this.src='${defaultCover}'" />
      </div>
      <div class="doc-info">
        <h3>${doc.title}</h3>
        <p><i class="fas fa-bookmark"></i> ${doc.major}</p>
        <span><i class="far fa-calendar-alt"></i> Năm phát hành: ${doc.publishYear}</span>
        <div class="doc-actions">
           <button class="btn-view" onclick="openDocPreview('${doc.title}', '${doc.major}', '${doc.publishYear}', '${fileUrl}')"><i class="fas fa-eye"></i></button>
           <button class="btn-edit" onclick="openEditModal(${doc.id}, '${doc.title}', '${doc.major}', ${doc.publishYear})"><i class="fas fa-edit"></i></button>
           <button class="btn-delete" onclick="deleteDocument(${doc.id})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
    documentListContainer.appendChild(card);
  });
}

function openDocPreview(title, major, year, url) {
    document.getElementById('viewModalTitle').textContent = title;
    document.getElementById('viewModalSubject').querySelector('span').textContent = major;
    document.getElementById('viewModalMeta').textContent = `Năm phát hành: ${year}`;
    
    // Gắn hàm download
    window.handleDownload = () => {
        window.open(url, '_blank');
    };

    document.getElementById('viewModal').classList.add('active');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
}

function openEditModal(id, title, subject, year) {
    currentEditingId = id;
    document.getElementById('editDocName').value = title;
    document.getElementById('editDocSubject').value = subject;
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingId = null;
}

async function saveDocument() {
    if (!currentEditingId) return;
    const newName = document.getElementById('editDocName').value;
    const newSubject = document.getElementById('editDocSubject').value;

    if(!newName.trim()) {
        alert("⚠️ Tên giáo trình không được để trống!");
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', newName);
        formData.append('major', newSubject);
        formData.append('publishYear', 2026);

        const response = await fetch(`http://localhost:8080/api/documents/${currentEditingId}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });

        if (response.ok) {
            alert("✅ Cập nhật thành công!");
            closeEditModal();
            loadDocuments();
        } else {
            const err = await response.json();
            alert("Lỗi: " + (err.message || "Không thể cập nhật"));
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Lỗi kết nối máy chủ!");
    }
}

async function deleteDocument(id) {
    if (!confirm("⚠️ Bạn có chắc chắn muốn xóa giáo trình này?")) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("✅ Đã xóa giáo trình!");
            loadDocuments();
        } else {
            const err = await response.json();
            alert("Lỗi: " + (err.message || "Không thể xóa"));
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Lỗi kết nối máy chủ!");
    }
}

/* =========================================================
   UPLOAD LOGIC WITH OTP
   ========================================================= */
/* =========================================================
   UPLOAD & FOLDER MODAL CONTROLS
   ========================================================= */

function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    document.getElementById('uploadForm').reset();
}

function openFolderModal() {
    document.getElementById('folderModal').classList.add('active');
}

function closeFolderModal() {
    document.getElementById('folderModal').classList.remove('active');
    document.getElementById('folderName').value = "";
}

async function submitUploadForm(event) {
    if (event) event.preventDefault();

    const title = document.getElementById('docTitle').value;
    const major = document.getElementById('docMajor').value;
    const year = document.getElementById('docYear').value;
    const coverFile = document.getElementById('docCover').files[0];
    const docFile = document.getElementById('docFile').files[0];

    if (!docFile) {
        alert("⚠️ Vui lòng chọn file giáo trình đính kèm!");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('major', major);
    formData.append('publishYear', year);
    formData.append('type', 'GIAO_TRINH');
    formData.append('file', docFile);
    if (coverFile) {
        formData.append('cover', coverFile);
    }

    const token = localStorage.getItem('token');
    
    if (typeof requireOtpBeforeAction === 'function') {
        requireOtpBeforeAction(async () => {
            try {
                const response = await fetch('http://localhost:8080/api/documents/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });

                if (response.ok) {
                    alert("✅ Đã tải lên giáo trình thành công!");
                    closeUploadModal();
                    loadDocuments();
                } else {
                    const err = await response.text();
                    alert("Lỗi: " + err);
                }
            } catch (error) {
                console.error("Upload error:", error);
                alert("Lỗi kết nối máy chủ!");
            }
        });
    } else {
        alert("Hệ thống xác thực OTP chưa sẵn sàng!");
    }
}

async function createFolder() {
    const name = document.getElementById('folderName').value;
    if (!name.trim()) {
        alert("Vui lòng nhập tên thư mục!");
        return;
    }
    alert(`✅ Thư mục giáo trình "${name}" đã được tạo (UI Demo)!`);
    closeFolderModal();
}



