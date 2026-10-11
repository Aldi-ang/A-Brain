/* KPM sound synth - the capybara's voice and the vault intro's invented sounds.
   ONE file, loaded by the sound studio (browser) and by the baker (node), so the sound Aldi saves is the sound
   that gets baked: no second implementation to drift. Deterministic - every random choice comes from a seed.

   THE CAPYBARA (round 3, his video "How I Make 8-Bit Dialogue Voices", youtube uv0CgsTU-Ow): the maker cuts a
   tiny slice out of a real vowel and pastes it over and over - measured, 13.4 ms = exactly 5 cycles of a voice at
   372 Hz - so the result is a frozen, buzzing vowel: human colour, chip stiffness. Here the vowel slice is built
   from the vowel's formants (the resonances that make an "a" sound like "a") into one wave cycle, and in "Game Boy"
   shape squeezed into 32 steps of 4 bits - exactly the Game Boy's wave channel. His "some humanity ... similar to
   the Sims": Simlish is gibberish with a real sentence melody, so each syllable of the actual line gets its own
   vowel and consonant, and the line gets a melody - falling at a full stop, rising at a question, lifted at "!".

   THE INTRO (round 3, his "dont make the intro 8 bit bruh, we need elegant for that"): no pulse waves at all -
   soft FM bells, glass, air, a slow chord, wide stereo, a long hall. */
(function (G) {
  'use strict';
  const SR = 44100, TAU = 2 * Math.PI;
  const st2 = (x) => Math.pow(2, x / 12);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function add(mix, buf, at, gain, sr = SR) {
    const i0 = Math.round(at * sr);
    for (let k = 0; k < buf.length; k++) { const i = i0 + k; if (i >= 0 && i < mix.length) mix[i] += buf[k] * gain; }
  }
  function resample(buf, rate) {
    const n = Math.max(1, Math.floor(buf.length / rate)), out = new Float32Array(n);
    for (let k = 0; k < n; k++) { const p = k * rate, i = Math.floor(p), f = p - i; out[k] = (buf[i] ?? 0) * (1 - f) + (buf[i + 1] ?? 0) * f; }
    return out;
  }
  /* band-passed noise (a state-variable filter) - breath, hiss, air */
  function noise(len, fc, q, amp, seed, sr = SR) {
    const n = Math.max(1, Math.round(len * sr)), out = new Float32Array(n), r = rng(seed);
    let low = 0, band = 0;
    for (let k = 0; k < n; k++) {
      const u = k / n, f = 2 * Math.sin(Math.PI * Math.min(.45 * sr, fc(u)) / sr);
      const hp = r() * 2 - 1 - low - q * band; band += f * hp; low += f * band; out[k] = band * amp(u);
    }
    return out;
  }

  /* ── the capybara's voice ─────────────────────────────────────────────────────────────────────────── */
  /* His third word on it: *"dont have to be 8 bit TBH why not sound like minecraft character or even sims character"*.
     So the main voices are HUMAN-like: a throat (a glottal pulse - the buzz the vocal folds make - with the small
     random wobbles a real throat has, "jitter" in pitch and "shimmer" in loudness, plus breath) shaped by a mouth
     (four resonances, the formants, that turn the buzz into "a", "e", "i", "o", "u" or a nasal "mmm"). A Minecraft
     villager is a nasal hum that rises and falls; a Sim is quick made-up syllables over a real sentence melody.
     The 8-bit voice from his video stays as one choice, to compare. */
  /* vowel formants, Hz (Peterson & Barney style averages); the Mouth size knob scales them - higher = smaller creature */
  const VOWEL = { a: [730, 1090, 2440, 3400], e: [530, 1840, 2480, 3500], i: [300, 2290, 3010, 3700], o: [570, 840, 2410, 3300], u: [320, 870, 2240, 3300] };
  const NASAL = [280, 1100, 2300, 3300];                                   // "mmm": the mouth shut, the sound through the nose
  const BWV = [70, 90, 130, 200], BWN = [80, 250, 300, 400];
  const ONSET = { soft: 'm, n, l, r, w, y, h or no consonant', hard: 't, k, p, b, d, g, j', hiss: 's, z, f, v, c, x' };
  /* how long a syllable file is - the plan and the renderer must agree, so both read it here */
  function sylLen(p, on, long) {
    return { pre: on === 'hiss' ? .035 * p.cons : on === 'hard' ? .008 : 0, lenV: (long ? .2 : .11) / p.speed * (p.shape === 'hum' ? 1.8 : 1) };
  }
  function normalize(out, to) { let pk = 0; for (const v of out) pk = Math.max(pk, Math.abs(v)); if (pk) for (let k = 0; k < out.length; k++) out[k] *= to / pk; return out; }
  /* the consonant before the vowel: a hiss (noise with its lows removed) or a short burst */
  function consonant(out, n0, on, cons, r) {
    let lp = 0;
    for (let k = 0; k < n0; k++) {
      const x = r() * 2 - 1; lp += .3 * (x - lp);
      out[k] = on === 'hiss' ? (x - lp) * Math.sin(Math.PI * k / n0) * .6 * cons : x * (1 - k / n0) * .8 * cons;
    }
  }

  /* the human voice: glottal pulse -> four formant resonators in a row (a "cascade", like Klatt's synthesiser) */
  function voiceSyllable(p, v, on, long, sr = SR) {
    const { pre, lenV } = sylLen(p, on, long), hum = p.shape === 'hum';
    const n0 = Math.round(pre * sr), n = n0 + Math.round(lenV * sr), out = new Float32Array(n), r = rng(hash(p.shape + v + on + (long ? 'L' : '')));
    const tgt = (hum ? NASAL : VOWEL[v]).map((f, i) => f * (i < 3 ? p.formant : (1 + p.formant) / 2)), bw = hum ? BWN : BWV;
    const from = hum || on === 'soft' ? NASAL : on === 'hiss' ? [400, 1700, 2600, 3400] : [350, 1800, 2700, 3500];   // where the consonant leaves the mouth
    consonant(out, n0, on, p.cons, r);
    const st = [[0, 0], [0, 0], [0, 0], [0, 0]];
    let ph = 0, per = 1, amp = 1, prevG = 0, coef = null;
    for (let k = n0; k < n; k++) {
      const tv = (k - n0) / sr, u = tv / lenV;
      /* the melody inside one syllable: a slide up into it, a fall at its end, a wobble on long ones */
      const semis = -p.scoop * Math.max(0, 1 - tv / .06) - p.bend * Math.max(0, (u - .6) / .4) + (long && tv > .06 ? p.vib * .4 * Math.sin(TAU * 5.5 * tv) : 0);
      const f0 = p.f * st2(semis);
      ph += f0 * per / sr;
      if (ph >= 1) { ph -= 1; per = 1 + (r() * 2 - 1) * .015; amp = 1 + (r() * 2 - 1) * .06; }   // jitter + shimmer, once per cycle
      const g = ph < .4 ? .5 * (1 - Math.cos(Math.PI * ph / .4)) : ph < .56 ? Math.cos(Math.PI * (ph - .4) / .32) : 0;   // Rosenberg pulse
      let x = (g - prevG) * sr / f0 * .5 * amp + (r() * 2 - 1) * p.breath * (.15 + .35 * g);   // its slope (the lips radiate change) + breath
      prevG = g;
      if (coef === null || (k - n0) % 16 === 0) {
        const m = Math.min(1, tv / .045);                                 // the mouth moves from the consonant into the vowel in 45 ms
        coef = tgt.map((F, i) => { const f = from[i] + (F - from[i]) * m, rr = Math.exp(-Math.PI * bw[i] / sr), B = 2 * rr * Math.cos(TAU * f / sr), C = -rr * rr; return [1 - B - C, B, C]; });
      }
      for (let i = 0; i < 4; i++) { const c = coef[i], s = st[i], y = c[0] * x + c[1] * s[0] + c[2] * s[1]; s[1] = s[0]; s[0] = y; x = y; }
      out[k] = x * Math.min(1, tv / (on === 'soft' ? .03 : .008)) * (1 - .2 * u) * Math.min(1, (lenV - tv) / .04);
    }
    normalize(out.subarray(n0), .8);                                      // every vowel equally loud; the consonant keeps its own level
    return out;
  }

  /* the 8-bit voice from his video: one vowel cycle squeezed into the Game Boy's 32-step, 4-bit wave, looped */
  function vowelCycle(v, p) {
    const TL = 32, tab = new Float64Array(TL), F = VOWEL[v].slice(0, 3).map((f) => f * p.formant), AMP = [1, .7, .35];
    for (let k = 1; k <= 15 && k * p.f < 9000; k++) {
      const f = k * p.f; let w = .25 / k;
      for (let i = 0; i < 3; i++) w += AMP[i] / (1 + Math.pow((f - F[i]) / BWV[i], 2));
      w *= Math.pow(k, -.3);
      for (let j = 0; j < TL; j++) tab[j] += w * Math.sin(TAU * k * j / TL);
    }
    let pk = 0; for (const x of tab) pk = Math.max(pk, Math.abs(x));
    for (let j = 0; j < TL; j++) tab[j] = Math.round((tab[j] / (pk || 1) + 1) * 7.5) / 7.5 - 1;   // 4 bits = 16 levels
    return tab;
  }
  function chipSyllable(p, v, on, long, sr = SR) {
    const { pre, lenV } = sylLen(p, on, long), tab = vowelCycle(v, p);
    const n0 = Math.round(pre * sr), n = n0 + Math.round(lenV * sr), out = new Float32Array(n), r = rng(hash('gb' + v + on + (long ? 'L' : '')));
    consonant(out, n0, on, p.cons, r);
    let ph = 0;
    for (let k = n0; k < n; k++) {
      const tv = (k - n0) / sr, u = tv / lenV;
      const semis = -p.scoop * Math.max(0, 1 - tv / .045) - p.bend * Math.max(0, (u - .6) / .4) + (long && tv > .06 ? p.vib * .4 * Math.sin(TAU * 6 * tv) : 0);
      ph += p.f * st2(semis) / sr; ph -= Math.floor(ph);
      out[k] = tab[Math.floor(ph * 32)] * .8 * Math.min(1, tv / (on === 'soft' ? .025 : .006)) * (1 - .25 * u) * Math.min(1, (lenV - tv) / .035);
    }
    return out;
  }
  function syllable(p, v, on, long, sr = SR) { return p.shape === 'gb' ? chipSyllable(p, v, on, long, sr) : voiceSyllable(p, v, on, long, sr); }

  /* the line as syllables: each gets the onset class of its first letter and its first vowel */
  function syllables(text) {
    const out = [];
    for (const m of text.matchAll(/[A-Za-z]+|[.!?]/g)) {
      const w = m[0];
      if (/^[.!?]$/.test(w)) { out.push({ end: w }); continue; }
      const parts = w.toLowerCase().match(/[^aeiouy]*[aeiouy]+/g) || [w.toLowerCase() + 'e'];
      let pos = m.index;
      parts.forEach((s, i) => {
        const c = s[0], v = s.match(/[aeiouy]/)[0].replace('y', 'i');
        const on = /[aeiouy]/.test(c) || /[mnlrwyh]/.test(c) ? 'soft' : /[szfvcx]/.test(c) ? 'hiss' : 'hard';
        out.push({ v, on, first: i === 0, from: pos, to: pos + s.length });
        pos += s.length;
      });
      out[out.length - 1].to = m.index + w.length;
    }
    return out;
  }
  /* the plan: which syllable file, at what pitch (a playback rate), when, how loud. The app will run THIS. */
  function plan(text, p) {
    const sy = syllables(text), r = rng(hash(text)), out = [];
    const sentences = []; let cur = [];
    for (const s of sy) { if (s.end) { if (cur.length) sentences.push({ s: cur, end: s.end }); cur = []; } else cur.push(s); }
    if (cur.length) sentences.push({ s: cur, end: '.' });
    let at = 0;
    for (const { s, end } of sentences) {
      const n = s.length, bang = end === '!', ask = end === '?', range = p.intonation * (bang ? 1.3 : 1);
      s.forEach((x, i) => {
        if (out.length >= p.maxSyl) return;
        const u = n > 1 ? i / (n - 1) : 0, last = i === n - 1 || out.length === p.maxSyl - 1;
        let semis = range * (1.5 - 3 * u) + (x.first ? .8 * range : 0) + (r() * 2 - 1) * 1.5 * p.jitter + (bang ? 2.5 : 0);
        if (ask && i >= n - 2) semis = range * (i === n - 1 ? 5 : 3);
        const rate = st2(semis), { pre, lenV } = sylLen(p, x.on, last);
        out.push({ v: x.v, on: x.on, long: last, rate, at: +at.toFixed(4), gain: (x.first ? 1 : .85) * (bang ? 1.1 : 1), from: x.from, to: x.to });
        const next = s[i + 1];
        at += (pre + lenV) / rate * .92 + (last ? .17 / p.speed : next && next.first ? .045 / p.speed : 0);
      });
    }
    return out;
  }
  function speak(text, p, sr = SR) {
    const pl = plan(text, p), cache = {}, last = pl[pl.length - 1];
    if (!last) return { mix: new Float32Array(1), plan: pl };
    const mix = new Float32Array(Math.ceil((last.at + .8) * sr));
    for (const x of pl) {
      const key = x.on + x.v + (x.long ? 'L' : '');
      cache[key] = cache[key] || syllable(p, x.v, x.on, x.long, sr);
      add(mix, resample(cache[key], x.rate), x.at, x.gain, sr);
    }
    return { mix, plan: pl };
  }
  const CAPY = {
    sims:     { label: 'Sims chatter', hint: 'quick made-up syllables over a big, friendly sentence melody - the Sims idea', shape: 'voice', f: 210, formant: 1.1, intonation: 1.7, jitter: .5, scoop: 2, bend: 1, speed: 1.15, cons: .8, vib: .3, breath: .25, maxSyl: 14 },
    villager: { label: 'Villager hum', hint: 'a nasal "hmm" that rises and falls - the Minecraft villager idea', shape: 'hum', f: 150, formant: 1, intonation: 1.8, jitter: .5, scoop: 3, bend: 3, speed: .8, cons: .2, vib: .2, breath: .35, maxSyl: 3 },
    cute:     { label: 'Cute chatter', hint: 'the same chatter, higher and from a smaller mouth - a young creature', shape: 'voice', f: 320, formant: 1.3, intonation: 1.6, jitter: .5, scoop: 2.5, bend: 1, speed: 1.25, cons: .7, vib: .3, breath: .2, maxSyl: 14 },
    grumble:  { label: 'Sleepy grumble', hint: 'low, slow and breathy, half-hummed', shape: 'voice', f: 130, formant: .95, intonation: .7, jitter: .3, scoop: 1.5, bend: 2, speed: .8, cons: .5, vib: .4, breath: .5, maxSyl: 8 },
    gbvoice:  { label: 'Game Boy voice (8-bit)', hint: 'the video\'s method: one vowel cycle squeezed into the Game Boy\'s 32-step wave, looped', shape: 'gb', f: 280, formant: 1.15, intonation: 1, jitter: .35, scoop: 1.5, bend: 0, speed: 1, cons: .6, vib: .3, breath: 0, maxSyl: 12 },
  };

  /* ── the vault intro: VaultGate.jsx's own clock (T_WAVE, T_WAVE_DUR, T_GATHER, FORMED, OUT, STEP, resolveIn) ── */
  const T = { wave: .1, waveDur: 3, gather: 2.8, gatherDur: 1.7, formed: 4.5, out: 6.7, step: .095, total: 8.5, roll: .046, outHold: .21,
    hello: { text: 'WELCOME BACK', at: 3.1, step: .07, hold: .44, outAt: 6.7, outStep: .034 },
    line: { text: 'KPM APP ACCESS UNLOCKED', at: 4.8, step: .04, hold: .36, outAt: 6.82, outStep: .022 } };
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function invEaseInOut(v) { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < v) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* an FM bell: a sine whose phase is pushed by another sine; the push fades faster than the note - a struck bell */
  function bell(f, len, o = {}, sr = SR) {
    const n = Math.round(len * sr), out = new Float32Array(n), ratio = o.ratio ?? 2, I0 = o.index ?? 1.5, tau = o.tau ?? len / 4, ti = o.tauI ?? tau / 2, att = o.attack ?? .003;
    for (let k = 0; k < n; k++) {
      const t = k / sr;
      out[k] = Math.sin(TAU * f * t + I0 * Math.exp(-t / ti) * Math.sin(TAU * f * ratio * t)) * Math.min(1, t / att) * Math.exp(-t / tau) * Math.min(1, (n - k) / (sr * .01));
    }
    return out;
  }
  /* a slow chord: each note doubled 0.3 % sharp, so it breathes */
  function pad(freqs, len, att, rel, sr = SR) {
    const n = Math.round(len * sr), out = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      const t = k / sr, e = t < att ? .5 - .5 * Math.cos(Math.PI * t / att) : t > len - rel ? .5 + .5 * Math.cos(Math.PI * (t - len + rel) / rel) : 1;
      let y = 0; for (const f of freqs) y += Math.sin(TAU * f * t) + .5 * Math.sin(TAU * f * 1.003 * t);
      out[k] = y / (freqs.length * 1.5) * e;
    }
    return out;
  }
  /* stereo: equal-power pan, -1 left .. +1 right */
  function add2(L, R, buf, at, gain, pan, sr = SR) { const a = (pan + 1) * Math.PI / 4; add(L, buf, at, gain * Math.cos(a), sr); add(R, buf, at, gain * Math.sin(a), sr); }
  /* the hall: two channels of soft noise dying over ~2 s - the studio's echo for the intro, and the baker's */
  function hall(sr = SR) {
    const n = Math.floor(sr * 2.4), pre = Math.floor(sr * .02);
    return [0, 1].map((ch) => { const d = new Float32Array(n), r = rng(21 + ch); let y = 0;
      for (let k = 0; k < n; k++) { y += .25 * (r() * 2 - 1 - y); d[k] = k < pre ? 0 : y * Math.exp(-(k - pre) / (sr * .55)); } return d; });
  }

  /* every moment a letter of the two text lines appears, rolls a random glyph (every 46 ms) or leaves */
  function typeEvents() {
    const ev = [];
    for (const L of [T.hello, T.line]) [...L.text].forEach((c, i) => {
      if (c === ' ') return;
      const t0 = L.at + i * L.step, to = L.outAt + i * L.outStep, pan = -.45 + .9 * i / (L.text.length - 1);   // the tick walks left to right with the letters
      ev.push({ t: t0, k: 'in', pan });
      for (let m = 1; m * T.roll < L.hold; m++) ev.push({ t: t0 + m * T.roll, k: 'roll', pan });
      ev.push({ t: to, k: 'out', pan });
      for (let m = 1; m * T.roll < T.outHold; m++) ev.push({ t: to + m * T.roll, k: 'outroll', pan });
    });
    return ev;
  }
  const TYPE = {
    'soft:key':   { label: 'Soft key', make: (sr) => noise(.022, () => 2600, .5, (u) => Math.exp(-u * 5), 17, sr) },
    'soft:tick':  { label: 'Soft tick', make: (sr) => { const a = bell(3000, .03, { ratio: 1, index: 0, tau: .006 }, sr), b = noise(.004, () => 5000, .6, () => .5, 19, sr); for (let k = 0; k < b.length; k++) a[k] += b[k]; return a; } },
    'soft:glass': { label: 'Glass tick', make: (sr) => bell(4186, .12, { ratio: 2, index: .6, tau: .03 }, sr) },
  };
  function trimmed(x) {
    let pk = 0; for (const v of x) pk = Math.max(pk, Math.abs(v));
    let i = 0; while (i < x.length && Math.abs(x[i]) < pk * .01) i++;
    const out = x.slice(i), f = Math.min(out.length, 88);
    for (let k = 0; k < f; k++) out[out.length - 1 - k] *= k / f;
    return out;
  }
  function typeLayer(c, rec, sr, L, R) {
    if (!c.vol || c.src === 'off') return;
    const base = TYPE[c.src] ? TYPE[c.src].make(sr) : rec(c.src) ? trimmed(rec(c.src)) : null;
    if (!base) return;
    const r = rng(29);
    typeEvents().forEach((e) => {
      const roll = e.k === 'roll' || e.k === 'outroll', out = e.k === 'out' || e.k === 'outroll';
      const w = (r() * 2 - 1) * (c.wobble || 0);                          // drawn for every event, so a toggle never reshuffles the rest
      if (out && !c.leave) return;
      const g = roll ? (c.chatter || 0) * .5 : 1;
      if (!g) return;
      add2(L, R, resample(base, (c.pitch || 1) * st2(w)), e.t, c.vol * g, e.pan, sr);
    });
  }

  const PENT = [0, 2, 4, 7, 9];
  /* the invented dot sounds - elegant. p = the pitch knob as a multiplier. Each draws into L/R at the app's own times. */
  const DESIGN = {
    wave: {
      sparkle: { label: 'Sparkle cascade', hint: 'a soft bell for the dots the ring lights - many at first, fewer as it slows, rising and spread wide', fn(L, R, p, sr) {
        const r = rng(41), N = 28;
        for (let j = 1; j <= N; j++) {
          const v = .8 * Math.sqrt(j / N), t = T.wave + T.waveDur * (1 - Math.cbrt(1 - v));   // area the ring has swept = dots it has lit
          const semis = PENT[j % 5] + 12 * Math.floor(j * 2 / N);
          add2(L, R, bell(523 * st2(semis) * p, .9, { ratio: 2, index: 1.2, tau: .28 }, sr), t, .22, r() * 1.6 - .8, sr);
        }
      } },
      air: { label: 'Air', hint: 'a breath of air that swells and settles with the ring, over a low soft chord', fn(L, R, p, sr) {
        const b = noise(T.waveDur, (u) => (700 + 2300 * Math.sin(Math.PI * Math.min(1, u * 1.3))) * p, .7, (u) => Math.pow(Math.sin(Math.PI * u), 1.5) * .6, 43, sr);
        add2(L, R, b, T.wave, .8, -.3, sr); add2(L, R, b.slice().reverse(), T.wave, .5, .3, sr);
        add2(L, R, pad([131 * p, 196 * p], T.waveDur, 1, 1.2, sr), T.wave, .25, 0, sr);
      } },
      bloom: { label: 'Slow chord', hint: 'a warm five-note chord that fades in as the ring opens', fn(L, R, p, sr) {
        const pd = pad([262, 330, 392, 494, 587].map((f) => f * p), 3.3, 1.2, 1.4, sr);
        add2(L, R, pd, T.wave, .3, -.25, sr); add2(L, R, pd, T.wave + .013, .3, .25, sr);
      } },
      bell: { label: 'Deep bell', hint: 'one low bell as the ring leaves, ringing out under everything', fn(L, R, p, sr) {
        add2(L, R, bell(131 * p, 3.2, { ratio: 1.4, index: 3, tau: 1, tauI: .5 }, sr), T.wave, .45, 0, sr);
        add2(L, R, bell(262 * p, 2.6, { ratio: 3.5, index: 1.5, tau: .7 }, sr), T.wave + .02, .2, .2, sr);
      } },
    },
    gather: {
      riser: { label: 'Reverse bell', hint: 'a bell played backwards, swelling up and landing exactly when the name forms', fn(L, R, p, sr) {
        const len = T.gatherDur, b = bell(659 * p, len, { ratio: 2, index: 2, tau: .6 }, sr).reverse();
        add2(L, R, b, T.formed - len, .4, -.2, sr); add2(L, R, b, T.formed - len, .4, .2, sr);
        add2(L, R, pad([330, 415, 494, 659].map((f) => f * p), len, 1.4, .08, sr), T.gather, .18, 0, sr);
      } },
      glass: { label: 'Glass swell', hint: 'a glass-like chord growing louder and brighter while the dots fly in', fn(L, R, p, sr) {
        const len = T.gatherDur, n = Math.round(len * sr), b = new Float32Array(n), F = [330, 415, 494, 659].map((f) => f * p);
        for (let k = 0; k < n; k++) {
          const t = k / sr, u = k / n, vib = st2(.1 * Math.sin(TAU * 5 * t));
          let y = 0; for (const f of F) y += Math.sin(TAU * f * vib * t) + u * .5 * Math.sin(TAU * 2 * f * vib * t);
          b[k] = y / 6 * u * u * Math.min(1, (n - k) / (sr * .06));
        }
        add2(L, R, b, T.gather, .7, 0, sr);
      } },
      twinkle: { label: 'Twinkles', hint: 'tiny soft bells, thickest when the dots move fastest, climbing as the name builds', fn(L, R, p, sr) {
        const N = 36;
        for (let j = 1; j <= N; j++) {
          const t = T.gather + T.gatherDur * invEaseInOut(j / N), semis = PENT[j % 5] + 12 * Math.floor(j * 2 / N);
          add2(L, R, bell(784 * st2(semis) * p, .35, { ratio: 2, index: .9, tau: .1 }, sr), t, .18, j % 2 ? -.5 : .5, sr);
        }
      } },
    },
    formed: {
      chime: { label: 'Chime chord', hint: 'five soft bells rolled into one chord, spread left to right', fn(L, R, p, sr) {
        [523, 659, 784, 988, 1175].forEach((f, i) => add2(L, R, bell(f * p, 2.4, { ratio: 2, index: 1.4, tau: .7 }, sr), T.formed + i * .028, .2, -.6 + .3 * i, sr));
      } },
      onebell: { label: 'One clear bell', hint: 'a single bright bell with a low one under it', fn(L, R, p, sr) {
        add2(L, R, bell(880 * p, 2.6, { ratio: 2, index: 1.8, tau: .8 }, sr), T.formed, .45, 0, sr);
        add2(L, R, bell(440 * p, 2.6, { ratio: 1.4, index: 1, tau: .9 }, sr), T.formed, .2, 0, sr);
      } },
      bloomchord: { label: 'Warm bloom', hint: 'a warm chord that opens quickly and rings out, with a small sparkle on top', fn(L, R, p, sr) {
        const pd = pad([262, 330, 392, 494, 587].map((f) => f * p), 2.4, .04, 2, sr);
        add2(L, R, pd, T.formed, .3, -.25, sr); add2(L, R, pd, T.formed + .011, .3, .25, sr);
        add2(L, R, bell(1568 * p, 1.2, { ratio: 2, index: .8, tau: .3 }, sr), T.formed, .12, .4, sr);
      } },
    },
    leave: {
      fall: { label: 'Falling sparkle', hint: 'soft bells stepping down and drifting left as the name breaks apart', fn(L, R, p, sr) {
        for (let i = 0; i < 8; i++) {
          const semis = -(PENT[i % 5] + 12 * Math.floor(i / 5)) ;
          add2(L, R, bell(1568 * st2(semis) * p, .6, { ratio: 2, index: 1, tau: .18 }, sr), T.out + i * .09, .2, .6 - 1.2 * i / 7, sr);
        }
      } },
      breath: { label: 'Breath', hint: 'a soft breath of air that sinks away', fn(L, R, p, sr) {
        add2(L, R, noise(.8, (u) => (2200 - 1400 * u) * p, .6, (u) => Math.sin(Math.PI * u) * .5, 47, sr), T.out, .5, 0, sr);
      } },
    },
  };
  const PARTS = ['type', 'wave', 'gather', 'formed', 'leave'];
  /* one part alone, or all of them: stereo, dry, the length of the whole intro plus room for the bells to ring */
  function intro(c, rec, sr = SR, only) {
    const n = Math.ceil((T.total + 2) * sr), L = new Float32Array(n), R = new Float32Array(n);
    for (const part of only ? [only] : PARTS) {
      const s = c[part]; if (!s) continue;
      if (part === 'type') { typeLayer(s, rec, sr, L, R); continue; }
      const d = DESIGN[part][s.d]; if (!d || !s.vol) continue;
      const l = new Float32Array(n), r = new Float32Array(n);
      d.fn(l, r, st2(s.pitch || 0), sr);
      for (let k = 0; k < n; k++) { L[k] += l[k] * s.vol; R[k] += r[k] * s.vol; }
    }
    let peak = 0; for (let k = 0; k < n; k++) peak = Math.max(peak, Math.abs(L[k]), Math.abs(R[k]));
    return { L, R, peak };
  }

  G.KPM_CHIP = { SR, CAPY, ONSET, VOWEL, syllables, plan, speak, syllable, T, TYPE, DESIGN, PARTS, intro, typeEvents, hall, easeOut, easeInOut };
})(typeof window !== 'undefined' ? window : globalThis);
