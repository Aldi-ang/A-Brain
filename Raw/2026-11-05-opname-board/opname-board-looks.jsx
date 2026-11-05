/* LAB ONLY - the three looks of his Stock Opname board, 2026-11-05 ("this one panel show regional warehouse stock opname status one
   by one, swap able with animation and swap button, futuristic panel"). Opened on the REAL screen, in place of the pending list:
   `?shell&opname&admin&tab=hq%20audits&board=a|b|c`. Nothing here ships. When he picks, the look moves into StockOpnameView and this
   file is deleted. The numbers are real sums from countedDiffs + the Quarantine price rule (priceDistributor || hpp || costPrice). */
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuarantineHatch, still } from '../src/components/QuarantineSwitch.jsx';
import { ToastHost, notify } from '../src/components/Toast.jsx';
import { ConfirmHost, promptAction } from '../src/components/ConfirmGate.jsx';
import { formatRupiah, formatNumber } from '../src/utils/helpers.js';
import { countedDiffs } from '../src/utils/supply.js';

const item = (name, price, expectedStock, goodCount, expectedDamagedStock, damagedCount, st, extra = {}) =>
  ({ id: name, name, priceDistributor: price, expectedStock, goodCount, expectedDamagedStock, damagedCount, st, ...extra });
const WH = [
  { id: 'HQ', name: 'HEADQUARTERS', by: 'Counted by Yoga · Mon 09:02', items: [
    item('Djarum Coklat 12', 12500, 1800, 1794, 12, 12, 'wait'),
    item('Cello Green 16', 8900, 4200, 4200, 0, 0, 'wait'),
    item('Gudang Garam Surya 16', 21500, 2400, 2400, 0, 0, 'wait'),
    item('Sampoerna Mild 16', 24800, 2400, 2400, 0, 0, 'ok'),
    item('Dji Sam Soe 12', 19900, 2400, 2400, 0, 0, 'ok'),
  ] },
  { id: 'BDG', name: 'BANDUNG', by: 'Counted by Dewi · Mon 08:14', items: [
    item('Djarum Coklat 12', 12500, 1800, 1790, 12, 14, 'wait', { damageKinds: [{ reason: 'Crushed', qty: 2 }] }),
    item('Cello Green 16', 8900, 420, 415, 0, 3, 'wait', { damageKinds: [{ reason: 'Torn', qty: 2 }, { reason: 'Wet', qty: 1 }] }),
    item('Dji Sam Soe 12', 19900, 340, 340, 0, 0, 'wait'),
    item('Sampoerna Mild 16', 24800, 600, 588, 4, 4, 'no', { reason: 'Recount shelf B.' }),
    item('Gudang Garam Surya 16', 21500, 900, 900, 0, 0, 'ok'),
    item('LA Lights 16', 22300, 510, 510, 2, 2, 'ok'),
    item('Magnum Filter 12', 16400, 0, 0, 0, 0, 'none'),
  ] },
  { id: 'SMG', name: 'SEMARANG', by: 'Counted by Rina · Mon 07:50', items: [
    item('Djarum Coklat 12', 12500, 760, 760, 0, 1, 'ok', { damageKinds: [{ reason: 'Wet', qty: 1 }] }),
    item('Cello Green 16', 8900, 300, 300, 0, 0, 'ok'),
    item('Dji Sam Soe 12', 19900, 150, 150, 0, 0, 'ok'),
    item('LA Lights 16', 22300, 210, 210, 0, 0, 'ok'),
  ] },
  { id: 'SLO', name: 'SOLO', by: 'No count yet this week', items: [] },
];

/* a pack short across good + damaged is missing; a new damaged pack is damaged; both cost the Quarantine price */
const loss = (i) => {
  const { good, damaged } = countedDiffs(i), price = Number(i.priceDistributor || i.hpp || i.costPrice || 0);
  const missing = Math.max(0, -(good + damaged)), hurt = Math.max(0, damaged);
  return { missing, hurt, missingRp: missing * price, hurtRp: hurt * price, money: (missing + hurt) * price };
};
/* a product sent back is being recounted, so its money is not a loss yet */
const sums = (w) => w.items.filter((i) => i.st === 'wait' || i.st === 'ok').map(loss).reduce((a, l) => ({ missing: a.missing + l.missing, hurt: a.hurt + l.hurt, missingRp: a.missingRp + l.missingRp, hurtRp: a.hurtRp + l.hurtRp, money: a.money + l.money }), { missing: 0, hurt: 0, missingRp: 0, hurtRp: 0, money: 0 });
const tally = (w) => ({ total: w.items.length, counted: w.items.filter((i) => i.st !== 'none').length, decided: w.items.filter((i) => i.st === 'ok' || i.st === 'no').length, waiting: w.items.filter((i) => i.st === 'wait').length });
const signed = (n) => (n > 0 ? `+${formatNumber(n)}` : n < 0 ? `-${formatNumber(-n)}` : '0');

const CSS = `
.brd-host { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 2px 1px 28px; }
.brd-panel { position: relative; background: var(--sunk); border: 1px solid var(--line); border-radius: 6px; padding: 14px; }
.brd-ticks { position: absolute; inset: -1px; pointer-events: none; border-radius: 6px; background-repeat: no-repeat; background-image:
  linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge)),
  linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge)), linear-gradient(var(--accent-edge), var(--accent-edge));
  background-size: 16px 2px, 2px 16px, 16px 2px, 2px 16px, 16px 2px, 2px 16px, 16px 2px, 2px 16px;
  background-position: 0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%; }
.brd-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.brd-name { font-size: 26px; line-height: 1.05; font-weight: 700; letter-spacing: .07em; color: var(--ink); overflow-wrap: anywhere; }
.brd-by { font-size: 13px; line-height: 1.3; color: var(--ink-dim); margin-top: 6px; font-weight: 600; }
.brd-meter { display: flex; gap: 3px; margin-top: 14px; }
.brd-seg { flex: 1; height: 10px; border-radius: 1px; border: 1px solid var(--accent-edge); }
.brd-seg.ok { background: var(--gold); border-color: var(--gold); }
.brd-seg.no { background: var(--danger); border-color: var(--danger); }
.brd-seg.none { border: 1px dashed var(--line-2, var(--line)); }
.brd-cnt { display: flex; justify-content: space-between; gap: 8px; margin-top: 7px; font-size: 13px; font-weight: 700; color: var(--ink); }
.brd-lost { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); }
.brd-lost small { display: block; font-size: 11px; font-weight: 700; letter-spacing: .14em; color: var(--ink-dim); }
.brd-lost b { display: block; font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: 30px; line-height: 1.15; font-weight: 800; color: var(--danger-ink); letter-spacing: -.01em; }
.brd-lost b.zero { color: var(--ink); }
.brd-lost > span { display: block; margin-top: 3px; font-size: 13px; font-weight: 600; color: var(--ink-dim); font-variant-numeric: tabular-nums; }
.brd-win { display: inline-grid; overflow: hidden; vertical-align: top; max-width: 100%; }
.brd-win > * { grid-area: 1 / 1; }

.brd-rows { container-type: inline-size; display: grid; gap: 8px; margin-top: 10px; }
.brd-row { background: var(--raised); border: 1px solid var(--line); border-radius: 6px; padding: 12px; display: grid; gap: 10px; }
.brd-row.none { border-style: dashed; background: transparent; }
.brd-nm { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-width: 0; }
.brd-nm > b { font-size: 15px; line-height: 1.2; font-weight: 700; color: var(--ink); text-transform: uppercase; letter-spacing: .03em; }
.brd-row.none .brd-nm > b, .brd-row.none .brd-nm > span { color: var(--ink-dim); }
.brd-nm > span { flex: none; font-size: 11px; font-weight: 800; letter-spacing: .1em; color: var(--ink-dim); white-space: nowrap; }
.brd-stamp { flex: none; font-size: 11px; font-weight: 800; letter-spacing: .1em; padding: 3px 7px; border: 1px solid currentColor; border-radius: 3px; white-space: nowrap; }
.brd-stamp.ok { color: var(--accent-ink); }
.brd-stamp.no { color: var(--danger-ink); }
.brd-tbl { display: grid; grid-template-columns: 1fr 60px 56px 78px; gap: 4px 6px; align-items: baseline; font-variant-numeric: tabular-nums; }
.brd-tbl > small { font-size: 11px; font-weight: 700; color: var(--ink-dim); letter-spacing: .04em; text-align: right; }
.brd-tbl > em { font-style: normal; font-size: 13px; font-weight: 700; color: var(--ink-dim); }
.brd-tbl > i { font-style: normal; font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--ink); text-align: right; }
.brd-tbl > i.bad { color: var(--danger-ink); font-weight: 800; }
.brd-tbl > i.dim { color: var(--ink-dim); }
.brd-loss { display: grid; gap: 6px; }
.brd-loss > p { margin: 0; font-size: 14px; font-weight: 700; color: var(--danger-ink); font-variant-numeric: tabular-nums; line-height: 1.3; }
.brd-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.brd-chips > span { font-size: 11px; font-weight: 700; letter-spacing: .05em; padding: 3px 7px; border-radius: 3px; border: 1px solid var(--danger); color: var(--danger-ink); }
.brd-why { margin: 0; font-size: 13px; font-weight: 600; color: var(--ink-dim); line-height: 1.3; }
.brd-act { display: flex; gap: 8px; }
.brd-act button { flex: 1; min-height: 44px; border-radius: 5px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 800; letter-spacing: .1em; transition: transform 120ms ease-out; cursor: pointer; }
.brd-act button:active { transform: scale(.97); }
.brd-rej { background: transparent; border: 1px solid var(--danger); color: var(--danger-ink); }
.brd-acc { background: var(--duke-fill-plank); border: 1px solid var(--accent-edge); color: var(--accent-ink); }
.brd-row.same { grid-template-columns: 1fr auto; align-items: center; }
.brd-row.same .brd-nm { display: block; }
.brd-row.same .brd-nm > span { display: block; margin-top: 3px; font-weight: 700; letter-spacing: .02em; font-size: 13px; }
.brd-row.same .brd-act button { flex: none; width: 44px; }
@container (min-width: 700px) {
  .brd-row:not(.same):not(.none) { grid-template-columns: minmax(130px, 1fr) 300px minmax(150px, 1fr) 214px; align-items: center; gap: 14px; }
  .brd-nm { flex-direction: column; align-items: flex-start; gap: 5px; }
  .brd-row.none, .brd-row.same { grid-template-columns: 1fr auto; align-items: center; }
  .brd-act button { min-height: 40px; }
}

/* A: the hatch he loves, on the panel's corner; a scan line changes the box */
.brd-hatchslot { flex: none; width: 124px; height: 106px; position: relative; z-index: 5; --next: "SEMARANG"; }
.brd-hatchslot .lbl { font-size: 0 !important; }
.brd-hatchslot .lbl::after { content: var(--next); font-size: 9.5px; letter-spacing: .04em; }
.brd-stage { position: relative; }
.brd-old { position: absolute; left: 0; right: 0; top: 0; z-index: 2; }
.brd-line { position: absolute; left: -6px; right: -6px; top: 0; height: 2px; background: var(--accent-edge); z-index: 4; pointer-events: none; opacity: 0; }
@media (min-width: 1024px) {
  .brd-a .brd-pair { display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 12px; align-items: start; }
  .brd-a .brd-rows { margin-top: 0; }
  .brd-a .brd-pair > .brd-panel { position: sticky; top: 8px; }
  .brd-a .brd-top { flex-direction: column; align-items: stretch; }
  .brd-a .brd-hatchslot { align-self: center; margin-top: 6px; }
}

/* B: every warehouse on a rail of lit plates; the panel slides like the header clock */
.brd-rail { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin-bottom: 10px; padding-bottom: 1px; }
.brd-rail::-webkit-scrollbar { display: none; }
.brd-plate { flex: 0 0 136px; min-height: 60px; text-align: left; background: var(--raised); border: 1px solid var(--line); border-radius: 5px; padding: 8px 10px; cursor: pointer; transition: transform 120ms ease-out; }
.brd-plate:active { transform: scale(.97); }
.brd-plate.on { border-color: var(--accent-edge); box-shadow: inset 0 -2px 0 var(--accent-edge); }
.brd-plate b { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; letter-spacing: .06em; color: var(--ink); white-space: nowrap; }
.brd-plate b i { flex: none; width: 8px; height: 8px; border-radius: 50%; border: 1px solid var(--line-2, var(--line)); }
.brd-plate b i.wait { background: var(--gold); border-color: var(--gold); }
.brd-plate b i.done { background: var(--ink); border-color: var(--ink); }
.brd-plate small { display: block; margin-top: 5px; font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--ink-dim); font-variant-numeric: tabular-nums; }
.brd-plate small.bad { color: var(--danger-ink); }
.brd-arrows { flex: none; display: flex; gap: 6px; }
.brd-arrows button { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 5px; background: var(--duke-fill-plank); border: 1px solid var(--accent-edge); color: var(--accent-ink); cursor: pointer; transition: transform 120ms ease-out; }
.brd-arrows button:active { transform: scale(.97); }
@media (min-width: 1024px) {
  .brd-plate { flex: 1 1 0; }
  .brd-b .brd-head, .brd-c .brd-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); gap: 22px; align-items: start; }
  .brd-b .brd-meter, .brd-c .brd-meter { margin-top: 4px; }
  .brd-b .brd-lost, .brd-c .brd-lost { margin-top: 0; padding-top: 0; border-top: 0; }
}

/* C: warehouses are a deck; the next two show their edges, and the edge you press becomes the card */
.brd-c { position: relative; padding-top: 58px; }
.brd-edge { position: absolute; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; height: 46px; padding: 7px 12px 0; border: 1px solid var(--line); border-bottom: 0; border-radius: 6px 6px 0 0; background: var(--raised); color: var(--ink-dim); font-size: 12px; font-weight: 800; letter-spacing: .08em; cursor: pointer; text-align: left; }
.brd-edge.e2 { top: 0; left: 18px; right: 18px; }
.brd-edge.e1 { top: 28px; left: 8px; right: 8px; color: var(--ink); background: color-mix(in srgb, var(--raised) 70%, var(--sunk)); }
.brd-edge small { font-family: var(--font-mono); font-size: 11px; font-weight: 700; }
.brd-edge small.bad { color: var(--danger-ink); }
.brd-card { position: relative; transform-origin: 50% 0; }
.brd-gone { position: absolute; left: 0; right: 0; top: 58px; z-index: 3; transform-origin: 20% 0; }
`;

const Meter = ({ w }) => <div className="brd-meter" aria-hidden="true">{w.items.length ? w.items.map((i) => <i key={i.id} className={`brd-seg ${i.st}`} />) : Array.from({ length: 7 }, (_, k) => <i key={k} className="brd-seg none" />)}</div>;

function Row({ i, onDecide }) {
  if (i.st === 'none') return <div className="brd-row none"><div className="brd-nm"><b>{i.name}</b></div><div className="brd-nm"><span>NOT COUNTED</span></div></div>;
  const { good, damaged } = countedDiffs(i), l = loss(i), same = !good && !damaged, hasD = Number(i.expectedDamagedStock) > 0 || Number(i.damagedCount) > 0;
  const stamp = i.st === 'ok' ? <span className="brd-stamp ok">ACCEPTED</span> : i.st === 'no' ? <span className="brd-stamp no">SENT BACK</span> : null;
  if (same && i.st !== 'no') return (
    <div className="brd-row same">
      <div className="brd-nm"><b>{i.name}</b><span>Matches · {formatNumber(i.goodCount)}{hasD ? ` good, ${formatNumber(i.damagedCount)} damaged` : ''}</span></div>
      {stamp || <div className="brd-act">
        <button className="brd-rej" aria-label={`Reject ${i.name}`} onClick={() => onDecide(i, 'no')}><X size={16} /></button>
        <button className="brd-acc" aria-label={`Accept ${i.name}`} onClick={() => onDecide(i, 'ok')}><Check size={16} /></button>
      </div>}
    </div>
  );
  const parts = [l.missing && `${formatNumber(l.missing)} missing`, l.hurt && `${formatNumber(l.hurt)} damaged`].filter(Boolean).join(' + ');
  return (
    <div className={`brd-row ${i.st}`}>
      <div className="brd-nm"><b>{i.name}</b>{stamp || <span>WAITING</span>}</div>
      <div className="brd-tbl">
        <em />
        <small>Expected</small><small>Found</small><small>Difference</small>
        <em>Good</em><i>{formatNumber(i.expectedStock)}</i><i>{formatNumber(i.goodCount)}</i><i className={good ? 'bad' : 'dim'}>{signed(good)}</i>
        {hasD && <><em>Damaged</em><i>{formatNumber(i.expectedDamagedStock)}</i><i>{formatNumber(i.damagedCount)}</i><i className={damaged ? 'bad' : 'dim'}>{signed(damaged)}</i></>}
      </div>
      <div className="brd-loss">
        {parts && <p>{parts} = {formatRupiah(l.money)}</p>}
        {i.damageKinds?.length > 0 && <div className="brd-chips">{i.damageKinds.map((k) => <span key={k.reason}>{k.reason} · {k.qty}</span>)}</div>}
        {i.st === 'no' && <p className="brd-why">Only this product goes back: {i.reason}</p>}
      </div>
      {i.st === 'wait' && <div className="brd-act">
        <button className="brd-rej" onClick={() => onDecide(i, 'no')}><X size={15} /><span>REJECT</span></button>
        <button className="brd-acc" onClick={() => onDecide(i, 'ok')}><Check size={15} /><span>ACCEPT</span></button>
      </div>}
    </div>
  );
}
const Rows = ({ w, onDecide }) => w.items.length
  ? <div className="brd-rows">{w.items.map((i) => <Row key={i.id} i={i} onDecide={onDecide} />)}</div>
  : <div className="brd-rows"><div className="brd-row none"><div className="brd-nm"><b>Nothing to check yet</b></div><p className="brd-why">The count opens on Stock Opname day. This warehouse's team leader submits it.</p></div></div>;
const Lost = ({ w, face }) => { const s = sums(w); return (
  <div className="brd-lost"><small>LOST VALUE</small>
    <b className={s.money ? '' : 'zero'}>{face || formatRupiah(s.money)}</b>
    <span>{s.money ? [s.missing && `${formatNumber(s.missing)} missing ${formatRupiah(s.missingRp)}`, s.hurt && `${formatNumber(s.hurt)} damaged ${formatRupiah(s.hurtRp)}`].filter(Boolean).join(' · ') : tally(w).total ? 'Nothing lost so far' : 'No count yet'}</span>
  </div>); };
const Tally = ({ w }) => { const t = tally(w); return <div className="brd-cnt"><span>{t.total ? `${t.counted} of ${t.total} counted` : 'Not counted'}</span>{t.total > 0 && <span>{t.decided} of {t.counted} decided</span>}</div>; };

const IN = 'cubic-bezier(.55, 0, .85, .35)', OUT = 'cubic-bezier(.23, 1, .32, 1)', ROLL = 'cubic-bezier(.2, .9, .2, 1)';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const paint = () => Promise.race([new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))), wait(80)]);   // a hidden tab has no frames, and a swap must never hang on one

function Board({ look }) {
  const [data, setData] = useState(WH), [at, setAt] = useState(1), [prev, setPrev] = useState(null), [nextName, setNextName] = useState(WH[2].name);
  const busy = useRef(false), hatch = useRef(null), stage = useRef(null), old = useRef(null), line = useRef(null), card = useRef(null);
  const w = data[at], n = data.length;
  const decide = async (i, st) => {
    let reason = '';
    if (st === 'no') { reason = await promptAction(`Why does ${i.name} go back? Only this product is recounted.`); if (reason === null) return; }
    setData((d) => d.map((x, k) => (k !== at ? x : { ...x, items: x.items.map((y) => (y.id === i.id ? { ...y, st, reason: reason || 'Discrepancy too high.' } : y)) })));
    notify(st === 'ok' ? `Accepted: ${i.name} at ${w.name}. Good stock and Quarantine become what was counted.` : `Sent back: ${i.name}. ${w.by.split(' · ')[0].replace('Counted by ', '')} recounts only this product.`);
  };
  const lockedSwap = async (fn) => { if (busy.current) return; busy.current = true; try { await fn(); } finally { busy.current = false; setPrev(null); } };

  const goA = () => lockedSwap(async () => {
    const to = (at + 1) % n;
    if (still()) { setAt(to); setNextName(data[(to + 1) % n].name); return; }
    hatch.current?.press('ok');
    setTimeout(() => setNextName(data[(to + 1) % n].name), 560);   // behind the hatch's shut doors
    await wait(130);
    setPrev(data[at]); setAt(to);
    await paint();
    const box = stage.current.getBoundingClientRect(), h = Math.min(box.height, innerHeight - Math.max(0, box.top));   // only what is on screen
    const o = { id: 'brd-scan', duration: 500, easing: 'cubic-bezier(.2, .8, .3, 1)', fill: 'forwards' };
    line.current.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${h}px)`, opacity: 1 }], o);
    const a = old.current.animate([{ clipPath: 'inset(0 -8px 0 -8px)' }, { clipPath: `inset(${h}px -8px 0 -8px)` }], o);
    await Promise.race([a.finished.catch(() => {}), wait(650)]);
    await wait(760);   // the hatch rides back up
  });
  const goB = (to) => lockedSwap(async () => {
    if (to === at) return;
    if (still()) { setAt(to); return; }
    setPrev(data[at]); setAt(to);
    await paint();
    const o = { id: 'brd-roll', duration: 320, easing: ROLL, fill: 'both' }, all = [];
    stage.current.querySelectorAll('.brd-face-old').forEach((e) => all.push(e.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], o)));
    stage.current.querySelectorAll('.brd-face-new').forEach((e) => all.push(e.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], o)));
    stage.current.querySelectorAll('.brd-row').forEach((e, k) => all.push(e.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { id: 'brd-roll', duration: 260, delay: Math.min(k, 7) * 35, easing: OUT, fill: 'both' })));
    await Promise.race([Promise.all(all.map((a) => a.finished.catch(() => {}))), wait(900)]);
    all.forEach((a) => a.cancel());
  });
  const goC = (to) => lockedSwap(async () => {
    if (still()) { setAt(to); return; }
    setPrev(data[at]); setAt(to);
    await paint();
    const a = old.current.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-108%) rotate(-3deg)', opacity: 1 }], { id: 'brd-deck', duration: 300, easing: IN, fill: 'forwards' });
    const b = card.current.animate([{ transform: 'translateY(-24px) scale(.965)', opacity: .7 }, { transform: 'none', opacity: 1 }], { id: 'brd-deck', duration: 360, delay: 40, easing: OUT, fill: 'both' });
    await Promise.race([Promise.all([a.finished, b.finished].map((p) => p.catch(() => {}))), wait(700)]);
    b.cancel();
  });

  if (look === 'a') {
    const pair = (x, slot, ownDecide) => (
      <div className="brd-pair">
        <div className="brd-panel"><i className="brd-ticks" />
          <div className="brd-top">
            <div><div className="brd-name">{x.name}</div><div className="brd-by">{x.by}</div></div>
            {slot}
          </div>
          <Meter w={x} /><Tally w={x} /><Lost w={x} />
        </div>
        <Rows w={x} onDecide={ownDecide} />
      </div>
    );
    return (
      <div className="brd-a">
        <div className="brd-stage" ref={stage}>
          {pair(w, <div className="brd-hatchslot" style={{ '--next': `"${nextName}"` }}><QuarantineHatch ref={hatch} view="ok" next={{ ok: 'ok', q: 'ok' }} onPress={goA} /></div>, decide)}
          {prev && <div className="brd-old" ref={old} aria-hidden="true">{pair(prev, <div className="brd-hatchslot" />, () => {})}</div>}
          <i className="brd-line" ref={line} />
        </div>
      </div>
    );
  }
  if (look === 'b') {
    const s = sums(w);
    return (
      <div className="brd-b" ref={stage}>
        <div className="brd-rail">{data.map((x, k) => { const t = tally(x), m = sums(x).money; return (
          <button key={x.id} className={`brd-plate${k === at ? ' on' : ''}`} onClick={() => goB(k)} aria-pressed={k === at}>
            <b><i className={!t.total ? '' : t.waiting ? 'wait' : 'done'} />{x.name}</b>
            <small className={m ? 'bad' : ''}>{!t.total ? 'No count' : m ? formatRupiah(m) : 'Nothing lost'}</small>
          </button>); })}</div>
        <div className="brd-panel"><i className="brd-ticks" />
          <div className="brd-head">
            <div className="brd-top">
              <div style={{ minWidth: 0 }}>
                <div className="brd-name"><span className="brd-win">{prev && <span className="brd-face-old">{prev.name}</span>}<span className="brd-face-new">{w.name}</span></span></div>
                <div className="brd-by">{w.by}</div>
              </div>
              <div className="brd-arrows">
                <button aria-label="Previous warehouse" onClick={() => goB((at + n - 1) % n)}><ChevronLeft size={18} /></button>
                <button aria-label="Next warehouse" className="brd-next" onClick={() => goB((at + 1) % n)}><ChevronRight size={18} /></button>
              </div>
            </div>
            <div><Meter w={w} /><Tally w={w} /></div>
            <Lost w={w} face={<span className="brd-win">{prev && <span className="brd-face-old">{formatRupiah(sums(prev).money)}</span>}<span className="brd-face-new">{formatRupiah(s.money)}</span></span>} />
          </div>
        </div>
        <Rows w={w} onDecide={decide} />
      </div>
    );
  }
  const e1 = (at + 1) % n, e2 = (at + 2) % n;
  const edge = (k, c) => { const x = data[k], t = tally(x), m = sums(x).money; return (
    <button className={`brd-edge ${c}${c === 'e1' ? ' brd-next' : ''}`} onClick={() => goC(k)}><span>{x.name}</span><small className={m ? 'bad' : ''}>{!t.total ? 'No count' : m ? formatRupiah(m) : 'Nothing lost'}</small></button>); };
  const face = (x, ownDecide) => (
    <>
      <div className="brd-panel"><i className="brd-ticks" />
        <div className="brd-head">
          <div className="brd-top"><div style={{ minWidth: 0 }}><div className="brd-name">{x.name}</div><div className="brd-by">{x.by}</div></div></div>
          <div><Meter w={x} /><Tally w={x} /></div>
          <Lost w={x} />
        </div>
      </div>
      <Rows w={x} onDecide={ownDecide} />
    </>
  );
  return (
    <div className="brd-c">
      {edge(e2, 'e2')}{edge(e1, 'e1')}
      <div className="brd-card" ref={card}>{face(w, decide)}</div>
      {prev && <div className="brd-gone" ref={old} aria-hidden="true">{face(prev, () => {})}</div>}
    </div>
  );
}

function Boot({ look }) {
  const [host, setHost] = useState(null);
  useEffect(() => {
    const t = setInterval(() => {
      const b = [...document.querySelectorAll('button')].find((e) => /pending hq/i.test(e.textContent));
      const box = b?.closest('.animate-fade-in');
      if (!box) return;
      clearInterval(t);
      box.children[1].style.display = 'none';              // the pending list this replaces
      box.children[0].children[1].style.display = 'none';  // the region filter: the swap replaces it
      const h = document.createElement('div'); h.className = 'brd-host'; box.append(h); setHost(h);
    }, 100);
    return () => clearInterval(t);
  }, []);
  return <>{host && createPortal(<Board look={look} />, host)}<ConfirmHost /><ToastHost /></>;
}

export function mount(look) {
  const s = document.createElement('style'); s.textContent = CSS; document.head.append(s);
  const d = document.createElement('div'); document.body.append(d);
  createRoot(d).render(<Boot look={look} />);
}
