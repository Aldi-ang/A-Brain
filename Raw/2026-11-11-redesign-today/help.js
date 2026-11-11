window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const any = (re, root = document) => [...root.querySelectorAll('button,[role="button"],a,[role="menuitem"],[role="option"],[role="tab"]')].filter((b) => vis(b) && re.test((b.getAttribute('aria-label') || b.innerText || '').trim()));
  const wait = async (fn, ms = 15000) => { for (let t = 0; t < ms; t += 200) { const v = fn(); if (v) return v; await sleep(200); } return null; };
  const wide = () => { const W = innerWidth; const seen = [];
    for (const e of document.querySelectorAll('body *')) { const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0 || r.right <= W + 2) continue;
      if (/merch|w-32 h-32/.test(String(e.className))) continue;
      let p = e.parentElement, clipped = false; while (p && p !== document.body) { const s = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 2) { clipped = true; break; } } p = p.parentElement; }
      if (clipped) continue; seen.push({ tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 50), text: (e.innerText || '').trim().slice(0, 30), right: Math.round(r.right) }); if (seen.length > 6) break; }
    return seen; };
  const toasts = () => [...document.querySelectorAll('[role="status"],[role="alert"],[data-sonner-toast]')].filter(vis).map((t) => t.innerText.trim().replace(/\n+/g, ' / ').slice(0, 160)).filter(Boolean);
  const stat = () => ({ sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, y: Math.round(scrollY), wide: wide(), toasts: toasts() });
  /* the guide: its box text, which beat, and the square */
  const cap = () => { const c = document.querySelector('.kpm-mx-cap'); const ring = document.querySelector('.kpm-mx-ring'); const rr = ring?.getBoundingClientRect(); const cr = c?.getBoundingClientRect();
    return c ? { say: c.querySelector('p')?.innerText, beat: c.querySelector('.notch')?.getAttribute('aria-label'), step: c.querySelector('b')?.innerText,
      ring: rr ? [Math.round(rr.left), Math.round(rr.top), Math.round(rr.width), Math.round(rr.height)] : null, box: [Math.round(cr.left), Math.round(cr.top), Math.round(cr.width), Math.round(cr.height)] } : null; };
  const click = (el) => { if (!el) return false; el.click(); window.dispatchEvent(new PointerEvent('pointerup')); return true; };
  return { sleep, set, any, wait, stat, vis, cap, click, wide }; })();
