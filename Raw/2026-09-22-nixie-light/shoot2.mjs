// Round two (14:40): the DIFFERENCE figure as a plate-family verdict — st-a stamp / st-b engraved well / st-c written —
// light frames + the recommended one in the dark theme. Run: node shoot2.mjs [frame…] | node shoot2.mjs compose
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&opname';
const CARD = '&tab=count:400/3,3%20damaged';
const FRAMES = {
  'st-a': '&light&look=st-a' + CARD,
  'st-b': '&light&look=st-b' + CARD,
  'st-c': '&light&look=st-c' + CARD,
  'st-a-dark': '&look=st-a' + CARD,
  'st-b-dark': '&look=st-b' + CARD,
};
const only = process.argv.slice(2);
for (const [name, q] of Object.entries(FRAMES)) {
  if (only.length && !only.includes(name) && !only.includes('shoot')) continue;
  if (only.length && only[0] === 'compose') break;
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', '--window-size=518,1000', `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' });
  console.log('shot', name);
}
const frame = (png, x, y, w, h, cap, scale = 1) => `<figure style="width:${Math.round(w * scale)}px"><figcaption>${cap}</figcaption><div class="f" style="width:${Math.round(w * scale)}px;height:${Math.round(h * scale)}px;background-image:url('${png}');background-position:-${Math.round(x * scale)}px -${Math.round(y * scale)}px;background-size:${Math.round(518 * scale)}px auto"></div></figure>`;
const page = (name, frames, w, h, capH) => {
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w}px}
  main{display:flex;gap:24px;padding:24px;align-items:flex-start;flex-wrap:wrap}
  figure{margin:0}figcaption{min-height:${capH}px;padding:0 4px 10px;color:#e8e4de}
  figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
  </style><main>${frames.join('')}</main>`;
  writeFileSync(`${name}.html`, html);
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, `file:///${dir}/${name}.html`], { stdio: 'ignore' });
  console.log(name, w, h);
};
if (only[0] === 'compose') {
  const { CROP, CAPS, CAPH } = await import('./board2.mjs');
  const [x, y, w, h] = CROP;
  page('board-verdict', CAPS.map(([png, cap]) => frame(png, x, y, w, h, cap)), w * CAPS.length + 24 * (CAPS.length + 1), h + 24 * 2 + CAPH, CAPH);
}
if (only[0] === 'zoom') {
  const [x, y, w, h] = [262, 480, 226, 68];
  const L = [['today.png', 'TODAY (nixie)'], ['st-a.png', 'A - the stamp'], ['st-b.png', 'B - the engraved well'], ['st-c.png', 'C - written by hand'], ['st-a-dark.png', 'A in the dark theme'], ['st-b-dark.png', 'B in the dark theme']];
  page('zoom2', L.map(([png, cap]) => frame(png, x, y, w, h, `<b>${cap}</b>`, 2)), (w * 2 + 24) * 3 + 24, (h * 2 + 40 + 24) * 2 + 24, 40);
}
