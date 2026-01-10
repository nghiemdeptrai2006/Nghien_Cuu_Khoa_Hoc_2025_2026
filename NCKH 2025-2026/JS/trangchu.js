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
  if (window.scrollY > 50) {
    header.style.background = "rgba(11, 94, 215, 0.98)";
  } else {
    header.style.background = "rgba(11, 94, 215, 0.9)";
  }
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

if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    chatPopup.style.display = "block";
  });
}

if (closeChat) {
  closeChat.addEventListener("click", () => {
    chatPopup.style.display = "none";
  });
}

/* =========================
   CHAT MESSAGE DEMO
========================= */
const chatForm = document.getElementById("chatForm");
const chatBody = document.getElementById("chatBody");

if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = chatForm.querySelector("input");
    if (input.value.trim() === "") return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.innerText = input.value;
    chatBody.appendChild(userMsg);

    input.value = "";

    // Auto reply
    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "bot-msg";
      botMsg.innerText = "Hệ thống đã ghi nhận yêu cầu. Vui lòng chờ hỗ trợ!";
      chatBody.appendChild(botMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
  });
}

/* =========================
   COUNTER STATISTICS
========================= */
const counters = document.querySelectorAll(".counter");

function startCounter() {
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

  const top = stats.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    startCounter();
  }
});

/* =========================
   SEARCH DEMO
========================= */
const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
    } else {
      alert("Đang tìm kiếm: " + keyword);
    }
  });
}

/* =========================
   BACK TO TOP
========================= */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
