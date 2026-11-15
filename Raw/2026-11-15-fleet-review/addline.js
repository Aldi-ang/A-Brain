/* the van-loading flow on this screen: one warehouse item -> the HOW MANY sheet -> its main key.
   Reports what the eye can see after each step (is the muatan list or MUAT VAN on screen?). */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const s = window.__sc;
const onScreen = (el) => { if (!el) return 'missing'; const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight ? 'ON SCREEN y' + Math.round(r.top) : 'off screen y' + Math.round(r.top); };
const slot = document.querySelector('.kpm-bay .slot[data-id]');
if (!slot) return 'no warehouse slot';
slot.scrollIntoView({ block: 'center' });
await wait(500);
const before = s.scrollTop;
const r = slot.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
const tap = async (el) => { const q = el.getBoundingClientRect(), X = q.left + q.width / 2, Y = q.top + q.height / 2; const ev = (type, C) => el.dispatchEvent(new C(type, { bubbles: true, cancelable: true, clientX: X, clientY: Y, pointerId: 1, pointerType: 'touch', isPrimary: true, button: 0 })); ev('pointerdown', PointerEvent); await wait(60); ev('pointerup', PointerEvent); ev('click', MouseEvent); await wait(900); return Math.round(Y); };
const y1 = await tap(slot);
const said1 = [...document.querySelectorAll('.kpm-bay .say.show')].map((e) => e.innerText.replace(/s+/g, ' '));
const vslot = [...document.querySelectorAll('.kpm-bay .slot[data-i]')].find((e) => !e.classList.contains('has')) || document.querySelector('.kpm-bay .slot[data-i]');
const vr = vslot && vslot.getBoundingClientRect();
const vanBoxSeen = vr ? (vr.bottom > 0 && vr.top < innerHeight ? 'ON SCREEN y' + Math.round(vr.top) : 'off screen y' + Math.round(vr.top)) : 'missing';
if (vslot) await tap(vslot);
const sheetBtn = [...document.querySelectorAll('button')].find((b) => /^\s*Masukkan/i.test(b.innerText || ''));
const step1 = { tap1y: y1, said1, vanBoxSeen, item: slot.innerText.replace(/\s+/g, ' ').slice(0, 40), sheet: sheetBtn ? sheetBtn.innerText.replace(/\s+/g, ' ') : 'no sheet', scrollTop: [before, s.scrollTop] };
if (!sheetBtn) return step1;
sheetBtn.click();
await wait(1500);
const man = document.querySelector('aside.man');
const go = document.querySelector('button.go');
return { ...step1, after: {
    muatanList: onScreen(man), loadKey: onScreen(go), loadKeyText: go?.innerText.replace(/\s+/g, ' '),
    lines: man ? [...man.querySelectorAll('li')].map((l) => l.innerText.replace(/\s+/g, ' ').slice(0, 50)) : [],
    said: [...document.querySelectorAll('.kpm-bay .say.show')].map((e) => e.innerText.replace(/\s+/g, ' ')),
    scrollTop: s.scrollTop, screen: innerHeight } };
