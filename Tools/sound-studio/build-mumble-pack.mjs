/* Cut a mumble recording into syllable clips for the studio's "Video mumble" voices -> mumble-pack.js.

   His ask, 2026-10-11: *"change the sfx for capybara to mumbling insted ... some fat but soft mumbling sound, just
   imagine the duke from resident evil village but inside the sim city or maybe esquie voice from expedition 33"*,
   with the reference "RPG Character Mumble Voices Sound Effects No Copyright" (Gravity Sound, youtube Dl_hOYskhHU),
   kept in A-Brain Raw/2026-10-11-mumble-ref/. Two of its nine characters are deep and dark enough for "fat but soft"
   (measured: #6 at 10.52 s, f0 137 Hz; #9 at 23.06 s, f0 198 Hz). Each is cut at the dips between syllables;
   chip.js shape 'rec' plays a clip at the voice's pitch, the way the synth plays a made syllable.

     node build-mumble-pack.mjs "<path to gravity-mumble.webm>"                                                  */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const SRC = process.argv[2], SR = 22050;
/* #6 (deep) gave only 4 clips at any cut - too few: the same few sounds would repeat, his "annoying" */
const SOURCES = { round: [23.06, 37.92] };

const decode = (from, to) => {
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(from), '-to', String(to), '-i', SRC, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 27 });
    return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
};
const pitch = (x) => {
    const W = 882, out = [];
    for (let i = 0; i + W < x.length; i += 441) {
        let best = 0, lag = 0;
        for (let L = Math.floor(SR / 400); L <= Math.floor(SR / 60); L++) {
            let a = 0, b = 0, c = 0;
            for (let k = 0; k + L < W; k++) { a += x[i + k] * x[i + k + L]; b += x[i + k] ** 2; c += x[i + k + L] ** 2; }
            const r = a / Math.sqrt(b * c + 1e-12); if (r > best) { best = r; lag = L; }
        }
        if (best > .6) out.push(SR / lag);
    }
    out.sort((p, q) => p - q);
    return out.length ? out[Math.floor(out.length / 2)] : 0;
};

const pack = {};
for (const [name, [from, to]] of Object.entries(SOURCES)) {
    const x = decode(from, to), F = 110, env = [];
    for (let i = 0; i + F <= x.length; i += F) { let e = 0; for (let k = 0; k < F; k++) e += x[i + k] ** 2; env.push(10 * Math.log10(e / F + 1e-12)); }
    const sm = env.map((_, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - 3); j <= Math.min(env.length - 1, i + 3); j++) { s += env[j]; n++; } return s / n; });
    const top = Math.max(...sm), floor = top - 30;
    /* peaks, then the lowest point between two neighbours = a cut, when it dips 2.5 dB under the smaller peak */
    const peaks = [];
    for (let i = 1; i < sm.length - 1; i++) if (sm[i] > top - 18 && sm[i] >= sm[i - 1] && sm[i] > sm[i + 1] && (!peaks.length || i - peaks[peaks.length - 1] > 18)) peaks.push(i);
    const cuts = [0];
    for (let p = 1; p < peaks.length; p++) {
        let lo = peaks[p - 1]; for (let i = peaks[p - 1]; i < peaks[p]; i++) if (sm[i] < sm[lo]) lo = i;
        if (Math.min(sm[peaks[p - 1]], sm[peaks[p]]) - sm[lo] >= 2.5) cuts.push(lo);
    }
    cuts.push(sm.length);
    const clips = [];
    for (let c = 1; c < cuts.length; c++) {
        let a = cuts[c - 1], b = cuts[c];
        while (a < b && sm[a] < floor) a++; while (b > a && sm[b - 1] < floor) b--;
        const len = (b - a) * F / SR;
        if (len < .08 || len > .65) continue;
        const s = x.slice(a * F, b * F);
        let pk = 0; for (const v of s) pk = Math.max(pk, Math.abs(v));
        const fade = Math.round(.008 * SR);
        for (let k = 0; k < s.length; k++) s[k] = s[k] / (pk || 1) * .8 * Math.min(1, k / fade, (s.length - 1 - k) / fade);
        const f0 = pitch(s);
        if (!f0) continue;                                   // a breath or a click, not a syllable
        const i16 = new Int16Array(s.length); for (let k = 0; k < s.length; k++) i16[k] = Math.round(s[k] * 32767);
        clips.push({ f0: Math.round(f0), len: +len.toFixed(3), pcm: Buffer.from(i16.buffer).toString('base64') });
    }
    pack[name] = { sr: SR, clips };
    console.log(`${name}: ${clips.length} clips, ${clips.map((c) => c.len).sort((p, q) => p - q).map((v) => v.toFixed(2)).join(' ')} s; f0 ${clips.map((c) => c.f0).join(' ')}`);
}
const js = '/* made by build-mumble-pack.mjs from Gravity Sound "RPG Character Mumble Voices" (youtube Dl_hOYskhHU, "No Copyright") - syllable clips, 16-bit, ' + SR + ' Hz */\n'
    + '(function (G) { G.KPM_MUMBLE = ' + JSON.stringify(pack) + '; })(typeof globalThis !== "undefined" ? globalThis : window);\n';
writeFileSync(new URL('./mumble-pack.js', import.meta.url), js);
console.log(`mumble-pack.js ${(js.length / 1024).toFixed(0)} KB`);
