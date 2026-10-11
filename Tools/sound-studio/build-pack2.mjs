// node build-pack2.mjs <measure.json> <out sfx-pack2.js> - the typing candidates for round 2 (Kenney Interface Sounds + UI Audio, CC0),
// encoded exactly like round 1's build-pack.mjs (mono, 44.1 kHz, 112k mp3) so the baker can reproduce what the studio plays.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const [measurePath, outPath] = process.argv.slice(2), M = JSON.parse(readFileSync(measurePath, 'utf8'));
const TYPE = ['tick_001', 'tick_002', 'click_004', 'click_001', 'select_008', 'click4', 'click5', 'switch13', 'mouseclick1'];
const SRC = {}, META = {};
for (const n of TYPE) {
  const m = M.find((r) => r.name === n && r.pack !== 'app'); if (!m) throw new Error('not measured: ' + n);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', m.file, '-ac', '1', '-ar', '44100', '-b:a', '112k', '-f', 'mp3', 'pipe:1'], { maxBuffer: 1 << 26 });
  if (r.status) throw new Error(n + ': ' + r.stderr);
  SRC[n] = r.stdout.toString('base64'); META[n] = { pack: m.pack, len: m.len, lead: m.lead, peakDb: m.peakDb, bright: m.centroid, bass: m.bass };
}
writeFileSync(outPath, '/* KPM sound studio round 2: typing candidates, Kenney Interface Sounds + UI Audio (CC0) */\n'
  + 'window.KPM_SFX2 = ' + JSON.stringify(SRC) + ';\nwindow.KPM_SFX2_META = ' + JSON.stringify(META) + ';\nwindow.KPM_SFX2_TYPE = ' + JSON.stringify(TYPE) + ';\n');
console.log(TYPE.length + ' recordings, ' + Math.round(readFileSync(outPath).length / 1024) + ' KB');
