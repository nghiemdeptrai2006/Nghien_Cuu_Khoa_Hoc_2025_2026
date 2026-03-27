/* =========================
   SỬ LÝ LOAD DỮ LIỆU TỪ BACKEND
========================= */
const documentListContainer = document.querySelector(".document-list");
const searchInput = document.querySelector(".search-area input");
const searchBtn = document.querySelector(".search-area button");

let allDocuments = []; // Lưu trữ tạm thời danh sách gốc để Tìm kiếm Frontend

// Load tất cả sách thuộc "TAI_LIEU" khi vừa mở trang
async function loadDocuments() {
  try {
    const url = `http://localhost:8080/api/documents?type=TAI_LIEU`;
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      allDocuments = (await response.json()).data;
      renderDocuments(allDocuments); // Render tất cả ngay từ đầu
    } else {
      console.error("Lỗi khi load tài liệu:", response.status);
    }
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
    documentListContainer.innerHTML = "<p style='text-align:center;width:100%;color:#888;padding: 40px;'>Chưa có tài liệu nào hoặc không thể kết nối Máy chủ.</p>";
  }
}

// Xây dựng giao diện thẻ Tài liệu
function renderDocuments(documents) {
  documentListContainer.innerHTML = ""; // Xóa dữ liệu cũ

  if (documents.length === 0) {
    documentListContainer.innerHTML = "<p style='text-align:center;width:100%;color:#888;'>Không có tài liệu nào phù hợp tiêu chí.</p>";
    return;
  }

  documents.forEach(doc => {
    // Nếu có ảnh bìa thì dùng, không có thì dùng dạng Icon
    const defaultCover = "https://placehold.co/300x400/1a237e/FFFFFF?text=Tài+Liệu";
    
    // EncodeURIComponent giúp xử lý các File có dấu tiếng Việt và "Dấu cách"
    const encodedCoverUrl = doc.coverUrl ? encodeURIComponent(doc.coverUrl) : '';
    const encodedFileUrl = doc.fileUrl ? encodeURIComponent(doc.fileUrl) : '';

    const coverImage = encodedCoverUrl ? `http://localhost:8080/api/documents/files/${encodedCoverUrl}` : defaultCover;
    const fileUrl = encodedFileUrl ? `http://localhost:8080/api/documents/files/${encodedFileUrl}` : "#";

    const card = document.createElement("div");
    card.classList.add("doc-card");
    
    card.innerHTML = `
      <div class="doc-card-inner" style="display: flex; gap: 20px; align-items: flex-start;">
        <div class="doc-cover-container" style="width: 100px; height: 130px; flex-shrink: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
            <img src="${coverImage}" alt="Bìa" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${defaultCover}'" />
        </div>
        <div class="doc-info" style="flex-grow: 1;">
            <h3 style="margin-top: 0; color: var(--text-main); font-size: 1.25rem;">${doc.title}</h3>
            <p style="margin-bottom: 8px;"><i class="fas fa-graduation-cap"></i> Ngành: ${doc.major}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;"><i class="fas fa-calendar-alt"></i> Năm xuất bản: ${doc.publishYear}</p>
            <div class="doc-actions" style="display: flex; gap: 10px;">
              <button class="btn-primary" onclick="previewDocument('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();" style="padding: 10px 20px; font-size: 0.9rem; flex: 1;"><i class="fas fa-eye"></i> Xem</button>
              <button class="btn-cancel" onclick="downloadFile('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();" style="padding: 10px 20px; font-size: 0.9rem; flex: 1; border: 1px solid var(--border-color);"><i class="fas fa-download"></i> Tải về</button>
            </div>
        </div>
      </div>
    `;
    documentListContainer.appendChild(card);
  });
}

// Cập nhật hàm tải file
function downloadFile(url, fileName) {
  if (url === "#" || !fileName) {
    alert("Không tìm thấy file tài liệu.");
    return;
  }
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Chạy load khi khởi tạo trang
window.addEventListener("DOMContentLoaded", async () => {
  // Cập nhật tên người dùng từ localStorage
  const fullName = localStorage.getItem('fullName');
  const profileSpan = document.querySelector('.user-profile-menu span');
  if (fullName && profileSpan) {
    profileSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${fullName}`;
  }

  await loadDocuments();

  // Nếu từ trangchu tìm kiếm → auto-fill và filter ngay
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q && searchInput) {
    searchInput.value = decodeURIComponent(q);
    searchDocument();
    // Scroll xuống kết quả
    setTimeout(() => {
      const list = document.querySelector('.document-list, .search-area');
      if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
});


/* =========================
   SEARCH DOCUMENT (Fontend Filter)
========================= */
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function searchDocument() {
  const keyword = removeVietnameseTones(searchInput.value);

  // Lọc trực tiếp từ mảng allDocuments đã lưu
  const filteredDocs = allDocuments.filter(doc => {
    const title = removeVietnameseTones(doc.title);
    const major = removeVietnameseTones(doc.major);
    return title.includes(keyword) || major.includes(keyword);
  });

  renderDocuments(filteredDocs);
}

// Click nút tìm kiếm
searchBtn.addEventListener("click", searchDocument);

// Gõ tới đâu lọc tới đó
searchInput.addEventListener("keyup", searchDocument);

// Nhấn Enter để tìm kiếm
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchDocument();
  }
});

/* =========================
   LOGOUT FUNCTION
========================= */
// Global logout() is now provided by /shared/js/auth.js

/* =========================
   API UPLOAD TÀI LIỆU TỰ DO
========================= */
const uploadModal = document.getElementById('uploadModal');

function openUploadModal() {
  uploadModal.classList.add('active');
}

function closeUploadModal() {
  uploadModal.classList.remove('active');
  document.getElementById('uploadForm').reset();
}

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('docTitle').value;
  const major = document.getElementById('docMajor').value;
  const year = document.getElementById('docYear').value;
  const coverFile = document.getElementById('docCover').files[0];
  const docFile = document.getElementById('docFile').files[0];

  if (!docFile) {
    alert("Vui lòng chọn File đính kèm tài liệu.");
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('major', major);
  formData.append('publishYear', year);
  formData.append('type', 'TAI_LIEU'); // Upload dưới dạng TAI_LIEU
  if(coverFile) formData.append('cover', coverFile); // Ảnh bìa không bắt buộc đối với Tài Liệu
  formData.append('file', docFile);

  const token = localStorage.getItem('token');
  if(!token) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/documents/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });

    if (response.ok) {
      alert("Đăng tài liệu thành công!");
      closeUploadModal();
      loadDocuments(); // Load lại danh sách luôn
    } else {
      const err = await response.text();
      alert("Lỗi đăng tải: " + err);
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Không thể kết nối Server!");
  }
});


