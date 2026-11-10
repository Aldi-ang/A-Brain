// Cut each AI Studio take into phrases at its pauses; one gain per voice so the phrases keep their own rise and fall.
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'tts'), OUT = path.join(__dirname, 'board');
const MEAN = -28, CAP = -6;   // a phrase sits a touch above the cha-ching (-30): speech is thin, the bell is dense
const err = (args) => spawnSync('ffmpeg', ['-hide_banner', ...args]).stderr.toString();
const res = {};
for (const v of ['neno', 'jett', 'mako', 'rami']) {
  const f = path.join(DIR, v + '-1.wav');
  const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
  const log = err(['-i', f, '-af', 'silencedetect=noise=-38dB:d=0.15', '-f', 'null', '-']);
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  // speech runs from each silence end (or 0) to the next silence start (or the end)
  const segs = [];
  let from = starts[0] > 0.05 ? 0 : null;
  const marks = starts.map((s, i) => [s, ends[i]]).sort((a, b) => a[0] - b[0]);
  for (const [s, e] of marks) { if (from != null && s - from > 0.3) segs.push([from, s]); from = e; }
  if (from != null && dur - from > 0.3) segs.push([from, dur]);
  const m = +err(['-i', f, '-af', 'volumedetect', '-f', 'null', '-']).match(/mean_volume: ([-\d.]+)/)[1];
  const pk = +err(['-i', f, '-af', 'volumedetect', '-f', 'null', '-']).match(/max_volume: ([-\d.]+)/)[1];
  // the take's mean counts its pauses; phrases alone are ~1.5 dB louder, so aim the take a little lower
  const g = Math.min(MEAN - 1.5 - m, CAP - pk);
  res[v] = segs.map(([a, b], i) => {
    const ss = Math.max(0, a - 0.04), t = Math.min(dur, b + 0.08) - ss, name = `v-${v}-${i + 1}`;
    execFileSync('ffmpeg', ['-hide_banner', '-y', '-loglevel', 'error', '-ss', ss.toFixed(3), '-t', t.toFixed(3), '-i', f, '-ac', '1',
      '-af', `afade=t=in:d=0.01,afade=t=out:st=${(t - 0.06).toFixed(3)}:d=0.06,volume=${g.toFixed(2)}dB`, '-b:a', '64k', path.join(OUT, name + '.mp3')]);
    return { name, len: +t.toFixed(2) };
  });
  console.log(v, 'gain', g.toFixed(1), 'dB', JSON.stringify(res[v]));
}
fs.writeFileSync(path.join(OUT, 'voices.json'), JSON.stringify(res));
