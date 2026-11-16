// node mkopt.mjs - writes opt-<name>.js = pick (pk.js) + the option library + apply(keys), one per option
import { readFileSync, writeFileSync } from 'node:fs';
const pk = readFileSync(new URL('pk.js', import.meta.url), 'utf8');
const lib = readFileSync(new URL('opt-lib.js', import.meta.url), 'utf8');
const OPTS = { a: 'S,W,A', b: 'S,B', c: 'S,W,C', ph: 'S,PH', none: '' };
for (const [n, k] of Object.entries(OPTS)) {
    writeFileSync(new URL(`opt-${n}.js`, import.meta.url), `${pk}\n${lib}\nawait new Promise((r) => setTimeout(r, 400));\nreturn apply(${JSON.stringify(k.split(',').filter(Boolean))});\n`);
}
console.log('wrote', Object.keys(OPTS).join(' '));
