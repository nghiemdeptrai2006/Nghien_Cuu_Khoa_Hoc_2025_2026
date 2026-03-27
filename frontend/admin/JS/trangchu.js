document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('toggle-btn');

    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Toggle Profile Dropdown
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            profileDropdown.classList.toggle('active');
            e.stopPropagation(); // Prevents document click from immediately closing it
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // ==========================================
    // MODULE XÁC THỰC VÀ HIỂN THỊ DỮ LIỆU TỪ API
    // ==========================================
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập trang Quản trị!");
        window.location.href = "../../auth/index.html"; 
    } else {
        displayUserInfo();
        loadDashboardData();
    }

    // Xử lý tất cả các nút Đăng xuất (Sidebar + Profile Dropdown)
    const logoutBtns = document.querySelectorAll('.logout-link, .sidebar-footer a');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(typeof logout === 'function') {
                logout();
            } else {
                console.warn('Global logout() not found, using fallback.');
                localStorage.clear();
                window.location.href = "../../auth/index.html";
            }
        });
    });

    async function loadDashboardData() {
        const statsContainer = document.querySelector('.stats-grid');
        if (!statsContainer) return; 

        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // 1. Fetch all documents to calculate counts
            const docRes = await fetch('http://localhost:8080/api/documents', { headers });
            if (docRes.ok) {
                const docApiRes = await docRes.json();
                const allDocs = docApiRes.data || [];
                
                const docsCount = allDocs.filter(d => d.type === 'TAI_LIEU').length;
                const textbookCount = allDocs.filter(d => d.type === 'GIAO_TRINH').length;
                const thesisCount = allDocs.filter(d => d.type === 'LUAN_VAN').length;

                const cardDocs = document.querySelector('#card-docs h3');
                const cardTextbooks = document.querySelector('#card-textbooks h3');
                const cardThesis = document.querySelector('#card-thesis h3');
                
                if (cardDocs) cardDocs.textContent = docsCount.toLocaleString();
                if (cardTextbooks) cardTextbooks.textContent = textbookCount.toLocaleString();
                if (cardThesis) cardThesis.textContent = thesisCount.toLocaleString();

                const majorStats = {};
                allDocs.forEach(d => {
                    const m = d.major || 'Chưa phân loại';
                    majorStats[m] = (majorStats[m] || 0) + 1;
                });
                renderFieldStats(majorStats, allDocs.length);
            }

            const supportRes = await fetch('http://localhost:8080/api/support/requests', { headers });
            if (supportRes.ok) {
                const supportRequests = await supportRes.json();
                const pendingSupport = supportRequests.filter(r => r.status === 'PENDING').length;
                const cardSupport = document.querySelector('#card-support h3');
                if (cardSupport) cardSupport.textContent = pendingSupport.toLocaleString();
            }

            const res = await fetch('http://localhost:8080/api/admin/stats', { headers });
            if (res.ok) {
                const apiRes = await res.json();
                const stats = apiRes.data;
                renderActivities(stats.recentActivities);
            }
        } catch (e) { console.error('Dashboard load failed', e); }
    }

    function renderActivities(activities) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList || !activities) return;

        activityList.innerHTML = activities.map(act => {
            const link = getActivityLink(act);
            return `
                <li onclick="window.location.href='${link}'" style="cursor: pointer;">
                    <div class="activity-icon ${act.color || 'blue'}">
                        <i class="fa-solid ${getActivityIcon(act.type)}"></i>
                    </div>
                    <div class="activity-details">
                        <p>${act.description}</p>
                        <span class="time-text">${formatTimeAgo(new Date(act.timestamp))}</span>
                    </div>
                </li>
            `;
        }).join('');
    }

    function getActivityLink(act) {
        switch(act.type) {
            case 'TOPIC': return 'quanlydetai.html';
            case 'PAPER': return 'quanlybaibao.html';
            case 'PRODUCT': return 'quanlysanpham.html';
            case 'USER': return 'quanlynguoidung.html';
            default: return '#';
        }
    }

    function getActivityIcon(type) {
        switch(type) {
            case 'TOPIC': return 'fa-folder-open';
            case 'PAPER': return 'fa-newspaper';
            case 'PRODUCT': return 'fa-box-archive';
            case 'USER': return 'fa-user-plus';
            default: return 'fa-circle-info';
        }
    }

    function renderFieldStats(fieldStats, totalCount) {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer || !fieldStats) return;
        const sortedStats = Object.entries(fieldStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
        chartContainer.innerHTML = sortedStats.map(([field, count]) => {
            const percentage = Math.round((count / totalCount) * 100);
            return `
                <div class="progress-item">
                    <div class="progress-label"><span>${field}</span><span>${percentage}%</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar" style="width: ${percentage}%;"></div></div>
                </div>
            `;
        }).join('');
    }

    function displayUserInfo() {
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');
        const nameDisplay = document.getElementById('user-name-display');
        if (nameDisplay) nameDisplay.textContent = fullName || 'Quản trị viên';
    }

    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' phút trước';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' giờ trước';
        return date.toLocaleDateString('vi-VN');
    }

    // ==========================================
    // QUICK SEARCH FUNCTIONALITY
    // ==========================================
    function initQuickSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchSuggestions = document.getElementById('searchSuggestions');
        let debounceTimer;

        if (!searchInput || !searchSuggestions) return;

        const getPageScope = () => {
            try {
                const path = window.location.pathname;
                const fullPage = path.split('/').pop() || 'trangchu.html';
                const page = fullPage.split('?')[0].split('#')[0];
                
                switch(page) {
                    case 'quanlynguoidung.html': return 'USER';
                    case 'quanlydetai.html': return 'TOPIC';
                    case 'quanlybaibao.html': return 'PAPER';
                    case 'quanlytailieu.html': return 'TAI_LIEU';
                    case 'quanlygiaotrinh.html': return 'GIAO_TRINH';
                    case 'quanlyluanvan.html': return 'LUAN_VAN';
                    case 'quanlysanpham.html': return 'PRODUCT';
                    default: return 'GLOBAL';
                }
            } catch (e) { return 'GLOBAL'; }
        };

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(debounceTimer);
            if (query.length < 2) {
                searchSuggestions.classList.remove('active');
                return;
            }

            const scope = getPageScope();
            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`http://localhost:8080/api/admin/search?query=${encodeURIComponent(query)}&scope=${scope}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (res.ok) {
                        const apiRes = await res.json();
                        renderSearchSuggestions(apiRes.data);
                    }
                } catch (err) { console.error('Search failed', err); }
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });
    }

    function renderSearchSuggestions(results) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (!searchSuggestions) return;

        if (!results || results.length === 0) {
            searchSuggestions.innerHTML = '<div class="no-results">Không tìm thấy kết quả phù hợp</div>';
        } else {
            searchSuggestions.innerHTML = results.map(item => `
                <div class="search-item" data-url="${item.url}">
                    <i class="${getSearchIcon(item.type)}"></i>
                    <div class="item-info">
                        <h5>${item.title}</h5>
                        <p>${item.subtitle}</p>
                    </div>
                </div>
            `).join('');

            searchSuggestions.querySelectorAll('.search-item').forEach(el => {
                el.addEventListener('click', () => {
                    const url = el.getAttribute('data-url');
                    const currentPath = window.location.pathname;
                    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                    window.location.href = basePath + url;
                });
            });
        }
        searchSuggestions.classList.add('active');
    }

    function getSearchIcon(type) {
        switch(type) {
            case 'USER': return 'fa-solid fa-user';
            case 'TOPIC': return 'fa-solid fa-microscope';
            case 'PAPER': return 'fa-solid fa-file-lines';
            case 'TAI_LIEU': return 'fa-solid fa-file-pdf';
            case 'GIAO_TRINH': return 'fa-solid fa-book';
            case 'LUAN_VAN': return 'fa-solid fa-graduation-cap';
            case 'PRODUCT': return 'fa-solid fa-box-archive';
            default: return 'fa-solid fa-magnifying-glass';
        }
    }

    // ==========================================
    // GLOBAL NOTIFICATION MODAL LOGIC
    // ==========================================
    const globalNotifBtn = document.getElementById('btn-global-notif');
    const globalNotifModal = document.getElementById('globalNotifModal');
    const globalNotifForm = document.getElementById('globalNotifForm');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn, .modal-overlay');

    if (globalNotifBtn && globalNotifModal) {
        globalNotifBtn.addEventListener('click', () => {
            globalNotifModal.classList.add('active');
        });
    }

    if (closeBtns && globalNotifModal) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // If clicking overlay, only close if clicking the overlay itself (not the content)
                if (btn.classList.contains('modal-overlay') && e.target !== globalNotifModal) return;
                globalNotifModal.classList.remove('active');
            });
        });
    }

    if (globalNotifForm) {
        globalNotifForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = globalNotifForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            const payload = {
                title: document.getElementById('notifTitle').value,
                message: document.getElementById('notifMessage').value,
                type: document.getElementById('notifType').value,
                link: document.getElementById('notifLink').value || null
            };

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
                
                // sendGlobalNotification is defined in shared/js/notifications.js
                const response = await sendGlobalNotification(payload);
                
                if (response.ok) {
                    alert('✅ Đã gửi thông báo thành công tới tất cả người dùng!');
                    globalNotifForm.reset();
                    globalNotifModal.classList.remove('active');
                } else {
                    const error = await response.text();
                    alert('❌ Lỗi khi gửi thông báo: ' + (error || response.status));
                }
            } catch (err) {
                console.error('Submit notification failed', err);
                alert('❌ Lỗi kết nối hệ thống. Vui lòng thử lại sau.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    initQuickSearch();

    // Existing checkScreenSize logic...
    const checkScreenSize = () => {
        if (window.innerWidth <= 1024 && sidebar && mainContent) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    };
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
});
