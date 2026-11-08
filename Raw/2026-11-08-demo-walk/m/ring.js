/* tap whatever the guide's square is round, like a visitor following it: return the square's middle for a real tap */
const ring = document.querySelector('.kpm-mx-ring'); if (!ring) return { noRing: true, cap: cap() };
const r = ring.getBoundingClientRect(); const x = Math.min(r.left + r.width / 2, innerWidth - 4), y = r.top + Math.min(r.height / 2, 40);
const el = document.elementsFromPoint(x, y).find((e) => !e.classList.contains('kpm-mx-ring') && !e.classList.contains('kpm-mx-veil'));
const target = el?.closest('button,[role="button"],a,input,select,label,[data-mark],[data-agent],td,tr') || el;
return { before: cap(), pressing: (target?.getAttribute('aria-label') || target?.innerText || target?.tagName || '').trim().slice(0, 60), tap: [Math.round(x), Math.round(y)] };
