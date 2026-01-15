function toggleFAQ(item) {
  const p = item.querySelector("p");
  p.style.display = p.style.display === "block" ? "none" : "block";
}

function openChat() {
  document.getElementById("chatBox").style.display = "block";
}

function closeChat() {
  document.getElementById("chatBox").style.display = "none";
}

/* =========================
   FAQ TOGGLE
========================= */
function toggleFAQ(item) {
  const answer = item.querySelector("p");

  // Ẩn tất cả FAQ khác
  document.querySelectorAll(".faq-item p").forEach(p => {
    if (p !== answer) {
      p.style.display = "none";
    }
  });

  // Toggle câu trả lời được click
  if (answer.style.display === "block") {
    answer.style.display = "none";
  } else {
    answer.style.display = "block";
  }
}

/* =========================
   CHAT OPEN / CLOSE
========================= */
const chatBox = document.getElementById("chatBox");

function openChat() {
  chatBox.style.display = "block";
}

function closeChat() {
  chatBox.style.display = "none";
}

/* =========================
   CHAT MESSAGE (DEMO)
========================= */
const chatInput = chatBox.querySelector("input");
const chatBody = chatBox.querySelector(".chat-body");

chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const message = chatInput.value.trim();
    if (message === "") return;

    // Hiển thị tin nhắn người dùng
    const userMsg = document.createElement("p");
    userMsg.innerHTML = "<b>Bạn:</b> " + message;
    chatBody.appendChild(userMsg);

    // Bot phản hồi tự động
    setTimeout(() => {
      const botMsg = document.createElement("p");
      botMsg.innerHTML =
        "<b>Bot:</b> Cảm ơn bạn! Bộ phận hỗ trợ sẽ phản hồi sớm.";
      chatBody.appendChild(botMsg);

      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);

    chatInput.value = "";
  }
});
