// contact sheet per screen: every 390 frame side by side, for looking, not for Aldi
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const UP = path.dirname(HERE);
const url = p => 'file:///' + p.split(path.sep).join('/');
for (const k of (process.argv[2] || 'dash,map,reports,settings,fame').split(',')) {
  const fr = k === 'desk' ? fs.readdirSync(UP).filter(f => f.endsWith('-1440.png')).sort()
    : fs.readdirSync(UP).filter(f => f.startsWith('ps-' + k + '-390-') && f.endsWith('.png')).sort();
  if (k === 'desk') { const html = `<body style="margin:0;background:#222;display:flex;flex-wrap:wrap;gap:6px;width:1758px">${fr.map(f => `<img src="${url(path.join(UP, f))}" style="width:576px">`).join('')}</body>`;
    const h = path.join(HERE, 'desk.html'); fs.writeFileSync(h, html); const png = path.join(HERE, 'desk.png'); fs.rmSync(png, { force: true });
    execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--hide-scrollbars', '--allow-file-access-from-files',
      '--user-data-dir=' + path.join(HERE, 'prof'), '--screenshot=' + png, '--window-size=1758,734', url(h)], { stdio: 'ignore' });
    console.log(k, fr.length, fs.existsSync(png) && fs.statSync(png).size); continue; }
  const html = `<body style="margin:0;background:#222;display:flex;gap:6px">${fr.map(f => `<img src="${url(path.join(UP, f))}" style="width:300px">`).join('')}</body>`;
  const h = path.join(HERE, k + '.html'); fs.writeFileSync(h, html);
  const png = path.join(HERE, k + '.png'); fs.rmSync(png, { force: true });
  execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--hide-scrollbars', '--allow-file-access-from-files',
    '--user-data-dir=' + path.join(HERE, 'prof'), '--screenshot=' + png, `--window-size=${fr.length * 306},650`, url(h)], { stdio: 'ignore' });
  console.log(k, fr.length, fs.existsSync(png) && fs.statSync(png).size);
}
