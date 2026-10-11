/* KPM chip synth - the capybara's 8-bit voices and the vault intro's invented sounds.
   ONE file, loaded by the sound studio (browser) and by the baker (node), so the sound Aldi saves is the sound
   that gets baked: no second implementation to drift. Deterministic - every random choice comes from a seed.

   How the old chips made sound (Game Boy: two pulse channels at 12.5 / 25 / 50 / 75 % duty, a 4-bit wave
   channel and a noise channel; NES: the same pulses plus a triangle): a pulse or triangle wave, a fast volume
   envelope, a pitch that slides or jumps, and fast arpeggios in place of chords. sfxr's "blip" recipe is that:
   no attack, a short hold, a quick decay, a high-pass. */
(function (G) {
  'use strict';
  const SR = 44100;
  const st2 = (x) => Math.pow(2, x / 12);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const DUTY = { p125: .125, p25: .25, p50: .5 };

  /* one chip voice. o: wave (p125 p25 p50 tri saw noise), f Hz, len s, slide / jump / vib in semitones (or st(u)
     returning semitones for u 0..1), crunch 0..1 (fewer bits + held samples = the old chips' grit), curve (decay
     shape, 0 = none), env(u) extra shape, seed. 4x oversampled so high notes do not turn to hiss. */
  function voice(o, sr = SR) {
    const n = Math.max(1, Math.round(o.len * sr)), out = new Float32Array(n), r = rng(o.seed || 7);
    const duty = DUTY[o.wave], a = o.attack ?? .002, curve = o.curve ?? 1.6, OS = 4;
    const bits = o.crunch ? Math.round(8 - o.crunch * 5) : 0, hold = o.crunch ? 1 + Math.round(o.crunch * 6) : 1;
    let ph = 0, nz = r() * 2 - 1, held = 0;
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const st = o.st ? o.st(u) : (o.slide || 0) * u + (o.jump && u >= (o.jumpAt ?? .5) ? o.jump : 0)
        + (o.vib ? o.vib * Math.sin(2 * Math.PI * (o.vibHz || 18) * k / sr) : 0);
      const f = o.f * st2(st);
      let acc = 0;
      for (let s = 0; s < OS; s++) {
        ph += f / (sr * OS);
        if (ph >= 1) { ph -= Math.floor(ph); if (o.wave === 'noise') nz = r() * 2 - 1; }
        /* a pulse centred on zero: a 12.5 % pulse at +1/-1 carries a big DC offset, and a DC offset under a
           fast envelope is a thump - bass, the exact thing he asked to lose */
        acc += duty ? ((ph < duty ? 1 : 0) - duty) / Math.max(duty, 1 - duty)
          : o.wave === 'tri' ? 4 * Math.abs(ph - .5) - 1 : o.wave === 'saw' ? 2 * ph - 1 : nz;
      }
      const t = k / sr;
      let y = acc / OS * (t < a ? t / a : Math.pow(Math.max(0, 1 - (t - a) / Math.max(1e-4, o.len - a)), curve));
      if (o.env) y *= o.env(u);
      if (bits) { const q = 1 << (bits - 1); y = Math.round(y * q) / q; }
      if (hold > 1) { if (k % hold === 0) held = y; y = held; }
      out[k] = y;
    }
    return out;
  }
  function add(mix, buf, at, gain, sr = SR) {
    const i0 = Math.round(at * sr);
    for (let k = 0; k < buf.length; k++) { const i = i0 + k; if (i >= 0 && i < mix.length) mix[i] += buf[k] * gain; }
  }
  function resample(buf, rate) {
    const n = Math.max(1, Math.floor(buf.length / rate)), out = new Float32Array(n);
    for (let k = 0; k < n; k++) { const p = k * rate, i = Math.floor(p), f = p - i; out[k] = (buf[i] ?? 0) * (1 - f) + (buf[i + 1] ?? 0) * f; }
    return out;
  }
  /* a two-pole low-passed noise whose brightness and loudness follow the moment - the "whoosh" */
  function whoosh(len, fc, amp, seed, sr = SR) {
    const n = Math.round(len * sr), out = new Float32Array(n), r = rng(seed);
    let y = 0, y2 = 0;
    for (let k = 0; k < n; k++) {
      const u = k / n, c = 1 - Math.exp(-2 * Math.PI * fc(u) / sr);
      y += c * (r() * 2 - 1 - y); y2 += c * (y - y2); out[k] = y2 * amp(u) * 2.4;
    }
    return out;
  }

  /* ── the capybara ─────────────────────────────────────────────────────────────────────────────────── */
  const CAPY = {
    gb:     { label: 'Game Boy beep', hint: 'a 25 % pulse, the Game Boy tone. Animal Crossing\'s beep-speech ("Bebebese") is this idea', wave: 'p25', f: 620, len: .045, slide: 0, jump: 0, vib: 0, crunch: 0, spread: 1 },
    nes:    { label: 'Thin NES voice', hint: 'the 12.5 % pulse - the thinnest, most nasal NES tone, sliding down a little', wave: 'p125', f: 520, len: .055, slide: -2, jump: 0, vib: 0, crunch: 0, spread: 1 },
    chirp:  { label: 'Square chirp', hint: 'a plain square that rises a little at the end - the classic RPG text blip', wave: 'p50', f: 700, len: .04, slide: 3, jump: 0, vib: 0, crunch: 0, spread: 1 },
    tri:    { label: 'Soft triangle', hint: 'the NES triangle - round and soft, no buzz', wave: 'tri', f: 440, len: .06, slide: 1, jump: 0, vib: 0, crunch: 0, spread: 1 },
    type:   { label: 'Typewriter blip', hint: 'very short and high, like courtroom-game text', wave: 'p50', f: 1100, len: .025, slide: 0, jump: 0, vib: 0, crunch: 0, spread: 1 },
    bibip:  { label: 'Bi-bip', hint: 'two notes inside one beep, like a coin pickup', wave: 'p25', f: 560, len: .055, slide: 0, jump: 5, vib: 0, crunch: 0, spread: 1 },
    wobble: { label: 'Wobble', hint: 'a fast wobble in the pitch - cartoon-like', wave: 'p25', f: 600, len: .07, slide: 0, jump: 0, vib: .7, crunch: 0, spread: 1 },
    gibber: { label: 'Gibberish', hint: 'big jumps between the 4 pitches - the sing-song mumble of old RPGs', wave: 'p25', f: 600, len: .045, slide: 0, jump: 0, vib: 0, crunch: .25, spread: 2.6 },
  };
  const STEPS = [1, 1.12, .92, 1.25];   // the app's four pitches, in the order speakMumble picks them (useSound.js)
  function capyVoices(p, sr = SR) {
    return STEPS.map((s, i) => voice({ wave: p.wave, f: p.f * (1 + (s - 1) * p.spread), len: p.len, slide: p.slide,
      jump: p.jump, jumpAt: .45, vib: p.vib, crunch: p.crunch, curve: 1.3, seed: 11 + i }, sr));
  }

  /* ── the vault intro: VaultGate.jsx's own clock (T_WAVE, T_WAVE_DUR, T_GATHER, FORMED, OUT, STEP, resolveIn) ── */
  const T = { wave: .1, waveDur: 3, gather: 2.8, gatherDur: 1.7, formed: 4.5, out: 6.7, step: .095, total: 8.5, roll: .046, outHold: .21,
    hello: { text: 'WELCOME BACK', at: 3.1, step: .07, hold: .44, outAt: 6.7, outStep: .034 },
    line: { text: 'KPM APP ACCESS UNLOCKED', at: 4.8, step: .04, hold: .36, outAt: 6.82, outStep: .022 } };
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function invEaseInOut(v) { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < v) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* every moment a letter of the two text lines appears, rolls a random glyph (every 46 ms) or leaves */
  function typeEvents() {
    const ev = [];
    for (const L of [T.hello, T.line]) [...L.text].forEach((c, i) => {
      if (c === ' ') return;
      const t0 = L.at + i * L.step, to = L.outAt + i * L.outStep;
      ev.push({ t: t0, k: 'in' });
      for (let m = 1; m * T.roll < L.hold; m++) ev.push({ t: t0 + m * T.roll, k: 'roll' });
      ev.push({ t: to, k: 'out' });
      for (let m = 1; m * T.roll < T.outHold; m++) ev.push({ t: to + m * T.roll, k: 'outroll' });
    });
    return ev;
  }
  const TYPE = {
    'chip:tick':  { label: '8-bit tick', make: (sr) => voice({ wave: 'p50', f: 1800, len: .014, curve: 1.2 }, sr) },
    'chip:key':   { label: '8-bit key', make: (sr) => { const a = voice({ wave: 'p25', f: 950, len: .022, curve: 1.4 }, sr), b = voice({ wave: 'noise', f: 7000, len: .008, curve: 1, seed: 3 }, sr); for (let k = 0; k < a.length; k++) a[k] = a[k] * .7 + (b[k] || 0) * .35; return a; } },
    'chip:noise': { label: '8-bit noise tick', make: (sr) => voice({ wave: 'noise', f: 9000, len: .012, curve: 1, seed: 5 }, sr) },
  };
  /* a recording as a tick: its silent lead cut off, a 2 ms fade at the end */
  function trimmed(x) {
    let pk = 0; for (const v of x) pk = Math.max(pk, Math.abs(v));
    let i = 0; while (i < x.length && Math.abs(x[i]) < pk * .01) i++;
    const out = x.slice(i), f = Math.min(out.length, 88);
    for (let k = 0; k < f; k++) out[out.length - 1 - k] *= k / f;
    return out;
  }
  function typeLayer(c, rec, sr, mix) {
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
      add(mix, resample(base, (c.pitch || 1) * st2(w)), e.t, c.vol * g, sr);
    });
  }

  /* the invented dot sounds. p = the pitch knob as a multiplier. Each draws into mix at the app's own times. */
  const DESIGN = {
    wave: {
      shimmer: { label: 'Shimmer', hint: 'a tiny bright blip each time the ring lights up dots - many at first, fewer as it slows', fn(mix, p, sr) {
        const r = rng(41), N = 70;
        for (let j = 1; j <= N; j++) {
          const v = .8 * Math.sqrt(j / N), t = T.wave + T.waveDur * (1 - Math.cbrt(1 - v));   // area the ring has swept = dots it has lit
          add(mix, voice({ wave: 'tri', f: (1700 + 1300 * r()) * (1 + .35 * v) * p, len: .035, curve: 2, seed: j }, sr), t, .35 + .25 * r(), sr);
        }
      } },
      whoosh: { label: 'Whoosh', hint: 'air rushing out with the ring - loud and bright while it is fast, dull as it slows', fn(mix, p, sr) {
        add(mix, whoosh(T.waveDur, (u) => (500 + 4200 * Math.pow(1 - u, 2)) * p, (u) => Math.min(1, u * 12) * (.15 + .85 * Math.pow(1 - u, 2)), 43, sr), T.wave, .55, sr);
      } },
      arp: { label: 'Rising arpeggio', hint: 'chiptune notes climbing up while the ring crosses - the old-console way to play a chord', fn(mix, p, sr) {
        const n = 37, pat = [0, 4, 7, 12];
        for (let i = 0; i < n; i++) {
          const u = i / n, t = T.wave + u * T.waveDur;
          add(mix, voice({ wave: 'p125', f: 523 * st2(pat[i % 4] + 12 * u) * p, len: .07, curve: 1.5 }, sr), t, .1 + .45 * Math.pow(1 - easeOut(u), .6), sr);
        }
      } },
      ping: { label: 'Sonar ping', hint: 'one ping as the ring leaves, answered twice by its own echo', fn(mix, p, sr) {
        [1, .45, .2].forEach((g, i) => add(mix, voice({ wave: 'p50', f: 1320 * p, len: .26, slide: -1, curve: 2.5 }, sr), T.wave + i * .24, g * .6, sr));
      } },
    },
    gather: {
      climb: { label: 'Power-up climb', hint: 'quick notes stepping up a scale as the dots fly in - the classic power-up', fn(mix, p, sr) {
        for (let t = T.gather; t < T.formed - .03; t += .07) {
          const g = easeInOut((t - T.gather) / T.gatherDur);
          add(mix, voice({ wave: 'p25', f: 330 * st2(Math.round(26 * g)) * p, len: .06, slide: 2, curve: 1.4 }, sr), t, .55, sr);
        }
      } },
      swarm: { label: 'Swarm of ticks', hint: 'a tiny tick for the flying dots - thickest when they move fastest, rising as the name builds', fn(mix, p, sr) {
        const r = rng(47), N = 60;
        for (let j = 1; j <= N; j++) {
          const t = T.gather + T.gatherDur * invEaseInOut(j / N);
          add(mix, voice({ wave: 'p125', f: (900 + 600 * r()) * Math.pow(2, 1.5 * j / N) * p, len: .018, curve: 1.2, seed: j }, sr), t, .28 + .15 * r(), sr);
        }
      } },
      glide: { label: 'Glide up', hint: 'one note sliding up two octaves with the dots, cut off the moment the name lands', fn(mix, p, sr) {
        const len = T.gatherDur;
        add(mix, voice({ wave: 'p25', f: 220 * p, len, curve: 0, st: (u) => 24 * easeInOut(u) + .15 * Math.sin(2 * Math.PI * 6 * u * len),
          env: (u) => Math.min(1, u * 4) * (u > .97 ? (1 - u) / .03 : 1) }, sr), T.gather, .4, sr);
      } },
    },
    formed: {
      coin: { label: 'Coin ding', hint: 'two quick notes, low then high - the coin pickup everyone knows', fn(mix, p, sr) {
        add(mix, voice({ wave: 'p50', f: 988 * p, len: .075, curve: .3 }, sr), T.formed, .5, sr);
        add(mix, voice({ wave: 'p50', f: 1319 * p, len: .38, curve: 2.2 }, sr), T.formed + .075, .5, sr);
      } },
      chord: { label: 'Chord', hint: 'four notes rolled fast into one chord', fn(mix, p, sr) {
        [0, 4, 7, 12].forEach((s, i) => add(mix, voice({ wave: 'p25', f: 1047 * st2(s) * p, len: .32 - i * .035, curve: 2 }, sr), T.formed + i * .035, .3, sr));
      } },
      tok: { label: 'Tok + sparkle', hint: 'a short wooden tok with a small sparkle on top', fn(mix, p, sr) {
        add(mix, voice({ wave: 'tri', f: 280 * p, len: .09, slide: -9, curve: 1.5 }, sr), T.formed, .8, sr);
        add(mix, voice({ wave: 'tri', f: 2637 * p, len: .22, curve: 3 }, sr), T.formed + .012, .3, sr);
      } },
    },
    leave: {
      fall: { label: 'Falling steps', hint: 'a note stepping down two octaves as the name breaks apart', fn(mix, p, sr) {
        add(mix, voice({ wave: 'p25', f: 1400 * p, len: .65, curve: 1.1, st: (u) => -Math.round(24 * u) }, sr), T.out, .4, sr);
      } },
      fizz: { label: 'Fizz', hint: 'a soft hiss that sinks as the letters dissolve', fn(mix, p, sr) {
        add(mix, voice({ wave: 'noise', f: 7000 * p, len: .5, curve: 1.6, st: (u) => -24 * u, seed: 9 }, sr), T.out, .35, sr);
      } },
    },
  };
  const PARTS = ['type', 'wave', 'gather', 'formed', 'leave'];
  /* one part alone, or all of them: a mono, dry buffer the length of the whole intro plus room for a tail */
  function intro(c, rec, sr = SR, only) {
    const mix = new Float32Array(Math.ceil((T.total + .6) * sr));
    for (const part of only ? [only] : PARTS) {
      const s = c[part]; if (!s) continue;
      if (part === 'type') { typeLayer(s, rec, sr, mix); continue; }
      const d = DESIGN[part][s.d]; if (!d || !s.vol) continue;
      const one = new Float32Array(mix.length);
      d.fn(one, st2(s.pitch || 0), sr);
      for (let k = 0; k < mix.length; k++) mix[k] += one[k] * s.vol;
    }
    let peak = 0; for (const v of mix) peak = Math.max(peak, Math.abs(v));
    return { mix, peak };
  }

  G.KPM_CHIP = { SR, voice, capyVoices, CAPY, STEPS, T, TYPE, DESIGN, PARTS, intro, typeEvents, easeOut, easeInOut };
})(typeof window !== 'undefined' ? window : globalThis);
