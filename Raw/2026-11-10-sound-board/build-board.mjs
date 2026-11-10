// Inline the sounds, the voice planner and his voice settings into the board page.
import fs from 'fs';
const APP = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
const { CAPY_VOICE, capyFiles, capyFile } = await import('file:///' + APP + 'src/config/capyVoice.js');
const b = (p) => fs.readFileSync(p).toString('base64');
const DATA = { sign: b(APP + 'public/sounds/sign.mp3'), r1: b('board/r1-pen.mp3'), r2: b('board/r2-pluck.mp3'), r3: b('board/r3-coins.mp3') };
const VOICE = {};
for (const f of capyFiles()) { const n = capyFile(f.on, f.v, f.len, f.rise); VOICE[n] = b(APP + 'public/sounds/' + n + '.mp3'); }
const html = fs.readFileSync('board-template.html', 'utf8')
  .replace('/*@@CHIP@@*/', () => fs.readFileSync(APP + 'tools/chip.js', 'utf8'))
  .replace('/*@@DATA@@*/', () => JSON.stringify(DATA))
  .replace('/*@@VOICE@@*/', () => JSON.stringify(VOICE))
  .replace('/*@@CAPY@@*/', () => JSON.stringify(CAPY_VOICE));
fs.writeFileSync('sale-sound-board.html', html);
console.log('syllables', Object.keys(VOICE).length, 'bytes', html.length);
