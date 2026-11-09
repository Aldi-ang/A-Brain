const v = document.querySelector('[data-guide="van"]');
return { slots: v ? [...v.querySelectorAll('.slot')].map((s) => s.className + (s.getAttribute('role') ? '[r]' : '') + JSON.stringify(s.dataset) + ' ' + (s.innerText || '').trim().slice(0, 12)).slice(0, 10) : 'none',
  cap: cap(), outer: v ? v.outerHTML.slice(0, 300) : null };
