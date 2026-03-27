/* =========================
   FILL SEARCH SUGGESTION
========================= */
function fillSearch(keyword) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = keyword;
    searchInput.focus();
    // Tự động kích hoạt tìm kiếm nếu cần
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) searchBtn.click();
  }
}

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
   SCROLL EFFECTS (HEADER & PROGRESS)
========================= */
const header = document.querySelector(".header");
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  // Header transparency
  if (header) {
    header.style.background =
      window.scrollY > 50
        ? "rgba(255, 255, 255, 0.98)"
        : "rgba(255, 255, 255, 0.7)";
  }

  // Scroll progress bar
  if (scrollProgress) {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
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

/* Support logic moved to support.js */

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
   INLINE SEARCH (Tất cả loại tài liệu)
========================= */
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().trim();
}

const searchBtn   = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsSection = document.getElementById("search-results-section");
const resultsGrid    = document.getElementById("search-results-grid");
const resultsTitle   = document.getElementById("search-results-title");

const TYPE_LABEL = {
  TAI_LIEU:  { label: "Tài liệu",  color: "#1565C0", icon: "fa-book-open" },
  GIAO_TRINH:{ label: "Giáo trình", color: "#2e7d32", icon: "fa-book" },
  LUAN_VAN:  { label: "Luận văn",  color: "#6a1b9a", icon: "fa-graduation-cap" },
};

// Render 1 card kết quả
function renderResultCard(doc) {
  const meta = TYPE_LABEL[doc.type] || { label: doc.type, color: "#555", icon: "fa-file" };
  const defaultCover = `https://placehold.co/80x100/${meta.color.replace('#','')}/FFFFFF?text=Doc`;
  const encodedFile = doc.fileUrl ? encodeURIComponent(doc.fileUrl) : '';
  const fileUrl = encodedFile ? `http://localhost:8080/api/documents/files/${encodedFile}` : "#";
  const coverSrc = doc.coverUrl
    ? `http://localhost:8080/api/documents/files/${encodeURIComponent(doc.coverUrl)}`
    : defaultCover;

  const card = document.createElement("div");
  card.style.cssText = `
    background:white; border-radius:14px; padding:20px;
    box-shadow:0 4px 18px rgba(0,0,0,0.08); display:flex; gap:15px;
    border:1px solid #eef0f6; transition:all 0.25s;
  `;
  card.onmouseenter = () => { card.style.transform = "translateY(-4px)"; card.style.boxShadow = "0 10px 30px rgba(26,35,126,0.13)"; };
  card.onmouseleave = () => { card.style.transform = ""; card.style.boxShadow = "0 4px 18px rgba(0,0,0,0.08)"; };

  card.innerHTML = `
    <div style="flex-shrink:0">
      <img src="${coverSrc}" alt="Bìa"
        style="width:70px;height:90px;object-fit:cover;border-radius:8px;border:1px solid #ddd;"
        onerror="this.src='${defaultCover}'" />
    </div>
    <div style="flex:1;min-width:0">
      <span style="display:inline-block;background:${meta.color}18;color:${meta.color};
        padding:2px 10px;border-radius:20px;font-size:0.78rem;font-weight:600;margin-bottom:6px;">
        <i class="fas ${meta.icon}"></i> ${meta.label}
      </span>
      <h3 style="font-size:1rem;font-weight:700;color:#1a237e;margin-bottom:5px;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${doc.title}</h3>
      <p style="font-size:0.85rem;color:#888;margin-bottom:4px;">
        <i class="fas fa-layer-group"></i> ${doc.major || "Chưa phân loại"}
      </p>
      <p style="font-size:0.82rem;color:#aaa;margin-bottom:12px;">
        <i class="fas fa-user"></i> ${doc.uploaderName || doc.uploadedBy || "Không rõ"} &nbsp;•&nbsp;
        <i class="fas fa-calendar"></i> ${doc.publishYear || ""}
      </p>
      <div style="display:flex;gap:8px;">
        <button onclick="previewDocument('${fileUrl}', '${doc.fileUrl}'); event.stopPropagation();"
          style="padding:6px 14px;background:linear-gradient(135deg,#1a237e,#1565C0);
          color:white;border-radius:20px;font-size:0.82rem;font-weight:600;border:none;cursor:pointer;">
          <i class="fas fa-eye"></i> Xem
        </button>
        <a href="${fileUrl}" download="${doc.fileUrl || 'tailieu'}"
          style="padding:6px 14px;background:#e8f5e9;color:#2e7d32;border-radius:20px;
          font-size:0.82rem;font-weight:600;text-decoration:none;">
          <i class="fas fa-download"></i> Tải
        </a>
      </div>
    </div>
  `;
  return card;
}

async function handleSearch() {
  const raw = searchInput.value.trim();
  if (!raw) {
    searchInput.focus();
    searchInput.placeholder = "⚠️ Vui lòng nhập từ khóa...";
    setTimeout(() => { searchInput.placeholder = "Nhập tên tài liệu, môn học, từ khóa..."; }, 2000);
    return;
  }

  // Hiện section kết quả với loading
  resultsSection.style.display = "block";
  resultsTitle.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tìm kiếm...`;
  resultsGrid.innerHTML = "";
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

  const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
  const keyword = removeVietnameseTones(raw);

  try {
    // Gọi API tìm tất cả loại tài liệu (không lọc type)
    const res = await fetch(
      `http://localhost:8080/api/documents?keyword=${encodeURIComponent(raw)}`,
      { headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" } }
    );

    let docs = [];
    if (res.ok) {
      const all = (await res.json()).data;
      // Lọc thêm phía frontend để đảm bảo
      docs = all.filter(d => {
        const t = removeVietnameseTones(d.title || "");
        const m = removeVietnameseTones(d.major || "");
        const u = removeVietnameseTones(d.uploaderName || d.uploadedBy || "");
        return t.includes(keyword) || m.includes(keyword) || u.includes(keyword);
      });
    } else {
      throw new Error("API error");
    }

    renderSearchResults(docs, raw);

  } catch {
    // Backend chưa chạy → thông báo
    resultsTitle.innerHTML = `<i class="fas fa-search"></i> Kết quả cho: "<b>${raw}</b>"`;
    resultsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:#888;">
        <i class="fas fa-server" style="font-size:2.5rem;color:#ccc;margin-bottom:12px;display:block;"></i>
        <p style="font-size:1rem;">Backend chưa khởi động tại <code>localhost:8080</code></p>
        <p style="font-size:0.9rem;margin-top:6px;">Vui lòng khởi động server để tìm kiếm dữ liệu thật.</p>
      </div>`;
  }
}

function renderSearchResults(docs, keyword) {
  resultsTitle.innerHTML = `<i class="fas fa-search"></i> Kết quả cho: "<b>${keyword}</b>" — ${docs.length} kết quả`;
  resultsGrid.innerHTML = "";

  if (docs.length === 0) {
    resultsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">
        <i class="fas fa-search" style="font-size:2.5rem;color:#ccc;margin-bottom:12px;display:block;"></i>
        <p>Không tìm thấy tài liệu nào phù hợp với "<b>${keyword}</b>".</p>
      </div>`;
    return;
  }

  docs.forEach(doc => resultsGrid.appendChild(renderResultCard(doc)));
}

function clearSearch() {
  resultsSection.style.display = "none";
  searchInput.value = "";
  resultsGrid.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (searchBtn)   searchBtn.addEventListener("click", handleSearch);
if (searchInput) {
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSearch();
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

/* =========================
   LOGOUT FUNCTION
========================= */
// Global logout() is now provided by /shared/js/auth.js

// Chạy khi khởi tạo
window.addEventListener("DOMContentLoaded", () => {
  const fullName = localStorage.getItem('fullName');
  const profileSpan = document.querySelector('.user-profile-menu span');
  if (fullName && profileSpan) {
    profileSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${fullName}`;
  }

  // Xử lý Đăng xuất
  const logoutBtns = document.querySelectorAll('.logout-link');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof logout === 'function') {
        logout();
      } else {
        console.warn('Global logout() not found, using fallback.');
        localStorage.clear();
        window.location.href = "../../auth/index.html";
      }
    });
  });
});


