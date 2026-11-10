// Prepare the sound-board cues: extract the coin files, print sign.mp3's envelope, cut + fade + level each cue.
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const APP = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
const PACKS = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/Raw/2026-10-10-sfx-packs/';
const OUT = path.join(__dirname, 'board');
fs.mkdirSync(OUT, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
const ffErr = (args) => { try { return execFileSync('ffmpeg', ['-hide_banner', ...args], { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return e.stderr.toString(); } };
const stat = (f) => {
  const e = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-']).stderr.toString();
  const d = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
  return { dur: +d.toFixed(3), peak: +(e.match(/max_volume: ([-\d.]+)/) || [])[1], mean: +(e.match(/mean_volume: ([-\d.]+)/) || [])[1] };
};

// 1. the coin recordings live base64 inside tools/sfx-kenney.js
global.window = {};
eval(fs.readFileSync(APP + 'tools/sfx-kenney.js', 'utf8'));
for (const k of ['handleCoins', 'handleCoins2']) fs.writeFileSync(path.join(OUT, 'src-' + k + '.mp3'), Buffer.from(window.KENNEY_SFX[k], 'base64'));

// 2. envelope of sign.mp3, 25 ms RMS buckets, first 2.3 s
if (process.argv[2] === 'env') {
  const f = process.argv[3] || APP + 'public/sounds/sign.mp3';
  const raw = execFileSync('ffmpeg', ['-hide_banner', '-i', f, '-ac', '1', '-ar', '8000', '-f', 'f32le', '-'], { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
  const s = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4), B = 200; // 25 ms at 8 kHz
  const rows = [];
  for (let i = 0; i < Math.min(s.length, 8000 * 2.3); i += B) {
    let m = 0, pk = 0; for (let j = i; j < i + B && j < s.length; j++) { m += s[j] * s[j]; pk = Math.max(pk, Math.abs(s[j])); }
    const db = 20 * Math.log10(Math.sqrt(m / B) + 1e-9);
    rows.push((i / 8000).toFixed(3) + ' ' + db.toFixed(0) + ' ' + '#'.repeat(Math.max(0, Math.round((db + 60) / 2))));
  }
  console.log(rows.join('\n'));
  process.exit(0);
}

// 3. the cues: [name, source, start, length, fadeOut] -> mono 44.1k mp3, 4 ms in, peak to TARGET dB
const MEAN = -30, CAP = -6;  // match loudness (mean) to his message sound (-29 dB), never peak above -6 dB
const CUES = JSON.parse(process.argv[2] || '[]');
for (const [name, src, ss, t, fo] of CUES) {
  const tmp = path.join(OUT, name + '.tmp.wav');
  ff(['-ss', String(ss), '-t', String(t), '-i', src, '-ac', '1', '-ar', '44100',
    '-af', `afade=t=in:d=0.004,afade=t=out:st=${(t - fo).toFixed(3)}:d=${fo}`, tmp]);
  const st = stat(tmp), g = Math.min(MEAN - st.mean, CAP - st.peak);
  ff(['-i', tmp, '-af', `volume=${g.toFixed(2)}dB`, '-b:a', '96k', path.join(OUT, name + '.mp3')]);
  fs.unlinkSync(tmp);
  console.log(name, JSON.stringify(stat(path.join(OUT, name + '.mp3'))));
}
