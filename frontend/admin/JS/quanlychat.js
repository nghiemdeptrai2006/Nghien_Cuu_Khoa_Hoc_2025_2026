let activeUserId = null;
let chatInterval = null;

// Helper function to wrap authFetch for consistent API calls
const apiFetch = async (endpoint, options = {}) => {
    // API_BASE is defined in auth.js
    const url = `${API_BASE}${endpoint}`;
    const response = await authFetch(url, options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
};

document.addEventListener('DOMContentLoaded', () => {
    loadActiveConversations();
    setupAdminProfile();

    // Auto-refresh conversation list every 10s to detect new chats
    setInterval(loadActiveConversations, 10000);

    // Event listener for sending message
    document.getElementById('btnSend').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Sidebar search
    const searchInput = document.querySelector('.search-users input');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            
            // First, filter existing items
            const localItems = document.querySelectorAll('.user-item');
            let hasLocalMatch = false;
            localItems.forEach(item => {
                const name = item.querySelector('h4').textContent.toLowerCase();
                const match = name.includes(query.toLowerCase());
                item.style.display = match ? 'flex' : 'none';
                if (match) hasLocalMatch = true;
            });

            // If no local match and query is long enough, search global
            if (query.length >= 2 && !hasLocalMatch) {
                try {
                    const results = await apiFetch(`/admin/search?query=${encodeURIComponent(query)}&scope=USER`);
                    if (results && results.data && results.data.length > 0) {
                        displaySearchResults(results.data);
                    }
                } catch (err) {
                    console.error('Global search error:', err);
                }
            } else if (query === '') {
                loadActiveConversations(); // Restore active list when cleared
            }
        });
    }
});

function displaySearchResults(users) {
    const userList = document.getElementById('userList');
    if (!userList) return;
    
    // Add a divider if there are already items
    if (userList.querySelectorAll('.user-item').length > 0) {
        const divider = document.createElement('div');
        divider.className = 'search-divider';
        divider.textContent = 'Kết quả tìm kiếm mới';
        userList.appendChild(divider);
    } else {
        userList.innerHTML = '';
    }

    users.forEach(user => {
        // Skip if already in list (simple check)
        if (document.querySelector(`.user-item[data-id="${user.id}"]`)) return;

        const userItem = document.createElement('div');
        userItem.className = 'user-item search-result';
        userItem.setAttribute('data-id', user.id);
        
        userItem.innerHTML = `
            <div class="avatar">
                ${user.title.charAt(0)}
            </div>
            <div class="user-item-info">
                <h4>${user.title}</h4>
                <p>Mới - Nhấn để nhắn tin</p>
            </div>
        `;

        userItem.onclick = () => {
            selectUser({
                id: parseInt(user.id),
                fullName: user.title,
                role: 'USER' // Basic role mapping
            });
        };
        userList.appendChild(userItem);
    });
}

async function setupAdminProfile() {
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    
    const nameDisplay = document.getElementById('user-name-display');
    const nameHeader = document.getElementById('user-name-display-header');
    const roleHeader = document.getElementById('user-role-display');

    if (nameDisplay) nameDisplay.textContent = fullName || 'Quản trị viên';
    if (nameHeader) nameHeader.textContent = fullName || 'Quản trị viên';
    if (roleHeader) {
        roleHeader.textContent = role === 'ADMIN' ? 'Quản trị viên' : (role || 'Admin');
    }
}

async function loadActiveConversations() {
    try {
        const conversations = await apiFetch('/chat/admin/conversations');
        const userList = document.getElementById('userList');
        if (!userList) return;
        
        userList.innerHTML = '';

        if (!conversations || conversations.length === 0) {
            userList.innerHTML = '<div class="loading-chats">Chưa có cuộc hội thoại nào.</div>';
            return;
        }

        conversations.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.setAttribute('data-id', user.id);
            
            const isOnline = user.lastSeen && (new Date() - new Date(user.lastSeen) < 5 * 60 * 1000); 
            
            userItem.innerHTML = `
                <div class="avatar">
                    ${user.avatar ? `<img src="${user.avatar}" style="width:100%; height:100%; border-radius:50%;">` : user.fullName.charAt(0)}
                    <div class="status-dot ${isOnline ? 'online' : 'offline'}"></div>
                </div>
                <div class="user-item-info">
                    <h4>${user.fullName}</h4>
                    <p>${user.role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}</p>
                </div>
            `;

            userItem.onclick = () => selectUser(user);
            userList.appendChild(userItem);
        });
    } catch (error) {
        console.error('Error loading conversations:', error);
        const userList = document.getElementById('userList');
        if (userList) userList.innerHTML = '<div class="loading-chats">Lỗi kết nối server.</div>';
    }
}

async function selectUser(user) {
    activeUserId = user.id;
    
    document.querySelectorAll('.user-item').forEach(item => item.classList.remove('active'));
    const selectedItem = document.querySelector(`.user-item[data-id="${user.id}"]`);
    if (selectedItem) selectedItem.classList.add('active');
    
    document.querySelector('.chat-empty-state').style.display = 'none';
    document.querySelector('.conversation-view').style.display = 'flex';
    
    document.getElementById('activeUserName').textContent = user.fullName;
    document.getElementById('activeUserAvatar').textContent = user.fullName.charAt(0);
    
    const isOnline = user.lastSeen && (new Date() - new Date(user.lastSeen) < 5 * 60 * 1000);
    const statusText = document.getElementById('activeUserStatus');
    statusText.textContent = isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến';
    statusText.style.color = isOnline ? '#10B981' : '#94A3B8';

    loadMessages();

    if (chatInterval) clearInterval(chatInterval);
    chatInterval = setInterval(loadMessages, 3000);
}

async function loadMessages() {
    if (!activeUserId) return;
    try {
        const messages = await apiFetch(`/chat/history/${activeUserId}`);
        const container = document.getElementById('messageContainer');
        if (!container) return;
        
        const shouldScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
        
        container.innerHTML = messages.map(msg => {
            const isSentByMe = msg.sender.id !== activeUserId;
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return `
                <div class="message ${isSentByMe ? 'sent' : 'received'}">
                    ${msg.content}
                    <span class="message-time">${time}</span>
                </div>
            `;
        }).join('');

        if (shouldScroll || container.innerHTML === '') {
            container.scrollTop = container.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const content = input.value.trim();
    if (!content || !activeUserId) return;

    try {
        await apiFetch('/chat/send', {
            method: 'POST',
            body: JSON.stringify({
                receiverId: activeUserId,
                content: content
            })
        });

        input.value = '';
        loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
