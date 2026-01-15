/* =========================
   FILTER THESIS
========================= */
const selects = document.querySelectorAll(".filter-area select");
const thesisCards = document.querySelectorAll(".thesis-card");

function filterThesis() {
  const major = selects[0].value;
  const level = selects[1].value; // hiện chưa có trong data
  const year = selects[2].value;

  thesisCards.forEach(card => {
    const cardMajor = card.querySelectorAll("p")[1].innerText;
    const cardYear = card.querySelectorAll("p")[2].innerText;

    let show = true;

    // Lọc theo ngành
    if (major !== "Tất cả ngành" && !cardMajor.includes(major)) {
      show = false;
    }

    // Lọc theo năm
    if (year !== "Tất cả năm" && !cardYear.includes(year)) {
      show = false;
    }

    card.style.display = show ? "block" : "none";
  });
}

// Gắn sự kiện change cho các select
selects.forEach(select => {
  select.addEventListener("change", filterThesis);
});

/* =========================
   VIEW DETAIL BUTTON
========================= */
const detailButtons = document.querySelectorAll(".thesis-card button");

detailButtons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".thesis-card");
    const title = card.querySelector("h3").innerText;
    const thesisId = button.dataset.id;

    if (!thesisId) {
      alert("Luận văn chưa có mã chi tiết!");
      return;
    }

    // Chuyển trang chi tiết, kèm id
    window.location.href =
      "/HTML/luanvan-chitiet.html?id=" + thesisId;
  });
});
