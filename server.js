const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 20400;
const distDir = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Resolve request path
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found - return 404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                background: #1a1412; 
                color: #e8dcc8;
              }
              .container { 
                text-align: center; 
                padding: 20px;
              }
              h1 { 
                font-size: 3rem; 
                color: #d4af37; 
                margin-bottom: 20px;
              }
              a { 
                color: #d4af37; 
                text-decoration: none; 
                font-size: 1.2rem;
              }
              a:hover { 
                text-decoration: underline; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/">Return to homepage</a>
            </div>
          </body>
        </html>
      `);
      return;
    }

    // Determine MIME type
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Twilight Tales Demo Server running at:
  - Local:   http://localhost:${PORT}
  - Network: http://0.0.0.0:${PORT}`);
});

console.log('Press Ctrl+C to stop the server');
