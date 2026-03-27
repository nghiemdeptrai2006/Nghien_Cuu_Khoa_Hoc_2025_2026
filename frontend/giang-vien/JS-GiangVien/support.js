/* ==========================================
   GLOBAL SUPPORT BAR & CHAT LOGIC (Lecturer)
   ========================================== */

/* Sử dụng API_BASE từ auth.js (đã được load trước) */
const CHAT_API_BASE = (typeof API_BASE !== 'undefined') ? API_BASE : 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Support Bar & Chat Popup if not present
    injectSupportElements();

    // 2. Setup Event Listeners
    setupSupportListeners();

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.querySelector(".menu");
    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            menu.classList.toggle("show");
        });
    }
});

function injectSupportElements() {
    if (document.querySelector('.support-bar')) return;

    const supportBarHTML = `
    <!-- SUPPORT BAR RIGHT -->
    <div class="support-bar">
      <div class="support-item" id="chatBtn" title="Chat hỗ trợ"><i class="fas fa-comment-dots"></i></div>
      <div class="support-item" id="phoneBtn" title="Gọi hotline"><i class="fas fa-phone"></i></div>
      <div class="support-item" id="emailBtn" title="Gửi thư"><i class="fas fa-envelope"></i></div>
      <div class="support-item" id="faqBtn" title="Câu hỏi thường gặp"><i class="fas fa-question-circle"></i></div>
    </div>

    <!-- CHAT POPUP -->
    <div class="chat-popup" id="chatPopup">
      <div class="chat-header">
        Chat hỗ trợ kỹ thuật
        <div class="close-chat" id="closeChat" style="cursor:pointer; font-size:1.2rem;">&times;</div>
      </div>

      <div class="chat-body" id="chatBody" style="height: 300px; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f8fafc;">
        <div class="bot-msg" style="background: white; padding: 10px 14px; border-radius: 12px; align-self: flex-start; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 0.9rem;">
            Chào Giảng viên! Em có thể hỗ trợ gì cho thầy/cô về hệ thống không ạ?
        </div>
      </div>

      <form id="chatForm" style="padding: 10px; border-top: 1px solid #eee; display: flex; gap: 8px;">
        <input type="text" id="chatInput" placeholder="Nhập câu hỏi..." style="flex: 1; padding: 8px 15px; border-radius: 20px; border: 1px solid #ddd; outline: none; font-size: 0.9rem;" />
        <button type="submit" style="background: #4F46E5; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer;"><i class="fas fa-paper-plane"></i></button>
      </form>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', supportBarHTML);
}

let adminId = null;
let pollInterval = null;
let isDemoMode = false; // Khi backend không available → dùng bot đơn giản

function setupSupportListeners() {
    const chatBtn = document.getElementById("chatBtn");
    const chatPopup = document.getElementById("chatPopup");
    const closeChat = document.getElementById("closeChat");
    const chatForm = document.getElementById("chatForm");
    const chatBody = document.getElementById("chatBody");

    if (chatBtn && chatPopup) {
        chatBtn.addEventListener("click", () => {
            const isOpening = !chatPopup.classList.contains("show");
            chatPopup.classList.toggle("show");
            if (isOpening) {
                initChat();
            } else {
                stopPolling();
            }
        });
    }

    if (closeChat && chatPopup) {
        closeChat.addEventListener("click", () => {
            chatPopup.classList.remove("show");
            stopPolling();
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const input = document.getElementById("chatInput");
            const message = input.value.trim();
            if (!message) return;

            // Hiện tin nhắn của user ngay lập tức
            addMessage(message, "user-msg", chatBody);
            input.value = "";

            // Demo mode: trả lời bot đơn giản
            if (isDemoMode || !adminId) {
                setTimeout(() => {
                    addMessage("Cảm ơn thầy/cô đã liên hệ! Hiện tại hệ thống đang bảo trì. Vui lòng liên hệ hotline: 0327833928 hoặc email: nguyentrongnghiem2006@gmail.com để được hỗ trợ.", "bot-msg", chatBody);
                }, 600);
                return;
            }

            // Gửi lên backend (real mode)
            try {
                const result = await authFetch(`${CHAT_API_BASE}/chat/send`, {
                    method: 'POST',
                    body: JSON.stringify({
                        receiverId: adminId,
                        content: message
                    })
                });
                if (!result || !result.ok) {
                    console.error("Gửi thất bại:", result?.status);
                    addMessage("Lỗi: Không thể gửi tin nhắn. Vui lòng thử lại.", "bot-msg", chatBody);
                }
            } catch (err) {
                console.error("Lỗi gửi tin nhắn:", err);
                addMessage("Lỗi kết nối. Vui lòng thử lại.", "bot-msg", chatBody);
            }
        });
    }

    // Other buttons
    document.getElementById('phoneBtn')?.addEventListener('click', () => {
        alert("📞 Hotline kỹ thuật cho Giảng viên: 0327833928");
    });

    document.getElementById('emailBtn')?.addEventListener('click', () => {
        window.location.href = "mailto:nguyentrongnghiem2006@gmail.com";
    });

    document.getElementById('faqBtn')?.addEventListener('click', () => {
        window.location.href = "hotro.html"; 
    });
}

async function initChat() {
    const chatBody = document.getElementById("chatBody");

    // Kiểm tra nếu đang dùng demo token → chuyển sang demo mode ngay
    const token = (typeof getToken === 'function') ? getToken() : localStorage.getItem('token');
    if (token && token.startsWith('demo_')) {
        isDemoMode = true;
        chatBody.innerHTML = '';
        addMessage("Chào Giảng viên! Bạn đang ở chế độ Demo. Tôi là bot hỗ trợ tự động — hãy nhắn tin và tôi sẽ phản hồi!", "bot-msg", chatBody);
        return;
    }

    if (!adminId) {
        try {
            const response = await authFetch(`${CHAT_API_BASE}/chat/admin-id`);
            if (response && response.ok) {
                const data = await response.json();
                if (data && data.adminId) {
                    adminId = data.adminId;
                    isDemoMode = false;
                    chatBody.innerHTML = '';
                    loadHistory();
                    startPolling();
                    return;
                }
            }
        } catch (err) {
            console.error("Không tìm thấy Admin ID:", err);
        }

        // Không kết nối được backend → demo mode
        isDemoMode = true;
        chatBody.innerHTML = '';
        addMessage("Chào thầy/cô! Hệ thống hỗ trợ trực tuyến hiện không khả dụng. Tôi là bot hỗ trợ tự động — thầy/cô có thể nhắn tin hoặc gọi hotline: 0327833928.", "bot-msg", chatBody);
    } else {
        loadHistory();
        startPolling();
    }
}

async function loadHistory() {
    if (!adminId || isDemoMode) return;
    try {
        const response = await authFetch(`${CHAT_API_BASE}/chat/history/${adminId}`);
        const chatBody = document.getElementById("chatBody");
        if (response && response.ok) {
            const history = await response.json();
            if (history && history.length > 0) {
                chatBody.innerHTML = '';
                history.forEach(msg => {
                    // API trả về nested object: msg.sender.id, msg.receiver.id
                    const isMine = msg.sender && msg.sender.id !== adminId;
                    const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';
                    addMessage(msg.content, isMine ? "user-msg" : "bot-msg", chatBody, time);
                });
            }
        }
    } catch (err) {
        console.error("Lỗi tải lịch sử chat:", err);
    }
}

function startPolling() {
    stopPolling();
    if (!isDemoMode) {
        pollInterval = setInterval(loadHistory, 4000); // Poll every 4 seconds
    }
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

function addMessage(text, className, container, time = '') {
    if (!container) return;

    const msg = document.createElement("div");
    msg.className = className;
    msg.innerHTML = `<span>${text}</span>${time ? `<div style="font-size:0.7rem; opacity:0.6; margin-top:3px; text-align:${className === 'user-msg' ? 'right' : 'left'}">${time}</div>` : ''}`;
    
    if (className === "user-msg") {
        msg.style.cssText = "background: #4F46E5; color: white; padding: 10px 14px; border-radius: 12px; align-self: flex-end; max-width: 80%; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
    } else {
        msg.style.cssText = "background: white; color: #1e293b; padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 80%; border: 1px solid #e2e8f0; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
    }
    
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}
