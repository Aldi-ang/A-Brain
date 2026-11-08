return { marks: [...new Set([...document.querySelectorAll('[data-mark]')].map((e) => e.dataset.mark + '=' + (e.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 24)))],
  nixies: [...document.querySelectorAll('.kpm-nixie')].map((n) => n.getAttribute('aria-label')),
  dialog: document.querySelector('.kpm-ct p')?.innerText?.slice(0, 80) };
