// How long the capybara talks today vs option A, over his real lines, 40 seeds each.
import 'file:///D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/tools/chip.js';
import { CAPY_VOICE } from 'file:///D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/src/config/capyVoice.js';
const LINES = ["Deal's done. Good haul.", "Stock's moving. I like that.", "Clean trade. Next route?", "Counted and paid. We're square.",
  "Right, that's noted.", "Into the book it goes.", "Good pick.", "Aye, one more.", "Sector Configuration Saved! 🚀", "Welcome back, Boss!"];
const A = { ...CAPY_VOICE, maxSyl: 5, first: true };
const len = (p) => { const s = []; for (const t of LINES) for (let k = 0; k < 40; k++) { const pl = globalThis.KPM_CHIP.plan(p.first ? (t.match(/^[^.!?]*[.!?]?/)[0]) : t, p, { seed: k }); s.push({ t: pl.at(-1).at + .35, n: pl.length, words: new Set(pl.map(x => x.sent + ':' + x.word)).size }); } return s; };
for (const [name, p] of [['today', CAPY_VOICE], ['A', A]]) {
  const s = len(p), avg = (f) => (s.reduce((a, x) => a + f(x), 0) / s.length).toFixed(2), max = (f) => Math.max(...s.map(f)).toFixed(2);
  console.log(name, 'seconds avg', avg(x => x.t), 'max', max(x => x.t), '| sounds avg', avg(x => x.n), 'max', max(x => x.n), '| words min', Math.min(...s.map(x => x.words)));
}
