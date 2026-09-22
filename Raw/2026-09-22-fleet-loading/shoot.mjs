// The Fleet & Roster van-loading talk (his 2026-09-22 15:05: "is it better to make another segment
// or just make another panel inside the fleet and roster"). Frames are headless shots of the REAL
// Fleet & Roster inside the lab shell as the REGIONAL ADMIN, plus the two option mocks.
// PC = 2000x1000 (his screen). PHONE = 518 (the narrowest uncropped headless width; the phone CSS
// applies below 1024 — `look=pin` does NOT fire the media queries). Run: node shoot.mjs [name...]
/* DELETE THE TARGET FIRST. Chrome's --screenshot silently leaves an EXISTING png untouched (seen
   2026-09-22: "composed board-pc" printed while the file on disk kept its old mtime and the old
   row layout), so a recomposed board can be sent as the previous version. */
import { writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = process.cwd().replace(/\\/g, '/');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const FRAMES = {
  'today-pc': [LAB + '&tab=budi', 2000, 1000],
  'today-phone': [LAB + '&tab=budi', 518, 1400],
  'a-pc': [LAB + '&mock=panel', 2000, 1000],
  'a-phone': [LAB + '&mock=panel&phone', 518, 1400],
  'b-pc': [LAB + '&mock=module', 2000, 1000],
  'b-phone': [LAB + '&mock=module&phone', 518, 1400],
  'a-pc-light': [LAB + '&mock=panel&light', 2000, 1000],
  'b-pc-light': [LAB + '&mock=module&light', 2000, 1000],

  /* ROUND TWO (his "i want better UI than that for our roster ... cool if we have some 3D
     animation as well" + "make sure that there is animation on doing loading"). */
  'r-a-pc': [LAB + '&at=1400&mock=panel&r=a', 2000, 1000],
  'r-b-pc': [LAB + '&at=1400&mock=panel&r=b', 2000, 1000],
  'r-c-pc': [LAB + '&at=1400&mock=panel&r=c', 2000, 1000],
  'r-a-phone': [LAB + '&at=1400&roster&mock=panel&r=a&phone', 518, 1400],
  'r-b-phone': [LAB + '&at=1400&roster&mock=panel&r=b&phone', 518, 1400],
  'r-c-phone': [LAB + '&at=1400&roster&mock=panel&r=c&phone', 518, 1400],
  'r-b-pc-light': [LAB + '&at=1400&mock=panel&r=b&light', 2000, 1000],
  /* the motion, frozen at one moment each (&at rewinds every animation and pauses it) */
  'm-a-mid': [LAB + '&mock=panel&r=b&play=a&at=700', 2000, 1000],
  'm-a-end': [LAB + '&mock=panel&r=b&play=a&at=1150', 2000, 1000],
  'm-b-mid': [LAB + '&mock=panel&r=b&play=b&at=330', 2000, 1000],
  'm-b-end': [LAB + '&mock=panel&r=b&play=b&at=780', 2000, 1000],
  'm-c-mid': [LAB + '&mock=panel&r=b&play=c&at=430', 2000, 1000],
  'm-c-end': [LAB + '&mock=panel&r=b&play=c&at=980', 2000, 1000],
};
const only = process.argv.slice(2);
for (const [name, [url, w, h]] of Object.entries(FRAMES)) {
  if (only.length && !only.includes(name)) continue;
  rmSync(dir + '/' + name + '.png', { force: true });
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=9000',
    `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, url], { stdio: 'ignore' });
  console.log('shot', name, w + 'x' + h);
}
export const frame = (png, x, y, w, h, cap, shotW, scale = 1) =>
  `<figure style="width:${Math.round(w * scale)}px"><figcaption>${cap}</figcaption><div class="f" style="width:${Math.round(w * scale)}px;height:${Math.round(h * scale)}px;background-image:url('${png}');background-position:-${Math.round(x * scale)}px -${Math.round(y * scale)}px;background-size:${Math.round(shotW * scale)}px auto"></div></figure>`;
export const page = (name, frames, w, h, capH, flow = 'row') => {
  writeFileSync(`${name}.html`, `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0a09;color:#e8e4de;font:600 15px/1.35 Segoe UI,system-ui,sans-serif;width:${w}px}
  main{display:flex;flex-direction:${flow};gap:24px;padding:24px;align-items:flex-start}
  figure{margin:0}figcaption{min-height:${capH}px;padding:0 4px 10px;color:#e8e4de}
  figcaption b{color:#d08a2e}.f{background-repeat:no-repeat;border:1px solid #3a342c;border-radius:6px}
  </style><main>${frames.join('')}</main>`);
  rmSync(dir + '/' + name + '.png', { force: true });
  execFileSync(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000',
    `--window-size=${w},${h}`, `--screenshot=${dir}/${name}.png`, `file:///${dir}/${name}.html`], { stdio: 'ignore' });
  console.log('composed', name, w + 'x' + h);
};
