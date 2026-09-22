// Round two of the Fleet & Roster job: the ROSTER look and the LOADING motion.
// Every number in a caption was measured in the pane at 518 after the option was drawn.
// Run: node board2.mjs
import { frame, page } from './shoot.mjs';

const PC = 2000;
const PH = 518;

/* ── THE ROSTER, on his PC — crop the left column, where the whole difference lives ────────── */
const ROSTER = [
  ['r-a-pc.png', '<b>A — THE BAY PLATE</b> · the photo, the number plate, and how full the van is right now (484 of his usual 600). Flat, fast, nothing new to learn.'],
  ['r-b-pc.png', '<b>B — THE VAN CRATE (3D)</b> · the same box the sales terminal already draws, one per person: a loaded van is a deep crate, an empty one a flat pallet. It turns once when you pick the person.'],
  ['r-c-pc.png', '<b>C — THE REGION FOLDER</b> · your warehouses as folders (Bandung open, Semarang shut), the people inside. Same folders as Customers and Sampling.'],
];
page('board-roster',
  ROSTER.map(([png, cap]) => frame(png, 40, 140, 430, 660, cap, PC, 1.05)),
  Math.round(430 * 1.05) * 3 + 24 * 4, Math.round(660 * 1.05) + 24 * 2 + 150, 150);

/* ── THE ROSTER, on the phone (518 — the phone CSS, not a pinned desk) ─────────────────────── */
const ROSTER_PH = [
  ['r-a-phone.png', '<b>A</b> on the phone'],
  ['r-b-phone.png', '<b>B</b> on the phone'],
  ['r-c-phone.png', '<b>C</b> on the phone'],
];
page('board-roster-phone',
  ROSTER_PH.map(([png, cap]) => frame(png, 0, 60, PH, 520, cap, PH)),
  PH * 3 + 24 * 4, 520 + 24 * 2 + 40, 40);

/* ── THE LOADING MOTION — the basket band only, two moments each ───────────────────────────── */
const X = 470, Y = 455, W = 1500, H = 330, S = 0.98;
const MOTION = [
  ['m-a-mid.png', '<b>1 — THE CARGO FLIES</b> · at 0,7 s: three crates on their way to the tally, one per line, in the order you added them.'],
  ['m-a-end.png', '<b>1 — landed</b> · the 760 Bks figure gives one pump and the van’s MUAT key dips on its suspension. ~1,2 s in all.'],
  ['m-b-mid.png', '<b>2 — THE SURAT JALAN STAMPS</b> · at 0,33 s: a gold line sweeps the list and each row greys out as it is counted.'],
  ['m-b-end.png', '<b>2 — stamped</b> · SURAT JALAN lands at 0,8 s. This is the same scan-and-seal the boss’s EOD sheet already uses — almost nothing to build.'],
  ['m-c-mid.png', '<b>3 — THE ROLLER DOOR</b> · at 0,43 s: the bay shutter comes down over the list, MEMUAT… showing through the slats.'],
  ['m-c-end.png', '<b>3 — open again</b> · at 0,98 s the door lifts on the loaded van. The longest of the three, ~1,1 s.'],
];
page('board-motion',
  MOTION.map(([png, cap]) => frame(png, X, Y, W, H, cap, PC, S)),
  Math.round(W * S) + 24 * 2, (Math.round(H * S) + 74) * 6 + 24 * 3, 66, 'column');
