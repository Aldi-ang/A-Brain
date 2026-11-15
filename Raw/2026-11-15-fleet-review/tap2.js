/* load flow, tap 2: the empty van square (scrolled to, as the thumb must today), the HOW MANY sheet, 100 Bks, Masukkan.
   Nothing is written - stock only moves on MUAT VAN, which is never pressed here.
   Then the van square stays where the eye is; report where the muatan list + MUAT VAN are, and the jump bar. */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const seen = (el) => { if (!el) return 'missing'; const r = el.getBoundingClientRect(); return (r.bottom > 0 && r.top + 40 < innerHeight ? 'ON SCREEN' : 'UNDER THE SCREEN') + ' y' + Math.round(r.top); };
const vslot = [...document.querySelectorAll('.kpm-bay .slot[data-i]')].find((e) => !e.classList.contains('has'));
if (!vslot) return 'no empty van square';
vslot.scrollIntoView({ block: 'nearest' });
await wait(400);
const q = vslot.getBoundingClientRect(), X = q.left + q.width / 2, Y = q.top + q.height / 2;
const ev = (type, C) => vslot.dispatchEvent(new C(type, { bubbles: true, cancelable: true, clientX: X, clientY: Y, pointerId: 1, pointerType: 'touch', isPrimary: true, button: 0 }));
ev('pointerdown', PointerEvent); await wait(60); ev('pointerup', PointerEvent); ev('click', MouseEvent);
await wait(900);
const inp = document.querySelector('.kpm-bay-sheet input');
if (!inp) return { sheet: 'did not open', said: [...document.querySelectorAll('.kpm-bay .say.show')].map((e) => e.innerText) };
Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, '100');
inp.dispatchEvent(new Event('input', { bubbles: true }));
await wait(400);
const ok = [...document.querySelectorAll('.kpm-bay-sheet button')].find((b) => /^\s*Masukkan/i.test(b.innerText || ''));
const okText = ok?.innerText.replace(/\s+/g, ' ');
ok?.click();
await wait(1200);
vslot.scrollIntoView({ block: 'nearest' });
await wait(700);
const jump = document.querySelector('.kpm-bay-jump');
return {
    okText, lines: [...document.querySelectorAll('aside.man ol.lines li')].map((l) => l.innerText.replace(/\s+/g, ' ').slice(0, 60)),
    vanSquare: seen(vslot), muatanList: seen(document.querySelector('aside.man')), muatVan: seen(document.querySelector('button.go')),
    jumpBar: jump ? jump.innerText.replace(/\s+/g, ' ') + ' @' + seen(jump) : 'none', screen: innerHeight,
};
