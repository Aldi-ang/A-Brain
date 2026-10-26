/* Runs inside the REAL lab page (?shell&vaultlist&tab=promo). Puts the prototype's dial (v3 CSS, shadow root so the app's
   classes cannot touch it) into the Supply Case at the spot an option names. Returns measurements for the captions. */
(opt, proto) => {
  const h3 = [...document.querySelectorAll('h3')].find((h) => /Supply Case/.test(h.textContent));
  const header = h3.parentElement, leftCol = header.parentElement, list = header.nextElementSibling;
  const searchWrap = header.children[1], tabs = header.children[2];
  const before = { headerH: header.offsetHeight, listH: list.clientHeight };

  const DIAL_CSS = `
  .dialbox { position: absolute; left: 0; top: 0; width: 196px; height: 132px; background: linear-gradient(#26231f, #121110); border-radius: 18px; border: 3px solid #050505;
    box-shadow: inset 0 2px 0 #3a352f, inset 0 -3px 0 #000, 0 4px 0 #000; box-sizing: border-box; transform-origin: 0 0; }
  .dialbox::before { content: ""; position: absolute; inset: 8px; border-radius: 12px; background: repeating-linear-gradient(90deg, #1b1916 0 3px, #161412 3px 6px); }
  .lamp { position: absolute; width: 40px; height: 40px; margin: -20px; border-radius: 50%; border: 3px solid #050505; background: #2a2622; display: grid; place-items: center; padding: 0; box-sizing: border-box;
    box-shadow: inset 0 2px 0 #3a352f; }
  .lamp svg { width: 24px; height: 24px; opacity: .45; }
  .lamp.on svg { opacity: 1; }
  .lamp.healthy.on { background: #0f2d2b; box-shadow: 0 0 14px 2px #2fbfa399, inset 0 0 8px #2fbfa3; }
  .lamp.quarantine.on { background: #3b3105; box-shadow: 0 0 14px 2px #f2c41899, inset 0 0 8px #f2c418; }
  .lamp.promo.on { background: #3a0b10; box-shadow: 0 0 14px 2px #e2b64a99, inset 0 0 8px #e2b64a; }
  .lb { position: absolute; bottom: 100%; margin-bottom: 3px; font: 800 14px/1 ui-monospace, Consolas, monospace; letter-spacing: .06em; color: #8a8178; white-space: nowrap; }
  .lamp.on .lb { color: #efe8db; }
  .knob { position: absolute; left: 50%; bottom: 10px; width: 64px; height: 64px; margin-left: -32px; border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #8f8f8f 0 12%, #5c5c5c 40%, #3a3a3a 70%, #262626 100%); box-shadow: 0 0 0 3px #050505, 0 0 0 6px #2f2b27, 0 6px 0 2px #000; }
  .rot { position: absolute; inset: 0; border-radius: 50%; transform: rotate(var(--a)); }
  .rot::before { content: ""; position: absolute; left: 50%; top: 4px; width: 8px; height: 22px; margin-left: -4px; border-radius: 3px; background: #d08a2e; box-shadow: 0 0 8px #d08a2e; }
  .rot::after { content: ""; position: absolute; inset: 12px; border-radius: 50%; background: repeating-conic-gradient(#4a4a4a 0 6deg, #3c3c3c 6deg 12deg); box-shadow: inset 0 0 6px #000; }`;
  const STOP = { healthy: -58, quarantine: 0, promo: 58 };
  const makeDial = (scale, chest = 'promo') => {
    const host = document.createElement('div');
    host.style.cssText = `position:relative;flex:none;width:${Math.round(196 * scale)}px;height:${Math.round(132 * scale + 4)}px`;
    const sr = host.attachShadow({ mode: 'open' });
    sr.innerHTML = `<style>${DIAL_CSS}</style><div class="dialbox" style="transform:scale(${scale})">${Object.keys(STOP).map((t) => {
      const a = STOP[t] * Math.PI / 180;
      return `<span class="lamp ${t}${t === chest ? ' on' : ''}" style="left:${98 + 70 * Math.sin(a)}px;top:${90 - 70 * Math.cos(a) + 16}px"><svg viewBox="-12 -12 24 24" data-t="${t}"></svg><span class="lb">${t.toUpperCase()}</span></span>`;
    }).join('')}<span class="knob"><span class="rot" style="--a:${STOP[chest]}deg"></span></span></div>`;
    const NS = 'http://www.w3.org/2000/svg', el = (n, at) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); return e; };
    sr.querySelector('[data-t=healthy]').append(el('ellipse', { rx: 10, ry: 7, fill: '#2fbfa3', stroke: '#050505', 'stroke-width': 2 }), el('circle', { r: 3.4, fill: '#050505' }));
    const rad = sr.querySelector('[data-t=quarantine]');
    rad.append(el('circle', { r: 11, fill: '#f2c418', stroke: '#050505', 'stroke-width': 1.5 }));
    for (const a0 of [-90, 30, 150]) {
      const p = (r, a) => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)];
      const [x1, y1] = p(3, a0 - 30), [x2, y2] = p(9, a0 - 30), [x3, y3] = p(9, a0 + 30), [x4, y4] = p(3, a0 + 30);
      rad.append(el('path', { d: `M${x1} ${y1}L${x2} ${y2}A9 9 0 0 1 ${x3} ${y3}L${x4} ${y4}A3 3 0 0 0 ${x1} ${y1}Z`, fill: '#050505' }));
    }
    rad.append(el('circle', { r: 1.8, fill: '#050505' }));
    sr.querySelector('[data-t=promo]').append(el('rect', { x: -9, y: -4, width: 18, height: 13, fill: '#a3222b', stroke: '#050505', 'stroke-width': 1.5 }),
      el('rect', { x: -10, y: -7, width: 20, height: 5, fill: '#c22d38', stroke: '#050505', 'stroke-width': 1.5 }),
      el('rect', { x: -2, y: -7, width: 4, height: 16, fill: '#e2b64a' }),
      el('path', { d: 'M0 -7C-6 -13 -9 -8 -3 -7M0 -7C6 -13 9 -8 3 -7', fill: 'none', stroke: '#e2b64a', 'stroke-width': 2.2 }));
    return host;
  };
  /* the promo chest holds promo items only, so its tab row is just ALL; the title names the chest (the switch reports) */
  const promoChest = () => {
    h3.textContent = 'Promo Chest';
    [...tabs.querySelectorAll('button')].forEach((b) => { if (/^PROMO$/.test(b.textContent.trim())) b.textContent = 'ALL'; else if (!/add/i.test(b.textContent)) b.style.display = 'none'; });
  };

  if (opt === 'A' || (opt === 'B' && innerWidth < 1024)) {            /* the dial in the case header, beside title + search */
    promoChest();
    const dial = makeDial(innerWidth < 1024 ? 0.78 : 0.78);
    Object.assign(header.style, { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: '12px' });
    Object.assign(h3.style, { gridColumn: '1', gridRow: '1' });
    Object.assign(searchWrap.style, { gridColumn: '1', gridRow: '2', alignSelf: 'end' });
    Object.assign(tabs.style, { gridColumn: '1 / -1', gridRow: '3' });
    Object.assign(dial.style, { gridColumn: '2', gridRow: '1 / 3', alignSelf: 'end', marginBottom: '12px' });
    header.append(dial);
  } else if (opt === 'B') {                                             /* PC: a deck at the foot of the case, like the warehouse box */
    promoChest();
    const deck = document.createElement('div');
    deck.style.cssText = 'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;padding:10px 16px 12px;border-top:1px solid rgba(245,158,11,.2);background:#000;flex:none';
    const note = (t, al) => { const s = document.createElement('span'); s.textContent = t; s.style.cssText = `font:700 12px/1.3 ui-monospace,Consolas,monospace;letter-spacing:.08em;color:#fcd34d;text-align:${al}`; return s; };
    deck.append(note('PROMO CHEST', 'left'), makeDial(0.78), note('4 ITEMS', 'right'));
    leftCol.append(deck);
  } else if (opt === 'C') {                                             /* a CHEST button beside + ADD opens the box as a panel */
    const add = [...tabs.querySelectorAll('button')].find((b) => /add/i.test(b.textContent));
    const chest = add.cloneNode(true);
    chest.innerHTML = '<svg width="14" height="14" viewBox="-12 -12 24 24"><rect x="-9" y="-4" width="18" height="13" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="-10" y="-7" width="20" height="4" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M0 -7V9" stroke="currentColor" stroke-width="2.2"/></svg> Chest';
    chest.classList.remove('ml-auto'); add.before(chest); chest.style.marginLeft = 'auto';
    if (opt === 'C' && !window.__closed) {
      const phone = innerWidth < 1024;
      const scrim = document.createElement('div');
      scrim.style.cssText = `position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.72);display:grid;place-items:${phone ? 'stretch' : 'center'}`;
      const panel = document.createElement('div');
      panel.style.cssText = phone ? 'background:#12100e;display:flex;flex-direction:column;width:100vw;height:100vh'
        : 'background:#12100e;display:flex;flex-direction:column;width:min(640px,calc(100vw - 32px));max-height:calc(100vh - 32px);border:1px solid #2b2621;border-radius:14px;overflow:hidden;box-shadow:0 30px 80px #000';
      panel.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 4px 4px 16px;border-bottom:1px solid #2b2621;flex:none">
        <span style="font:700 12px/1 ui-monospace,Consolas,monospace;letter-spacing:.2em;color:#d08a2e">MASTER VAULT · CHEST</span>
        <span style="width:44px;height:44px;display:grid;place-items:center;color:#efe8db;font:700 20px/1 sans-serif">×</span></div>`;
      const fr = document.createElement('iframe');
      fr.style.cssText = 'border:0;width:100%;flex:1;min-height:0;display:block';
      fr.srcdoc = proto;
      panel.append(fr); scrim.append(panel); document.body.append(scrim);
      return new Promise((done) => { fr.onload = () => setTimeout(() => {
        const d = fr.contentDocument; if (!phone) { fr.style.flex = 'none'; fr.style.height = d.documentElement.scrollHeight + 'px'; }
        done({ opt, vw: innerWidth, frameDocH: d.documentElement.scrollHeight, frameH: fr.clientHeight, overflowX: document.documentElement.scrollWidth > innerWidth });
      }, 900); });
    }
  }
  const after = { headerH: header.offsetHeight, listH: list.clientHeight };
  const dialEl = header.querySelector(':scope > div:last-child') ;
  return { opt, vw: innerWidth, before, after, overflowX: document.documentElement.scrollWidth > innerWidth, headerW: header.clientWidth,
    searchW: searchWrap.getBoundingClientRect().width, fonts: document.fonts.check('700 13px Rajdhani') };
}
