// Before/after of the full potato audit: idle CPU at 60 fps, scroll jank, per screen.
import fs from 'node:fs';
const B = JSON.parse(fs.readFileSync(new URL('./potato-result-before.json', import.meta.url), 'utf8'));
const A = JSON.parse(fs.readFileSync(new URL('./potato-result.json', import.meta.url), 'utf8'));
const by = (r) => Object.fromEntries(r.screens.map(s => [s.label, s]));
const b = by(B), a = by(A);
console.log('screen'.padEnd(26), 'cpu before -> after'.padEnd(22), 'janky frames (worst ms) before -> after');
for (const k of Object.keys(b)) {
  const x = b[k], y = a[k]; if (!y || x.missing) continue;
  const j = (s) => s.scroll ? `${s.scroll.jankyFrames} (${s.scroll.worstFrameMs})` : '-';
  console.log(k.padEnd(26), `${x.idleCpuPctAt60}% -> ${y.idleCpuPctAt60}%`.padEnd(22), `${j(x)} -> ${j(y)}`);
}
console.log('load before', JSON.stringify(B.load.cold_slow4g), '\nload after ', JSON.stringify(A.load.cold_slow4g));
console.log('errors after', A.errors.length);
