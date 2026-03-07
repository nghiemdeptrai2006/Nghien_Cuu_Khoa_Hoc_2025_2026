/* =========================================================
   REPORT & CHART GENERATION (ADMIN)
   => Using CDN Chart.js included in HTML
   ========================================================= */

// Wait for DOM to load thoroughly
document.addEventListener("DOMContentLoaded", function() {
    renderCharts();
});

function renderCharts() {
    // 1. Chart Data: Bar Chart (Đề tài theo khoa)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['CNTT', 'Kinh tế', 'Ngoại ngữ', 'Điện tử', 'Luật'],
            datasets: [{
                label: 'Số lượng Đề tài',
                data: [42, 30, 25, 38, 15],
                backgroundColor: 'rgba(30, 64, 175, 0.8)', // Primary color
                borderWidth: 0,
                borderRadius: 4
            }, {
                label: 'Hoàn thành Nghiệm thu',
                data: [35, 28, 20, 30, 14],
                backgroundColor: 'rgba(16, 185, 129, 0.8)', // Success color
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. Chart Data: Doughnut Chart (Cơ cấu Sản phẩm)
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Bài báo Quốc Tế', 'Bài báo VN', 'Sáng Chế', 'Sách / Khác'],
            datasets: [{
                data: [45, 25, 10, 20],
                backgroundColor: [
                    '#3b82f6', // blue
                    '#10b981', // emerald
                    '#f59e0b', // amber
                    '#8b5cf6'  // violet
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Action Buttons
function generateReport() {
    alert("⏳ Đang thiết lập Query truy xuất CSDL tổng hợp...\n\n✅ Đã lấy Data thành công. Giao diện biểu đồ đã được làm mới!");
}

function exportPDF() {
    alert("🖨️ Yêu cầu Xuất PDF đã được đưa vào Hàng đợi (Queue) xử lý. Trình tải File sẽ xuất hiện sau ít giây.");
}

function exportExcel() {
    alert("📊 Đang đóng gói dữ liệu Log. Danh sách dữ liệu cấu trúc Array dạng RAW sẽ tải xuống dưới chuẩn .XSLX");
}
