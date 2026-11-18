---
title: "Customers screen - three concepts (A sheet, B visit board, C area tree)"
created: 2026-11-18
status: DECIDED 2026-11-18 - C (area tree)
---
# Customers screen - three concepts

**PROBLEM (his words, 2026-11-18):** *"i think i want u to make other redesign that this because it is standardised and too similar with other segment and also since this data is a lot u need to redesign it so that it could be more tidy do u have concept to make this easier?"* The v5 list + shop-in-hand picture (artifact MnDZdz9gMEq6aMyDBGhaxL) was rejected as too similar to Receivables/Reports, and a card list does not hold 600+ shops tidily.

**OPTIONS** (board: kpm `.claude/drafts/customers-concepts.html`)

| | Concept | Answers | Holds 600 shops by |
|---|---|---|---|
| A | The sheet | "show me all, let me sort and group" | 30 px table rows (~14 per screen), group-by chip, side drawer |
| B | Visit board | "who needs a visit, who is behind" | 4 columns by visit rhythm (Late / Due this week / Fine / Never), sorted by need |
| C | Area tree | "how is each area doing" | Prov > Kab > Kec tree with count + late bar, area facts, then its shops |

**COSTS:** A = most data per screen, least "visual"; closest to a spreadsheet. B = action-first, but finding one shop by name needs search; 527 "Fine" shops hide in one column. C = matches the folders he already uses, but two clicks to a shop.

**DECISION (2026-11-18):** C, the area tree - his words *"c looks the best"*, after board v2 showed every feature in all three (https://claude.ai/artifact/LMBj8wJEqRe5ryrpqe5F3N).

**REJECTED ON PURPOSE:** the same master-detail as Receivables/Reports (his "standardised"); a map as the directory (Map System is its own segment).

Models applied: Inversion (what makes 600 rows untidy: one shape per row, no grouping), Opportunity Cost (each concept trades search speed for action focus).
