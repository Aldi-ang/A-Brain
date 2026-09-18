---
title: Customers on the phone — what 375 px measured, and the three YES/NO fixes on the table
description: The phone sweep reaches the Customers screen (CustomerManagement). Measured at innerWidth 375 in the real shell; three proposals rendered through ?css= and sent as three boards. DECIDED 10:00 — three YES, names A→Z, the folder tree stays — shipped kpm a9822ff.
type: brainstorm
created: 2026-09-17
updated: 2026-09-17
status: CONFIRMED on his phone 2026-09-18 — "t2 approve" (with three follow-up asks, see 2026-09-18_customers-look-dan-badge-karantina); shipped kpm a9822ff
confidence: high
checked: 2026-09-17
tags: [brainstorm, phone, customers, sweep, 375]
---

# Customers on the phone (2026-09-17, 09:30–09:55)

## The problem

Same sweep rule as the terminal. This is the screen a salesman registers and looks up shops from.
Mounted as T5 in the real shell (`?shell&customers`, kpm `6c230a6`; App.jsx:5041 mounts it with
no wrapper at all). The desk (1280) has the SAME order — form first, directory below — so the phone
only amplifies it.

## What measured (375, dark and light)

| thing | today |
|---|---|
| order | the ADD NEW CUSTOMER form (~1,100 px) sits above the search box and the directory; a lookup scrolls past every field |
| name / phone inputs | 42 tall |
| rank select, price select, PIC input, last-visit date | 40 |
| PROVINSI / KABUPATEN / KECAMATAN / Address | 34 tall, 12 px |
| GPS coords, Maps link | 38 |
| "Location & Street View" header + Auto-Find / My GPS | title wraps, both buttons wrap to two lines (74×44, 67×44) |
| folder cards (Indonesia → provinsi → kabupaten → kecamatan → shops) | 164 px each, four taps to reach the shops |
| shop cards | 222 px each; Edit 49×29 (12 px); rank badge 10 px; breadcrumb links 20 tall |
| headings "(Kecamatan Level)", "4 Registered" | 10 px |
| fine | Save 52, Upload 40→(44 in fix 2), search 50, FOLDER 44; nothing wider than 375; no text under 10 |

## The three fixes (boards `st-cust-1/2/3.png`)

1. **Order** — phone only: the form folds behind one 48 px `+ ADD NEW CUSTOMER` button; search and
   the directory come first; the button opens the same form under it. Needs a state in
   `CustomerManager.jsx` (a `showForm` toggle, default closed under `lg`); the frame was CSS only
   (`::before` drew the button). Editing an existing shop must open the form automatically.
2. **Form** — every box 44, the 12 px ones 13, Auto-Find / My GPS on their own row (half each).
3. **Directory** — folder cards → 64 px rows; shop cards keep every field but lose ~170 px of
   padding each; Edit 44; breadcrumb links 44; 10 px type → 11.

```css
@media (max-width:1023px){
/* 1 · ORDER — the registration form folds behind one button; search and the directory come first */
.max-w-5xl > div.p-6.rounded-2xl{padding:0;background:transparent;border:0;box-shadow:none}
.max-w-5xl > div.p-6.rounded-2xl > form{display:none}
.max-w-5xl > div.p-6.rounded-2xl::before{content:'+   ADD NEW CUSTOMER';display:flex;align-items:center;justify-content:center;min-height:48px;font-weight:700;font-size:13px;letter-spacing:.12em;color:var(--gold-ink);background:var(--gold);border-radius:12px}
}
@media (max-width:1023px){
/* 2 · FORM — every box 44 tall, the small ones 13 px, Auto-Find / My GPS on their own row */
form.flex-col input, form.flex-col select{min-height:44px}
form.flex-col input.text-xs, form.flex-col textarea.text-xs{font-size:13px}
form.flex-col .rounded-xl.space-y-3 > .justify-between{flex-wrap:wrap;gap:10px}
form.flex-col .rounded-xl.space-y-3 > .justify-between > .flex.gap-2:not(.items-center){width:100%;display:grid;grid-template-columns:1fr 1fr;gap:10px}
form.flex-col .rounded-xl.space-y-3 > .justify-between > .flex.gap-2:not(.items-center) > button{min-height:44px;justify-content:center;white-space:nowrap;font-size:13px}
form.flex-col .cursor-pointer{min-height:44px}
form.flex-col .rounded-xl.space-y-3 > .justify-between > .flex.items-center.gap-2{width:100%;display:flex;justify-content:flex-start}
form.flex-col .rounded-xl.space-y-3 > .justify-between > .flex.items-center.gap-2 > span{white-space:nowrap}
}
@media (max-width:1023px){
/* 3 · DIRECTORY — folder cards become rows, store cards lose their dead space, small type 11 */
.grid.gap-4 > div.p-6.cursor-pointer{display:grid;grid-template-columns:auto 1fr;column-gap:12px;align-items:center;padding:10px 14px}
.grid.gap-4 > div.p-6.cursor-pointer > div:first-child{margin:0}
.grid.gap-4 > div.p-6.cursor-pointer > div:first-child > div:first-child{width:44px;height:44px}
.grid.gap-4 > div.p-6.cursor-pointer > h3{margin:0;font-size:15px;grid-column:2;grid-row:1;align-self:end}
.grid.gap-4 > div.p-6.cursor-pointer > p{grid-column:2;grid-row:2;font-size:11px}
.grid.gap-4 > div.p-6.cursor-pointer > div:first-child{grid-row:1 / span 2}
.grid.gap-4 > div.p-5.cursor-pointer{padding:12px}
.grid.gap-4 > div.p-5.cursor-pointer > .mb-4.pb-4{margin-bottom:10px;padding-bottom:10px}
.grid.gap-4 > div.p-5.cursor-pointer .grid.grid-cols-2.gap-4.mb-4{margin-bottom:10px;gap:8px}
.grid.gap-4 > div.p-5.cursor-pointer button{min-height:44px}
.grid.gap-4 > div.p-5.cursor-pointer .text-\[10px\]{font-size:11px}
.max-w-5xl .w-fit.p-3 > button{min-height:44px}
.max-w-5xl h4.text-\[10px\]{font-size:11px}
.max-w-5xl .grid.gap-4 p.text-\[10px\]{font-size:11px}
}
```

## Open question raised with the boards

❓ The four-level folder tree is the boss's organiser. A T5 salesman has own-region access only —
should the phone skip straight to his region's shops (one list under the search) instead of
Indonesia → provinsi → kabupaten → kecamatan? Behaviour change, T5/T6 only; not rendered.

## Decision

**Three YES + one addition + the ❓ answered NO, 2026-09-17 10:00.** His words: *"yes to all but on the customer directory i want the customer name to be alphabetically in order so that its easier to find them, for the question that u ask i think just let it be like that do not need to change anything"*. Mid-build: *"i want the textbox background to be dark when use darkmode and light when use light mode because right now it is white inside dark mode and it is too bright bro"*. Shipped kpm `a9822ff` (the commit message carries every class): `showForm` seeded from the width, the 48 px gold button under lg, Edit opens / save folds; every box 44 with `bg-[var(--inset)]` on the raised card and `bg-[var(--raised)]` inside the inset blocks; Auto-Find / My GPS a half each; folder rows; shop cards 222 → 199; Edit / breadcrumb 44; shops `localeCompare(..., 'id', { sensitivity: 'base' })`. Guards 1587 (red 8 first), audit 722, desk 1280 unchanged. Trap found: `index.css` `button:has(> svg:only-child)` — an icon + text button counts as icon-only (text nodes are not children), so it went inline-flex over `lg:hidden`; the label is a span now. ✅ TEST owed on his phone.

## Rejected on purpose

- Reordering the desk too — he was not asked; the desk's order is a separate call.
- Hiding the FOLDER button from T5 — a permission question, not a phone one; noted, not changed.

## Models applied

Opportunity Cost (the order fix is worth more than every 44 px together — it is the tap he pays on
every lookup); Second-Order (folding the form changes the edit path: edit must open it); Chesterton's
Fence (the folder tree is the boss's structure — asked, not flattened).
