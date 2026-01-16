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
