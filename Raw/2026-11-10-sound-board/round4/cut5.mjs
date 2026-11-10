// Round 5: cut his Jett takes into J4 phrases per mood, key the Flow clips to animated WebP.
// node cut5.mjs probe | voice | video <fps> <size> <q>
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const R4 = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/Raw/2026-11-10-sound-board/round4';
const OUT = R4 + '/cut';
fs.mkdirSync(OUT + '/voice', { recursive: true });
fs.mkdirSync(OUT + '/video', { recursive: true });
const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', '-y', ...args], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;
const KEY = 'format=yuva420p,chromakey=color=0x00ff00:similarity=0.2:blend=0.06';
const mode = process.argv[2];

function dur(f) {
  return +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim();
}

if (mode === 'probe') {
  // green sample + union bounding box of the character over every frame
  const first = {};
  for (const n of (process.argv.length > 3 ? process.argv.slice(3) : ['idle-1', 'idle-2', 'talk-1', 'talk-2', 'deal-1'])) {
    const f = fs.existsSync(R4 + '/video/' + n + '.mp4') ? R4 + '/video/' + n + '.mp4' : n;
    const px = execFileSync('ffmpeg', ['-v', 'error', '-ss', '1', '-i', f, '-vf', 'crop=2:2:20:20,format=rgb24', '-frames:v', '1', '-f', 'rawvideo', '-'],);
    // alpha masks at 6 fps, bbox in JS: a column/row counts only with 4+ solid pixels (compression specks do not)
    const W = 1280, H = 720, buf = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-vf', KEY + ',alphaextract,fps=6', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 30 });
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    for (let o = 0; o + W * H <= buf.length; o += W * H) {
      const col = new Uint16Array(W), row = new Uint16Array(H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (buf[o + y * W + x] > 128) { col[x]++; row[y]++; }
      for (let x = 0; x < W; x++) if (col[x] >= 4) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      for (let y = 0; y < H; y++) if (row[y] >= 4) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      // the START pose (frame 1): its own box - the pose two clips must share so he does not hop when one takes over
      if (o === 0) { first[n] = { x0, x1, y0, y1 }; console.log(n, 'START pose x', x0, '-', x1, 'y', y0, '-', y1, 'h', y1 - y0, 'centre x', (x0 + x1) / 2); }
    }
    console.log(n, 'green', [...px.slice(0, 3)].map((b) => b.toString(16)).join(' '), 'bbox x', x0, '-', x1, 'y', y0, '-', y1, 'h', y1 - y0);
  }
}

if (mode === 'voice') {
  // RE-CUT 2026-11-11: every phrase is a whole spoken phrase of at least MIN seconds - his rule, three times in October:
  // "minimum 3 words", never one lonely sound. Cut only at real pauses (0.25 s+); a phrase shorter than MIN joins its
  // neighbour as the take spoke it; one longer than MAX splits at its longest breath. Pauses inside are capped at 0.3 s.
  const RATE = 1.26, MIN = 1.15 * RATE, MAX = 3.3 * RATE;      // J4: rate 1.26 = +4 semitones and quicker - a smaller throat
  const moods = ['happy', 'curious', 'approving', 'excited'];
  for (const f of fs.readdirSync(OUT + '/voice')) fs.rmSync(OUT + '/voice/' + f);
  const list = [];
  const gapsOf = (f, d) => {
    const e = ff(['-i', f, '-af', 'silencedetect=noise=-38dB:d=' + d, '-f', 'null', '-']);
    const st = [...e.matchAll(/silence_start: ([\d.]+)/g)].map((x) => +x[1]), en = [...e.matchAll(/silence_end: ([\d.]+)/g)].map((x) => +x[1]);
    return st.map((s, i) => ({ s, e: en[i] ?? Infinity }));
  };
  for (const mood of moods) {
    let k = 0;
    for (const take of [1, 2]) {
      const f = R4 + '/voice/' + mood + '-' + take + '.wav', D = dur(f);
      const fine = gapsOf(f, 0.1).map((g) => ({ s: g.s, e: Math.min(g.e, D) }));
      const lead = fine.find((g) => g.s < 0.05)?.e ?? 0, tail = fine.find((g) => g.e > D - 0.05)?.s ?? D;
      const inner = fine.filter((g) => g.s > lead + 0.05 && g.e < tail - 0.05);
      // phrases: split at pauses of 0.25 s+
      let ph = []; let a = lead;
      for (const g of inner) if (g.e - g.s >= 0.25) { ph.push([a, g.s]); a = g.e; }
      ph.push([a, tail]);
      // too long: split at the longest breath that leaves both halves long enough
      const split = (p) => {
        if (p[1] - p[0] <= MAX) return [p];
        const c = inner.filter((g) => g.s - p[0] >= MIN && p[1] - g.e >= MIN).sort((x, y) => (y.e - y.s) - (x.e - x.s))[0];
        return c ? [...split([p[0], c.s]), ...split([c.e, p[1]])] : [p];
      };
      ph = ph.flatMap(split);
      // too short: join the next one (the last joins the one before)
      const out = [];
      for (const p of ph) { const last = out[out.length - 1]; if (last && last[1] - last[0] < MIN) last[1] = p[1]; else out.push([...p]); }
      if (out.length > 1 && out[out.length - 1][1] - out[out.length - 1][0] < MIN) { const z = out.pop(); out[out.length - 1][1] = z[1]; }
      for (const [p0, p1] of out) {
        // keep-intervals: a pause over 0.3 s inside the phrase keeps 0.15 s each side
        const keep = []; let x = Math.max(0, p0 - 0.03);
        for (const g of inner) if (g.s > p0 && g.e < p1 && g.e - g.s > 0.3) { keep.push([x, g.s + 0.15]); x = g.e - 0.15; }
        keep.push([x, Math.min(D, p1 + 0.08)]);
        const len = keep.reduce((n, [u, v]) => n + v - u, 0) / RATE;
        k++;
        const tmp = OUT + '/voice/tmp.wav', name = 'capy-' + mood + '-' + k, mp3 = OUT + '/voice/' + name + '.mp3';
        const sel = keep.map(([u, v]) => 'between(t,' + u.toFixed(3) + ',' + v.toFixed(3) + ')').join('+');
        ff(['-i', f, '-af', "aselect='" + sel + "',asetpts=N/SR/TB,asetrate=" + Math.round(24000 * RATE) + ',aresample=24000', tmp]);
        const vd = ff(['-i', tmp, '-af', 'volumedetect', '-f', 'null', '-']);
        const mean = +vd.match(/mean_volume: (-?[\d.]+)/)[1], max = +vd.match(/max_volume: (-?[\d.]+)/)[1];
        const gain = Math.min(-30 - mean, -6 - max);
        ff(['-i', tmp, '-af', 'volume=' + gain.toFixed(2) + 'dB,afade=t=in:d=0.01,afade=t=out:st=' + Math.max(0.02, len - 0.06).toFixed(3) + ':d=0.05', '-ac', '1', '-b:a', '64k', mp3]);
        // the ear: bursts of sound with 60 ms+ of quiet before them, in the finished file
        const L = dur(mp3), bursts = gapsOf(mp3, 0.06).filter((g) => g.s > 0.02 && g.e < L - 0.05).length + 1;
        list.push({ name, len: +L.toFixed(2), bursts, from: mood + '-' + take + ' ' + p0.toFixed(2) + '-' + p1.toFixed(2), gain: +gain.toFixed(1) });
      }
    }
  }
  fs.rmSync(OUT + '/voice/tmp.wav', { force: true });
  fs.writeFileSync(OUT + '/voice/list.json', JSON.stringify(list, null, 1));
  for (const x of list) console.log(x.name.padEnd(18), String(x.len).padEnd(5), 'bursts', String(x.bursts).padEnd(3), x.from.padEnd(24), 'gain', x.gain, fs.statSync(OUT + '/voice/' + x.name + '.mp3').size);
  console.log(moods.map((m) => m + ': ' + list.filter((x) => x.name.startsWith('capy-' + m)).length).join(', '));
}

if (mode === 'video') {
  // node cut5.mjs video <fps> <size> <q> <cropSide> <cropX> <cropY> [names...]
  const [fps, size, q, S, X, Y] = process.argv.slice(3, 9).map(Number);
  const names = process.argv.slice(9);
  for (const n of names) {
    const src = fs.existsSync(R4 + '/video/' + n + '.mp4') ? R4 + '/video/' + n + '.mp4' : R4 + '/../round5/' + n + '.mp4';
    // drop the last frame: it IS the first one, and showing it twice hitches the loop
    const T = (dur(src) - 1 / 24).toFixed(3);
    // PRE: a denoise before the key - Veo's flat colours shimmer frame to frame, and every shimmer is a changed pixel to store
    const pre = process.env.PRE ? process.env.PRE + ',' : '';
    const vf = pre + KEY + ',despill=type=green:mix=0.6,crop=' + S + ':' + S + ':' + X + ':' + Y + ',scale=' + size + ':' + size + ':flags=lanczos,fps=' + fps + ',format=yuva420p';
    const out = OUT + '/video/' + n + '-' + fps + 'f-' + size + (process.env.TAG || '') + '.webp';
    ff(['-t', T, '-i', src, '-an', '-vf', vf, '-c:v', 'libwebp_anim', '-lossless', '0', '-q:v', String(q), '-loop', '0', '-preset', process.env.PRESET || 'picture', '-compression_level', '6', out]);
    ff(['-i', src, '-an', '-vf', KEY + ',despill=type=green:mix=0.6,crop=' + S + ':' + S + ':' + X + ':' + Y + ',scale=' + size + ':' + size + ':flags=lanczos,format=yuva420p', '-frames:v', '1', '-c:v', 'libwebp', '-q:v', String(q), OUT + '/video/' + n + '-still-' + size + '.webp']);
    console.log(n, fps + 'fps', size + 'px', 'q' + q, fs.statSync(out).size, 'bytes');
  }
}
