/* the HUB pin board: TODAY (as the app draws it, measured 3.5 px off) vs three one-piece symbols - injected into the
   lab page so the app's own font (Rajdhani) and stylesheet are on hand */
(() => {
  const D = '#14110e', G = '#E4B04A', CREAM = '#F0E2BC', LV = '#B8B0A4', RED = '#E0583A';
  const SPROUT = `<path d="M8 15V8.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 9.2C8 5.6 5.6 3.4 2 3.4c0 3.6 2.4 5.8 6 5.8z"/><path d="M8 8.4c0-3.1 2.3-5.1 6-5.1 0 3.3-2.3 5.1-6 5.1z"/>`;
  const badge = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${D}" stroke="${LV}" stroke-opacity=".85" stroke-width="2"/><svg x="${cx - r * .6}" y="${cy - r * .6}" width="${r * 1.2}" height="${r * 1.2}" viewBox="0 0 16 16" style="fill:${LV};color:${LV}">${SPROUT}</svg>`;
  const word = (cx, y) => `<g><rect x="${cx - 15}" y="${y}" width="30" height="13" rx="2.5" fill="${D}" stroke="${G}" stroke-width="1.5"/><text x="${cx}" y="${y + 10.2}" text-anchor="middle" font-family="Rajdhani, sans-serif" font-weight="800" font-size="11" letter-spacing="1.3" fill="${CREAM}">HUB</text></g>`;
  const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${RED}" stroke="${D}" stroke-width="2"/>`;
  const shadow = 'filter:drop-shadow(0 2px 0 rgba(0,0,0,.55))';
  const OPT = {
    /* A: the warehouse IS the plate - roof and walls one shape, the level badge inside its door, the word under it */
    A: { name: 'A · the badge lives IN the warehouse', w: 50, h: 66, svg: `<path d="M3 23L25 5l22 18" fill="none" stroke="${G}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 21.5L25 8l17 13.5V49H8z" fill="${D}" stroke="${G}" stroke-width="2" stroke-linejoin="round"/>${badge(25, 34, 11.5)}${word(25, 52)}${dot(44, 9)}` },
    /* B: a real warehouse silhouette - low gable, a striped roller door - and the level badge on its corner */
    B: { name: 'B · a warehouse with a roller door', w: 58, h: 66, svg: `<path d="M3 20L29 6l26 14v28H3z" fill="${D}" stroke="${G}" stroke-width="2.2" stroke-linejoin="round"/><path d="M17 48V27h24v21" fill="none" stroke="${G}" stroke-width="1.8"/><path d="M19 31h20M19 35h20M19 39h20M19 43h20" stroke="${G}" stroke-opacity=".7" stroke-width="1.6"/>${badge(46, 42, 9)}${word(29, 52)}${dot(52, 9)}` },
    /* C: not a building - the centre of a network: the badge in a gold ring with spokes going out to the shops */
    C: { name: 'C · the centre the goods go out from', w: 56, h: 66, svg: `${[0, 60, 120, 180, 240, 300].map((a) => { const r = a * Math.PI / 180, x1 = 28 + Math.cos(r) * 17.5, y1 = 25 + Math.sin(r) * 17.5, x2 = 28 + Math.cos(r) * 24.5, y2 = 25 + Math.sin(r) * 24.5; return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${G}" stroke-width="3" stroke-linecap="round"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="2.4" fill="${G}"/>`; }).join('')}<circle cx="28" cy="25" r="16" fill="${D}" stroke="${G}" stroke-width="2.2"/>${badge(28, 25, 11.5)}${word(28, 52)}${dot(47, 7)}` },
  };
  const today = (scale) => { const px = 37 * scale; return `<span style="position:relative;display:inline-block;width:${px}px;height:${px}px;margin-top:${16 * scale}px"><svg viewBox="0 0 44 13" preserveAspectRatio="none" style="position:absolute;left:${-7 * scale}px;top:${-14 * scale}px;width:${44 * scale}px;height:${13 * scale}px;overflow:visible"><path d="M2 12L22 2l20 10" fill="${D}" stroke="${G}" stroke-width="2.2" stroke-linejoin="round"/></svg><svg viewBox="0 0 32 32" style="width:100%;height:100%;overflow:visible;${shadow}">${badge(16, 16, 13.5)}</svg><svg viewBox="0 0 10 10" style="position:absolute;right:${-5 * scale}px;top:${-5 * scale}px;width:${9 * scale}px;height:${9 * scale}px"><circle cx="5" cy="5" r="4" fill="${RED}" stroke="${D}" stroke-width="1.6"/></svg><svg viewBox="0 0 30 13" style="position:absolute;left:50%;translate:-50% 0;top:calc(100% + ${4 * scale}px);width:${30 * scale}px;height:${13 * scale}px">${word(15, 0)}</svg></span>`; };
  const opt = (o, scale) => `<svg viewBox="0 0 ${o.w} ${o.h}" width="${o.w * scale}" height="${o.h * scale}" style="overflow:visible;${shadow}">${o.svg}</svg>`;
  const pin = (scale = 1) => `<svg viewBox="0 0 32 32" width="${31 * scale}" height="${31 * scale}" style="${shadow}">${badge(16, 16, 13.5)}</svg>`;
  const map = (inner, h) => `<div style="position:relative;height:${h}px;border-radius:10px;overflow:hidden;background:#eadfc8;background-image:linear-gradient(32deg,transparent 46%,#d98e5a 46%,#d98e5a 50%,transparent 50%),linear-gradient(118deg,transparent 60%,#f7f2e6 60%,#f7f2e6 64%,transparent 64%);display:flex;align-items:center;justify-content:center;gap:22px">${inner}</div>`;
  const col = (title, oneX, threeX, note) => `<div style="flex:1;min-width:0;display:grid;gap:8px"><b style="font:800 15px/1.2 Rajdhani,sans-serif;color:${CREAM};letter-spacing:.04em">${title}</b>${map(`${pin()}${oneX}${pin()}`, 150)}${map(threeX, 250)}<small style="font:600 12px/1.35 system-ui;color:#c9c1b4">${note}</small></div>`;
  document.body.style.cssText = 'margin:0;background:#0a0908';
  document.body.innerHTML = `<div id="board" style="width:1180px;padding:16px;display:flex;gap:14px;background:#0a0908">${[
    col('TODAY · as the app draws it', today(1), today(3), 'the roof hangs 3.5 px to the left of the badge, and the red dot sits on the roof\'s end'),
    col(OPT.A.name, opt(OPT.A, 1), opt(OPT.A, 3), 'one shape: roof + walls; the level stays big inside; the word under it (my pick)'),
    col(OPT.B.name, opt(OPT.B, 1), opt(OPT.B, 3), 'reads "warehouse" fastest; the level badge gets smaller, on the corner'),
    col(OPT.C.name, opt(OPT.C, 1), opt(OPT.C, 3), 'not a building - a centre with lines going out to the shops'),
  ].join('')}</div>`;
})();
