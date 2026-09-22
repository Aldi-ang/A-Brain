// SHIPPED, round three: the boss's audit line follows the card — plain figures, the DIFFERENCE red with the one-shot drop.
// Frames at 518 (phone CSS) light + dark, and the desk row at 1280.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin&tab=hq%20audits,bandung';
const shot = (name, q, w, h) => { execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' }); console.log('shot', name); };
if (process.argv[2] !== 'compose') shot('audit-light', '&light', 518, 1000);
if (process.argv[2] !== 'compose') shot('audit-dark', '', 518, 1000);
if (process.argv[2] !== 'compose') shot('audit-desk', '&light', 1280, 900);
const frame = (png, x, y, w, h, cap, bw) => `<figure style="width:${w}px"><figcaption>${cap}</figcaption><div class="f" style="width:${w}px;height:${h}px;background-image:url('${png}');background-position:-${x}px -${y}px;background-size:${bw}px auto"></div></figure>`;
const caps = [
  frame('audit-light.png', 20, 250, 478, 420, '<b>HQ audits, light</b> — the audit line: EXPECTED and FOUND as plain figures, the DIFFERENCE in red, same size and font; it drops in once.', 518),
  frame('audit-dark.png', 20, 250, 478, 420, '<b>HQ audits, dark</b> — the same line in the dark theme.', 518),
  frame('audit-desk.png', 720, 200, 560, 420, '<b>the desk row (1280)</b> — SYS → FND → the difference, one line, same figures.', 1280),
];
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${478 * 2 + 560 + 24 * 4}px}main{display:flex;gap:24px;padding:24px;align-items:flex-start}figure{margin:0}figcaption{min-height:70px;padding:0 4px 10px}figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}</style><main>${caps.join('')}</main>`;
writeFileSync('board-audit.html', html);
execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${478 * 2 + 560 + 24 * 4},${420 + 24 * 2 + 70}`, `--screenshot=${dir}/board-audit.png`, `file:///${dir}/board-audit.html`], { stdio: 'ignore' });
console.log('board-audit');
