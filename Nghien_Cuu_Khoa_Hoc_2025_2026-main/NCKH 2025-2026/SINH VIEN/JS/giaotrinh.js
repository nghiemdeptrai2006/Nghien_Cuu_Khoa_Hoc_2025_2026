/* =========================
   FILTER BOOKS
========================= */
const filterSelects = document.querySelectorAll(".filter-area select");
const bookCards = document.querySelectorAll(".book-card");

function filterBooks() {
  const major = filterSelects[0].value;
  const year = filterSelects[1].value;

  bookCards.forEach(card => {
    const cardMajor = card.querySelectorAll("p")[0].innerText;
    const cardYear = card.querySelectorAll("p")[1].innerText;

    let visible = true;

    // Lọc theo ngành
    if (
      major !== "Tất cả ngành" &&
      !cardMajor.toLowerCase().includes(major.toLowerCase())
    ) {
      visible = false;
    }

    // Lọc theo năm
    if (
      year !== "Tất cả năm học" &&
      !cardYear.includes(year)
    ) {
      visible = false;
    }

    card.style.display = visible ? "block" : "none";
  });
}

// Gắn sự kiện change
filterSelects.forEach(select => {
  select.addEventListener("change", filterBooks);
});

/* =========================
   VIEW / DOWNLOAD BOOK
========================= */
const bookButtons = document.querySelectorAll(".book-card button");

bookButtons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".book-card");
    const title = card.querySelector("h3").innerText;
    const fileName = button.dataset.file;

    if (!fileName) {
      alert("Giáo trình chưa có file đính kèm!");
      return;
    }

    const choice = confirm(
      "Giáo trình: " + title +
      "\n\nNhấn OK để XEM\nNhấn Hủy để TẢI"
    );

    const filePath = "/PDF/" + fileName;

    if (choice) {
      // Xem online (tab mới)
      window.open(filePath, "_blank");
    } else {
      // Tải về
      const link = document.createElement("a");
      link.href = filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});
