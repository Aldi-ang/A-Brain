/* 2026-10-06 - the Karantina scene's right door had no sign: the page's CSS draws var(--sign), which was never defined, so
   the shut doors read as a blank panel. The app builds the radiation sign from pixel data (kpm QuarantineSwitch.jsx SIGN_IMG
   from utils/vanBay.js HAZARD_SIGN); this builds the same image and gives it to the page's doors.
   Usage: node add-door-sign.mjs <page.html> */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KPM = path.resolve(HERE, '../../../kpm-inventory-main');
const { HAZARD_SIGN } = await import(pathToFileURL(path.join(KPM, 'src/utils/vanBay.js')).href);
const svgImg = (viewBox, body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' shape-rendering='crispEdges'>${body}</svg>`)}")`;
const SIGN = svgImg('-4.5 -4.5 24 24', `<g fill='#141414'>${HAZARD_SIGN.map(([x, y]) => `<rect x='${x}' y='${y}' width='1.02' height='1.02'/>`).join('')}</g>`);
const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const old = '.kpm-doors { position: absolute; inset: 0; z-index: 4; pointer-events: none; }';
if (s.includes('--sign: url(')) { console.log('already has the sign'); process.exit(0); }
if (!s.includes(old)) throw new Error('doors rule not found');
s = s.replace(old, `.kpm-doors { position: absolute; inset: 0; z-index: 4; pointer-events: none; --sign: ${SIGN}; }   /* the app's radiation sign (QuarantineSwitch.jsx SIGN_IMG) */`);
fs.writeFileSync(file, s);
console.log('sign added,', SIGN.length, 'chars');
