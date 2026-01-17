/* =========================
   SCROLL HEADER EFFECT
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (!header) return;

  header.style.background =
    window.scrollY > 40
      ? "rgba(10, 79, 163, 0.97)"
      : "#0a4fa3";
});

/* =========================
   DASHBOARD CARD CLICK EFFECT
========================= */
const cards = document.querySelectorAll(".dashboard .card");

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Nếu click vào thẻ <a> thì để link xử lý bình thường
    if (e.target.tagName.toLowerCase() === "a") return;

    const link = card.querySelector("a");
    if (link) {
      window.location.href = link.getAttribute("href");
    }
  });
});

/* =========================
   WELCOME MESSAGE (OPTIONAL)
========================= */
window.addEventListener("load", () => {
  const bannerTitle = document.querySelector(".banner h2");
  if (!bannerTitle) return;

  // Hiệu ứng chữ đơn giản
  bannerTitle.style.opacity = "0";

  setTimeout(() => {
    bannerTitle.style.transition = "opacity 0.8s ease";
    bannerTitle.style.opacity = "1";
  }, 200);
});
