/* Runs inside the REAL lab terminal (?shell&terminal&many). Draws one state of the proposed arrival flow over the
   real component, using only the app's own --duke-* colours, and returns measurements for the captions.
   today       : nothing drawn (the shooter has already tapped + / the grip where the frame needs it)
   arrive      : the status sheet that opens when GPS locks a shop (phone: bottom sheet; PC: a card)
   open        : phone only - the Manifest as a left panel, pulled out, its tab riding the panel's edge
   tucked      : phone only - the panel away, the tab on the left edge, wares at full height
   flag        : tucked + the flag that slides out of the tab for 2 s after each "+" */
(state) => {
  const phone = innerWidth < 1024;
  const $ = (s, r = document) => r.querySelector(s);
  const dr = [...document.querySelectorAll('div')].find((d) => d.style.getPropertyValue('--drawer-h'));
  const imp = (el, o) => { for (const k in o) el.style.setProperty(k, o[k], 'important'); };
  const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
  /* the wares' own face (Rajdhani); its double quotes would end a style="" attribute, so they become single quotes */
  const font = getComputedStyle($('input[placeholder*="search" i]') || document.body).fontFamily.replace(/"/g, "'");
  const shopName = ($('[aria-label="Choose customer"]')?.innerText || '').split('\n').pop().trim() || 'TOKO BERKAH JAYA';
  const grip = dr ? [...dr.children].find((c) => /lg:hidden h-\[52px\]/.test(c.className)) : null;
  const lines = grip ? [...grip.querySelectorAll('.text-\\[10px\\]')].map((e) => e.innerText) : [];
  const count = (grip?.innerText.match(/MANIFEST \((\d+)\)/i) || [])[1] || '0';
  const total = (grip?.innerText.match(/Rp [\d.]+/) || ['Rp 0'])[0];
  const out = { state, vw: innerWidth, vh: innerHeight, fonts: document.fonts.check('700 13px Rajdhani'), shopName, count, total };

  const scrim = (z) => { const s = document.createElement('div'); imp(s, { position: 'fixed', inset: '0', 'z-index': String(z), background: 'rgba(0,0,0,.6)' }); document.body.append(s); return s; };

  /* the tab: mirrors the menu ribbon on the right edge (same 25 % band, same slim plate), carries the count */
  const TAB_W = 20, TAB_TOP = Math.round(innerHeight * 0.25 - 66), TAB_H = 132;
  const makeTab = (left) => {
    const t = document.createElement('div');
    imp(t, { position: 'fixed', left: left + 'px', top: TAB_TOP + 'px', width: TAB_W + 'px', height: TAB_H + 'px', 'z-index': '151',
      background: 'var(--duke-fill-panel)', border: '2px solid var(--duke-amber)', 'border-left-width': left ? '0' : '0', 'border-radius': '0 10px 10px 0',
      display: 'flex', 'flex-direction': 'column', 'align-items': 'center', gap: '6px', padding: '6px 0', 'box-sizing': 'border-box',
      'box-shadow': '4px 0 14px rgba(0,0,0,.5)', 'font-family': font });
    t.innerHTML = `<span style="min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:var(--duke-amber);color:#000;font:900 11px/18px ${font};text-align:center;box-sizing:border-box">${count}</span>
      <span style="writing-mode:vertical-rl;transform:rotate(180deg);font:900 11px/1 ${font};letter-spacing:.18em;color:var(--duke-amber-ink);text-transform:uppercase">Manifest</span>
      <span style="margin-top:auto;color:var(--duke-ink-3);font:900 14px/1 ${font}">${left ? '‹' : '›'}</span>`;
    document.body.append(t);
    return t;
  };

  if (state === 'today') return out;

  if (state === 'arrive') {
    if (phone && dr) imp(dr, { display: 'none' });       /* the AFTER terminal has no bottom drawer */
    if (phone) makeTab(0);
    scrim(160);
    const sheet = document.createElement('div');
    imp(sheet, phone
      ? { position: 'fixed', left: '0', right: '0', bottom: '0', 'z-index': '161', 'border-top': '4px solid var(--duke-edge-1)', 'border-radius': '16px 16px 0 0' }
      : { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '520px', 'z-index': '161', border: '4px solid var(--duke-edge-1)', 'border-radius': '16px', 'box-shadow': '0 30px 80px #000' });
    imp(sheet, { background: 'var(--duke-fill-panel)', color: 'var(--duke-ink-1)', 'font-family': font, padding: '16px 16px 20px', 'box-sizing': 'border-box' });
    const tags = [['Stock Full (No Order) 🛑'], ['Competitor Issue ⚠️'], ['Store Closed 🔒'], ['New Request 📝']];
    const chip = (t, extra = '') => `<button style="min-height:56px;padding:8px 10px;border-radius:10px;border:2px solid var(--duke-edge-1);background:var(--duke-fill-well);color:var(--duke-ink-1);font:800 13px/1.2 ${font};letter-spacing:.06em;text-transform:uppercase;text-align:left;${extra}">${t}</button>`;
    sheet.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font:800 11px/1 ${font};letter-spacing:.16em;color:var(--duke-ink-6);text-transform:uppercase">You are here · 0 m · GPS ✓</div>
          <div style="font:900 22px/1.15 ${font};letter-spacing:.04em;text-transform:uppercase;margin-top:6px;color:var(--duke-paper-ink, var(--duke-ink-1))">${shopName}</div>
          <div style="font:600 13px/1.3 ${font};color:var(--duke-ink-3);margin-top:2px">Jl. Merdeka No. 12, Bandung</div>
        </div>
        <button aria-label="Close" style="width:44px;height:44px;flex:none;border-radius:10px;border:1px solid var(--duke-edge-1);background:transparent;color:var(--duke-ink-3);font:700 22px/1 sans-serif">×</button>
      </div>
      <button style="margin-top:16px;width:100%;min-height:60px;border-radius:10px;border:2px solid var(--duke-brass-edge-3);background:linear-gradient(90deg,var(--duke-amber),var(--duke-amber-2));color:#000;font:900 18px/1 ${font};letter-spacing:.18em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:10px">⚡ Take order</button>
      <div style="margin:16px 0 8px;font:800 11px/1 ${font};letter-spacing:.16em;color:var(--duke-ink-6);text-transform:uppercase">No order? One tap saves the visit</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${tags.map(([t]) => chip(t)).join('')}${chip('Routine Check', 'grid-column:1/-1;min-height:48px;text-align:center')}</div>`;
    document.body.append(sheet);
    return { ...out, sheet: box(sheet), chips: [...sheet.querySelectorAll('button')].map((b) => box(b)[3]), overflowX: document.documentElement.scrollWidth > innerWidth };
  }

  if (!phone) return { ...out, note: 'PC: the Manifest is already the left column - nothing to draw' };

  /* open / tucked / flag: the REAL drawer element becomes a left panel */
  const PANEL_W = Math.min(Math.round(innerWidth * 0.86), 340);
  imp(dr, { top: '0', bottom: '0', left: '0', right: 'auto', width: PANEL_W + 'px', height: '100%', 'border-top-width': '0', 'border-right-width': '4px',
    'box-shadow': '10px 0 30px rgba(0,0,0,.6)', transition: 'none', 'z-index': '150' });
  if (grip) {
    imp(grip.children[0], { display: 'none' });                                  /* the up/down pill means nothing sideways */
    const chev = grip.querySelector('svg:last-child'); if (chev) imp(chev, { transform: 'rotate(90deg)' });   /* points left: close */
  }
  if (state === 'open') {
    const s = scrim(149); imp(s, { left: PANEL_W + 'px' });
    makeTab(PANEL_W);
    return { ...out, panel: box(dr), list: box(dr.querySelector('.overflow-y-auto')), tab: [PANEL_W, TAB_TOP, TAB_W, TAB_H], overflowX: document.documentElement.scrollWidth > innerWidth };
  }
  imp(dr, { transform: `translateX(-${PANEL_W + 8}px)` });
  makeTab(0);
  const prod = $('[data-guide=products]');
  if (state === 'flag') {
    const f = document.createElement('div');
    imp(f, { position: 'fixed', left: TAB_W + 'px', top: (TAB_TOP + 10) + 'px', 'z-index': '151', 'max-width': `calc(100vw - ${TAB_W + 24}px)`,
      background: 'var(--duke-fill-panel)', border: '2px solid var(--duke-amber)', 'border-left': '0', 'border-radius': '0 10px 10px 0',
      padding: '8px 12px', 'box-shadow': '4px 6px 18px rgba(0,0,0,.55)', 'font-family': font, 'box-sizing': 'border-box' });
    f.innerHTML = `<div style="font:800 11px/1 ${font};letter-spacing:.14em;color:var(--duke-ink-6);text-transform:uppercase">Added · ${count} in manifest</div>
      <div style="font:900 14px/1.2 ${font};letter-spacing:.04em;text-transform:uppercase;margin-top:4px;color:var(--duke-ink-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">+1 ${lines[lines.length - 1] || ''}</div>
      <div style="font:900 18px/1 ${font};color:var(--duke-amber-ink);margin-top:4px">${total}</div>`;
    document.body.append(f);
    out.flag = box(f);
  }
  return { ...out, panel: box(dr), prod: box(prod), tab: [0, TAB_TOP, TAB_W, TAB_H], overflowX: document.documentElement.scrollWidth > innerWidth };
}
