/* who calls the hot functions in a .cpuprofile: node callers.mjs <file.cpuprofile> <functionName> [depth]
   prints self time of <functionName> grouped by its caller chain (depth frames up) - TEST ONLY (2026-11-15) */
import { readFileSync } from 'node:fs';

const [file, name, depthArg] = process.argv.slice(2);
const depth = Number(depthArg || 3);
const p = JSON.parse(readFileSync(file, 'utf8'));
const byId = new Map(p.nodes.map((n) => [n.id, n]));
const parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const self = new Map();
p.samples.forEach((sid, k) => self.set(sid, (self.get(sid) || 0) + (p.timeDeltas[k + 1] ?? p.timeDeltas[k] ?? 0)));
const label = (n) => `${n.callFrame.functionName || '(anon)'} ${(n.callFrame.url || '').replace(/^.*localhost:\d+\//, '').replace(/[?].*$/, '')}:${n.callFrame.lineNumber + 1}`;
const chains = new Map(); let total = 0;
for (const [sid, us] of self) {
    const n = byId.get(sid);
    if (n.callFrame.functionName !== name) continue;
    total += us;
    const chain = []; let cur = parent.get(sid);
    for (let i = 0; i < depth && cur; i++) { chain.push(label(byId.get(cur))); cur = parent.get(cur); }
    const k = chain.join('  <-  ');
    chains.set(k, (chains.get(k) || 0) + us);
}
console.log(`${name}: ${Math.round(total / 1000)} ms self`);
for (const [k, us] of [...chains].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`${Math.round(us / 1000)} ms  <-  ${k}`);
