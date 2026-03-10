/* =========================================================
   PROJECT MANAGEMENT ACTION (ADMIN)
   ========================================================= */

function updateStatus(projectId, action) {
    if(action === 'approve') {
        let confirmed = confirm("⚠️ Xác nhận PHÊ DUYỆT cho dự án " + projectId + "?\nHệ thống sẽ gửi email thông báo tới Chủ nhiệm đề tài.");
        if(confirmed) {
            alert("✅ Tổ chức thuyết minh và Duyệt đề cương thành công!");
            // Reload simulated
        }
    } else if (action === 'reject') {
        let reason = prompt("Vui lòng nhập lý do HỦY / TRẢ VỀ phiếu đề tài " + projectId + ":");
        if(reason !== null && reason.trim() !== "") {
            alert("❌ Đã HỦY Đề tài và gửi phản hồi: " + reason);
        }
    }
}

function sendWarning() {
    alert("🔔 Đã tự động gửi Email & Push Notification nhắc nhở báo cáo tiến độ tới Chủ nhiệm đề tài!");
}
