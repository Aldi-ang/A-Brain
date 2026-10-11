// prints JSON: the real levelBadge output for the pins the HUB check needs, sliced from MapMissionControl.jsx
import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2], 'utf8');
const part = src.slice(src.indexOf('const MD ='), src.indexOf('const Badge ='));
const api = new Function(`${part}; return { levelBadge, hubSize, LEVEL_LOOKS, LEVEL_NONE };`)();
const { levelBadge, hubSize, LEVEL_LOOKS, LEVEL_NONE } = api;
const pin = (look, hub, dot, big) => {
  const px = Math.round(look[2] * 1.4 * (big ? 1.3 : 1) + (hub ? 6 : 0));
  const [w, h] = (hub ? hubSize(px) : [px, px]).map((n) => Math.max(32, n + 10));
  return `<div class="custom-icon ms-pin lab-pin" style="width:${w}px;height:${h}px">${levelBadge(look, { dot, big, hub, fit: px })}</div>`;
};
console.log(JSON.stringify([
  pin(LEVEL_NONE, false, '', false),
  pin(LEVEL_NONE, true, 'late', false),
  pin(LEVEL_LOOKS[0], true, 'soon', false),
  pin(LEVEL_LOOKS[3], true, '', true),
  `<div class="ms-head lab-head" style="width:320px">${levelBadge(LEVEL_NONE, { big: true, hub: true, dot: 'late' })}<div><h5>Toko Grosir</h5></div></div>`,
]));
