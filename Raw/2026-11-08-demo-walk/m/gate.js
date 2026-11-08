/* the person's own vault gate after a SWITCH: type the demo password and open */
const g = await wait(() => document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); if (!g) return { noGate: true, text: document.body.innerText.slice(0, 200) };
const shown = document.body.innerText.match(/Demo vault password[^\n]*/i)?.[0] || null;
set(g, 'admin123'); await sleep(300); any(/Open the vault/i)[0]?.click();
await wait(() => !document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); await sleep(4000);
const ct = document.querySelector('.kpm-ct');
return { shown, talk: ct?.querySelector('p')?.innerText, mission: document.querySelector('.kpm-mission')?.innerText.replace(/\n+/g, ' / '), bar: document.querySelector('.kpm-demo-bar')?.innerText.replace(/\n+/g, ' / ') };
