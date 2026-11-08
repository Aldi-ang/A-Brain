await sleep(900);
const ct = document.querySelector('.kpm-ct'); const gate = document.querySelector('input[placeholder="MASTER PASSWORD"]');
return { cap: cap(), talk: ct ? { line: ct.querySelector('p')?.innerText, choices: !!ct.querySelector('.choices') } : null, gate: !!gate,
  mission: document.querySelector('.kpm-mission')?.innerText.replace(/\n+/g, ' / '),
  title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim()).slice(0, 3),
  alert: document.querySelector('[role="alertdialog"]')?.innerText.slice(0, 200), stat: stat() };
