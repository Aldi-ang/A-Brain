// node sum.cjs phone-T2.json  -> one line per screen: heads, overflow, toasts, bad words, errors, book, lessons
const o = require('./' + process.argv[2]);
const f = (v) => JSON.stringify(v);
const W = (s) => (s?.wide || []).filter((x) => !/merch|w-32 h-32/.test(x.cls));
console.log(o.mode, o.tier, 'nav:', (o.nav || []).map((n) => n.id).join(','));
console.log('greet', f(o.greet)); console.log('guide', f(o.guide && { say: o.guide.say, ring: o.guide.ring, box: o.guide.box }));
for (const [k, s] of Object.entries(o.screens)) {
  const L = Object.entries(s.lessons || {}).map(([t, l]) => `${t}[${f(l.open?.box)} wide=${f(W(l.open?.stat)).slice(0, 80)} bad=${f(l.mid?.stat?.bad || []).slice(0, 80)}]`).join(' ');
  console.log(`- ${k} | ${String(f(s.heads)).slice(0, 90)} | sw ${s.stat?.sw} | wide ${String(f(W(s.stat))).slice(0, 160)} | toast ${String(f(s.stat?.toasts)).slice(0, 120)} | bad ${String(f(s.stat?.bad)).slice(0, 160)} | empty ${String(f(s.empty)).slice(0, 120)} | err ${String(f(s.errors)).slice(0, 240)} | book ${typeof s.book === 'object' ? s.book.text.slice(0, 60) : s.book} | ${L}`);
}
