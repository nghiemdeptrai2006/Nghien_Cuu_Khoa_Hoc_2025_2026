const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 5500;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

http.createServer((request, response) => {
    let url = request.url.split('?')[0];
    if (url === '/') {
        response.writeHead(302, { 'Location': '/frontend/auth/index.html' });
        response.end();
        return;
    }
    
    let filePath = '.' + url;
    // Decode URI to handle %20 and other encoded chars
    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        console.error("URI Decode Error:", e);
    }

    // Nếu file không tồn tại, thử thay thế khoảng trắng thành dấu gạch ngang (Normalization)
    if (!fs.existsSync(filePath)) {
        let normalizedPath = filePath.replace(/ /g, '-');
        if (fs.existsSync(normalizedPath)) {
            filePath = normalizedPath;
        }
    }

    // Nếu vẫn không tồn tại ở đường dẫn gốc, thử tìm trong /frontend
    if (!fs.existsSync(filePath) && !url.startsWith('/shared/')) {
        let frontendPath = './frontend' + url;
        try { frontendPath = decodeURIComponent(frontendPath); } catch(e) {}
        
        if (fs.existsSync(frontendPath)) {
            filePath = frontendPath;
        } else {
            let normalizedFrontend = frontendPath.replace(/ /g, '-');
            if (fs.existsSync(normalizedFrontend)) {
                filePath = normalizedFrontend;
            }
        }
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log(`Server running at http://localhost:${port}/`);
