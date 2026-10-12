import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname } from 'node:path';
import { route } from './routes.mjs';
const root = new URL('../', import.meta.url);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export async function handle(req, res) {
  if (!['GET','HEAD'].includes(req.method)) {
    res.writeHead(405, {'Allow':'GET, HEAD'});res.end('Method not allowed');return;
  }
  const url = new URL(req.url, 'http://localhost');
  const match = route(url.pathname);
  if (match?.redirect) { res.writeHead(308, {'Location': match.redirect + url.search});res.end();return; }
  if (!match) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});res.end('Page not found');return; }
  try {
    const data = await readFile(new URL(match.file, root));
    res.writeHead(200, {'Content-Type': types[extname(match.file)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});res.end('File not found'); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  http.createServer(handle).listen(port, '127.0.0.1', () => console.log(`Mawonga Training preview: http://localhost:${port}`));
}
