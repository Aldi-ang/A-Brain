const d = (sel) => { const b = document.querySelector(sel); if (!b) return 'none';
  return [...b.querySelectorAll('*')].filter((e) => vis(e) && e.children.length <= 3).slice(0, 14).map((e) => e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0, 3).join('.') + (e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : '') + (e.dataset && Object.keys(e.dataset).length ? JSON.stringify(e.dataset) : '') + ' "' + (e.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 24) + '"'); };
return { wh: d('[data-guide="wh"]'), van: d('[data-guide="van"]') };
