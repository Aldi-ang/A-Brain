---
name: expand-and-contract
description: Help the user decide what's in scope for an idea by aggressively expanding it into every possible thing it COULD include, then sorting each item into one of four scope buckets (Core / Nice-to-have / Maybe-later / Out). Use this skill whenever the user is trying to figure out the boundaries of an idea — what's in, what's out, what's parked for later. Trigger on phrases like "what's in scope", "help me scope this", "decide what's in or out", "narrow this down", "what should this include", "expand and contract", "make this concrete", or any time the user has a seed idea and seems unsure how big or small to make it. Use this skill even when the user doesn't say "scope" explicitly — whenever they bring a half-formed idea and the real question is "how big should this be?", this is the right tool. Do NOT use for fully-formed, concrete tasks where the scope is already settled (e.g., "write me a YouTube script for episode 1").
---

# Expand and Contract

A skill for deciding **what's in scope** for an idea. The user brings something like *"I want to start a personal finance YouTube channel"* — you expand it into every possible thing it *could* include (be maximalist), then sort each item into one of four buckets so they walk away knowing exactly what's in, what's out, and what's parked.

The name captures the shape:
- **Expand** = generate a wide, maximalist list of everything this idea *could* contain. Features, audiences, formats, integrations, related opportunities, adjacent extensions — go big.
- **Contract** = sort each candidate into Core / Nice-to-have / Maybe-later / Out. This is the real work. Drawing the fence is what makes the idea concrete.

The fence (Out bucket) is as important as the contents (Core bucket). Knowing what you're *not* doing is what gives you permission to say no later.

## Interaction principle (read before every user interaction)

**Every prompt Claude issues to the user in this skill goes through the `ask_user_input_v0` interactive tool — never through plain-text questions.** The skill is built around fast, low-friction choice-making; typing prose answers breaks the rhythm and defeats the point.

This applies to:
- The pre-sort review of the expanded candidate list
- Every bucket-sorting pass (Core, Out, Maybe-later)
- Per-item trigger selection for Maybe-later items
- The final scope confirmation
- Any mid-flow correction or "move this item" handoff

Allowed question types: `single_select`, `multi_select`, `rank_priorities`. No question Claude *asks* the user should require a typed reply. (The user is of course free to type freely at any point — but Claude should never *prompt* for typed input.)

If a question genuinely seems to require open-ended text, reframe it as a choice. For example, instead of "What's the trigger for parking this until later?" → offer 3–4 generated trigger options as a `single_select` with "Actually, this is Out" as the escape hatch.

## When to use this skill

Trigger on any seed idea where the real question is "how big should this be?" or "what's in or out?":
- "I want to start X" / "I'm building Y" / "I'm thinking about Z"
- "Help me scope this"
- "What should this include?"
- "I keep adding more to this — help me cut"
- "What's the MVP?"

Use it across domains: a content channel, a side business, a software project, a career move, a creative work, an event, a renovation, a course curriculum.

Do NOT use when scope is already settled and the user wants execution help.

## The four scope buckets

Every candidate item gets sorted into exactly one bucket:

| Bucket | Meaning | Example for a personal finance YouTube channel |
|---|---|---|
| **Core** | Must exist or this isn't the thing. The non-negotiable spine. | Weekly long-form video, talking-head format, contrarian POV |
| **Nice-to-have** | Real value, will probably ship in v1 if time permits, but cutting it doesn't break the idea | Custom thumbnail style, opening hook formula, email newsletter |
| **Maybe-later** | Genuinely good — but explicitly parked for v2+. Not abandoned, just not now. | Shorts channel, paid course, podcast spin-off, sponsorships |
| **Out** | Explicitly not doing. The fence. Saying no to these now prevents future drift. | Live streaming, daily uploads, financial advisor certification, individual stock picks |

Two rules about the buckets:

1. **Out is a feature, not a residual.** Items go in Out *deliberately*, not just because they didn't make Core. The Out list is where the user grants themselves permission to refuse scope creep later.
2. **Maybe-later is not a parking lot for indecision.** It's reserved for items that are genuinely strong but timing is wrong. If the user can't articulate when it *would* be ready ("after I have 1,000 subscribers", "after the first product ships"), it probably belongs in Out instead.

## Workflow

Four phases. Move through them in order. Do not skip the visualization.

### Phase 1: Expand — generate a maximalist candidate list

When you receive a seed idea, do NOT ask "what's your goal?" or "who's your audience?" Don't ask for clarification before doing the work. Go straight into expansion.

Analyze the idea and generate a **flat, maximalist list of candidate scope items** — every concrete thing this idea *could* include. Be wide. Surface things the user hadn't even considered. The point is to give them a real choice space, not a tidy starter set.

**Size the expansion to the idea's complexity:**

| Complexity | Target item count | Examples |
|---|---|---|
| Simple | 8–12 items | A weekly habit, a small experiment, a single event |
| Standard | 12–18 items | A content channel, a side project, a course |
| Complex | 18–25 items | A business, a multi-month creative work, a career pivot |

**What counts as a candidate item:**
- A concrete feature, format, or component ("weekly video", "email newsletter")
- A specific audience segment ("beginners", "people with $100k+ portfolios")
- A distribution channel ("YouTube", "Substack", "TikTok cross-post")
- A monetization or operating decision ("sponsorships", "paid course", "Patreon tier")
- An adjacent extension ("podcast version", "live Q&As", "Discord community")
- A boundary or operating principle ("no financial advice", "always show real numbers", "no clickbait titles")
- A production/process choice ("scripted vs improvised", "professional editor vs DIY")

Mix concrete items (a feature) with operating choices (a principle). Both shape scope.

**Don't generate items by category.** A flat list is the goal — categories will collapse into the sorting phase. You can lightly group during presentation if it aids readability, but the list itself should be a single stream of candidates.

**Before sorting, present the expanded list as a clean numbered list in the message**, followed by a brief framing line ("Here's what this idea *could* contain — be ruthless about cutting; that's the whole point"). Then immediately call `ask_user_input_v0` with a single `single_select` question:

> **"Ready to start sorting?"**
> - "Looks good — start sorting"
> - "Remove a few first — some don't apply"
> - "Re-expand — these aren't the right shape"

If the user picks "Remove a few first," follow up with a `multi_select` listing every candidate item, asking which to drop. Then proceed to sorting with the trimmed list. If they pick "Re-expand," generate a fresh list with a different angle (e.g., more boundary/principle items, less feature-heavy) and re-prompt.

Never ask the user to type new candidates via prose. If they freely offer additions in chat, accept them — but Claude does not *prompt* for free text.

### Phase 2: Contract — sort items into buckets

This is the heart of the skill. The sorting happens in **interactive passes** using `ask_user_input_v0`. Never present items as inline markdown lists for the user to type answers about — use the interactive checkbox tool.

**Approach: pass-by-bucket, batched.**

Sort items one bucket at a time, in this order:

1. **Core pass** — "Which of these are absolute must-haves?" (multi-select)
2. **Out pass** — "Of what remains, which are explicit nos? You're not doing these." (multi-select)
3. **Maybe-later pass** — "Of what remains, which belong in v2+?" (multi-select). After this selection, **immediately collect a trigger condition for each chosen Maybe-later item** via follow-up `single_select` calls. For each item, generate 3–4 contextually appropriate trigger options + an escape hatch. Example for "podcast version":
   - "After 20+ video episodes"
   - "After hitting 5k subscribers"
   - "After 3+ months of consistent weekly cadence"
   - "Actually, move to Out — no clear trigger"

   Batch these trigger questions up to 3 per `ask_user_input_v0` call; loop if there are more than 3 Maybe-later items. Items whose trigger answer is "move to Out" get reassigned to Out automatically.

4. Everything still unsorted becomes **Nice-to-have** by default. **Confirm the final scope via `ask_user_input_v0`** — present the four buckets in the message text, then call:

   > **"Final scope look right?"** (single_select)
   > - "Looks good — finalize and visualize"
   > - "Move a few items between buckets first"

   If the user picks "Move a few," follow up with a `multi_select` listing all items, asking which to move; then for each selected item, a `single_select` asking the new bucket. Loop until they pick "Looks good."

This ordering is deliberate. **Core first** captures conviction. **Out second** forces the hard nos before the user gets soft. **Maybe-later third** forces a credible parking criterion (no future trigger = it's Out). What's left is genuinely Nice-to-have — the v1 polish layer.

**Tool mechanics:**
- `ask_user_input_v0` caps at 3 questions per call and 4 options per question
- Group items into chunks of up to 4 and present multiple multi-select questions per call when needed
- For 12 items in the Core pass: 3 multi-select questions (4 items each) in one call
- For 20 items: 3 multi-select questions in batch 1 (12 items), then a second call for the remaining 8
- Question wording should always include the bucket framing ("Which of these are **Core** — must exist or this isn't the thing?")

**Adaptive sequencing:** if the Core pass reveals a strong direction, restate the leftover items in light of it before the Out pass (e.g., "You picked weekly long-form and contrarian — now, of what's left, what are you explicitly NOT doing?"). The user's Core choices reshape how the remaining items feel.

**Don't allow ambiguity to leak through.** Every item ends in exactly one bucket. If the user says "it depends" on something, ask one follow-up to force the call. The whole point of the skill is to produce a crisp scope.

### Phase 3: Deliver — the scope statement and bucketed list

Output has two parts:

**(a) A short scope statement** — 3–5 sentences that read as a confident description of *what this is and what it is not*. Lead with what's Core, then explicitly call out what's Out ("This is NOT a daily Shorts channel. Not a stock-picking show. Not a beginner explainer.") The "not" list is what makes the scope feel real.

**(b) The full bucketed list**, rendered as a clear markdown table or four-section list:

```
CORE (must exist)
- weekly long-form video
- talking-head format
- contrarian POV
- ~10 min episode length

NICE-TO-HAVE (v1 polish if time)
- custom thumbnail style
- email newsletter recap
- opening hook formula

MAYBE-LATER (parked for v2+)
- Shorts channel — after 5k subs
- Paid course — after 10k subs
- Podcast version — after 20 episodes

OUT (explicitly not doing)
- daily uploads
- live streaming
- financial advisor certification
- individual stock picks
- sponsorships in year 1
```

Maybe-later items should include the **trigger** that would activate them ("after 5k subs", "after the first product ships"). No trigger = should have been Out.

Then surface **2–3 watch-outs** — things the scope choices imply that the user may not have noticed. Examples:
- "Your Core list adds up to ~6 hours per episode. Multiply by 50 weeks — that's 300 hours/year. Block the time before episode 1 or the scope will eat it for you."
- "You put 'sponsorships' in Out for year 1 — good. But that means revenue in year 1 is exactly $0. Decide now if that's OK or if a single Nice-to-have monetization (Patreon? affiliate?) should move into Core."

### Phase 4: Visualize — concentric scope circles

Render the scope as **concentric circles** showing the four buckets from inside out:

- **Center: Core** (filled, strong accent color, items labeled inside)
- **First ring: Nice-to-have** (lighter fill, items labeled)
- **Second ring: Maybe-later** (lighter still, items labeled, with their trigger conditions if short)
- **Outside the outermost ring: Out** (items floating beyond the fence, struck through or dimmed, clearly visually outside)

The outermost ring's edge is **the fence** — the boundary between what's being done and what isn't. Make it visually prominent (heavier stroke, or a label like "the fence").

Call `visualize:read_me` with `modules: ["diagram"]` on first widget render in the conversation, then `visualize:show_widget`. If the widget tool fails or times out, fall back to a Mermaid diagram using nested subgraphs to approximate the concentric structure, with `classDef` styles distinguishing the four buckets.

**Visual style requirements:**
- Concentric circles, not boxes — the geometry communicates "inside vs outside" instinctively
- The Out items must be clearly *outside* the outer ring, not inside a fourth ring. They're past the fence.
- Use no more than 4 fill colors total (one per bucket), in a clear inside-to-outside gradient (saturated → muted)
- If items are too numerous to fit inside the circles legibly, abbreviate to 2–3 word labels and trust the bucketed list (Phase 3 output) to carry the detail

## Critical behaviors

- **Never prompt for typed input.** Every question Claude asks the user goes through `ask_user_input_v0` — single_select, multi_select, or rank_priorities. If a question seems to need free text, reframe it as a choice (see Interaction principle above).
- **Don't be timid in the expansion.** Maximalism is the point. Surface 20 items even if you know 15 will get cut — the cutting is the value.
- **Don't skip the Out bucket.** A list with only Core / Nice / Maybe is not a scope — it's a wishlist. The Out list is where the real boundary lives.
- **Don't let Maybe-later become a graveyard.** Require a trigger condition. No trigger = Out.
- **Don't ask before you start.** The user gave you an idea. Go straight into expansion, then check the list with them before sorting.
- **Don't use single-select for sorting.** Each item belongs to one bucket, but the natural interaction is "which of these are Core?" (multi-select), not "what's the bucket for item #1?" (one question per item, exhausting).
- **Don't render the visual as a list, table, or tree.** The geometry of concentric circles is doing real work — it communicates the fence at a glance.

## Anti-patterns to avoid

- Treating this as a generic prioritization (MoSCoW, RICE, etc.) — those are for backlogs, not scope decisions on a half-formed idea
- Producing a Core list that's so big it's actually a wishlist
- Producing an Out list of only 1–2 items — if there's nothing being said no to, the scope hasn't really been drawn
- Letting "it depends" leak through — every item must end in one bucket
- Asking the user to type bucket assignments instead of using the interactive checkboxes
- Asking *any* question via plain text instead of `ask_user_input_v0` — including confirmations, "does this look right?", "want to move anything?", and trigger-condition collection
- Treating Maybe-later as the default bucket when the user hesitates — most hesitation should resolve to Out
- Forgetting the trigger condition on Maybe-later items
- Rendering the visual as anything other than concentric circles with items clearly inside and outside the fence
