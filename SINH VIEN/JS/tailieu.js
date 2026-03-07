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
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      allDocuments = await response.json();
      renderDocuments(allDocuments); // Render tất cả ngay từ đầu
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
      <div style="display: flex; gap: 15px;">
        <div style="width: 80px; height: 100px; flex-shrink: 0; overflow: hidden; border-radius: 5px; border: 1px solid #ccc;">
            <img src="${coverImage}" alt="Bìa" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${defaultCover}'" />
        </div>
        <div style="flex-grow: 1;">
            <h3>${doc.title}</h3>
            <p>Ngành: ${doc.major}</p>
            <p style="font-size: 0.85rem; color: #777;">Năm xuất bản: ${doc.publishYear}</p>
            <div class="doc-actions" style="margin-top: 15px;">
              <button class="btn-view" onclick="window.open('${fileUrl}', '_blank'); event.stopPropagation();" style="padding: 8px 15px; margin-right: 5px; background: #0b5ed7; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-eye"></i> Xem</button>
              <button onclick="downloadFile('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();" style="padding: 8px 15px; background: #198754; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-download"></i> Tải về</button>
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
window.addEventListener("DOMContentLoaded", loadDocuments);

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
function logout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
  window.location.href = '../../Dangnhap_wedIned/index.html'; 
}

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

  const token = localStorage.getItem('jwt_token');
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
