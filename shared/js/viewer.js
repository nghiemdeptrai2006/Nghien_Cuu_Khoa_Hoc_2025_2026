/**
 * viewer.js - Shared Document Viewer Logic
 * Handles inline preview for .docx (using docx-preview) and .pdf files.
 */

const docViewerModal = {
    init() {
        // Create modal structure if not exists (safeguard)
        if (!document.getElementById('docPreviewModal')) {
            const modalHtml = `
                <div id="docPreviewModal" class="doc-viewer-modal">
                    <div class="doc-viewer-overlay" onclick="docViewerModal.close()"></div>
                    <div class="doc-viewer-container">
                        <div class="doc-viewer-header">
                            <h3 id="docPreviewTitle">Xem tài liệu</h3>
                            <div class="doc-viewer-controls">
                                <button class="btn-download-inner" id="docPreviewDownload"><i class="fas fa-download"></i> Tải về</button>
                                <button class="btn-close-viewer" onclick="docViewerModal.close()"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div id="docPreviewContent" class="doc-viewer-body">
                            <div class="loader-container">
                                <div class="loader"></div>
                                <p>Đang tải tài liệu...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    },

    show() {
        const modal = document.getElementById('docPreviewModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    },

    close() {
        const modal = document.getElementById('docPreviewModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('docPreviewContent').innerHTML = ''; // Clear content
            document.body.style.overflow = '';
        }
    },

    async preview(fileUrl, fileName) {
        this.init();
        this.show();
        
        const container = document.getElementById('docPreviewContent');
        const titleEl = document.getElementById('docPreviewTitle');
        const downloadBtn = document.getElementById('docPreviewDownload');
        
        titleEl.textContent = fileName || 'Xem tài liệu';
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName || "document";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const fileExt = fileName ? fileName.split('.').pop().toLowerCase() : '';

        try {
            if (fileExt === 'docx') {
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                container.innerHTML = ''; // Remove loader
                await docx.renderAsync(blob, container);
            } else if (fileExt === 'pdf') {
                container.innerHTML = `<iframe src="${fileUrl}" width="100%" height="100%" frameborder="0"></iframe>`;
            } else {
                // Fallback for other types
                container.innerHTML = `
                    <div class="viewer-error">
                        <i class="fas fa-file-alt"></i>
                        <p>Trình xem trực tuyến chưa hỗ trợ định dạng này (${fileExt}).</p>
                        <a href="${fileUrl}" target="_blank" class="btn-open-new">Mở trong tab mới</a>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Viewer Error:", error);
            container.innerHTML = `<div class="viewer-error">Không thể tải tài liệu. Vui lòng kiểm tra lại kết nối.</div>`;
        }
    }
};

// Global function for easier access in onclick
function previewDocument(url, fileName) {
    docViewerModal.preview(url, fileName);
}
