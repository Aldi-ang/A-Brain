import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = process.argv[2], S = process.argv[3];
const { voicePlan } = await import(pathToFileURL(root + '/src/utils/voicePlan.js').href);
const lines = fs.readFileSync(S + '/capylines.txt', 'utf8').split('\n').filter(Boolean).map(l => l.slice(1, -1));
const ms = fs.readFileSync(root + '/src/MerchantSalesView.jsx', 'utf8'), cm = fs.readFileSync(root + '/src/components/CapybaraMascot.jsx', 'utf8');
for (const src of [ms.match(/const CHATTER = \{[\s\S]*?\};/)[0], (ms.match(/DEAL_LINES = \[[\s\S]*?\];/) || [''])[0], cm.slice(0, cm.indexOf('export default'))])
  for (const m of src.matchAll(/"([^"]{2,})"/g)) lines.push(m[1]);
const hist = {}, shortLines = new Map(), gapHist = {}, durHist = {};
let total = 0;
for (const t of lines) for (let seed = 1; seed <= 300; seed++) {
  const p = voicePlan(t, seed); total++;
  const bySent = {};
  for (const x of p) (bySent[x.sent] ||= new Set()).add(x.word);
  const sizes = Object.values(bySent).map(s => s.size), minS = sizes.length ? Math.min(...sizes) : 0;
  hist[minS] = (hist[minS] || 0) + 1;
  if (minS < 3) shortLines.set(t, (shortLines.get(t) || 0) + 1);
  // gap between the START of one word and the start of the next, in ms (word onsets)
  for (let i = 1; i < p.length; i++) if (p[i].word !== p[i - 1].word && p[i].sent === p[i - 1].sent) {
    const g = Math.round((p[i].at - p[i - 1].at) * 1000 / 50) * 50; gapHist[g] = (gapHist[g] || 0) + 1;
  }
  const d = p.length ? Math.round(p[p.length - 1].at * 10) / 10 : 0; durHist[d] = (durHist[d] || 0) + 1;
}
console.log('lines', lines.length, 'plans', total);
console.log('fewest words in any sentence -> plans:', JSON.stringify(hist));
console.log('lines with a sentence under 3 words:', shortLines.size);
for (const [t, n] of [...shortLines].slice(0, 15)) console.log('  ', n + '/300', JSON.stringify(t));
console.log('word-onset gaps (ms, 50 ms buckets):', JSON.stringify(gapHist));
console.log('example plans:');
for (const t of ['Good pick.', 'Hi.', 'Ah. This one.']) {
  const p = voicePlan(t, 7);
  console.log('  ', JSON.stringify(t), p.map(x => `${x.word}@${Math.round(x.at * 1000)}ms ${x.on}-${x.v}-${x.len} g${x.gain.toFixed(2)} r${x.rate.toFixed(2)}`).join(' | '));
}
