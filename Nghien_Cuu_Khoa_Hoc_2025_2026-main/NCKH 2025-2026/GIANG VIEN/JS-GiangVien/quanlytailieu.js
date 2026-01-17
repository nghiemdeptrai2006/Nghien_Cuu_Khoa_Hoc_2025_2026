/* =========================
   SCROLL HEADER EFFECT
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (!header) return;

  header.style.background =
    window.scrollY > 50
      ? "linear-gradient(90deg, #1e40af, #2563eb)"
      : "linear-gradient(90deg, #1e40af, #2563eb)";
});

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

const searchInput = document.querySelector(".tool-bar input");
const docCards = document.querySelectorAll(".doc-card");

function searchDocument() {
  if (!searchInput) return;

  const keyword = removeVietnameseTones(searchInput.value);

  docCards.forEach((card) => {
    const title = removeVietnameseTones(
      card.querySelector("h3").innerText
    );
    const subject = removeVietnameseTones(
      card.querySelector("p").innerText
    );

    const match =
      title.includes(keyword) || subject.includes(keyword);

    card.style.display = match ? "block" : "none";
  });
}

// Gõ tới đâu lọc tới đó
if (searchInput) {
  searchInput.addEventListener("keyup", searchDocument);
}

// Nhấn Enter để tìm kiếm
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchDocument();
  }
});

/* =========================
   TOOL BAR BUTTONS (DEMO)
========================= */
const toolbarButtons = document.querySelectorAll(".tool-bar button");

toolbarButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    switch (index) {
      case 0:
        alert("📤 Chức năng tải tài liệu sẽ được triển khai!");
        break;
      case 1:
        alert("📁 Chức năng tạo thư mục sẽ được triển khai!");
        break;
      case 2:
        alert("🔍 Chức năng lọc tài liệu nâng cao!");
        break;
    }
  });
});

/* =========================
   DOCUMENT ACTIONS
========================= */
const actionLinks = document.querySelectorAll(".doc-actions a");

actionLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const action = link.innerText;
    const card = link.closest(".doc-card");
    const title = card.querySelector("h3").innerText;

    if (action === "Xem") {
      alert("📄 Xem tài liệu: " + title);
    }

    if (action === "Sửa") {
      alert("✏️ Chỉnh sửa tài liệu: " + title);
    }

    if (action === "Xóa") {
      const ok = confirm(
        "❗ Bạn có chắc chắn muốn xóa tài liệu:\n" + title
      );
      if (ok) {
        card.remove();
      }
    }
  });
});

/* =========================
   CARD CLICK SUPPORT
========================= */
docCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Tránh xung đột khi click action
    if (e.target.tagName.toLowerCase() === "a") return;
    card.classList.toggle("active");
  });
});
