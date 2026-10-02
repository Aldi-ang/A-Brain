/* The expedition prototype's ground: the SAME dark tiles the app's Map System uses (Esri Canvas World_Dark_Gray_Base,
   MapMissionControl.jsx:2426, brightness 1.2 like .balanced-dark-tile), 8 x 6 tiles at zoom 14 around Muntilan,
   stitched once into ground.jpg. An artifact cannot load map tiles (its CSP blocks them), so the page ships this picture.
   Run: node ground.mjs */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const Z = 14, LAT = -7.5808, LNG = 110.2925, COLS = 8, ROWS = 6;
const n = 2 ** Z, tx = (LNG + 180) / 360 * n, ty = (1 - Math.asinh(Math.tan(LAT * Math.PI / 180)) / Math.PI) / 2 * n;
const x0 = Math.floor(tx) - 3, y0 = Math.floor(ty) - 3;
let html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#000}div{display:grid;grid-template-columns:repeat(${COLS},256px);filter:brightness(1.2)}img{display:block;width:256px;height:256px}</style><div>`;
for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++)
  html += `<img src="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${Z}/${y0 + y}/${x0 + x}">`;
fs.writeFileSync(path.join(HERE, 'ground-lab.html'), html + '</div>');
const out = path.join(HERE, 'ground.png'); fs.rmSync(out, { force: true });
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--user-data-dir=' + path.join(HERE, 'profile'), `--window-size=${COLS * 256},${ROWS * 256}`, '--virtual-time-budget=8000',
  '--screenshot=' + out, pathToFileURL(path.join(HERE, 'ground-lab.html')).href], { stdio: 'ignore' });
fs.rmSync(path.join(HERE, 'profile'), { recursive: true, force: true });
console.log(JSON.stringify({ size: fs.statSync(out).size, centre: [(tx - x0) * 256, (ty - y0) * 256].map(Math.round), x0, y0 }));
