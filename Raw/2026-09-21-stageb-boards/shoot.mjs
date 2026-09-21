// STAGE B boards — shoots the frames headless at 518 (root pinned to 375 by look=pin) and composes two boards.
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell';
const FRAMES = {
  'prof-today-boss': ['&profile&admin&look=pin', 1000],
  'prof-today-man': ['&profile&look=pin', 1000],
  'prof-a': ['&profile&head&look=pin,prof-a', 1000],
  'prof-b': ['&profile&head&look=pin,prof-b', 1200],
  'xp-a': ['&eod&verified&xp=a&look=pin', 900],
  'xp-b': ['&eod&verified&xp=b&look=pin', 900],
  'xp-c': ['&eod&verified&xp=c&look=pin', 900],
};
const only = process.argv.slice(2);
for (const [name, [q, h]] of Object.entries(FRAMES)) {
  if (only.length && !only.includes(name) && !only.includes('shoot')) continue;
  if (only.length && only[0] === 'compose') break;
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000', `--window-size=518,${h}`, `--screenshot=${dir}/${name}.png`, LAB + q], { stdio: 'ignore' });
  console.log('shot', name);
}
const frame = (png, y, h, cap) => `<figure><figcaption>${cap}</figcaption><div class="f" style="height:${h}px;background-image:url('${png}.png');background-position:0 -${y}px"></div></figure>`;
const page = (name, frames, h, capH = 170) => {
  const w = frames.length * 375 + (frames.length + 1) * 24;
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w}px}
  main{display:flex;gap:24px;padding:24px;align-items:flex-start}
  figure{margin:0;width:375px}figcaption{min-height:${capH}px;padding:0 4px 10px;color:#e8e4de}
  figcaption b{color:#d08a2e}.f{width:375px;background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
  </style><main>${frames.join('')}</main>`;
  writeFileSync(`${name}.html`, html);
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000', `--window-size=${w},${h + capH + 48}`, `--screenshot=${dir}/${name}.png`, `file:///${dir}/${name}.html`], { stdio: 'ignore' });
  console.log(name, w, h + capH + 48);
};
page('board-prof', [
  frame('prof-today-boss', 0, 820, '<b>TODAY, the boss</b> — the four keys float in one row 430 px wide on a 375 px screen: LEADERBOARD is cut and the whole page slides 95 px sideways. The photo block is 96 px down from the top to clear them. The page scrolls inside its own box, not with the app. 20 labels at 10 px. « THE HUSTLER » pulses forever, the trophy bounces forever.'),
  frame('prof-today-man', 0, 820, '<b>TODAY, the salesman</b> — no keys but AVATAR and LEADERBOARD, the same 96 px gap above the photo, the same photo + stars + pills + name, then the OMSET 7 HARI box with the XP, the bar, the rank and the next rank. 600 px before any number he can act on.'),
  frame('prof-a', 0, 820, '<b>A (recommended)</b> — the keys wrap in 44 px rows (the boss gets GRANT AWARD as a fifth key), then the SAME card head the boss sees in HQ Verification: photo in the rank frame, rank · title, XP, the bar, XP to the next rank, CLOSED ?/? on today\'s route. One line under it: tier · ID · region · days active. The photo + stars + name block and the OMSET box are gone — the head says it. Nothing pulses. The page scrolls as one.'),
  frame('prof-b', 0, 820, '<b>B</b> — the same head, but the OMSET 7 HARI box stays under it. Safer (nothing removed), but the XP, the bar and the rank appear twice on one screen, 120 px apart.'),
], 820, 200);
page('board-xp', [
  frame('xp-a', 250, 560, '<b>A</b> — the Shift Closed block, and under its line: XP TONIGHT with the nixie <b>+51</b> — the app\'s one number instrument; the digits roll up from 0 the moment the boss\'s approval lands (nothing blinks), then the bar under it fills to the new place on the ladder and the line says the rank and the XP to the next one.'),
  frame('xp-b', 250, 560, '<b>B (recommended)</b> — the same nixie +51, and when the digits settle the working prints under it, one row at a time: collected Rp → +33, day closed → +10, pita cukai clean → +5, route 3 stores → +3. The number shows its working; the rows rise in AFTER the roll, never with it.'),
  frame('xp-c', 250, 560, '<b>C</b> — the nixie +51 beside the ladder figure 5.614 → 5.665 XP, the bar filling, SILVER · THE HUSTLER and the XP to GOLD — the profile\'s progression on the EOD panel. Cost: the arrow figure and the nixie say the same +51 twice.'),
], 560, 170);
