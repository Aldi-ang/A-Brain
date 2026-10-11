import http from 'node:http'; import { readFile } from 'node:fs/promises'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
// local check of the round-2 studio, wrapped the way the Artifact host wraps a page (doctype + viewport)
const dir = dirname(fileURLToPath(import.meta.url));
http.createServer(async (q, r) => { const f = q.url === '/' ? 'sound-studio.html' : q.url.slice(1).split('?')[0];
  try { let b = await readFile(join(dir, f)); if (f.endsWith('.html')) b = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>' + b + '</body></html>';
    r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.png') ? 'image/png' : 'text/html; charset=utf-8' }); r.end(b); } catch { r.writeHead(404); r.end(); } }).listen(4197);
