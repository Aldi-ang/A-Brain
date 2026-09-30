// Static half of the potato audit: the built stylesheet, the offline download (precache), image decode memory.
import fs from 'node:fs';
import path from 'node:path';
const DIST = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/dist';
const out = {};

/* the stylesheet the first screen must parse */
const cssFiles = fs.readdirSync(path.join(DIST, 'assets')).filter(f => f.endsWith('.css'));
out.css = cssFiles.map(f => {
  const s = fs.readFileSync(path.join(DIST, 'assets', f), 'utf8');
  const count = (re) => (s.match(re) || []).length;
  return { file: f, kb: Math.round(s.length / 1024), rules: count(/\{/g), hasSelectors: count(/:has\(/g), keyframes: count(/@keyframes/g),
    infinite: count(/infinite/g), backdrop: count(/backdrop-filter:/g), blur: count(/blur\(/g), boxShadow: count(/box-shadow:/g),
    animatesNonComposited: [...new Set([...s.matchAll(/@keyframes ([\w-]+)\{((?:[^{}]*\{[^{}]*\})*)\}/g)]
      .filter(m => /(?:^|[;{])(?:width|height|top|left|right|bottom|margin|padding|background(?:-position|-color|-size)?|box-shadow|filter|color|border[\w-]*|clip-path|stroke[\w-]*|font-size|letter-spacing)\s*:/.test(m[2]))
      .map(m => m[1]))] };
});

/* the offline copy the phone downloads after every push (only changed files, by revision) */
const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
const entries = [...sw.matchAll(/\{url:"([^"]+)",revision:(?:"[^"]*"|null)\}/g)].map(m => m[1]);
const sized = entries.map(u => { try { return [u, fs.statSync(path.join(DIST, u)).size]; } catch { return [u, 0]; } });
const byType = {};
for (const [u, b] of sized) { const t = u.split('.').pop(); byType[t] = (byType[t] || 0) + b; }
out.precache = { files: sized.length, totalKB: Math.round(sized.reduce((s, x) => s + x[1], 0) / 1024),
  byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])),
  biggest: sized.sort((a, b) => b[1] - a[1]).slice(0, 12).map(([u, b]) => `${Math.round(b / 1024)}KB ${u}`) };

/* PNG decode memory: width x height x 4 bytes once drawn, whatever the file size */
const png = (f) => { const b = fs.readFileSync(f); return b.toString('ascii', 12, 16) === 'IHDR' ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };
const imgs = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.png')) { const wh = png(p); if (wh) imgs.push([p.replace(DIST, ''), Math.round(fs.statSync(p).size / 1024), wh[0], wh[1], Math.round(wh[0] * wh[1] * 4 / 1048576 * 10) / 10]); } } };
walk(DIST);
out.pngDecodeMB = imgs.sort((a, b) => b[4] - a[4]).slice(0, 12).map(([p, kb, w, h, mb]) => `${mb}MB decoded (${w}x${h}, ${kb}KB file) ${p}`);
out.index = (fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').match(/<link[^>]+>|<script[^>]*src[^>]*>/g) || []);
console.log(JSON.stringify(out, null, 1));
