/* LAB ONLY - the page around tools/opname-drafts.jsx for the Artifact, so he can press all three on his phone and his PC. Same code as the
   lab frames; the app's colour values are injected by A-Brain Raw/2026-11-05-opname-board/build-drafts.mjs. Deleted with the drafts. */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Draft, CSS } from './opname-drafts.jsx';

const NOTE = {
  1: 'The Ledger. One table of warehouses with their numbers. Press a warehouse row: its products open under it.',
  2: 'The Worklist. Warehouses are tabs. Press a tab: the line glides to it and the list fades in. The list starts with only what still waits for you.',
  3: 'The Queue. Press a warehouse, then a product. Each Accept or Reject moves to the next one. On a PC keyboard: A, R and the up and down arrows.',
};
const PAGE = `
html, body { margin: 0; background: var(--page); }
.pg-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; padding: 10px 16px; background: var(--raised); border-bottom: 1px solid color-mix(in srgb, var(--ink) 26%, transparent); font-family: var(--font-body); color: var(--ink); }
.pg-bar b { font-size: 14px; font-weight: 600; margin-right: auto; }
.pg-seg { display: flex; border: 1px solid color-mix(in srgb, var(--ink) 26%, transparent); border-radius: 6px; overflow: hidden; }
.pg-seg button { min-height: 36px; padding: 0 12px; border: 0; background: none; color: var(--ink-dim); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; }
.pg-seg button + button { border-left: 1px solid color-mix(in srgb, var(--ink) 13%, transparent); }
.pg-seg button[aria-pressed="true"] { background: color-mix(in srgb, var(--accent-edge) 16%, transparent); color: var(--ink); font-weight: 600; }
.pg-seg button:focus-visible { outline: 2px solid var(--accent-edge); outline-offset: -2px; }
.pg-note { margin: 0; padding: 10px 16px 0; font-family: var(--font-body); font-size: 13px; line-height: 1.4; color: var(--ink-dim); }
.pg-frame { padding: 12px 16px 0; max-width: 1440px; margin: 0 auto; box-sizing: border-box; }
.pg-frame.phone { max-width: 391px; padding: 12px 8px 0; border-inline: 1px solid color-mix(in srgb, var(--ink) 26%, transparent); }
.pg-wide { display: none; }
@media (min-width: 700px) { .pg-wide { display: flex; } }
`;

function Page() {
  const start = /^#draft-([123])$/.exec(location.hash)?.[1] || '2';
  const [draft, setDraft] = useState(start), [light, setLight] = useState(false), [phone, setPhone] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle('light', light); }, [light]);
  useEffect(() => { try { history.replaceState(null, '', `#draft-${draft}`); } catch { /* the viewer may refuse */ } }, [draft]);
  const seg = (list, val, set, cls = '') => <div className={`pg-seg ${cls}`}>{list.map(([k, t]) => <button key={String(k)} aria-pressed={val === k} onClick={() => set(k)}>{t}</button>)}</div>;
  return (
    <>
      <div className="pg-bar"><b>Stock Opname board drafts</b>
        {seg([['1', '1 Ledger'], ['2', '2 Worklist'], ['3', '3 Queue']], draft, setDraft)}
        {seg([[false, 'Dark'], [true, 'Light']], light, setLight)}
        {seg([[false, 'PC width'], [true, 'Phone width']], phone, setPhone, 'pg-wide')}
      </div>
      <p className="pg-note">{NOTE[draft]} The numbers are made up. Nothing here changes your stock.</p>
      <div className={`pg-frame${phone ? ' phone' : ''}`}><Draft key={draft} draft={draft} /></div>
    </>
  );
}
const st = document.createElement('style'); st.textContent = CSS + PAGE; document.head.append(st);
createRoot(document.getElementById('root')).render(<Page />);
