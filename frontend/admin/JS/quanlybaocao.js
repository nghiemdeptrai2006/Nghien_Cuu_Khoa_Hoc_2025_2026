let barChart, pieChart;

// Wait for DOM to load thoroughly
document.addEventListener("DOMContentLoaded", function() {
    loadReportData();
});

async function loadReportData() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        const docRes = await fetch('http://localhost:8080/api/documents', { headers });
        if (!docRes.ok) throw new Error('Failed to fetch docs');

        const docApiRes = await docRes.json();
        const allDocs = docApiRes.data || [];

        const docsCount = allDocs.filter(d => d.type === 'TAI_LIEU').length;
        const textbookCount = allDocs.filter(d => d.type === 'GIAO_TRINH').length;
        const thesisCount = allDocs.filter(d => d.type === 'LUAN_VAN').length;

        // Update Stat Cards
        document.getElementById('totalDocs').textContent = docsCount.toLocaleString();
        document.getElementById('totalTextbooks').textContent = textbookCount.toLocaleString();
        document.getElementById('totalThesis').textContent = thesisCount.toLocaleString();

        // Prepare Major Stats
        const majorStats = {};
        allDocs.forEach(d => {
            const m = d.major || 'Chưa phân loại';
            majorStats[m] = (majorStats[m] || 0) + 1;
        });

        // Render Charts with real data
        renderCharts(majorStats, { docsCount, textbookCount, thesisCount });
        
        // Fetch general stats for activities
        const statsRes = await fetch('http://localhost:8080/api/admin/stats', { headers });
        if (statsRes.ok) {
            const apiRes = await statsRes.json();
            renderLogs(apiRes.data.recentActivities);
        }

    } catch (e) {
        console.error('Report error:', e);
        renderCharts();
    }
}

function renderCharts(majorStats = {}, counts = {}) {
    // 1. Bar Chart (Học liệu theo chuyên ngành)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();

    const sortedMajors = Object.entries(majorStats).sort((a,b) => b[1] - a[1]).slice(0, 7);
    const labels = sortedMajors.length > 0 ? sortedMajors.map(m => m[0]) : ['CNTT', 'Kinh tế', 'Cơ khí', 'Xây dựng', 'Khác'];
    const data = sortedMajors.length > 0 ? sortedMajors.map(m => m[1]) : [12, 19, 3, 5, 2];

    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng học liệu',
                data: data,
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: '#2563eb',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    padding: 12,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // 2. Pie Chart (Cơ cấu loại học liệu)
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Tài liệu', 'Giáo trình', 'Luận văn'],
            datasets: [{
                data: [counts.docsCount || 1, counts.textbookCount || 1, counts.thesisCount || 1],
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b'],
                hoverOffset: 15,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { 
                legend: { 
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    padding: 12,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    cornerRadius: 8
                }
            }
        }
    });
}

function renderLogs(activities) {
    const logBody = document.getElementById('logTableBody');
    if (!logBody || !activities) return;

    logBody.innerHTML = activities.map(act => {
        const date = new Date(act.timestamp).toLocaleString('vi-VN');
        return `
            <tr>
                <td>${date}</td>
                <td><span style="color:${act.color === 'blue' ? '#2563eb' : (act.color === 'green' ? '#059669' : '#d97706')}; font-weight:600">${act.description}</span></td>
                <td>System / Admin</td>
                <td>127.0.0.1</td>
            </tr>
        `;
    }).join('');
}

// Action Buttons
function generateReport() {
    loadReportData();
    alert("🔄 Dữ liệu báo cáo đã được cập nhật từ hệ thống!");
}

function exportPDF() {
    window.print();
}

function exportExcel() {
    const table = document.querySelector(".data-table");
    let csv = [];
    const rows = table.querySelectorAll("tr");
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++) 
            row.push(`"${cols[j].innerText.replace(/"/g, '""')}"`);
        csv.push(row.join(","));
    }

    const csvFile = new Blob(["\ufeff" + csv.join("\n")], {type: "text/csv;charset=utf-16"});
    const downloadLink = document.createElement("a");
    downloadLink.download = `Bao-cao-NCKH-${new Date().toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}



