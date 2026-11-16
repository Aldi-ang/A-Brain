const cs = getComputedStyle(document.documentElement);
const v = Object.fromEntries(['--panel','--raised','--inset','--line-1','--line-2','--line-3','--ink-dim','--accent-edge','--gold','--edge'].map(k => [k, cs.getPropertyValue(k).trim()]));
const p = document.querySelector('.kpm-fleet-panel');
const chain = []; let e = p; while (e && e !== document.body) { const s = getComputedStyle(e); if (s.transform !== 'none' || s.filter !== 'none' || s.backdropFilter !== 'none' || s.contain !== 'none' || s.willChange !== 'auto' || s.overflow !== 'visible' || s.zIndex !== 'auto') chain.push(`${e.tagName}.${String(e.className).slice(0,50)} t=${s.transform!=='none'} f=${s.filter} bf=${s.backdropFilter} ov=${s.overflow} z=${s.zIndex} pos=${s.position}`); e = e.parentElement; }
const body = document.querySelector('.kpm-fleet-body');
return { v, chain, tools: body?.firstElementChild?.className, bodyKids: [...(body?.children || [])].slice(0,3).map(c => c.className.slice(0,60)), panelKids: [...p.children].map(c => c.tagName + '.' + String(c.className).slice(0,40)) };
