/* =========================
   MENU MOBILE
========================= */
const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}

/* =========================
   SCROLL HEADER EFFECT
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (!header) return;
  header.style.background =
    window.scrollY > 50
      ? "rgba(11, 94, 215, 0.98)"
      : "rgba(11, 94, 215, 0.9)";
});

/* =========================
   SCROLL ANIMATION
========================= */
const revealElements = document.querySelectorAll(".feature-card, .stat-box");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* =========================
   CHAT SUPPORT
========================= */
const chatBtn = document.getElementById("chatBtn");
const chatPopup = document.getElementById("chatPopup");
const closeChat = document.getElementById("closeChat");

if (chatBtn && chatPopup) {
  chatBtn.addEventListener("click", () => {
    chatPopup.style.display = "block";
  });
}

if (closeChat && chatPopup) {
  closeChat.addEventListener("click", () => {
    chatPopup.style.display = "none";
  });
}

/* =========================
   CHAT MESSAGE DEMO
========================= */
const chatForm = document.getElementById("chatForm");
const chatBody = document.getElementById("chatBody");

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(message) {
  const text = message.toLowerCase();

  if (text.includes("tài liệu"))
    return "Bạn có thể tìm tài liệu theo tên môn học hoặc từ khóa.";
  if (text.includes("giáo trình"))
    return "Giáo trình hỗ trợ xem online và tải về PDF.";
  if (text.includes("luận văn"))
    return "Luận văn được phân loại theo ngành và năm.";
  if (text.includes("liên hệ"))
    return "Vui lòng liên hệ email: khoquocte@edu.vn";

  return "Hệ thống đã ghi nhận yêu cầu. Vui lòng chờ hỗ trợ!";
}

if (chatForm && chatBody) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = chatForm.querySelector("input");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user-msg");
    input.value = "";

    setTimeout(() => {
      addMessage(botReply(message), "bot-msg");
    }, 700);
  });
}

/* =========================
   COUNTER STATISTICS
========================= */
const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function startCounter() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    let current = 0;

    const update = () => {
      current += Math.ceil(target / 80);
      if (current < target) {
        counter.innerText = current;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
}

window.addEventListener("scroll", () => {
  const stats = document.querySelector(".stats");
  if (!stats) return;

  if (stats.getBoundingClientRect().top < window.innerHeight - 100) {
    startCounter();
  }
});

/* =========================
   SEARCH DEMO (CLICK + ENTER)
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

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

function handleSearch() {
  const keyword = removeVietnameseTones(searchInput.value);
  if (!keyword) {
    alert("Vui lòng nhập từ khóa tìm kiếm!");
  } else {
    alert("Đang tìm kiếm: " + keyword);
  }
}

if (searchBtn) {
  searchBtn.addEventListener("click", handleSearch);
}

if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}

/* =========================
   BACK TO TOP
========================= */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (!backToTop) return;
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
