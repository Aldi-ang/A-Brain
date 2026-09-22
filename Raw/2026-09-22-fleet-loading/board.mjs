// Composes the two boards for the van-loading talk. Numbers in the captions were measured in the
// pane at 518 AFTER each option was drawn, never from the plan. Run: node board.mjs
import { frame, page } from './shoot.mjs';

const PH = 518;   // phone shot width
const PC = 2000;  // desk shot width
const pcS = 0.72; // desk frames scaled so the product rows stay readable

/* ── BOARD 1 — THE PHONE (518) ─────────────────────────────────────────────────────────────── */
const phone = [
  ['today-phone.png', '<b>TODAY</b><br>One product at a time.<br>The loading box starts <b>1001 px</b> down —<br>the whole roster scrolls past first.<br>3 products = 3 presses, 3 stock writes.'],
  ['a-phone.png', '<b>A — A PANEL inside Fleet &amp; Roster</b><br>Tap MUAT on a person; the bay opens<br>over the roster. First product <b>341 px</b> down,<br>the LOAD key at <b>789</b> — no scrolling.<br>One press loads the whole list.'],
  ['b-phone.png', '<b>B — ITS OWN SEGMENT</b><br>Opens straight on the loading job<br>(person → goods → surat jalan).<br>First product <b>304 px</b> down.<br>Fleet &amp; Roster keeps only the people.'],
];
page('board-phone',
  phone.map(([png, cap]) => frame(png, 0, 0, PH, 1010, cap, PH)),
  PH * 3 + 24 * 4, 1010 + 24 * 2 + 120, 120);

/* ── BOARD 2 — THE PC (2000 x 1000, his screen) ────────────────────────────────────────────── */
const desk = [
  ['today-pc.png', '<b>TODAY</b> — roster left, a one-product box right. Choose a product, type the qty, press LOAD. Each press is its own stock transaction.'],
  ['a-pc.png', '<b>A — A PANEL inside Fleet &amp; Roster.</b> Same screen, same two columns. The bay replaces today\'s one-product box: pick many, one LOAD key, one surat jalan.'],
  ['b-pc.png', '<b>B — ITS OWN SEGMENT.</b> A page for the loading job alone, with the day\'s loading history beside it. Fleet &amp; Roster loses the dock and keeps hiring + the roster.'],
];
/* stacked, not side by side: three 2000-wide desks in a row shrink to 0,42 and the product rows
   stop being readable — the board exists to be read, not to be wide */
page('board-pc',
  desk.map(([png, cap]) => frame(png, 0, 110, PC, 760, cap, PC, pcS)),
  Math.round(PC * pcS) + 24 * 2, (Math.round(760 * pcS) + 58) * 3 + 24 * 4, 50, 'column');
