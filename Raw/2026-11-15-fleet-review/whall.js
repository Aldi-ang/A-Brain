/* the warehouse chest, every page: name + stock of each box */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const read = () => [...document.querySelectorAll('.kpm-bay .slot[data-id]')].map((s) => s.innerText.replace(/\s+/g, ' ').trim());
const out = [read()];
const keys = [...document.querySelectorAll('.kpm-bay .pg')].filter((b) => /^\d+$/.test(b.innerText.trim()));
const p2 = keys.find((b) => b.innerText.trim() === '2');
if (p2) { p2.click(); await wait(900); out.push(read()); p2.parentElement.querySelector('.pg')?.click(); }
return { head: document.querySelector('.kpm-bay')?.innerText.split('\n').slice(0, 2), out };
