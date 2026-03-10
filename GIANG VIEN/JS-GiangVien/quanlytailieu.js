document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra trạng thái Đăng nhập bằng Token
    const token = typeof getToken === 'function' ? getToken() : null;
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập Cổng Giảng Viên!");
        window.location.href = "../../Dangnhap_wedIned/index.html"; 
        return;
    }

    // 2. Tải và hiển thị thông tin Giảng viên từ LocalStorage
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        
        // Cập nhật tên trên Header (Góc phải trên cùng)
        const userNameDisplay = document.querySelector('.user-profile-menu span');
        if (userNameDisplay) {
            userNameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${user.fullName}`;
        }

        // Cập nhật thẻ Banner chào mừng (Dành riêng cho Trang chủ)
        const welcomeTitle = document.querySelector('.banner h2');
        if (welcomeTitle && welcomeTitle.textContent.includes('Xin chào')) {
            welcomeTitle.textContent = `Xin chào, ${user.fullName} 👋`;
        }
    }

    // 3. Xử lý sự kiện Mobile Menu (Header Menu Toggle)
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
        });
    }

    // 4. Handle clicks outside of modals to close them
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeViewModal();
            closeEditModal();
        }
    });

    // 5. Load Data
    loadDocuments();
});

/* =========================================================
   SỬ LÝ LOAD DỮ LIỆU TỪ BACKEND
   ========================================================= */
const documentListContainer = document.getElementById("documentList");

async function loadDocuments() {
  try {
    const url = `http://localhost:8080/api/documents?type=TAI_LIEU`;
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const documents = await response.json();
      renderDocuments(documents); 
    } else {
      console.error("Lỗi khi load tài liệu:", response.status);
    }
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
  }
}

// Xây dựng giao diện thẻ Tài liệu
function renderDocuments(documents) {
  documentListContainer.innerHTML = ""; // Xóa dữ liệu cũ

  if (documents.length === 0) {
    documentListContainer.innerHTML = "<p style='text-align:center;width:100%;color:#888;'>Bạn chưa có tài liệu nào.</p>";
    return;
  }

  documents.forEach(doc => {
    const defaultCover = "https://placehold.co/300x400/1a237e/FFFFFF?text=Tài+Liệu";
    
    const encodedCoverUrl = doc.coverUrl ? encodeURIComponent(doc.coverUrl) : '';
    const encodedFileUrl = doc.fileUrl ? encodeURIComponent(doc.fileUrl) : '';

    const coverImage = encodedCoverUrl ? `http://localhost:8080/api/documents/files/${encodedCoverUrl}` : defaultCover;
    const fileUrl = encodedFileUrl ? `http://localhost:8080/api/documents/files/${encodedFileUrl}` : "#";

    const card = document.createElement("div");
    card.classList.add("doc-card");
    
    card.innerHTML = `
      <div class="doc-cover">
         <img src="${coverImage}" alt="Bìa" onerror="this.src='${defaultCover}'" />
      </div>
      <div class="doc-info">
        <h3>${doc.title}</h3>
        <p>Môn học/Ngành: ${doc.major}</p>
        <span>Năm phát hành: ${doc.publishYear}</span>
        <div class="doc-actions">
           <a onclick="window.open('${fileUrl}', '_blank'); event.stopPropagation();"><i class="fas fa-eye"></i> Xem</a>
           <a onclick="openEditModal('${doc.title}', '${doc.major}')"><i class="fas fa-edit"></i> Sửa</a>
           <a style="cursor: pointer;" onclick="alert('Tính năng xóa đang hoàn thiện!'); event.stopPropagation();"><i class="fas fa-trash"></i> Xóa</a>
        </div>
      </div>
    `;
    documentListContainer.appendChild(card);
  });
}


/* =========================================================
   MODAL FUNCTIONALITY (VIEW & EDIT DOCUMENT)
   ========================================================= */

// Open View Modal with dynamic data
function openViewModal(title, subject, meta) {
    document.getElementById('viewModalTitle').textContent = title;
    document.getElementById('viewModalSubject').querySelector('span').textContent = subject;
    document.getElementById('viewModalMeta').querySelector('span').textContent = meta;
    
    document.getElementById('viewModal').classList.add('active');
}

// Close View Modal
function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
}

// Open Edit Modal with pre-filled data
function openEditModal(title, subject) {
    document.getElementById('editDocName').value = title;
    document.getElementById('editDocSubject').value = subject;
    
    document.getElementById('editModal').classList.add('active');
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

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

/* =========================================================
   OVERRIDE UPLOAD HTML FUNCTION (FROM INLINE SCRIPT)
   ========================================================= */
window.submitUpload = async function() {
    const fileInput = document.getElementById('fileUpload');
    if(fileInput.files.length === 0) {
        alert("⚠️ Vui lòng chọn một file đính kèm trước khi tải lên!");
        return;
    }

    const title = prompt("Nhập tên Tài liệu: ");
    if(!title) return;

    const major = prompt("Nhập Môn học/Ngành học: ");
    if(!major) return;

    const year = prompt("Nhập năm xuất bản: ", "2025");
    if(!year) return;
    
    // Tạo FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('major', major);
    formData.append('publishYear', year);
    formData.append('type', 'TAI_LIEU');
    formData.append('file', fileInput.files[0]);
    // Note: Ảnh bìa tạm thời chưa có input fileCover trong thẻ HTML upload ảo, sẽ báo user tạo modal đầy đủ sau.

    const token = localStorage.getItem('jwt_token');
    try {
        const response = await fetch('http://localhost:8080/api/documents/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        if (response.ok) {
            alert("✅ Tải lên tài liệu giảng dạy thành công vào hệ thống!");
            fileInput.value = "";
            document.getElementById('fileName').textContent = "";
            toggleUploadArea();
            loadDocuments(); // Refresh danh sách
        } else {
            const err = await response.text();
            alert("Lỗi đăng tải: " + err);
        }
    } catch (error) {
        console.error("Upload error:", error);
        alert("Không thể kết nối Server!");
    }
}