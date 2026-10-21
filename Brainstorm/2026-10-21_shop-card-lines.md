---
date: 2026-10-21
status: OPEN — waiting on Aldi (A or B)
---
# Customer Directory: the shop cards get clear lines

## The problem, in his words
> *"btw i want u to add line and well format because the customer cards looks too smooth without any literature or anything here as u can see not even the lines toseparate the information"* (2026-10-20, with a screenshot of Asyifa Mart Madura and Endang CELL)

## What the code does today (read 2026-10-21)
| # | Fact | Where |
|---|---|---|
| F1 | The card already has two rules (under the head, over the keys), both `--line` #26231F = 1.3:1 on the card. theme.css calls it "decorative only". Present and invisible. | `CustomerManager.jsx` ~1643, ~1689; `theme.css:100` |
| F2 | The two facts (T3/T4 PIC, NOO BY) are 12 px values under 11 px labels. His taste file: text he must read starts at 15 px. | ~1673-1681 |
| F3 | BUG: a long name ("Warung Sumber Rejeki") pushes the ⋯ key past the card's right edge at 375. The head's left group has no `min-width:0`, so the name's `truncate` never fires. | ~1644 |

## The options (board sent 2026-10-21 08:01, lab looks `card-a` / `card-b`, kpm `8c6b425`)
| | What it is | Cost |
|---|---|---|
| **A — Bands** | Name on its own darker (inset) strip; a `--line-3` rule under it and over the keys; the two facts split by a column rule; values 15 px | Card 141 → 149 px at 375 (+8). On the PC the key row gets its own strip. |
| **B — Spec sheet** | One `--line-2` hairline row per fact, label left, value right; `--line-3` under the head; values 15 px | Card 141 → 174 px at 375 (+33): four shops cost about one extra card of scrolling. He has rejected "too much going on vertically" on the phone before (2026-09-01). |

Both carry the F3 fix — it is a bug, not an option.

## Decision
OPEN — waiting on Aldi.

## Rejected on purpose
- **Recolouring `--line` itself.** It is shared by hundreds of edges that are meant to be quiet; brightening it would add lines everywhere, against his 2026-08-27 law ("hierarchy is made of space, not of more lines"). The fix stays on this card.
- **Gold rules between sections.** Amber is an edge and an ink, never a slab — but a gold line under every shop in a list of forty would turn the accent into wallpaper. Gold stays on the press (the charge line) and the hover edge.
- **Adding new facts (address, phone) to the card.** "literature" could mean more text; nothing he said names a field, so the boards show today's facts only. Ask if he says the card still looks empty after the lines land.

Models applied: Chesterton's Fence (why `--line` was decorative before brightening it), Second-Order Thinking (B's height on a phone list), Opportunity Cost (a field nobody asked for vs the lines he did).
