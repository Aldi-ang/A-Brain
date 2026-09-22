// SHIPPED: the plain red verdict figure, both themes, at 518 (phone CSS) — and the mid-motion frame proves the drop.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&opname';
const shot = (name, q, budget = 9000) => { execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--virtual-time-budget=${budget}`, '--window-size=518,1000', `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' }); console.log('shot', name); };
shot('ship-light', '&light&tab=count:400/3,3%20damaged');          // -17: red, dropped in
shot('ship-dark', '&tab=count:400/3,3%20damaged');
shot('ship-surplus', '&light&tab=count:425/0');                    // +5: red, risen
shot('ship-match', '&light&tab=count:420/0');                      // 0: plain ink, no motion
const frame = (png, x, y, w, h, cap, scale = 1) => `<figure style="width:${Math.round(w * scale)}px"><figcaption>${cap}</figcaption><div class="f" style="width:${Math.round(w * scale)}px;height:${Math.round(h * scale)}px;background-image:url('${png}');background-position:-${Math.round(x * scale)}px -${Math.round(y * scale)}px;background-size:${Math.round(518 * scale)}px auto"></div></figure>`;
const [x, y, w, h] = [20, 280, 478, 300];
const caps = [
  ['ship-light.png', '<b>SHIPPED, light</b> — a shortfall of 17: the same figure as the three beside it, in red. It dropped in from above and settled.'],
  ['ship-dark.png', '<b>SHIPPED, dark</b> — the same plate in the dark theme.'],
  ['ship-surplus.png', '<b>a surplus of 5</b> — red too, and it rose with a small pop instead of dropping.'],
  ['ship-match.png', '<b>a match</b> — plain ink like its neighbours, nothing moves.'],
];
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w * 4 + 24 * 5}px}main{display:flex;gap:24px;padding:24px;align-items:flex-start}figure{margin:0}figcaption{min-height:70px;padding:0 4px 10px}figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}</style><main>${caps.map(([p, c]) => frame(p, x, y, w, h, c)).join('')}</main>`;
writeFileSync('board-shipped.html', html);
execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${w * 4 + 24 * 5},${h + 24 * 2 + 70}`, `--screenshot=${dir}/board-shipped.png`, `file:///${dir}/board-shipped.html`], { stdio: 'ignore' });
console.log('board-shipped');
