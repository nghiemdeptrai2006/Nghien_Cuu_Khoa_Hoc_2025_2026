/* =========================
   SCROLL HEADER EFFECT
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (!header) return;

  header.style.background =
    window.scrollY > 40
      ? "rgba(10,79,163,0.97)"
      : "rgba(10,79,163,0.95)";
});

/* =========================
   SEARCH THESIS
========================= */
const searchInput = document.querySelector(".tool-bar input");
const thesisCards = document.querySelectorAll(".doc-card");

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function searchThesis() {
  if (!searchInput) return;

  const keyword = removeVietnameseTones(searchInput.value);

  thesisCards.forEach(card => {
    const title = removeVietnameseTones(card.querySelector("h3").innerText);
    const student = removeVietnameseTones(card.querySelector("p").innerText);
    const match =
      title.includes(keyword) || student.includes(keyword);

    card.style.display = match ? "block" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("keyup", searchThesis);
}

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchThesis();
  }
});

/* =========================
   TOOL BAR BUTTONS (DEMO)
========================= */
const toolButtons = document.querySelectorAll(".tool-bar button");

toolButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    switch (index) {
      case 0:
        alert("📤 Chức năng tải luận văn sẽ được triển khai sau");
        break;
      case 1:
        alert("📁 Tạo thư mục mới (demo)");
        break;
      case 2:
        alert("🔍 Bộ lọc nâng cao theo năm / ngành");
        break;
    }
  });
});

/* =========================
   DOC ACTIONS
========================= */
const actionLinks = document.querySelectorAll(".doc-actions a");

actionLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const action = link.innerText.toLowerCase();
    const card = link.closest(".doc-card");
    const title = card.querySelector("h3").innerText;

    if (action === "xem") {
      alert("📄 Đang mở luận văn:\n" + title);
    }

    if (action === "sửa") {
      alert("✏️ Chỉnh sửa thông tin luận văn:\n" + title);
    }

    if (action === "xóa") {
      const ok = confirm(
        "⚠️ Bạn có chắc chắn muốn xóa luận văn:\n" + title + " ?"
      );

      if (ok) {
        card.remove();
      }
    }
  });
});
