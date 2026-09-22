// SHIPPED board (2026-09-22): the review card open on the desk (dark / light), the Agent Inventory strip on the desk, and both at 375.
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell';
const OPEN = '&tab=%E2%8C%84';
const shot = (name, q, w, h) => { execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' }); console.log('shot', name); };
if (!process.argv.includes('compose')) {
  shot('s-card-dark', '&eod&admin' + OPEN, 2000, 1000);
  shot('s-card-light', '&eod&admin&light' + OPEN, 2000, 1000);
  shot('s-inv-dark', '&agent', 2000, 1000);
  shot('s-card-phone', '&eod&admin&look=pin' + OPEN, 518, 1300);
  shot('s-inv-phone', '&agent&look=pin', 518, 900);
}
const crop = (png, x, y, w, h, cap, full = 2000) => `<figure style="width:${w}px"><figcaption>${cap}</figcaption><div class="f" style="width:${w}px;height:${h}px;background-image:url('${png}');background-position:-${x}px -${y}px;background-size:${full}px auto"></div></figure>`;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:2098px}
main{display:flex;flex-wrap:wrap;gap:24px;padding:24px;align-items:flex-start}
figure{margin:0}figcaption{min-height:80px;padding:0 4px 10px;color:#e8e4de}
figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
</style><main>
${crop('s-card-dark.png', 350, 250, 650, 700, '<b>SHIPPED — the review card open on your PC, dark</b>: photo 128, CLOSED TODAY beside the name, the body in two columns. Card 564 px (was 880); the RESET line ends 126 px above the screen\'s bottom.')}
${crop('s-card-light.png', 350, 250, 650, 700, '<b>the same in light</b>: the stamps-lost words are ink with the amber dot; card 606 px.')}
${crop('s-card-phone.png', 0, 380, 375, 700, '<b>the phone (375)</b> — unchanged: head 251, the stack, the lines 51 px; measured identical to the old code.', 518)}
${crop('s-inv-dark.png', 470, 110, 1050, 340, '<b>SHIPPED — the Agent Inventory on your PC</b>: MANIFEST on its own row, the four boxes full-width under it (239 px each); MODAL has 41 px to spare, CASH 26, the coin 38 px inside its box.')}
${crop('s-inv-phone.png', 0, 130, 375, 330, '<b>the phone (375)</b> — unchanged: two boxes to a row, 163 px, no sideways scroll.', 518)}
</main>`;
writeFileSync('board-shipped.html', html);
execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', '--window-size=2098,1700', `--screenshot=${dir}/board-shipped.png`, `file:///${dir}/board-shipped.html`], { stdio: 'ignore' });
console.log('board-shipped');
