/* 
   NOTIFICATIONS.JS - Shared Notification Logic
   Kho Dữ Liệu Số - Digital Data Repository
*/

document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
});

async function initNotifications() {
    const bell = document.querySelector('.notifications');
    const badge = document.querySelector('.notifications .badge');
    const dropdown = document.querySelector('.notif-dropdown');
    const list = document.querySelector('.notif-list');
    const markAllBtn = document.querySelector('#mark-all-read');

    if (!bell) return;

    // Initial count update
    updateUnreadCount();

    // Toggle dropdown
    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        bell.classList.toggle('active');
        if (bell.classList.contains('active')) {
            loadNotifications();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        bell.classList.remove('active');
    });

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing when clicking inside dropdown
    });

    // Mark all as read
    if (markAllBtn) {
        markAllBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await markAllAsRead();
        });
    }
}

async function updateUnreadCount() {
    try {
        const response = await authFetch('http://localhost:8080/api/notifications/unread-count');
        if (response.ok) {
            const data = await response.json();
            const badge = document.querySelector('.notifications .badge');
            if (badge) {
                if (data.count > 0) {
                    badge.textContent = data.count > 9 ? '9+' : data.count;
                    badge.style.display = 'block';
                } else {
                    badge.style.display = 'none';
                }
            }
        } else {
            console.error(`Unread count error: ${response.status}`);
        }
    } catch (error) {
        console.error('Network error fetching unread count:', error);
    }
}

async function loadNotifications() {
    const list = document.querySelector('.notif-list');
    if (!list) return;

    list.innerHTML = '<div class="notif-empty"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';

    try {
        const response = await authFetch('http://localhost:8080/api/notifications');
        if (response.ok) {
            const notifications = await response.json();
            renderNotificationList(notifications);
        } else {
            // Lấy nội dung lỗi từ backend (nếu có)
            const errorMsg = await response.text();
            list.innerHTML = `<div class="notif-empty">Lỗi tải: ${errorMsg || response.status}</div>`;
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
        list.innerHTML = '<div class="notif-empty">Lỗi kết nối server</div>';
    }
}

function renderNotificationList(notifications) {
    const list = document.querySelector('.notif-list');
    if (notifications.length === 0) {
        list.innerHTML = '<div class="notif-empty"><i class="fa-solid fa-bell-slash"></i> Không có thông báo nào</div>';
        return;
    }

    list.innerHTML = '';
    notifications.forEach(n => {
        const item = document.createElement('div');
        item.className = `notif-item ${n.read ? '' : 'unread'}`;
        
        // Icon based on type
        let iconClass = 'fa-bell';
        if (n.type === 'SUPPORT') iconClass = 'fa-headset';
        if (n.type === 'DOCUMENT') iconClass = 'fa-file-lines';

        item.innerHTML = `
            <div class="notif-icon"><i class="fa-solid ${iconClass}"></i></div>
            <div class="notif-content">
                <p><strong>${n.title}</strong>: ${n.message}</p>
                <span>${timeAgo(n.createdAt)}</span>
            </div>
        `;

        item.onclick = async () => {
            if (!n.read) {
                await markAsRead(n.id);
            }
            if (n.link) {
                window.location.href = n.link;
            }
        };

        list.appendChild(item);
    });
}

async function markAsRead(id) {
    try {
        const response = await authFetch(`http://localhost:8080/api/notifications/${id}/read`, {
            method: 'PUT'
        });
        if (response.ok) {
            updateUnreadCount();
        }
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

async function markAllAsRead() {
    try {
        const response = await authFetch('http://localhost:8080/api/notifications/read-all', {
            method: 'PUT'
        });
        if (response.ok) {
            updateUnreadCount();
            loadNotifications();
        }
    } catch (error) {
        console.error('Error marking all as read:', error);
    }
}

async function sendGlobalNotification(payload) {
    try {
        const response = await authFetch('http://localhost:8080/api/notifications/send-global', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        console.error('Error sending global notification:', error);
        throw error;
    }
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}
