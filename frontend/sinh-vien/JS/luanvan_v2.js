/* =========================================================
   EMERALD MASTER V2.1 - THESIS ENGINE (LUAN VAN)
   ========================================================= */

console.log("[THESIS-JS] SCRIPT LOADED - VERSION 2.3");

const API_BASE = 'http://localhost:8080/api';
let allTheses = [];

function initThesisPortal() {
    console.log("[THESIS-JS] INITIALIZING PORTAL...");
    const container = document.querySelector('.thesis-list');
    const searchInput = document.getElementById('searchInput');
    const filterMajor = document.getElementById('filterMajor');
    const filterLevel = document.getElementById('filterLevel');
    const filterYear = document.getElementById('filterYear');

    if (!container) {
        console.error("[THESIS-JS] ERROR: .thesis-list NOT FOUND!");
        return;
    }

    const fullName = localStorage.getItem('fullName');
    const profileSpan = document.querySelector('.user-profile-menu span');
    if (fullName && profileSpan) {
        profileSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${fullName}`;
    }

    loadTheses(container, searchInput, filterMajor, filterLevel, filterYear);

    if (filterMajor) filterMajor.addEventListener("change", applyFilters);
    if (filterLevel) filterLevel.addEventListener("change", applyFilters);
    if (filterYear) filterYear.addEventListener("change", applyFilters);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initThesisPortal();
} else {
    document.addEventListener('DOMContentLoaded', initThesisPortal);
}

async function loadTheses(container, searchInput, filterMajor, filterLevel, filterYear) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const url = `${API_BASE}/documents?type=LUAN_VAN`;
        const token = localStorage.getItem('token');
        const headers = {};
        if (token && token !== 'null') headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch(url, { headers, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 403) throw new Error('403 Forbidden - Backend Restart Required');
            throw new Error(`Server Error: ${response.status}`);
        }

        const result = await response.json();
        allTheses = result.data || [];
        renderTheses(allTheses, container);
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("[THESIS-JS] SYNC ERROR:", error);
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-exclamation-triangle fa-3x" style="color: #ef4444; margin-bottom: 20px;"></i>
                    <p style="color: #64748b; margin-bottom: 20px; font-weight: 600;">
                        ${error.name === 'AbortError' ? 'CONNECTION TIMEOUT (10s)' : 'COULD NOT SYNC REAL DATA'}
                    </p>
                    <button onclick="location.reload()" style="background:#8B5CF6; border:none; padding:12px 30px; border-radius:12px; color:white; cursor:pointer; font-weight:700;">
                        RETRY / HARD REFRESH
                    </button>
                </div>
            `;
        }
    }
}

function renderTheses(theses, container) {
    if (!container) return;
    container.innerHTML = "";
    if (theses.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px;color:#94a3b8;"><p>No theses found.</p></div>`;
        return;
    }
    theses.forEach(doc => {
        const fileUrl = doc.fileUrl ? `${API_BASE}/documents/files/${encodeURIComponent(doc.fileUrl)}` : "#";
        const card = document.createElement("div");
        card.className = "thesis-card";
        card.innerHTML = `
            <h3>${doc.title}</h3>
            <p><i class="fas fa-university"></i> Major: ${doc.major}</p>
            <p><i class="fas fa-id-card"></i> Level: ${doc.docLevel || 'University'}</p>
            <p><i class="far fa-calendar-alt"></i> Year: ${doc.publishYear}</p>
            <button onclick="window.previewDocument('${fileUrl}', '${doc.fileUrl}')">View Thesis</button>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterMajor = document.getElementById('filterMajor');
    const filterLevel = document.getElementById('filterLevel');
    const filterYear = document.getElementById('filterYear');
    const container = document.querySelector('.thesis-list');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const major = filterMajor ? filterMajor.value : "Tất cả ngành";
    const level = filterLevel ? filterLevel.value : "Tất cả cấp độ";
    const year = filterYear ? filterYear.value : "Tất cả năm";
    const filtered = allTheses.filter(doc => {
        const titleMatch = (doc.title || "").toLowerCase().includes(keyword);
        const majorMatch = major === "Tất cả ngành" || doc.major === major;
        const levelMatch = level === "Tất cả cấp độ" || doc.docLevel === level;
        const yearMatch = year === "Tất cả năm" || doc.publishYear.toString() === year;
        return titleMatch && majorMatch && levelMatch && yearMatch;
    });
    renderTheses(filtered, container);
}

window.handleSearch = () => {
    clearTimeout(window.searchDebounce);
    window.searchDebounce = setTimeout(applyFilters, 300);
};

window.openUploadModal = () => document.getElementById("uploadModal")?.classList.add("active");
window.closeUploadModal = () => {
    document.getElementById("uploadModal")?.classList.remove("active");
    document.getElementById("uploadForm")?.reset();
};

window.handleUploadSubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector(".btn-save");
    const formData = new FormData();
    formData.append("title", document.getElementById("docTitle").value);
    formData.append("major", document.getElementById("docMajor").value);
    formData.append("docLevel", document.getElementById("docLevel").value);
    formData.append("publishYear", document.getElementById("docYear").value);
    formData.append("type", "LUAN_VAN");
    formData.append("file", document.getElementById("docFile").files[0]);
    const token = localStorage.getItem("token");
    try {
        if (submitBtn) submitBtn.disabled = true;
        const response = await fetch(`${API_BASE}/documents/upload`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
        if (response.ok) {
            alert("Success!");
            window.closeUploadModal();
            location.reload();
        } else throw new Error("Upload Error");
    } catch (error) { alert(error.message); }
    if (submitBtn) submitBtn.disabled = false;
};
