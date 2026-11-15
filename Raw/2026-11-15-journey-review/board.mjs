/* COMPOSE A BOARD FOR ALDI from walk frames: node board.mjs <spec.json> <out.png>
   spec = { title, sub, width, frameW, sections: [{ h, items: [ { img, cap } | { pair: [{ img, cap }, { img, cap }] } ] }] }
   The page is drawn by a headless desktop Chrome (its own profile, port 9558) and shot whole. The old png is deleted first,
   so a failed shot cannot pass for a new one. Colours: slate + gold (his palette), text plain. */
import { readFileSync, writeFileSync, rmSync, statSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const [specFile, outFile] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(DIR + specFile, 'utf8'));
const W = spec.width || 1240;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const missing = [];
function fig(f) {
    if (!existsSync(DIR + f.img)) missing.push(f.img);
    /* f.css = [w, h] of the page in CSS px; f.marks = [{ x, y, w, h, t }] in those px: a dashed gold box on what goes wrong.
       f.notch: an iPhone 13's notch, status line and home bar drawn over the frame - it is a simulation, so it looks like one */
    const pc = (v, of) => `${(100 * v / of).toFixed(2)}%`;
    const marks = (f.marks || []).map((m) => `<i class="mk" style="left:${pc(m.x, f.css[0])};top:${pc(m.y, f.css[1])};width:${pc(m.w, f.css[0])};height:${pc(m.h, f.css[1])}"><em${m.up ? ' class="up"' : ''}>${m.t}</em></i>`).join('');
    const notch = f.notch ? '<i class="nt"></i><i class="st l">9:41</i><i class="st r">5G 100%</i><i class="hb"></i>' : '';
    return `<figure style="width:${f.w || spec.frameW || 220}px"><div class="ph"><img src="${pathToFileURL(DIR + f.img).href}">${notch}${marks}</div><figcaption>${f.cap}</figcaption></figure>`;
}
const body = spec.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.note ? `<p class="note">${s.note}</p>` : ''}<div class="row">${s.items.map((it) => (it.pair
    ? `<div class="pair">${fig(it.pair[0])}<span class="arrow">&rarr;</span>${fig(it.pair[1])}</div>` : fig(it))).join('')}</div>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#15171c;color:#e8e4dc;font:15px/1.4 "Segoe UI",system-ui,sans-serif;padding:28px 30px 34px;width:${W}px;box-sizing:border-box}
h1{font-size:25px;margin:0 0 6px;color:#d9a441}.sub{color:#b3aea4;margin:0 0 8px;max-width:1100px}
h2{font-size:17px;margin:24px 0 10px;color:#d9a441;border-top:1px solid #30333a;padding-top:16px}
.note{margin:-4px 0 12px;color:#b3aea4;font-size:14px;max-width:1100px}
.row{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}
figure{margin:0}figure img{width:100%;border-radius:10px;border:1px solid #3a3d45;display:block}
.ph{position:relative}.ph i{position:absolute;font-style:normal}
.mk{border:2px dashed #e0b25a;border-radius:6px;box-shadow:0 0 0 2px rgba(0,0,0,.55)}.mk em{position:absolute;left:-2px;top:100%;margin-top:3px;background:#e0b25a;color:#15171c;font:700 10.5px/1.25 "Segoe UI",sans-serif;font-style:normal;padding:2px 5px;border-radius:4px;white-space:nowrap}.mk em.up{top:auto;bottom:100%;margin:0 0 3px}
.nt{left:50%;top:0;width:41.5%;height:3.8%;transform:translateX(-50%);background:#000;border-radius:0 0 12px 12px}
.st{top:1.2%;color:#fff;font:600 10px/1 "Segoe UI",sans-serif}.st.l{left:9%}.st.r{right:7%}
.hb{left:50%;bottom:.9%;width:34%;height:4px;transform:translateX(-50%);background:rgba(255,255,255,.85);border-radius:3px}
figcaption{margin-top:7px;font-size:13px;color:#ddd8ce}figcaption b{color:#e0b25a}
.pair{display:flex;gap:10px;align-items:center;padding:10px;border:1px solid #30333a;border-radius:12px;background:#1b1e24}.arrow{font-size:24px;color:#d9a441}
</style></head><body><h1>${esc(spec.title)}</h1><p class="sub">${spec.sub || ''}</p>${body}</body></html>`;
if (missing.length) { console.log('MISSING FRAMES:', missing.join(', ')); process.exit(1); }
const page = DIR + specFile.replace(/\.json$/, '.html');
writeFileSync(page, html);

const PORT = 9558, out = DIR + outFile;
rmSync(out, { force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${DIR}prof-board`, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(page).href });
await sleep(2500);
const h = (await send('Runtime.evaluate', { expression: 'Math.ceil(document.documentElement.scrollHeight)', returnByValue: true })).result.value;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: h, deviceScaleFactor: 1, mobile: false });
await sleep(600);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
ws.close(); chrome.kill();
console.log(`${outFile} ${W}x${h} ${statSync(out).size} bytes, written ${statSync(out).mtime.toISOString()}`);
process.exit(0);
