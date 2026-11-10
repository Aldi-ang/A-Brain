// Inline the sounds, the voice planner and his voice settings into the board page.
import fs from 'fs';
const APP = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
const { CAPY_VOICE, capyFiles, capyFile } = await import('file:///' + APP + 'src/config/capyVoice.js');
const b = (p) => fs.readFileSync(p).toString('base64');
const DATA = { sign: b(APP + 'public/sounds/sign.mp3'), c1: b('board/c1-chaching-short.mp3'), c2: b('board/c2-chaching-full.mp3') };
const POOLS = JSON.parse(fs.readFileSync('board/voices.json', 'utf8'));
for (const v of Object.values(POOLS)) for (const p of v) DATA[p.name] = b('board/' + p.name + '.mp3');
const VOICE = {};
for (const f of capyFiles()) { const n = capyFile(f.on, f.v, f.len, f.rise); VOICE[n] = b(APP + 'public/sounds/' + n + '.mp3'); }
const html = fs.readFileSync('board-template.html', 'utf8')
  .replace('/*@@CHIP@@*/', () => fs.readFileSync(APP + 'tools/chip.js', 'utf8'))
  .replace('/*@@DATA@@*/', () => JSON.stringify(DATA))
  .replace('/*@@VOICE@@*/', () => JSON.stringify(VOICE))
  .replace('/*@@POOLS@@*/', () => JSON.stringify(POOLS))
  .replace('/*@@CAPY@@*/', () => JSON.stringify(CAPY_VOICE));
fs.writeFileSync('sale-sound-board.html', html);
console.log('syllables', Object.keys(VOICE).length, 'bytes', html.length);
