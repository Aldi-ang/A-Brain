---
title: The save button on the manifest paper
created: 2026-11-04
status: DECIDED B, built + live kpm 9eae2d1
tags: [kpm, sales-terminal, design, brainstorm]
---

# The save button on the manifest paper

**Problem, his words (2026-11-03, with `Raw/2026-11-03-hq-bugs/save-button.png`):** *"why is the button become like this"*.

**Cause, measured in the lab (`Raw/2026-11-04-save-button/board.mjs`):** the fill is old (the gradient has been there since at least June), the wrap is new. `c76408e` made MAKE DEAL into SIMPAN TRANSAKSI; at `lg:text-2xl` + `tracking-[0.2em]` the PC button (368 px wide) goes to 2 lines and from 68 to 100 px tall, and the bolt is pushed to the edge. On the phone it still fits on 1 line. The amber slab itself breaks [[Aldi's Design Taste]]: 2026-08-21, the SLAB vs MARK refinement, 2026-10-31 *"too bright"*, 2026-11-02 *"even the fill color is bad"*.

**Rule from him that shaped the options (2026-11-03, PHOTO CORNER):** on the manifest, a control should look printed on or pasted into the paper, not a device sitting on it.

## Options

Board: `Raw/2026-11-04-save-button/board.png`. Every frame is the real button, reached by the real steps (cart, shop, photo on Chrome's fake camera), with the option as CSS. Measured: all three are 1 line on phone and PC, 48 px on the phone (same as today), 56 px on PC. Lite Mode shot for each, no console errors.

| | Look | Cost |
|---|---|---|
| A PRINTED BLOCK (recommended) | Solid black ink, thin inner line, amber bolt | A dark plate; the MODE switch on this paper is already one |
| B RUBBER STAMP | No fill, double ink line | Easiest of the three to overlook |
| C WAX SEAL | Ink frame, small amber disc around the bolt | Busiest; the seal adds an element the paper has nowhere else |

All three cost the same to build, on this one button.

## Decision

**His pick, 2026-11-04:** *"i like B better"*. Built + live `9eae2d1` as `.kpm-save-stamp`. Proof: `Raw/2026-11-04-save-button/built-board.png`. My recommendation was A; he took the one that looks most like the paper.

**How it was built:** a theme.css class with fixed ink (it is printed on the paper in both themes), the words in a `<span>` (lesson: an icon beside a bare text node keeps the 44 px min-height), press = 1 px sink and darker ink, `:disabled` as on the board. Both Retur types use the red version: the MODE switch and the Retur type control already say which one it is (today: brass for exchange, red for refund). One line + a check that the label never wraps at PC.

**Also found, not asked:** the two "Same as last time" buttons (MerchantSalesView.jsx ~2685, ~3067) carry the same wide amber fill.

## Rejected on purpose (by me, he has not seen these)

- Keeping the amber fill and only fixing the wrap: fixes the symptom he named and breaks his law a fourth time.
- Brass, or any lighter gold plate: his 2026-11-02 verdict.
- Shortening the label: SIMPAN TRANSAKSI came from the language switch he asked for; a smaller, tighter word fits it.
- taste-skill's bans on serif and on the paper palette: his taste file outranks them, and the skill itself says it is not for product UI.

Models applied: Chesterton's Fence (the fill predates the complaint, so find what changed first), Inversion (what guarantees another "i hate it": any fill in amber or brass).
