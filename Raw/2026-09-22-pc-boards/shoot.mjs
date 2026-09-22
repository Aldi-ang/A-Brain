// PC boards (2026-09-22) — the review card open on the desk, the Agent Inventory strip on the desk.
// Shoots the lab headless at his 2000×1000 and composes two boards with captions above the frames.
import { writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell';
const OPEN = '&tab=%E2%8C%84'; // presses the card's own chevron button — a real click through setOpen
const FRAMES = {
  'card-today': ['&eod&admin' + OPEN],
  'card-a': ['&eod&admin&look=rc-head,rc-two' + OPEN],
  'card-b': ['&eod&admin&look=rc-two' + OPEN],
  'inv-today': ['&agent'],
  'inv-a': ['&agent&look=inv-a'],
  'inv-c': ['&agent&look=inv-c'],
};
const only = process.argv.slice(2);
for (const [name, [q]] of Object.entries(FRAMES)) {
  if (only.length && !only.includes(name) && !only.includes('shoot')) continue;
  if (only.length && only[0] === 'compose') break;
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', '--window-size=2000,1000', `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' });
  console.log('shot', name);
}
// a frame is a crop of a 2000×1000 shot: x,y,w,h in CSS px; his own screenshot is a frame too
const frame = (png, x, y, w, h, cap, scale = 1) => `<figure style="width:${Math.round(w * scale)}px"><figcaption>${cap}</figcaption><div class="f" style="width:${Math.round(w * scale)}px;height:${Math.round(h * scale)}px;background-image:url('${png}');background-position:-${Math.round(x * scale)}px -${Math.round(y * scale)}px;background-size:${Math.round(2000 * scale)}px auto"></div></figure>`;
const own = (png, w, h, cap) => `<figure style="width:${w}px"><figcaption>${cap}</figcaption><div class="f" style="width:${w}px;height:${h}px;background-image:url('${png}');background-size:${w}px auto"></div></figure>`;
const page = (name, frames, w, h, capH, column = false) => {
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w}px}
  main{display:flex;gap:24px;padding:24px;align-items:flex-start;${column ? 'flex-direction:column' : ''}}
  figure{margin:0}figcaption{min-height:${capH}px;padding:0 4px 10px;color:#e8e4de}
  figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
  </style><main>${frames.join('')}</main>`;
  writeFileSync(`${name}.html`, html);
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, `file:///${dir}/${name}.html`], { stdio: 'ignore' });
  console.log(name, w, h);
};
// Board 1 — the open card. The scroller runs y 98..968; the card starts at y≈277. Crop x 350..1000 (650), y 250..1000 (750): TODAY is cut by the screen's bottom, which is the defect.
const CW = 650, CH_ = 750;
page('board-card', [
  frame('card-today.png', 350, 250, CW, CH_, '<b>TODAY</b> — the open card is 880 px tall on your 1000 px screen: the plate and the RESET line sit 189 px below the screen\'s bottom edge, so you scroll down to approve and back up to read the head. The photo block and the CLOSED TODAY row alone take 255 px.'),
  frame('card-a.png', 350, 250, CW, CH_, '<b>A (recommended)</b> — on the PC only, when the card opens its head compacts: the photo 128 → 72, CLOSED TODAY and the stamps light move beside the name on one row (head 255 → 134 px). Under it the body uses the card\'s width: REVENUE TONIGHT + PRODUCTS TODAY on the left, THE HANDOVER lines + the plate on the right. Card 880 → 619 px; the RESET line ends 55 px above the screen\'s bottom. Nothing changes on the phone. Cost: a product name gets 170 px instead of 400 — a long one wraps to two lines.'),
  frame('card-b.png', 350, 250, CW, CH_, '<b>B</b> — the same two-column body, the head left as it is (photo 128, CLOSED TODAY under it). Card 880 → 737 px: on your screen it ends 64 px above the bottom with 5 handover lines; a 6th line (BOUNTY, when he is short) leaves 8 px. Cost: no slack — one more line, or a smaller window, and you scroll again.'),
], CW * 3 + 24 * 4, CH_ + 24 * 2 + 250, 250);
// Board 2 — the strip. The header runs x 483..1507, y 122..371 at 2000. Crop x 470..1520 (1050), y 110..380 (270).
const IW = 1050, IH = 270;
page('board-inv', [
  own('his-today.png', 1050, 400, '<b>TODAY, your screenshot</b> — on your PC the four boxes are 149 px wide (the stats column is 65 % of the 1024 px page at this width), 124 px inside. MODAL\'s <b>Rp 1.200.000</b> at 20 px is 152 px in your font, so it runs 14 px past each side of its box into CASH; CASH\'s coin + number is 164 px, so the coin sits outside its own box (the gold sliver at CASH\'s left edge is the coin). Below 1280 px (a laptop) the row is full-width and nothing crosses.'),
  frame('inv-a.png', 470, 110, IW, 340, '<b>A</b> — the desk uses the laptop\'s layout: the MANIFEST block on its own row, the four boxes full-width under it (239 px each, 87 px of slack for the widest number). Nothing redrawn, the coin stays. Cost: the header grows one row taller (≈110 px) on the PC — the product list starts lower.'),
  frame('inv-c.png', 470, 110, IW, IH, '<b>B (recommended)</b> — the four boxes become ONE panel in the same language as PROJECTED VALUE under it: four cells with hairline dividers, the number at 18 px in a 155 px cell (a 7-digit rupiah has 19 px to spare in your font; an 8-digit one steps down to 16 px, the size ladder the box already has), no coin on the desk, the same height as today. Cost: the boxes lose their separate frames and the CASH coin; a title row for the panel is yours to name if you want one.'),
], IW + 24 * 2, 400 + 340 + IH + 24 * 4 + 90 * 3, 90, true);
