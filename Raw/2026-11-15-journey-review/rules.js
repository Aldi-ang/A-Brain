const el = document.querySelector('.kx-find-key'), out = [];
const walk = (rules, media) => { for (const r of rules) { if (r instanceof CSSStyleRule) { if (r.style?.display) { try { if (el.matches(r.selectorText)) out.push((media ? "@" + media + " " : "") + r.selectorText.slice(0, 80) + " => " + r.style.display); } catch {} } } else if (r.cssRules && r.media) walk(r.cssRules, r.media.mediaText); else if (r.cssRules) walk(r.cssRules, media); else if (r.selectorText && r.style?.display) { try { if (el.matches(r.selectorText)) out.push((media ? '@' + media + ' ' : '') + r.selectorText.slice(0, 80) + ' => ' + r.style.display); } catch {} } } };
const sheets = [...document.styleSheets];
for (const s of sheets) { try { walk(s.cssRules, ''); } catch (e) { out.push('x ' + (s.href || 'inline')); } }
out.push('sheets ' + sheets.length + ', with kx-feed-line: ' + sheets.filter((s) => { try { return [...s.cssRules].some((r) => /kx-feed-line/.test(r.cssText)); } catch { return false; } }).length);
out.push('style tags naming expedition: ' + [...document.querySelectorAll('style[data-vite-dev-id]')].filter((s) => /expedition/.test(s.dataset.viteDevId)).map((s) => s.textContent.includes('kx-find-key')).join(','));
return out;
