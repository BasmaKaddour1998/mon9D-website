const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  const candidates = [path.resolve(root, relative), path.resolve(root, 'public', relative)];
  const file = candidates.find((candidate) => candidate.startsWith(root) && fs.existsSync(candidate) && !fs.statSync(candidate).isDirectory()) || candidates[0];
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' || ext === '.json' ? 'no-cache' : 'public, max-age=31536000, immutable' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '0.0.0.0', () => console.log(`mon9D site listening on ${port}`));
