/* =========================
   SEARCH DOCUMENT
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

const searchInput = document.querySelector(".search-area input");
const searchBtn = document.querySelector(".search-area button");
const documents = document.querySelectorAll(".doc-card");

function searchDocument() {
  const keyword = removeVietnameseTones(searchInput.value);

  documents.forEach(doc => {
    const title = removeVietnameseTones(doc.querySelector("h3").innerText);
    const major = removeVietnameseTones(doc.querySelector("p").innerText);

    if (title.includes(keyword) || major.includes(keyword)) {
      doc.style.display = "block";
    } else {
      doc.style.display = "none";
    }
  });
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
   DOWNLOAD BUTTON
========================= */
const downloadButtons = document.querySelectorAll(".doc-card button");

downloadButtons.forEach(button => {
  button.addEventListener("click", () => {
    const fileName = button.dataset.file;
    const docName = button.closest(".doc-card").querySelector("h3").innerText;

    if (!fileName) {
      alert("Tài liệu chưa có file đính kèm!");
      return;
    }

    alert("Bạn đang tải tài liệu: " + docName);

    const link = document.createElement("a");
    link.href = "/downloads/" + fileName;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
