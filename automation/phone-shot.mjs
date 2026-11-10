// Phone-width screenshot of a local HTML file, the TRUE width - not a crop.
// Headless Edge/Chrome will not make a window narrower than ~510 px, so --window-size=375 lays the page out at
// 510 and crops it: a fake sideways overflow (the alucard lesson "a phone in headless Chrome is a desktop", seen 4x).
// This wraps the page in an iframe of the real width, deletes the old PNG first (a failed shot must not leave
// yesterday's picture), and writes the page's own innerWidth / scrollWidth in a strip at the top of the shot.
//   node phone-shot.mjs <page.html> <out.png> [width=380] [height=2300]
// 2026-11-10, Edge 157: msedge.exe returns AT ONCE and the browser writes the PNG a few seconds later, so the shot
// is polled for; --virtual-time-budget and --dump-dom are gone (with the hand-off they gave no PNG / no stdout).
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const [page, out, w = '380', h = '2300'] = process.argv.slice(2);
if (!page || !out) { console.error('usage: node phone-shot.mjs <page.html> <out.png> [width] [height]'); process.exit(1); }
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(fs.existsSync);
const abs = path.resolve(page), dir = path.dirname(abs), url = (f) => 'file:///' + f.replace(/\\/g, '/');
const wrap = path.join(dir, '.phone-shot-wrap.html'), dest = path.resolve(out);
const probe = `onload="try{const d=this.contentDocument;document.getElementById('m').textContent='inner '+d.defaultView.innerWidth+' scroll '+d.documentElement.scrollWidth+(d.documentElement.scrollWidth>d.defaultView.innerWidth?' SIDEWAYS OVERFLOW':' fits')}catch(e){document.getElementById('m').textContent='width unknown'}"`;
fs.writeFileSync(wrap, `<body style="margin:0;background:#000"><div id="m" style="font:12px monospace;color:#000;background:#fff;width:${w}px">loading</div><iframe src="${url(abs)}" ${probe} style="width:${w}px;height:${h}px;border:0;display:block"></iframe>`);
fs.rmSync(dest, { force: true });
const prof = path.join(os.homedir(), '.cache', 'phone-shot-profile');
execFileSync(EDGE, ['--headless=new', '--user-data-dir=' + prof, '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  `--window-size=${Math.max(+w, 520)},${+h + 20}`, '--screenshot=' + dest, url(wrap)], { stdio: 'ignore' });
const until = Date.now() + 20000;
let last = -1;
while (Date.now() < until) {   // wait for the file AND for its size to stop changing
  const size = fs.existsSync(dest) ? fs.statSync(dest).size : -1;
  if (size > 0 && size === last) break;
  last = size; execFileSync(process.execPath, ['-e', 'setTimeout(()=>{},700)']);
}
fs.rmSync(wrap, { force: true });
console.log(fs.existsSync(dest) ? `shot ${out} - the strip at the top says the page's width and whether it fits` : 'NO SHOT after 20 s');
