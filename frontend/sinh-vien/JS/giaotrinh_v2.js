/* =========================
   SỬ LÝ LOAD DỮ LIỆU TỪ BACKEND
========================= */
const bookListContainer = document.querySelector(".book-list");
const filterSelects = document.querySelectorAll(".filter-area select");

// Load tất cả sách thuộc "GIAO_TRINH" khi vừa mở trang
async function loadBooks() {
  try {
    const major = filterSelects[0].value === "Tất cả ngành" ? "" : filterSelects[0].value;
    const year = filterSelects[1].value === "Tất cả năm học" ? "" : filterSelects[1].value;

    let url = `http://localhost:8080/api/documents?type=GIAO_TRINH`;
    if (major) url += `&major=${encodeURIComponent(major)}`;
    if (year) url += `&publishYear=${year}`;

    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const documents = (await response.json()).data;
      renderBooks(documents);
    } else {
      console.error("Lỗi khi load giáo trình:", response.status);
    }
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
  }
}

// Xây dựng giao diện thẻ Sách
function renderBooks(documents) {
  bookListContainer.innerHTML = ""; // Xóa dữ liệu cũ tĩnh

  if (documents.length === 0) {
    bookListContainer.innerHTML = "<p style='text-align:center;width:100%;color:#888;'>Không có giáo trình nào phù hợp tiêu chí.</p>";
    return;
  }

  documents.forEach(doc => {
    const defaultCover = "https://placehold.co/300x400/1a237e/FFFFFF?text=Bìa+Sách";
    
    // EncodeURIComponent giúp xử lý các File có dấu tiếng Việt và "Dấu cách"
    const encodedCoverUrl = doc.coverUrl ? encodeURIComponent(doc.coverUrl) : '';
    const encodedFileUrl = doc.fileUrl ? encodeURIComponent(doc.fileUrl) : '';

    const coverImage = encodedCoverUrl ? `http://localhost:8080/api/documents/files/${encodedCoverUrl}` : defaultCover;
    const fileUrl = encodedFileUrl ? `http://localhost:8080/api/documents/files/${encodedFileUrl}` : "#";

    const card = document.createElement("div");
    card.classList.add("book-card");
    
    card.innerHTML = `
        <div class="book-cover">
          <img src="${coverImage}" alt="Bìa sách ${doc.title}" onerror="this.src='${defaultCover}'" />
        </div>
        <div class="book-info">
          <h3>${doc.title}</h3>
          <p><i class="fas fa-layer-group"></i> Ngành: ${doc.major}</p>
          <p><i class="far fa-calendar-alt"></i> Năm: ${doc.publishYear}</p>
          <div class="book-actions">
            <!-- Nút Xem (Mở viewer nội bộ) -->
            <button class="btn-view" onclick="previewDocument('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();"><i class="fas fa-eye"></i> Xem</button>
            
            <!-- Nút Tải (Ép trình duyệt tải về) -->
            <button class="btn-download" onclick="downloadFile('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();"><i class="fas fa-download"></i> Tải về</button>
          </div>
        </div>
    `;
    bookListContainer.appendChild(card);
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

// Gắn sự kiện Lọc cho 2 dropdown
filterSelects.forEach(select => {
  select.addEventListener("change", loadBooks);
});

// Chạy load khi khởi tạo trang
window.addEventListener("DOMContentLoaded", () => {
  // Cập nhật tên người dùng từ localStorage
  const fullName = localStorage.getItem('fullName');
  const profileSpan = document.querySelector('.user-profile-menu span');
  if (fullName && profileSpan) {
    profileSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${fullName}`;
  }

  loadBooks();
});



/* =========================
   LOGOUT FUNCTION
========================= */
// Global logout() is now provided by /shared/js/auth.js




