/* load flow, tap 1: the first warehouse item, centred as a thumb would find it, one tap.
   Reports where the van square for tap 2 is afterwards (on or under the screen), and the muatan lines already there. */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const seen = (el) => { if (!el) return 'missing'; const r = el.getBoundingClientRect(); return (r.bottom > 0 && r.top + 40 < innerHeight ? 'ON SCREEN' : 'UNDER THE SCREEN') + ' y' + Math.round(r.top); };
/* a muatan kept from an earlier run (the bay keeps its draft) is emptied first, so every frame starts at 0 lines */
let cleared = 0;
for (const t of document.querySelectorAll('aside.man ol.lines .trash')) { t.click(); cleared++; await wait(400); }
if (cleared) await wait(4500);   /* its "keluar dari muatan" message fades before the frame */
const linesBefore = document.querySelectorAll('aside.man ol.lines li').length;
const slot = document.querySelector('.kpm-bay .slot[data-id]');
if (!slot) return 'no warehouse slot';
slot.scrollIntoView({ block: 'center' });
await wait(500);
const q = slot.getBoundingClientRect(), X = q.left + q.width / 2, Y = q.top + q.height / 2;
const ev = (type, C) => slot.dispatchEvent(new C(type, { bubbles: true, cancelable: true, clientX: X, clientY: Y, pointerId: 1, pointerType: 'touch', isPrimary: true, button: 0 }));
ev('pointerdown', PointerEvent); await wait(60); ev('pointerup', PointerEvent); ev('click', MouseEvent);
await wait(1400);
const vslot = [...document.querySelectorAll('.kpm-bay .slot[data-i]')].find((e) => !e.classList.contains('has'));
return {
    linesBefore, tappedAt: Math.round(Y), item: slot.innerText.replace(/\s+/g, ' ').slice(0, 30),
    said: [...document.querySelectorAll('.kpm-bay .say.show')].map((e) => e.innerText.replace(/\s+/g, ' ')),
    vanSquare: seen(vslot), screen: innerHeight,
};
