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
            if(typeof closeViewModal === 'function') closeViewModal();
            if(typeof closeEditModal === 'function') closeEditModal();
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
    const url = `http://localhost:8080/api/documents?type=GIAO_TRINH`;
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
      console.error("Lỗi khi load giáo trình:", response.status);
    }
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
  }
}

// Xây dựng giao diện thẻ Giáo trình
function renderDocuments(documents) {
  if (!documentListContainer) return;

  documentListContainer.innerHTML = ""; // Xóa dữ liệu cũ

  if (documents.length === 0) {
    documentListContainer.innerHTML = "<p style='text-align:center;width:100%;color:#888;'>Bạn chưa có giáo trình nào.</p>";
    return;
  }

  documents.forEach(doc => {
    const defaultCover = "https://placehold.co/300x400/1a237e/FFFFFF?text=Giáo+Trình";
    
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
           <a onclick="alert('Tính năng sửa đang code!'); event.stopPropagation();"><i class="fas fa-edit"></i> Sửa</a>
           <a style="cursor: pointer;" onclick="alert('Tính năng xóa đang code!'); event.stopPropagation();"><i class="fas fa-trash"></i> Xóa</a>
        </div>
      </div>
    `;
    documentListContainer.appendChild(card);
  });
}