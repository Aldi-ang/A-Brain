// node sfx-measure.mjs <packs dir> <app sounds dir> > out.json
// Measures every recording: audible length, peak, brightness (spectral centroid), bass share (<300 Hz).
import { readdirSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

const SR = 22050;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = [...walk(process.argv[2]).filter((f) => /\.ogg$/i.test(f)),
  ...['commit', 'error', 'click', 'mumble1', 'vault-b'].map((n) => join(process.argv[3], n + '.mp3'))];

function pcm(f) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), 'pipe:1'], { maxBuffer: 1 << 28 });
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);
}
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
}
const out = [];
for (const f of files) {
  const x = pcm(f); if (!x.length) continue;
  let peak = 0, pi = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > peak) { peak = a; pi = i; } }
  const th = peak * 0.01;                                   // -40 dB under the peak
  let s = 0, e = x.length - 1; while (s < x.length && Math.abs(x[s]) < th) s++; while (e > s && Math.abs(x[e]) < th) e--;
  const N = 1024; let eTot = 0, eLow = 0, cen = 0;
  for (let o = s; o + N <= e + 1 || o === s; o += N) {
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N && o + i < x.length; i++) re[i] = x[o + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
    fft(re, im);
    for (let k = 1; k < N / 2; k++) { const p = re[k] * re[k] + im[k] * im[k], hz = k * SR / N; eTot += p; cen += p * hz; if (hz < 300) eLow += p; }
    if (o + N > e) break;
  }
  out.push({ pack: basename(dirname(f)).replace(/^kenney_/, '').replace(/^.*Audio$/i, (m) => m), file: f, name: basename(f).replace(/\.(ogg|mp3)$/, ''),
    len: +((e - s) / SR).toFixed(3), lead: +(s / SR).toFixed(3), peakDb: +(20 * Math.log10(peak || 1e-9)).toFixed(1),
    attackMs: Math.round((pi - s) / SR * 1000), centroid: Math.round(cen / (eTot || 1)), bass: +(eLow / (eTot || 1)).toFixed(3) });
}
console.log(JSON.stringify(out));
