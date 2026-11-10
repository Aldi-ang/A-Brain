// Phone-width screenshot of a local HTML file, the TRUE width - not a crop.
// Headless Edge/Chrome will not make a window narrower than ~510 px, so --window-size=375 lays the page out at
// 510 and crops it: a fake sideways overflow (the alucard lesson "a phone in headless Chrome is a desktop", seen 4x).
// This wraps the page in an iframe of the real width instead, deletes the old PNG first (a failed shot must not
// leave yesterday's picture), and prints the page's own innerWidth / scrollWidth so overflow is a number, not a guess.
//   node phone-shot.mjs <page.html> <out.png> [width=380] [height=2300]
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [page, out, w = '380', h = '2300'] = process.argv.slice(2);
if (!page || !out) { console.error('usage: node phone-shot.mjs <page.html> <out.png> [width] [height]'); process.exit(1); }
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(fs.existsSync);
const abs = path.resolve(page), dir = path.dirname(abs), url = (f) => 'file:///' + f.replace(/\\/g, '/');
const wrap = path.join(dir, '.phone-shot-wrap.html');
const probe = `onload="try{const d=this.contentDocument;document.title=d.defaultView.innerWidth+' '+d.documentElement.scrollWidth}catch(e){document.title='no-probe'}"`;
fs.writeFileSync(wrap, `<body style="margin:0;background:#000"><iframe src="${url(abs)}" ${probe} style="width:${w}px;height:${h}px;border:0"></iframe>`);
fs.rmSync(out, { force: true });
const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--window-size=${Math.max(+w, 520)},${h}`, '--virtual-time-budget=4000'];
execFileSync(EDGE, [...args, '--screenshot=' + path.resolve(out), url(wrap)], { stdio: 'ignore' });
const title = execFileSync(EDGE, [...args, '--dump-dom', url(wrap)], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().match(/<title>([^<]*)<\/title>/)?.[1] || 'no-probe';
fs.rmSync(wrap, { force: true });
const [iw, sw] = title.split(' ').map(Number);
console.log(fs.existsSync(out) ? `shot ${out}` : 'NO SHOT', `| page inner ${iw} scroll ${sw}`, sw > iw ? '| SIDEWAYS OVERFLOW' : '| fits');
