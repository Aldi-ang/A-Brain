// node build-pack.mjs <measure.json> <app sounds dir> <out sfx-pack.js>
// The studio's recordings: the shortlist per moment (picked from measurements), each as a small mp3,
// plus today's app sound for each moment so he can compare. Kenney packs are CC0.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const [measurePath, appDir, outPath] = process.argv.slice(2);
const M = JSON.parse(readFileSync(measurePath, 'utf8'));
const CARDS = {
  msg:   ['glass_001', 'glass_002', 'pluck_002', 'confirmation_003', 'confirmation_002', 'select_003', 'toggle_002', 'maximize_007', 'powerUp2'],
  fail:  ['error_003', 'error_001', 'error_002', 'error_004', 'back_001', 'glass_003', 'question_003'],
  capy:  ['pluck_001', 'glass_005', 'glass_006', 'drop_001', 'toggle_004', 'select_007', 'tick_004', 'click4', 'switch8'],
  intro: ['jingles_STEEL13', 'jingles_SAX01', 'jingles_NES00', 'jingles_STEEL16', 'jingles_STEEL07', 'jingles_PIZZI13', 'powerUp1', 'powerUp3', 'spaceTrash3', 'zapTwoTone2'],
};
const TODAY = { msg: 'commit', fail: 'error', capy: 'mumble1', intro: 'vault-b' };

const mp3 = (file) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', '44100', '-b:a', '112k', '-f', 'mp3', 'pipe:1'], { maxBuffer: 1 << 26 });
  if (r.status) throw new Error(file + ': ' + r.stderr);
  return r.stdout.toString('base64');
};
const SRC = {}, META = {};
for (const [card, names] of Object.entries(CARDS)) {
  for (const n of names) {
    const m = M.find((r) => r.name === n && r.pack !== 'app');
    if (!m) throw new Error('not measured: ' + n);
    SRC[n] = mp3(m.file);
    META[n] = { pack: m.pack, len: m.len, lead: m.lead, peakDb: m.peakDb, bright: m.centroid, bass: m.bass };
  }
  const t = TODAY[card], tm = M.find((r) => r.name === t && r.pack === 'app');
  SRC['today:' + t] = readFileSync(join(appDir, t + '.mp3')).toString('base64');
  META['today:' + t] = { pack: 'app (today)', len: tm.len, lead: tm.lead, peakDb: tm.peakDb, bright: tm.centroid, bass: tm.bass };
}
writeFileSync(outPath, '/* KPM sound studio recordings: Kenney Interface Sounds, UI Audio, Digital Audio, Music Jingles (CC0), plus the app\'s current sounds */\n'
  + 'window.KPM_SFX = ' + JSON.stringify(SRC) + ';\nwindow.KPM_SFX_META = ' + JSON.stringify(META) + ';\nwindow.KPM_SFX_CARDS = ' + JSON.stringify({ cards: CARDS, today: TODAY }) + ';\n');
console.log(`${Object.keys(SRC).length} recordings, ${Math.round(readFileSync(outPath).length / 1024)} KB`);
