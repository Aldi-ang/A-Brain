// Prints the potato audit as one table plus the evidence lines behind each column.
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync(new URL('./potato-result.json', import.meta.url), 'utf8'));
console.log('rate', r.rate, r.viewport, '| errors', r.errors.length, r.errors.slice(0, 3));
console.log('load', JSON.stringify(r.load));
console.log('typing ms/letter', r.unlockTypingMsPerLetter, '| unlock wave', JSON.stringify({ cpu60: r.unlockSequence.idleCpuPctAt60, msPerFrame: r.unlockSequence.msPerFrame, top: r.unlockSequence.mainTop.slice(0, 3) }));
console.log('css', JSON.stringify(r.css));
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log('\n' + ['screen', 'settle', 'cpu@60', 'ms/fr', 'fr/s', 'commit/s', 'anims', 'nonComp', 'backdrop', 'canvas', 'jank', 'worst', 'dom'].map((h, i) => pad(h, i ? 8 : 22)).join(''));
for (const s of r.screens) {
  if (s.missing) { console.log(pad(s.label, 22), 'MISSING'); continue; }
  console.log([pad(s.label, 22), pad(s.settleMs ?? '-', 8), pad(s.idleCpuPctAt60 + '%', 8), pad(s.msPerFrame, 8), pad(s.framesPerSecHeadless, 8), pad(s.reactCommitsPerSec, 8),
    pad(s.scan?.running, 8), pad(s.scan?.notComposited?.length, 8), pad(s.scan?.heavy?.backdrop?.filter(x => !x.includes('(off)')).length, 8), pad(s.scan?.canvases?.length, 8),
    pad(s.scroll?.jankyFrames ?? '-', 8), pad(s.scroll?.worstFrameMs ?? '-', 8), pad(s.scan?.dom, 8)].join(''));
}
for (const s of r.screens) {
  if (s.missing) continue;
  console.log(`\n## ${s.label}: main top ${JSON.stringify(s.trace.mainTop.slice(0, 3))}`);
  if (s.who?.length) console.log('  who re-renders:', JSON.stringify(s.who.slice(0, 3)));
  if (s.rafPerSec?.length) console.log('  rAF/s:', JSON.stringify(s.rafPerSec));
  if (s.timeoutsPerSec?.length) console.log('  timeouts/s:', JSON.stringify(s.timeoutsPerSec.slice(0, 4)));
  if (s.domChangesPerSec?.length) console.log('  DOM changes/s:', JSON.stringify(s.domChangesPerSec.slice(0, 4)));
  if (s.scan?.notComposited?.length) console.log('  not composited:', JSON.stringify(s.scan.notComposited));
  if (s.scan?.composited?.length) console.log('  composited:', JSON.stringify(s.scan.composited.slice(0, 5)));
  const h = s.scan?.heavy; if (h) console.log('  heavy:', JSON.stringify({ backdrop: h.backdrop.filter(x => !x.includes('(off)')), blur: h.blur.filter(x => !x.includes('(off)') && !x.includes('blur(0px)')), blend: h.blend, bigShadow: h.bigShadow, willChange: h.willChange }));
  if (s.scan?.canvases?.length) console.log('  canvases:', JSON.stringify(s.scan.canvases));
}
console.log('\nsources', JSON.stringify(r.sources, null, 1));
