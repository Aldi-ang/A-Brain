// The light-mode nixie boards (his 2026-09-20 "t4 looks okay but the light mode nixie can look better that
// that"). Frames are 2000×1000 headless shots of the REAL Stock Opname count card in the lab's shell, light
// mode, at 518 (the narrowest uncropped headless width; the phone CSS applies below 1024); a board is a crop per option with its caption. Run: node shoot.mjs [frame…|compose]
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&light';
const CARD = '&tab=count:400/3,3%20damaged';
const FRAMES = {
  'today': CARD,
  'nx-a': '&look=nx-a' + CARD,
  'nx-b': '&look=nx-b' + CARD,
  'nx-c': '&look=nx-c' + CARD,
  'today-dark': CARD,
};
const only = process.argv.slice(2);
for (const [name, q] of Object.entries(FRAMES)) {
  if (only.length && !only.includes(name) && !only.includes('shoot')) continue;
  if (only.length && only[0] === 'compose') break;
  const url = name === 'today-dark' ? LAB.replace('&light', '') + q : LAB + q;
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', '--window-size=518,1000', `--screenshot=${dir}/${name}.png`, url], { stdio: 'ignore' });
  console.log('shot', name);
}
const frame = (png, x, y, w, h, cap, scale = 1) => `<figure style="width:${Math.round(w * scale)}px"><figcaption>${cap}</figcaption><div class="f" style="width:${Math.round(w * scale)}px;height:${Math.round(h * scale)}px;background-image:url('${png}');background-position:-${Math.round(x * scale)}px -${Math.round(y * scale)}px;background-size:${Math.round(518 * scale)}px auto"></div></figure>`;
const page = (name, frames, w, h, capH) => {
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w}px}
  main{display:flex;gap:24px;padding:24px;align-items:flex-start}
  figure{margin:0}figcaption{min-height:${capH}px;padding:0 4px 10px;color:#e8e4de}
  figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
  </style><main>${frames.join('')}</main>`;
  writeFileSync(`${name}.html`, html);
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, `file:///${dir}/${name}.html`], { stdio: 'ignore' });
  console.log(name, w, h);
};
export { frame, page };
if (only[0] === 'compose') {
  const { CROP, CAPS, CAPH } = await import('./board.mjs');
  const [x, y, w, h] = CROP;
  page('board-nixie', CAPS.map(([png, cap]) => frame(png, x, y, w, h, cap)), w * CAPS.length + 24 * (CAPS.length + 1), h + 24 * 2 + CAPH, CAPH);
}
