/* TEST ONLY, this browser only: mark steps 6 and 7 done (6 has no way in for Dika) so step 8 can be walked */
const s = JSON.parse(localStorage.getItem('kpm-demo-mission') || '{}');
s.done = { ...(s.done || {}), 6: { who: 'DIKA SAPUTRA' }, 7: { who: 'DIKA SAPUTRA', damaged: 1 } };
localStorage.setItem('kpm-demo-mission', JSON.stringify(s)); return Object.keys(s.done);
