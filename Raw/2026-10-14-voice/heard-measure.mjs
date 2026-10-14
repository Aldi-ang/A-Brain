// What he HEARS: the real baked syllable files laid on the plan's timeline, counted as separate sounds.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const root = process.argv[2], S = process.argv[3];
const { voicePlan } = await import(pathToFileURL(root + '/src/utils/voicePlan.js').href);
const { capyFile } = await import(pathToFileURL(root + '/src/config/capyVoice.js').href);
const SR = 8000, WIN = 80; // 10 ms windows
const env = {}, info = [];
for (const f of fs.readdirSync(root + '/public/sounds').filter(n => /^capy-.*\.mp3$/.test(n))) {
  const raw = execFileSync('ffmpeg', ['-v', 'quiet', '-i', root + '/public/sounds/' + f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 26 });
  const a = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4), w = [];
  for (let i = 0; i < a.length; i += WIN) { let s = 0; for (let j = i; j < Math.min(a.length, i + WIN); j++) s += a[j] * a[j]; w.push(Math.sqrt(s / WIN)); }
  env[f.replace('.mp3', '')] = w;
  const db = w.map(x => 20 * Math.log10(x + 1e-9)), on = db.findIndex(d => d > -40), off = db.length - 1 - [...db].reverse().findIndex(d => d > -40);
  info.push({ f, ms: w.length * 10, lead: on * 10, audible: (off - on + 1) * 10, peak: Math.max(...db).toFixed(1) });
}
const avg = (k) => Math.round(info.reduce((s, x) => s + x[k], 0) / info.length);
console.log('files', info.length, '| container ms avg', avg('ms'), '| leading silence ms avg', avg('lead'), '| audible ms avg', avg('audible'));
for (const len of ['s', 'm', 'l']) { const g = info.filter(x => x.f.match(new RegExp('-' + len + '(-r)?\\.mp3$'))); console.log('  len', len, 'audible ms min/avg/max', Math.min(...g.map(x => x.audible)), Math.round(g.reduce((s, x) => s + x.audible, 0) / g.length), Math.max(...g.map(x => x.audible)), '| lead', Math.min(...g.map(x => x.lead)), '-', Math.max(...g.map(x => x.lead))); }

const lines = fs.readFileSync(S + '/capylines.txt', 'utf8').split('\n').filter(Boolean).map(l => l.slice(1, -1));
const ms = fs.readFileSync(root + '/src/MerchantSalesView.jsx', 'utf8'), cm = fs.readFileSync(root + '/src/components/CapybaraMascot.jsx', 'utf8');
for (const src of [ms.match(/const CHATTER = \{[\s\S]*?\};/)[0], (ms.match(/DEAL_LINES = \[[\s\S]*?\];/) || [''])[0], cm.slice(0, cm.indexOf('export default'))])
  for (const m of src.matchAll(/"([^"]{2,})"/g)) lines.push(m[1]);

// heard sounds = runs of loud windows separated by >= GAP ms of quiet (quiet = below -40 dBFS... and also below 30% of the louder neighbour)
const count = (text, seed, GAP) => {
  const p = voicePlan(text, seed), bySent = {};
  for (const x of p) (bySent[x.sent] ||= []).push(x);
  let minHeard = 99;
  for (const xs of Object.values(bySent)) {
    const t0 = xs[0].at, end = xs[xs.length - 1].at - t0 + 1.2, mix = new Float32Array(Math.ceil(end * 100));
    for (const x of xs) {
      const e = env[capyFile(x.on, x.v, x.len, x.rise)], start = (x.at - t0) * 100;
      for (let i = 0; i < e.length; i++) { const k = Math.floor(start + i / x.rate); if (k < mix.length) mix[k] = Math.max(mix[k], e[i] * x.gain); }
    }
    const loud = Array.from(mix, v => 20 * Math.log10(v + 1e-9) > -40);
    let heard = 0, quiet = GAP, inSound = false;
    for (const l of loud) { if (l) { if (!inSound && quiet >= GAP) heard++; inSound = true; quiet = 0; } else { quiet += 10; if (quiet >= GAP) inSound = false; } }
    minHeard = Math.min(minHeard, heard);
  }
  return minHeard;
};
for (const GAP of [40, 60, 80]) {
  const hist = {}, bad = new Map(); let n = 0;
  for (const t of lines) for (let seed = 1; seed <= 40; seed++) { const h = count(t, seed, GAP); hist[h] = (hist[h] || 0) + 1; n++; if (h < 3) bad.set(t, (bad.get(t) || 0) + 1); }
  const under = Object.entries(hist).filter(([k]) => +k < 3).reduce((s, [, v]) => s + v, 0);
  console.log(`a silence of ${GAP} ms splits two sounds: sentences heard as <3 sounds in ${under} of ${n} plans (${(100 * under / n).toFixed(1)}%) | fewest heard -> plans ${JSON.stringify(hist)}`);
  if (GAP === 60) for (const [t, c] of [...bad].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log('     ', c + '/40', JSON.stringify(t));
}
