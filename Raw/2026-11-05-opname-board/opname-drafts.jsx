/* LAB ONLY - three business-format drafts of the Stock Opname board, his 2026-11-05 "make the animation and panel outside of our theme
   but take the color just not the design ... professional where real factory and business can use it ... super ergonomics, super
   efficient". Same palette tokens as the app, none of its game material: system font, flat surfaces, sentence case, real table
   columns, motion from IBM Carbon's "productive" rules (70-240 ms, curves below) and Material's peer-view patterns. Opened on the real
   screen with `?shell&opname&admin&tab=hq%20audits&draft=1|2|3`; tools/opname-drafts-page.jsx wraps the same code for the Artifact.
   Nothing here ships. When he picks, the draft moves into StockOpnameView and this file is deleted. */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { Check, X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, History, Camera, TriangleAlert, Repeat2 } from 'lucide-react';

const STD = 'cubic-bezier(0.2, 0, 0.38, 0.9)', ENTER = 'cubic-bezier(0, 0, 0.38, 0.9)';   // Carbon productive standard + entrance
const still = () => document.documentElement.classList.contains('lite-mode') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = new Intl.NumberFormat('id-ID');
const num = (n) => fmt.format(n), rp = (n) => `Rp ${fmt.format(n)}`, signed = (n) => (n > 0 ? `+${num(n)}` : n < 0 ? `-${num(-n)}` : '0');

const P = { sm: ['Sampoerna Mild 16', 24800], dj: ['Djarum Coklat 12', 12500], cg: ['Cello Green 16', 8900], cm: ['Cello Merah 12', 9400], ds: ['Dji Sam Soe 12', 19900],
  la: ['LA Lights 16', 22300], mg: ['Magnum Filter 12', 16400], gs: ['Gudang Garam Surya 16', 21500], gf: ['Gudang Garam Filter 12', 18700], gk: ['Gudang Garam Surya 12', 17200] };
const r = (k, e, f, de = 0, df = 0, st = 'wait', x = {}) => ({ id: k, name: P[k][0], price: P[k][1], e, f, de, df, st, reason: '', ...x });
const WH = [
  { id: 'HQ', name: 'Headquarters', leader: 'Yoga', at: 'Mon 09:02', items: [r('dj', 1800, 1794, 12, 12, 'wait', { cause: 'Counting mistake' }), r('cg', 4200, 4200), r('gs', 2400, 2400), r('sm', 2400, 2400, 0, 0, 'ok'), r('ds', 2400, 2400, 0, 0, 'ok'), r('la', 1500, 1500, 0, 0, 'ok'), r('mg', 900, 900, 0, 0, 'ok'), r('gf', 1200, 1200, 0, 0, 'ok')] },
  { id: 'BDG', name: 'Bandung', leader: 'Dewi', at: 'Mon 08:14', items: [
    r('sm', 600, 588, 4, 4, 'wait', { cause: 'Not sure', streak: 'Short in 2 of the last 3 counts', twice: true }),
    r('dj', 1800, 1790, 12, 14, 'wait', { kinds: [['Crushed', 2]], photo: true, twice: true, cause: 'Counting mistake' }),
    r('cg', 420, 415, 0, 3, 'wait', { kinds: [['Torn', 2], ['Wet', 1]], photo: true }),
    r('ds', 340, 340), r('la', 510, 510, 2, 2), r('mg', 260, 260),
    r('gs', 900, 900, 0, 0, 'ok'), r('gf', 450, 449, 0, 0, 'ok', { cause: 'Counting mistake' }),
    r('cm', 168, 160, 0, 0, 'no', { reason: 'Recount shelf B.' }), r('gk', 300, 0, 0, 0, 'none') ] },
  { id: 'SMG', name: 'Semarang', leader: 'Rina', at: 'Mon 07:50', items: [r('dj', 760, 760, 0, 1, 'ok', { kinds: [['Wet', 1]], photo: true }), r('cg', 300, 300, 0, 0, 'ok'), r('ds', 150, 150, 0, 0, 'ok'), r('la', 210, 210, 0, 0, 'ok'), r('gs', 320, 320, 0, 0, 'ok'), r('mg', 95, 95, 0, 0, 'ok')] },
  { id: 'SLO', name: 'Solo', leader: 'Agus', at: '', items: [] },
  { id: 'SBY', name: 'Surabaya', leader: 'Lina', at: 'Mon 10:31', items: [r('gs', 640, 622, 3, 7, 'wait', { kinds: [['Crushed', 3], ['Expired', 1]], photo: true, cause: 'Not sure' }), r('sm', 410, 410), r('cg', 880, 880), r('dj', 500, 500, 0, 0, 'ok'), r('ds', 120, 120, 0, 0, 'ok')] },
];

/* the same two differences as countedDiffs in utils/supply.js; a pack short across good + damaged is missing, a new damaged pack is damaged */
const diff = (i) => ({ g: i.f - i.e, d: i.df - i.de });
const same = (i) => i.f === i.e && i.df === i.de;
const loss = (i) => { const { g, d } = diff(i), miss = Math.max(0, -(g + d)), hurt = Math.max(0, d); return { miss, hurt, missRp: miss * i.price, hurtRp: hurt * i.price, rp: (miss + hurt) * i.price }; };
const stats = (w) => { const s = { total: w.items.length, counted: 0, decided: 0, waiting: 0, matching: 0, ok: 0, no: 0, none: 0, miss: 0, hurt: 0, missRp: 0, hurtRp: 0, rp: 0 };
  w.items.forEach((i) => { if (i.st !== 'none') s.counted++; else s.none++; if (i.st === 'ok') { s.ok++; s.decided++; } if (i.st === 'no') { s.no++; s.decided++; } if (i.st === 'wait') { s.waiting++; if (same(i)) s.matching++; }
    if (i.st === 'wait' || i.st === 'ok') { const l = loss(i); s.miss += l.miss; s.hurt += l.hurt; s.missRp += l.missRp; s.hurtRp += l.hurtRp; s.rp += l.rp; } });   // a rejected product is being recounted: not a loss yet
  return s; };
const rank = { wait: 0, no: 1, ok: 2, none: 3 };
const ordered = (w) => [...w.items].sort((a, b) => rank[a.st] - rank[b.st] || loss(b).rp - loss(a).rp);
const whStatus = (s) => (!s.total ? 'Not submitted' : s.waiting ? `${s.waiting} waiting` : 'All decided');

function useBoard() {
  const [data, setData] = useState(WH), [toast, setToast] = useState(null), tm = useRef();
  const say = (t) => { clearTimeout(tm.current); setToast(t); tm.current = setTimeout(() => setToast(null), 5000); };
  const put = (w, ids, st, reason) => setData((d) => d.map((x) => (x.id !== w.id ? x : { ...x, items: x.items.map((i) => (ids.includes(i.id) ? { ...i, st, reason } : i)) })));
  const decide = (w, i, st, reason = '') => { put(w, [i.id], st, reason);
    say({ text: st === 'ok' ? `Accepted ${i.name} at ${w.name}.` : `Rejected ${i.name}. ${w.leader} recounts only this product.`, undo: () => { put(w, [i.id], 'wait', ''); say({ text: `${i.name} is waiting again.` }); } }); };
  const acceptMatching = (w) => { const ids = w.items.filter((i) => i.st === 'wait' && same(i)).map((i) => i.id); put(w, ids, 'ok', '');
    say({ text: `Accepted ${ids.length} matching products at ${w.name}.`, undo: () => { put(w, ids, 'wait', ''); say({ text: `${ids.length} products are waiting again.` }); } }); };
  return { data, decide, acceptMatching, toast, say, setToast };
}

const Status = ({ st }) => (st === 'ok' ? <span className="bz-status ok"><Check size={14} />Accepted</span>
  : st === 'no' ? <span className="bz-status no"><X size={14} />Rejected</span>
  : st === 'none' ? <span className="bz-status none">Not counted</span>
  : <span className="bz-status wait"><i className="bz-dot" />Waiting</span>);

const Meta = ({ i }) => (i.kinds?.length || i.cause || i.photo || i.twice || i.streak || i.reason) ? (
  <div className="bz-meta">
    {i.kinds?.map(([k, q]) => <span key={k} className="bz-tag">{k} {q}</span>)}
    {i.cause && <span>Cause: {i.cause}</span>}
    {i.twice && <span>Counted twice</span>}
    {i.photo && <span className="bz-ico"><Camera size={13} />Photo</span>}
    {i.streak && <span className="bz-ico warn"><TriangleAlert size={13} />{i.streak}</span>}
    {i.st === 'no' && i.reason && <span className="bz-ico"><Repeat2 size={13} />Recount asked: {i.reason}</span>}
  </div>) : null;

function RejectForm({ w, i, b, onClose }) {
  const [text, setText] = useState(''), [err, setErr] = useState(false), inp = useRef(null), id = `bz-why-${w.id}-${i.id}`;
  useEffect(() => { inp.current?.focus({ preventScroll: true }); }, []);
  const send = (e) => { e.preventDefault(); if (!text.trim()) { setErr(true); inp.current?.focus(); return; } onClose(); b.decide(w, i, 'no', text.trim()); };
  return (
    <form className="bz-rej" onSubmit={send}>
      <label htmlFor={id}>Why does {i.name} go back to {w.leader}?</label>
      <div className="bz-rej-chips">{['Recount please', 'Check the other shelf', 'Photo needed'].map((c) => <button type="button" key={c} className="bz-chip" onClick={() => { setText(c); setErr(false); }}>{c}</button>)}</div>
      <input ref={inp} id={id} value={text} onChange={(e) => { setText(e.target.value); setErr(false); }} autoComplete="off" />
      {err && <p className="bz-err">Write why, so {w.leader} knows what to recount.</p>}
      <div className="bz-rej-acts"><button type="button" className="bz-btn" onClick={onClose}>Cancel</button><button className="bz-btn bz-rejb on"><X size={15} />Reject this product</button></div>
    </form>
  );
}
const Acts = ({ w, i, b, onReject }) => (
  <div className="bz-acts">
    <button className="bz-btn bz-rejb" aria-label={`Reject ${i.name}`} onClick={onReject}><X size={15} /><span>Reject</span></button>
    <button className="bz-btn bz-acc" aria-label={`Accept ${i.name}`} onClick={() => b.decide(w, i, 'ok')}><Check size={15} /><span>Accept</span></button>
  </div>
);
const Lines = ({ i }) => { const { g, d } = diff(i), hasD = i.de > 0 || i.df > 0; return (
  <div className="bz-lines">
    <span>Good</span><span>{num(i.e)} → {num(i.f)}</span><b className={g ? 'bad' : ''}>{signed(g)}</b>
    {hasD && <><span>Damaged</span><span>{num(i.de)} → {num(i.df)}</span><b className={d ? 'bad' : ''}>{signed(d)}</b></>}
  </div>); };
const Sentence = ({ i }) => { const l = loss(i), p = [l.miss && `${num(l.miss)} missing`, l.hurt && `${num(l.hurt)} damaged`].filter(Boolean).join(' + '); return p ? <span className="bz-sum">{p}</span> : null; };

function Row({ w, i, b }) {
  const [rej, setRej] = useState(false), { g, d } = diff(i), l = loss(i), none = i.st === 'none', hasD = i.de > 0 || i.df > 0;
  if (none) return <div className="bz-row none" role="row"><div className="bz-nm"><b>{i.name}</b></div><div className="bz-st"><Status st="none" /></div></div>;
  const quiet = same(i) && !i.reason;
  return (
    <div className={`bz-row ${i.st}${quiet ? ' quiet' : ''}`} role="row">
      <div className="bz-nm"><b>{i.name}</b>{quiet ? <span className="bz-sum dim">Matches · {num(i.f)}{hasD ? ` good, ${num(i.df)} damaged` : ''}</span> : <Sentence i={i} />}</div>
      <div className="bz-six"><span>{num(i.e)}</span><span>{num(i.f)}</span><span className={g ? 'bad' : ''}>{signed(g)}</span><span>{hasD ? num(i.de) : '0'}</span><span>{hasD ? num(i.df) : '0'}</span><span className={d ? 'bad' : ''}>{signed(d)}</span></div>
      {!quiet && <Lines i={i} />}
      <div className={`bz-val${l.rp ? ' bad' : ''}`}>{l.rp ? rp(l.rp) : '-'}</div>
      <div className="bz-st"><Status st={i.st} /></div>
      <div className="bz-do">{i.st === 'wait' && !rej && <Acts w={w} i={i} b={b} onReject={() => setRej(true)} />}</div>
      {!quiet && <Meta i={i} />}
      {rej && <RejectForm w={w} i={i} b={b} onClose={() => setRej(false)} />}
    </div>
  );
}

const Head = ({ b, total = true }) => { const all = b.data.map(stats).reduce((a, s) => ({ rp: a.rp + s.rp, w: a.w + (s.waiting ? 1 : 0) }), { rp: 0, w: 0 }); return (
  <header className="bz-head">
    <div className="bz-title"><h3>Stock count review</h3><p>Week of 2-8 Nov 2026</p></div>
    {total && <div className="bz-alltot"><small>Lost value, all warehouses</small><b>{rp(all.rp)}</b></div>}
    <button className="bz-btn bz-hist" onClick={() => b.say({ text: 'Audit History opens here.' })}><History size={15} /><span>Audit history</span></button>
  </header>); };

/* ---------- DRAFT 1: THE LEDGER. One table of warehouses; a row opens its products in place, like an outline in a spreadsheet. ---------- */
function Ledger({ b }) {
  const [open, setOpen] = useState('BDG');
  const tot = b.data.map(stats).reduce((a, s) => ({ miss: a.miss + s.miss, hurt: a.hurt + s.hurt, rp: a.rp + s.rp, counted: a.counted + s.counted, total: a.total + s.total, decided: a.decided + s.decided }), { miss: 0, hurt: 0, rp: 0, counted: 0, total: 0, decided: 0 });
  return (
    <>
      <Head b={b} />
      <section className="bz-card bz-led" aria-label="Warehouses">
        <div className="bz-led-row bz-th"><span>Warehouse</span><span>Status</span><span className="n">Counted</span><span className="n">Decided</span><span className="n">Missing</span><span className="n">Damaged</span><span className="n">Lost value</span></div>
        {b.data.map((w) => { const s = stats(w), on = open === w.id; return (
          <div key={w.id} className={`bz-grp${on ? ' open' : ''}`}>
            <button className="bz-led-row bz-led-btn" data-wh={w.id} aria-expanded={on} onClick={() => setOpen(on ? null : w.id)}>
              <span className="c-name"><ChevronRight size={16} className="bz-chev" /><b>{w.name}</b></span>
              <span className={`c-st${s.waiting ? ' live' : ''}`}>{whStatus(s)}</span>
              <span className="n c-a">{s.total ? `${s.counted} of ${s.total}` : '-'}</span>
              <span className="n c-b">{s.counted ? `${s.decided} of ${s.counted}` : '-'}</span>
              <span className="n c-c">{num(s.miss)}</span><span className="n c-d">{num(s.hurt)}</span>
              <span className={`n c-rp${s.rp ? ' bad' : ''}`}>{s.total ? rp(s.rp) : '-'}</span>
            </button>
            <div className="bz-exp"><div className="bz-exp-in" inert={!on}>
              <div className="bz-who"><span>{s.total ? `Counted by ${w.leader} · ${w.at}` : `Waiting for ${w.leader}. Stock Opname day is Monday.`}</span>{s.matching > 0 && <button className="bz-btn bz-acc" onClick={() => b.acceptMatching(w)}><Check size={15} /><span>Accept {s.matching} matching</span></button>}</div>
              {s.total > 0 && <div className="bz-rows d1" role="table">
                <div className="bz-phead bz-th" role="row"><span>Product</span><span className="grp"><em>Good stock</em><i>Expected</i><i>Found</i><i>Difference</i></span><span className="grp"><em>Damaged stock</em><i>Expected</i><i>Found</i><i>Difference</i></span><span className="n">Value</span><span>Status</span><span /></div>
                {ordered(w).map((i) => <Row key={i.id} w={w} i={i} b={b} />)}
              </div>}
            </div></div>
          </div>); })}
        <div className="bz-led-row bz-led-total"><span className="c-name"><b>All warehouses</b></span><span /><span className="n c-a">{tot.counted} of {tot.total}</span><span className="n c-b">{tot.decided} of {tot.counted}</span><span className="n c-c">{num(tot.miss)}</span><span className="n c-d">{num(tot.hurt)}</span><span className="n c-rp bad">{rp(tot.rp)}</span></div>
      </section>
    </>
  );
}

/* ---------- DRAFT 2: THE WORKLIST. Warehouses are tabs, numbers on top, only what still needs you underneath. ---------- */
function Worklist({ b }) {
  const [at, setAt] = useState(1), [filter, setFilter] = useState('wait');
  const bar = useRef(null), ind = useRef(null), body = useRef(null), last = useRef(1), key = useRef(false);
  const w = b.data[at], s = stats(w);
  const place = () => { const el = bar.current?.querySelectorAll('[role=tab]')[at]; if (el && ind.current) ind.current.style.transform = `translateX(${el.offsetLeft}px) scaleX(${el.offsetWidth})`; };
  useLayoutEffect(() => { place(); const el = bar.current.querySelectorAll('[role=tab]')[at]; bar.current.scrollTo({ left: el.offsetLeft - (bar.current.clientWidth - el.offsetWidth) / 2, behavior: still() ? 'auto' : 'smooth' });
    if (last.current !== at && !still() && !key.current) { const dir = at > last.current ? 1 : -1; body.current.animate([{ opacity: 0, transform: `translateX(${dir * 16}px)` }, { opacity: 1, transform: 'none' }], { id: 'bz-swap', duration: 150, easing: ENTER }); }
    last.current = at; key.current = false; }, [at]);
  useEffect(() => { const ro = new ResizeObserver(place); ro.observe(bar.current); return () => ro.disconnect(); });
  const onKey = (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { key.current = true; setAt((at + d + b.data.length) % b.data.length); } };
  const list = ordered(w).filter((i) => (filter === 'all' ? true : i.st === filter));
  const FIL = [['wait', 'Waiting', s.waiting], ['ok', 'Accepted', s.ok], ['no', 'Rejected', s.no], ['none', 'Not counted', s.none], ['all', 'All', s.total]];
  const diffs = list.filter((i) => !(i.st === 'wait' && same(i))), matches = list.filter((i) => i.st === 'wait' && same(i));
  return (
    <>
      <Head b={b} />
      <div className="bz-tabs" role="tablist" aria-label="Warehouses" ref={bar} onKeyDown={onKey}>
        {b.data.map((x, k) => { const t = stats(x); return (
          <button key={x.id} role="tab" data-wh={x.id} aria-selected={k === at} tabIndex={k === at ? 0 : -1} className="bz-tab" onClick={() => setAt(k)}>
            <b>{x.name}</b><small className={t.rp ? 'bad' : ''}>{!t.total ? 'Not submitted' : t.rp ? rp(t.rp) : 'Nothing lost'}</small>
            {t.waiting > 0 && <i className="bz-count" aria-label={`${t.waiting} waiting`}>{t.waiting}</i>}
          </button>); })}
        <i className="bz-ind" ref={ind} aria-hidden="true" />
      </div>
      <div className="bz-swapbody" ref={body}>
        <section className="bz-card bz-kpi" aria-label={`${w.name} summary`}>
          <div className="bz-who">{s.total ? `Counted by ${w.leader} · ${w.at}` : `Waiting for ${w.leader}. Stock Opname day is Monday.`}</div>
          <div className="bz-kgrid">
            <div><small>Counted</small><b>{s.counted} <em>of {s.total}</em></b></div>
            <div><small>Decided</small><b>{s.decided} <em>of {s.counted}</em></b></div>
            <div><small>Missing</small><b>{num(s.miss)} <em>{rp(s.missRp)}</em></b></div>
            <div><small>Damaged</small><b>{num(s.hurt)} <em>{rp(s.hurtRp)}</em></b></div>
            <div className="big"><small>Lost value</small><b className={s.rp ? 'bad' : ''}>{rp(s.rp)}</b></div>
          </div>
          <div className="bz-prog" aria-hidden="true"><i className="ok" style={{ flexGrow: s.ok }} /><i className="no" style={{ flexGrow: s.no }} /><i className="wait" style={{ flexGrow: s.waiting }} /><i className="none" style={{ flexGrow: s.none + (s.total ? 0 : 1) }} /></div>
        </section>
        {s.total > 0 && <>
          <div className="bz-filters" role="group" aria-label="Show products">{FIL.map(([k, t, n]) => <button key={k} className="bz-fil" aria-pressed={filter === k} onClick={() => setFilter(k)}>{t} <em>{n}</em></button>)}</div>
          <section className="bz-card">
            <div className="bz-rows d2" role="table">
              <div className="bz-phead bz-th" role="row"><span>Product</span><span className="n3"><i /><i>Expected → Found</i><i>Difference</i></span><span className="n">Value</span><span /></div>
              {diffs.map((i) => <Row key={i.id} w={w} i={i} b={b} />)}
              {matches.length > 0 && <div className="bz-sub"><span>Matches the book</span><button className="bz-btn bz-acc" onClick={() => b.acceptMatching(w)}><Check size={15} /><span>Accept all {matches.length}</span></button></div>}
              {matches.map((i) => <Row key={i.id} w={w} i={i} b={b} />)}
              {!list.length && <p className="bz-none">{filter === 'wait' ? `Nothing is waiting at ${w.name}.` : 'No products here.'}</p>}
            </div>
          </section>
        </>}
      </div>
    </>
  );
}

/* ---------- DRAFT 3: THE QUEUE. Warehouses, then products, then one product with its full evidence; each decision moves to the next. ---------- */
function Queue({ b }) {
  const [at, setAt] = useState(1), [pid, setPid] = useState('sm'), [level, setLevel] = useState(0), [rej, setRej] = useState(false);
  const pane = useRef(null), det = useRef(null), root = useRef(null), viaKey = useRef(false), prevLevel = useRef(0);
  const w = b.data[at], list = ordered(w), i = w.items.find((x) => x.id === pid) || list[0], s = stats(w);
  const waiting = list.filter((x) => x.st === 'wait'), pos = i ? waiting.findIndex((x) => x.id === i.id) : -1;
  useLayoutEffect(() => { if (still() || prevLevel.current === level) return; const dir = level > prevLevel.current ? 1 : -1; prevLevel.current = level;
    if (getComputedStyle(root.current).getPropertyValue('--narrow').trim() === '1') root.current.querySelector(`[data-pane="${level}"]`)?.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }], { id: 'bz-push', duration: 240, easing: ENTER }); }, [level]);
  useLayoutEffect(() => { if (!still() && !viaKey.current) det.current?.animate([{ opacity: 0 }, { opacity: 1 }], { id: 'bz-fade', duration: 110, easing: 'linear' }); viaKey.current = false; }, [pid, at]);
  const pickWh = (k) => { const nw = b.data[k], first = ordered(nw)[0]; setAt(k); setPid(first?.id || ''); setRej(false); setLevel(1); };
  const pick = (x) => { setPid(x.id); setRej(false); setLevel(2); };
  const after = () => { const rest = waiting.filter((x) => x.id !== i.id), nx = rest[Math.max(0, pos)] || rest[0]; if (nx) setPid(nx.id); else { setLevel(1); } };
  const act = (st, why) => { b.decide(w, i, st, why); setRej(false); after(); };
  const step = (d) => { const idx = list.findIndex((x) => x.id === i?.id), nx = list[idx + d]; if (nx) { setPid(nx.id); setRej(false); } };
  useEffect(() => { const on = (e) => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey || !root.current?.isConnected) return; const k = e.key.toLowerCase();
    if (k === 'arrowdown' || k === 'j') { viaKey.current = true; step(1); e.preventDefault(); } else if (k === 'arrowup' || k === 'k') { viaKey.current = true; step(-1); e.preventDefault(); }
    else if (k === 'a' && i?.st === 'wait') { viaKey.current = true; act('ok'); } else if (k === 'r' && i?.st === 'wait') { setRej(true); e.preventDefault(); } };
    addEventListener('keydown', on); return () => removeEventListener('keydown', on); });
  const l = i ? loss(i) : null, D = i ? diff(i) : null;
  return (
    <>
      <Head b={b} />
      <div className="bz-split" ref={root} data-level={level}>
        <section className="bz-card bz-pane" data-pane="0" aria-label="Warehouses">
          <div className="bz-pane-h">Warehouses</div>
          <div className="bz-scroll">{b.data.map((x, k) => { const t = stats(x); return (
            <button key={x.id} data-wh={x.id} className={`bz-q${k === at ? ' on' : ''}`} aria-current={k === at} onClick={() => pickWh(k)}>
              <span className="l1"><b>{x.name}</b><span className={t.rp ? 'bad' : ''}>{t.total ? rp(t.rp) : '-'}</span></span>
              <span className="l2"><span>{whStatus(t)}</span><span>{t.counted ? `${t.decided} of ${t.counted} decided` : ''}</span></span>
              <span className="bz-prog" aria-hidden="true"><i className="ok" style={{ flexGrow: t.ok }} /><i className="no" style={{ flexGrow: t.no }} /><i className="wait" style={{ flexGrow: t.waiting }} /><i className="none" style={{ flexGrow: t.none + (t.total ? 0 : 1) }} /></span>
              <ChevronRight size={16} className="bz-go" />
            </button>); })}</div>
        </section>
        <section className="bz-card bz-pane" data-pane="1" aria-label={`Products at ${w.name}`}>
          <div className="bz-pane-h"><button className="bz-back" aria-label="Back to warehouses" onClick={() => setLevel(0)}><ChevronLeft size={18} /></button><span>{w.name}</span><em>{s.total ? `${w.leader} · ${w.at}` : `Waiting for ${w.leader}`}</em></div>
          {s.matching > 0 && <div className="bz-sub top"><span>{s.matching} match the book</span><button className="bz-btn bz-acc" onClick={() => b.acceptMatching(w)}><Check size={15} /><span>Accept all {s.matching}</span></button></div>}
          <div className="bz-scroll">
            {list.map((x) => { const v = loss(x); return (
              <button key={x.id} className={`bz-qp${x.id === i?.id ? ' on' : ''}`} aria-current={x.id === i?.id} onClick={() => pick(x)}>
                <span className="l1"><b>{x.name}</b><span className={v.rp ? 'bad' : ''}>{v.rp ? rp(v.rp) : ''}</span></span>
                <span className="l2"><Status st={x.st} /><span>{x.st === 'none' ? '' : same(x) ? 'Matches' : <Sentence i={x} />}</span></span>
                <ChevronRight size={16} className="bz-go" />
              </button>); })}
            {!list.length && <p className="bz-none">The count opens on Stock Opname day. {w.leader} submits it.</p>}
          </div>
        </section>
        <section className="bz-card bz-pane bz-det" data-pane="2" aria-label="Product detail">
          <div className="bz-pane-h"><button className="bz-back" aria-label="Back to products" onClick={() => setLevel(1)}><ChevronLeft size={18} /></button><span>{w.name}</span><em>{pos >= 0 ? `${pos + 1} of ${waiting.length} waiting` : ''}</em>
            <span className="bz-nav"><button className="bz-btn" aria-label="Previous product" onClick={() => step(-1)}><ChevronUp size={15} /></button><button className="bz-btn" aria-label="Next product" onClick={() => step(1)}><ChevronDown size={15} /></button></span></div>
          {i ? <div className="bz-scroll" ref={det}>
            <div className="bz-d-top"><h4>{i.name}</h4><Status st={i.st} /></div>
            {i.st === 'none' ? <p className="bz-none">{w.leader} did not count this product.</p> : <>
              <table className="bz-dt"><thead><tr><th /><th>Expected</th><th>Found</th><th>Difference</th></tr></thead><tbody>
                <tr><th>Good</th><td>{num(i.e)}</td><td>{num(i.f)}</td><td className={D.g ? 'bad' : ''}>{signed(D.g)}</td></tr>
                <tr><th>Damaged</th><td>{num(i.de)}</td><td>{num(i.df)}</td><td className={D.d ? 'bad' : ''}>{signed(D.d)}</td></tr>
              </tbody></table>
              {l.rp > 0 ? <table className="bz-dt bill"><tbody>
                {l.miss > 0 && <tr><th>Missing</th><td>{num(l.miss)} × {rp(i.price)}</td><td>{rp(l.missRp)}</td></tr>}
                {l.hurt > 0 && <tr><th>Damaged</th><td>{num(l.hurt)} × {rp(i.price)}</td><td>{rp(l.hurtRp)}</td></tr>}
                <tr className="tot"><th>Lost value</th><td /><td className="bad">{rp(l.rp)}</td></tr>
              </tbody></table> : <p className="bz-none">Matches the book. Nothing lost.</p>}
              <Meta i={i} />
              {i.photo && <button className="bz-photo" onClick={() => b.say({ text: 'The damage photo opens here.' })}><Camera size={18} /><span>Damage photo</span></button>}
            </>}
          </div> : <div className="bz-scroll"><p className="bz-none">No product to show.</p></div>}
          {i?.st === 'wait' && <div className="bz-bar">
            {rej ? <RejectForm w={{ ...w, id: `q${w.id}` }} i={i} b={{ ...b, decide: (_w, _i, _s, why) => act('no', why) }} onClose={() => setRej(false)} /> : <>
              <button className="bz-btn bz-rejb" onClick={() => setRej(true)}><X size={15} /><span>Reject</span><kbd>R</kbd></button>
              <button className="bz-btn bz-acc" onClick={() => act('ok')}><Check size={15} /><span>Accept</span><kbd>A</kbd></button>
            </>}
          </div>}
        </section>
      </div>
    </>
  );
}

function Toast({ b }) {
  const t = b.toast;
  return <div className="bz-toastwrap" aria-live="polite">{t && <div className="bz-toast" key={t.text}><span>{t.text}</span>{t.undo && <button onClick={t.undo}>Undo</button>}</div>}</div>;
}

export function Draft({ draft }) {
  const b = useBoard();
  return <div className="bz" data-draft={draft}>{draft === '1' ? <Ledger b={b} /> : draft === '2' ? <Worklist b={b} /> : <Queue b={b} />}<Toast b={b} /></div>;
}

export const CSS = `
.bz { --hair: color-mix(in srgb, var(--ink) 13%, transparent); --hair2: color-mix(in srgb, var(--ink) 26%, transparent); --tint: color-mix(in srgb, var(--accent-edge) 13%, transparent);
  container: bz / inline-size; display: grid; gap: 12px; padding-bottom: 76px; font-family: var(--font-body); font-size: 14px; line-height: 1.4; font-weight: 400; color: var(--ink); text-align: left; font-variant-numeric: tabular-nums; -webkit-font-smoothing: antialiased; letter-spacing: normal; text-transform: none; }
.bz *, .bz *::before, .bz *::after { box-sizing: border-box; }
.bz button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; letter-spacing: normal; text-transform: none; text-align: inherit; }
.bz :focus-visible { outline: 2px solid var(--accent-edge); outline-offset: 1px; }
.bz h3, .bz h4, .bz p { margin: 0; font-family: inherit; letter-spacing: normal; text-transform: none; }
.bz em { font-style: normal; }
.bz .bad { color: var(--danger-ink); }
.bz .n { text-align: right; }
.bz-card { background: var(--raised); border: 1px solid var(--hair2); border-radius: 8px; overflow: hidden; }
.bz-th { font-size: 12px; font-weight: 600; color: var(--ink-dim); }
.bz-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; }
.bz-title { flex: 1 1 auto; min-width: 0; }
.bz-title h3 { font-size: 18px; line-height: 1.25; font-weight: 600; color: var(--ink); }
.bz-title p { font-size: 13px; color: var(--ink-dim); }
.bz-alltot { order: 3; flex: 1 1 100%; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.bz-alltot small { font-size: 13px; color: var(--ink-dim); }
.bz-alltot b { font-size: 18px; font-weight: 600; color: var(--danger-ink); }
.bz-btn { display: inline-flex !important; align-items: center; justify-content: center; gap: 6px; min-height: 44px !important; min-width: 44px !important; padding: 0 12px; border-radius: 6px; font-size: 13px !important; font-weight: 600 !important; white-space: nowrap; border: 1px solid var(--hair2) !important; transition: background-color 110ms ease, border-color 110ms ease, transform 70ms ease-out; }
.bz-btn:active { transform: scale(.97); }
.bz-acc { color: var(--accent-ink) !important; border-color: var(--accent-edge) !important; background: var(--duke-fill-plank) !important; }
.bz-rejb.on { color: var(--danger-ink) !important; border-color: var(--danger) !important; }
.bz-hist span { display: none; }
.bz-status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; white-space: nowrap; color: var(--ink); }
.bz-status.no { color: var(--danger-ink); } .bz-status.none { color: var(--ink-dim); font-weight: 400; }
.bz-status.ok svg { color: var(--accent-ink); }
.bz-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid var(--accent-edge); }
.bz-who { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--ink-dim); }

/* product rows: the phone shape first */
.bz-rows { display: grid; }
.bz-phead { display: none; }
.bz-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; padding: 12px; border-top: 1px solid var(--hair); }
.bz-rows > .bz-row:first-of-type { border-top: 0; }
.bz-nm { min-width: 0; display: grid; gap: 1px; }
.bz-nm > b { font-size: 14px; font-weight: 600; color: var(--ink); }
.bz-row.none .bz-nm > b { font-weight: 400; color: var(--ink-dim); }
.bz-sum { font-size: 13px; font-weight: 600; color: var(--danger-ink); }
.bz-sum.dim { font-weight: 400; color: var(--ink-dim); }
.bz-six { display: none; }
.bz-lines { grid-column: 1 / -1; display: grid; grid-template-columns: 62px minmax(0, 1fr) auto; gap: 1px 8px; font-size: 13px; }
.bz-lines > span:nth-child(3n+1) { color: var(--ink-dim); }
.bz-lines > b { font-weight: 600; text-align: right; }
.bz-val { grid-column: 2; grid-row: 1; font-size: 14px; font-weight: 600; text-align: right; color: var(--ink-dim); }
.bz-val.bad { color: var(--danger-ink); }
.bz-st { display: none; }
.bz-row.ok .bz-st, .bz-row.no .bz-st, .bz-row.none .bz-st { display: block; grid-column: 1 / -1; }
.bz-row.none .bz-st { grid-column: 2; grid-row: 1; text-align: right; }
.bz-do { grid-column: 1 / -1; }
.bz-do:empty { display: none; }
.bz-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bz-meta { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; color: var(--ink-dim); }
.bz-tag { color: var(--danger-ink); border: 1px solid var(--danger); border-radius: 4px; padding: 0 5px; font-weight: 600; }
.bz-ico { display: inline-flex; align-items: center; gap: 4px; }
.bz-ico.warn { color: var(--danger-ink); font-weight: 600; }
.bz-row.quiet { align-items: center; }
.bz-row.quiet .bz-val { display: none; }
.bz-row.quiet .bz-do { grid-column: 2; grid-row: 1; }
.bz-row.quiet .bz-st { grid-column: 2; grid-row: 1; }
.bz-row.quiet .bz-acts { grid-template-columns: 44px 44px; }
.bz-rej { grid-column: 1 / -1; display: grid; gap: 8px; padding: 10px; border-radius: 6px; background: var(--tint); }
.bz-rej label { font-size: 13px; font-weight: 600; color: var(--ink); }
.bz-rej input { width: 100%; min-height: 44px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--hair2); background: var(--raised); color: var(--ink); font: inherit; font-size: 16px; }
.bz-rej-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.bz-chip { min-height: 36px; padding: 0 10px; border-radius: 18px; border: 1px solid var(--hair2) !important; font-size: 13px !important; }
.bz-err { font-size: 13px; color: var(--danger-ink); }
.bz-rej-acts { display: grid; grid-template-columns: auto 1fr; gap: 8px; }

/* DRAFT 1 */
.bz-led-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1px 10px; width: 100%; padding: 10px 12px; }
.bz-led > .bz-th { display: none; }
.bz-led-btn { min-height: 56px; align-items: center; transition: background-color 110ms ease; }
.bz-grp { border-top: 1px solid var(--hair); }
.bz-grp.open > .bz-led-btn { background: var(--tint); }
.bz-led-row .c-name { display: flex; align-items: center; gap: 6px; min-width: 0; }
.bz-led-row .c-name b { font-size: 15px; font-weight: 600; color: var(--ink); }
.bz-chev { flex: none; color: var(--ink-dim); transition: transform 150ms ${STD}; }
.bz-grp.open .bz-chev { transform: rotate(90deg); }
.bz-led-row .c-st { grid-column: 1; grid-row: 2; padding-left: 22px; font-size: 13px; color: var(--ink-dim); }
.bz-led-row .c-st.live { color: var(--accent-ink); font-weight: 600; }
.bz-led-row .c-rp { grid-column: 2; grid-row: 1; font-size: 15px; font-weight: 600; }
.bz-led-row .c-a { grid-column: 2; grid-row: 2; font-size: 13px; color: var(--ink-dim); }
.bz-led-row .c-b, .bz-led-row .c-c, .bz-led-row .c-d { display: none; }
.bz-led-total { border-top: 1px solid var(--hair2); }
.bz-exp { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 240ms ${STD}; }
.bz-grp.open .bz-exp { grid-template-rows: 1fr; }
.bz-exp-in { min-height: 0; overflow: hidden; }
.bz-grp .bz-who { padding: 8px 12px; border-top: 1px solid var(--hair); }

/* DRAFT 2 */
.bz-tabs { position: relative; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid var(--hair2); }
.bz-tabs::-webkit-scrollbar { display: none; }
.bz-tab { position: relative; flex: none; display: grid; grid-template-columns: auto auto; column-gap: 8px; align-items: center; justify-content: start; min-height: 52px; padding: 7px 16px 8px 12px !important; }
.bz-tab b { font-size: 14px; font-weight: 500; color: var(--ink-dim); white-space: nowrap; transition: color 110ms ease; }
.bz-tab[aria-selected="true"] b { color: var(--ink); font-weight: 600; }
.bz-tab small { grid-column: 1 / -1; grid-row: 2; font-size: 12px; color: var(--ink-dim); white-space: nowrap; }
.bz-count { grid-column: 2; grid-row: 1; justify-self: start; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; font-style: normal; font-size: 11px; font-weight: 700; line-height: 16px; text-align: center; border: 1px solid var(--accent-edge); color: var(--accent-ink); }
.bz-ind { position: absolute; left: 0; bottom: 0; width: 1px; height: 2px; background: var(--accent-edge); transform-origin: 0 0; transition: transform 240ms ${STD}; }
.bz-swapbody { display: grid; gap: 12px; }
.bz-kpi { padding: 10px 12px 0; display: grid; gap: 10px; }
.bz-kgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; }
.bz-kgrid > div { display: grid; min-width: 0; }
.bz-kgrid small { font-size: 12px; color: var(--ink-dim); }
.bz-kgrid b { font-size: 16px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.bz-kgrid b em { font-size: 12px; font-weight: 400; color: var(--ink-dim); }
.bz-kgrid .big { grid-column: 1 / -1; }
.bz-kgrid .big b { font-size: 22px; }
.bz-kgrid .big b.bad { color: var(--danger-ink); }
.bz-prog { display: flex; height: 4px; gap: 1px; margin: 0 -12px; background: transparent; }
.bz-prog i { flex: 0 0 0; min-width: 0; }
.bz-prog .ok { background: var(--accent-edge); } .bz-prog .no { background: var(--danger); } .bz-prog .wait { background: var(--hair2); } .bz-prog .none { background: var(--hair); }
.bz-filters { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.bz-filters::-webkit-scrollbar { display: none; }
.bz-fil { flex: none; min-height: 40px; padding: 0 12px !important; border-radius: 6px; border: 1px solid var(--hair2) !important; font-size: 13px !important; font-weight: 500 !important; color: var(--ink-dim) !important; transition: background-color 110ms ease; }
.bz-fil em { color: var(--ink-dim); margin-left: 3px; }
.bz-fil[aria-pressed="true"] { background: var(--tint) !important; border-color: var(--accent-edge) !important; color: var(--ink) !important; font-weight: 600 !important; }
.bz-sub { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--hair); font-size: 13px; font-weight: 600; color: var(--ink-dim); background: color-mix(in srgb, var(--ink) 4%, transparent); }
.bz-none { padding: 18px 12px; font-size: 13px; color: var(--ink-dim); }
/* draft 2's phone rows: the two presses sit beside the figures, in reach of the thumb */
.d2 .bz-row:not(.quiet):not(.none):not(.ok):not(.no) { grid-template-columns: minmax(0, 1fr) 96px; }
.d2 .bz-row:not(.quiet) .bz-lines { grid-column: 1; }
.d2 .bz-row:not(.quiet) .bz-do { grid-column: 2; grid-row: 2 / span 2; align-self: start; }
.d2 .bz-acts { grid-template-columns: 44px 44px; }
.d2 .bz-acts span, .bz-row.quiet .bz-acts span { display: none; }

/* DRAFT 3: the phone walks warehouse -> product -> detail */
.bz-split { --narrow: 1; display: grid; gap: 10px; }
.bz-split[data-level="0"] [data-pane="1"], .bz-split[data-level="0"] [data-pane="2"], .bz-split[data-level="1"] [data-pane="0"], .bz-split[data-level="1"] [data-pane="2"], .bz-split[data-level="2"] [data-pane="0"], .bz-split[data-level="2"] [data-pane="1"] { display: none; }
.bz-pane { display: flex; flex-direction: column; min-width: 0; }
.bz-pane-h { display: flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 12px; border-bottom: 1px solid var(--hair); font-size: 14px; font-weight: 600; }
.bz-pane-h em { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--ink-dim); white-space: nowrap; }
.bz-back { width: 44px; height: 44px; margin-left: -12px; display: grid !important; place-items: center; color: var(--ink-dim) !important; }
.bz-nav { display: none; }
.bz-scroll { min-height: 0; }
.bz-q, .bz-qp { position: relative; display: grid !important; gap: 3px; width: 100%; padding: 11px 34px 11px 12px !important; min-height: 64px; border-top: 1px solid var(--hair) !important; transition: background-color 110ms ease; }
.bz-scroll > .bz-q:first-child, .bz-scroll > .bz-qp:first-child { border-top: 0 !important; }
.bz-q .l1, .bz-qp .l1 { display: flex; justify-content: space-between; gap: 10px; }
.bz-q .l1 b, .bz-qp .l1 b { font-size: 14px; font-weight: 600; color: var(--ink); }
.bz-q .l1 span, .bz-qp .l1 span { font-size: 14px; font-weight: 600; white-space: nowrap; color: var(--ink-dim); }
.bz-q .l1 span.bad, .bz-qp .l1 span.bad { color: var(--danger-ink); }
.bz-q .l2, .bz-qp .l2 { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; color: var(--ink-dim); }
.bz-q .bz-prog { margin: 4px 0 0; height: 3px; }
.bz-go { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--ink-dim); }
.bz-d-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 12px 6px; }
.bz-d-top h4 { font-size: 17px; font-weight: 600; color: var(--ink); }
.bz-dt { width: calc(100% - 24px); margin: 4px 12px 10px; border-collapse: collapse; font-size: 14px; }
.bz-dt th { font-weight: 400; color: var(--ink-dim); text-align: left; padding: 5px 0; font-size: 13px; }
.bz-dt thead th { text-align: right; font-size: 12px; font-weight: 600; }
.bz-dt td { text-align: right; padding: 5px 0; font-weight: 600; border-top: 1px solid var(--hair); }
.bz-dt tbody th { border-top: 1px solid var(--hair); }
.bz-dt.bill td:nth-child(2) { font-weight: 400; color: var(--ink-dim); }
.bz-dt .tot th, .bz-dt .tot td { font-size: 16px; font-weight: 600; color: var(--ink); border-top: 1px solid var(--hair2); }
.bz-dt .tot td.bad { color: var(--danger-ink); }
.bz-det .bz-meta { margin: 0 12px 10px; }
.bz-photo { display: flex !important; align-items: center; gap: 8px; margin: 0 12px 12px; min-height: 44px; padding: 0 12px !important; width: calc(100% - 24px); border-radius: 6px; border: 1px dashed var(--hair2) !important; font-size: 13px !important; color: var(--ink-dim) !important; }
.bz-bar { position: sticky; bottom: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--hair2); background: var(--raised); }
.bz-bar .bz-rej { grid-column: 1 / -1; padding: 0; background: none; }
.bz-bar kbd { display: none; }

.bz-toastwrap { position: fixed; left: 50%; bottom: 18px; z-index: 90; transform: translateX(-50%); width: min(92vw, 460px); pointer-events: none; }
.bz-toast { pointer-events: auto; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 10px 14px; border-radius: 8px; font-size: 14px; background: var(--ink); color: var(--raised); box-shadow: 0 6px 20px rgba(0, 0, 0, .28); animation: bzToast 150ms ${ENTER} both; }
.bz-toast button { flex: none; min-height: 32px; padding: 0 6px; font-weight: 700 !important; color: inherit !important; text-decoration: underline !important; text-underline-offset: 3px; }
@keyframes bzToast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .bz-toast { animation: none; } .bz-exp, .bz-ind, .bz-chev { transition: none; } }

@media (hover: hover) and (pointer: fine) {
  .bz-led-btn:hover, .bz-q:hover, .bz-qp:hover { background: color-mix(in srgb, var(--ink) 5%, transparent); }
  .bz-grp.open > .bz-led-btn:hover, .bz-q.on:hover, .bz-qp.on:hover { background: var(--tint); }
  .bz-btn:hover { background-color: color-mix(in srgb, var(--ink) 8%, transparent); }
  .bz-acc:hover { background: var(--duke-fill-plank-2, var(--duke-fill-plank)) !important; }
  .bz-rejb:hover { color: var(--danger-ink) !important; border-color: var(--danger) !important; background: transparent; }
  .bz-tab:hover b { color: var(--ink); }
  .bz-fil:hover { color: var(--ink) !important; }
  .bz-chip:hover { border-color: var(--accent-edge) !important; }
}
.bz-q.on, .bz-qp.on { background: var(--tint); }

/* the PC: real table columns */
@container bz (min-width: 800px) {
  .bz-btn { min-height: 34px !important; min-width: 34px !important; }
  .d2 .bz-acts span, .bz-row.quiet .bz-acts span { display: inline; }
  .bz-row.quiet .bz-acts { grid-template-columns: auto auto; justify-content: end; }
  .bz-hist span { display: inline; }
  .bz-alltot { order: 0; flex: none; display: grid; justify-items: end; gap: 0; }
  .bz-alltot small { font-size: 12px; }
  .bz-alltot b { font-size: 20px; }
  .bz-title h3 { font-size: 20px; }
  .bz-chip { min-height: 30px; }
  .bz-rej input { min-height: 34px; font-size: 14px; }
  .bz-rej { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
  .bz-rej label { grid-column: 1 / -1; }
  .bz-rej-chips { grid-column: 1 / -1; order: 0; }
  .bz-err { grid-column: 1 / -1; order: 3; }
  .bz-phead { display: grid; padding: 8px 12px; background: color-mix(in srgb, var(--ink) 4%, transparent); align-items: end; }
  .bz-phead.bz-th .n3 i, .bz-phead .grp i { font-style: normal; text-align: right; }
  .bz-phead .grp em { grid-column: 1 / -1; text-align: center; border-bottom: 1px solid var(--hair); padding-bottom: 2px; }
  .bz-phead .grp { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px 8px; }

  /* draft 2 at table width */
  .bz-kpi { padding-top: 10px; }
  .bz-kgrid { grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(0, 1.3fr); align-items: end; }
  .bz-kgrid .big { grid-column: auto; text-align: right; }
  .bz-tab { flex: 0 1 auto; min-width: 150px; }
  .d2 .bz-phead, .d2 .bz-row { grid-template-columns: minmax(200px, 1fr) minmax(300px, 340px) 110px 208px !important; column-gap: 16px; align-items: center; }
  .d2 .bz-phead .n3 { display: grid; grid-template-columns: 62px minmax(0, 1fr) 70px; gap: 8px; }
  .d2 .bz-phead .n3 i:nth-child(2) { text-align: left; }
  .d2 .bz-row { padding: 9px 12px; }
  .d2 .bz-row .bz-lines { grid-column: 2 !important; grid-template-columns: 62px minmax(0, 1fr) 70px; }
  .d2 .bz-row .bz-val { grid-column: 3; grid-row: 1; }
  .d2 .bz-row .bz-do { grid-column: 4 !important; grid-row: 1 !important; justify-self: end; align-self: center; }
  .d2 .bz-row .bz-st { grid-column: 4 !important; grid-row: 1; display: block; text-align: right; }
  .d2 .bz-row.wait .bz-st { display: none; }
  .d2 .bz-row .bz-meta, .d2 .bz-row .bz-rej { grid-column: 1 / -1; }
  .d2 .bz-acts { grid-template-columns: auto auto; }
  .d2 .bz-row:not(.quiet) .bz-btn, .d2 .bz-sub .bz-btn { min-width: 34px; }
  .d2 .bz-row.quiet .bz-nm { grid-column: 1 / span 2; }
  .d2 .bz-row.quiet .bz-val { display: block; grid-column: 3; }
}
@container bz (min-width: 1000px) {
  /* draft 1 at ledger width */
  .bz-led > .bz-th { display: grid; background: color-mix(in srgb, var(--ink) 4%, transparent); }
  .bz-led-row { grid-template-columns: minmax(180px, 1fr) 140px 100px 100px 90px 90px 130px; gap: 0 12px; align-items: center; padding: 8px 12px; }
  .bz-led-btn { min-height: 44px; }
  .bz-led-row .c-st, .bz-led-row .c-a, .bz-led-row .c-rp, .bz-led-row .c-b, .bz-led-row .c-c, .bz-led-row .c-d { display: block; grid-column: auto; grid-row: auto; padding: 0; font-size: 14px; color: var(--ink); }
  .bz-led-row .c-rp { font-weight: 600; }
  .bz-led-row .c-rp.bad { color: var(--danger-ink); }
  .bz-led-row .c-st { color: var(--ink-dim); font-size: 13px; }
  .bz-led-row .c-st.live { color: var(--accent-ink); }
  .d1 .bz-phead, .d1 .bz-row { grid-template-columns: minmax(200px, 1fr) 200px 180px 100px 92px 172px; column-gap: 14px; align-items: center; }
  .d1 .bz-row { padding: 8px 12px; }
  .d1 .bz-lines { display: none; }
  .d1 .bz-six { display: contents; }
  .d1 .bz-six > span { display: none; }
  .d1 .bz-row .bz-val { grid-column: 4; grid-row: 1; }
  .d1 .bz-six { display: grid; grid-column: 2 / span 2; grid-row: 1; grid-template-columns: repeat(3, 1fr) repeat(3, 1fr); column-gap: 8px; text-align: right; font-size: 14px; }
  .d1 .bz-six { grid-template-columns: 58px 58px 62px 54px 54px 58px; justify-content: space-between; }
  .d1 .bz-six > span { display: block; }
  .d1 .bz-six > span.bad { font-weight: 600; }
  .d1 .bz-row .bz-st { display: block; grid-column: 5; grid-row: 1; }
  .d1 .bz-row .bz-do { grid-column: 6; grid-row: 1; }
  .d1 .bz-row .bz-meta, .d1 .bz-row .bz-rej { grid-column: 1 / -1; }
  .d1 .bz-acts { grid-template-columns: auto auto; justify-content: end; }
  .d1 .bz-row.quiet .bz-acts { grid-template-columns: auto auto; }
  .d1 .bz-row.quiet .bz-val { display: block; }
  .d1 .bz-row.none .bz-st { grid-column: 5; text-align: left; }

  /* draft 3 at three panes */
  .bz-split { --narrow: 0; grid-template-columns: 250px 360px minmax(0, 1fr); height: clamp(460px, calc(100vh - 305px), 860px); }
  .bz-split[data-level] [data-pane] { display: flex; min-height: 0; }
  .bz-split .bz-back { display: none !important; }
  .bz-scroll { flex: 1; overflow-y: auto; scrollbar-width: thin; }
  .bz-pane-h em { margin-left: 8px; }
  .bz-nav { display: flex; gap: 4px; margin-left: auto; }
  .bz-go { display: none; }
  .bz-q, .bz-qp { padding-right: 12px !important; }
  .bz-bar { justify-content: end; grid-template-columns: auto auto; }
  .bz-bar .bz-btn { min-height: 38px !important; padding: 0 16px; }
  .bz-bar kbd { display: inline-block; margin-left: 4px; padding: 0 5px; font: inherit; font-size: 11px; border: 1px solid currentColor; border-radius: 3px; opacity: .7; }
  .bz-dt { max-width: 560px; }
  .bz-photo { max-width: 560px; }
}
`;

/* the real screen in the lab: the board in place of the pending list, and the big title + double tabs folded to one row */
function Boot({ draft }) {
  const [host, setHost] = useState(null);
  useEffect(() => {
    const t = setInterval(() => {
      const b = [...document.querySelectorAll('button')].find((e) => /pending hq/i.test(e.textContent));
      const box = b?.closest('.animate-fade-in');
      if (!box) return;
      clearInterval(t);
      box.children[0].style.display = 'none'; box.children[1].style.display = 'none';
      const title = document.querySelector('h2')?.parentElement?.parentElement;
      if (title) { title.classList.add('bz-fold'); title.querySelector('h2').parentElement.style.display = 'none'; title.style.padding = '4px'; title.style.background = 'transparent'; title.style.boxShadow = 'none'; title.style.border = '0';
        const tabs = title.lastElementChild; tabs.style.display = 'flex'; tabs.style.overflowX = 'auto'; tabs.style.gap = '2px'; [...tabs.children].forEach((c) => { c.style.flex = '1 0 auto'; c.style.fontFamily = 'var(--font-body)'; c.style.letterSpacing = 'normal'; c.style.textTransform = 'none'; c.style.fontSize = '13px'; c.style.fontWeight = '600'; c.style.minHeight = '40px'; }); }
      const h = document.createElement('div'); h.style.cssText = 'flex:1;min-height:0;padding:0 1px'; box.append(h); setHost(h);
    }, 100);
    return () => clearInterval(t);
  }, []);
  return host && createPortal(<Draft draft={draft} />, host);
}
export function mountInLab(draft) {
  const s = document.createElement('style'); s.textContent = CSS + '@media (max-width:480px){.bz-fold svg{display:none}}'; document.head.append(s);
  const d = document.createElement('div'); document.body.append(d);
  createRoot(d).render(<Boot draft={draft} />);
}
