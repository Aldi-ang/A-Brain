/* LAB ONLY: mark guide steps 1 and 2 done for today (the guide's own localStorage record), so step 3 - the van load on the
   new ledger - is the live step without re-walking the Restock Vault. window.__done3 = true also marks 3 (to replay it, do not set it). */
const day = new Date(Date.now() + 7 * 3600e3 - 5 * 60e3).toISOString().slice(0, 10);
localStorage.setItem('kpm-demo-mission', JSON.stringify({ day, done: { 1: { qty: 100, name: 'Cello Chocolate' }, 2: { qty: 50, name: 'Cello Chocolate', to: 'Bandung' } } }));
setTimeout(() => location.reload(), 50);
return 'steps 1-2 marked done for ' + day;
