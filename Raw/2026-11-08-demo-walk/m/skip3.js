/* TEST ONLY, this browser only: mark step 3 done (its save was refused) so steps 4+ can be walked */
const s = JSON.parse(localStorage.getItem('kpm-demo-mission') || '{}');
s.done = { ...(s.done || {}), 3: { qty: 50, who: 'DIKA SAPUTRA' } };
localStorage.setItem('kpm-demo-mission', JSON.stringify(s)); return s;
