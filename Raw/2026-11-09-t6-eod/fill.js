/* one card of the EOD deck, the way a salesman does it: every transfer ticked as landed, every count line filled to what it
   carried (the box clamps), the cash box = 0 unless it already has a number; then the gold button. Repeat until the letter can send. */
const send = document.querySelector('[data-guide="send"]');
if (send && vis(send) && !send.disabled) return { ready: true, send: send.innerText.trim() };
const deck = document.querySelector('[data-guide="deck"]'); if (!deck) return { noDeck: true, text: document.body.innerText.slice(0, 300) };
const did = [];
for (const row of deck.querySelectorAll('div.rounded-md')) {
  const b = [...row.querySelectorAll('button')].filter((x) => vis(x) && !x.disabled);
  if (b.length === 3 && !b.some((x) => x.className.includes('accent-edge') || x.className.includes('danger-plate'))) { b[0].click(); did.push('tick ' + b[0].innerText.trim()); await sleep(150); }
}
for (const i of [...deck.querySelectorAll('input')].filter((x) => vis(x) && !x.disabled && x.value === '')) {
  set(i, /counted$/.test(i.getAttribute('aria-label') || '') ? 99999 : 0); did.push('typed ' + (i.getAttribute('aria-label') || 'cash')); await sleep(150);
}
await sleep(400);
const gold = [...document.querySelectorAll('button')].filter((x) => vis(x) && /in the letter/i.test(x.innerText)).pop()
  || [...document.querySelectorAll('button')].filter((x) => vis(x) && /first|count|Enter what/i.test(x.innerText)).pop();
const label = gold?.innerText.trim();
if (gold && !gold.disabled) { gold.click(); did.push('pressed ' + label); } else did.push('gold not ready: ' + label);
await sleep(1200);
return { did, sendNow: document.querySelector('[data-guide="send"]')?.innerText.trim() || null };
