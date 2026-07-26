---
type: concept
created: 2026-07-27
updated: 2026-07-27
tags: [tooling, code-quality, philosophy]
---

# Ponytail Philosophy

Ponytail is a Claude Code plugin/skill that governs *how* code gets written in the real
`kpm-inventory` repo — a real-time coding discipline, not a knowledge-capture tool like this
wiki. It runs invisibly during actual coding sessions; this page exists so the "why" behind
Claude Code's behavior is legible to the project owner instead of being invisible magic.

## The core idea

"Lazy means efficient, not careless." Before writing new code, climb a ladder of questions
and stop at the first rung that holds:

1. Does this need to exist at all? (YAGNI — skip speculative need)
2. Is it already in this codebase? Reuse a pattern that already lives here.
3. Does the standard library already do it?
4. Does a native platform feature cover it?
5. Does an already-installed dependency solve it?
6. Can it be one line?
7. Only then: the minimum code that actually works.

## Bug fix = root cause, not symptom

Before editing, grep every caller of the function about to change. The lazy fix and the
root-cause fix are usually the same fix — one guard in a shared function is a *smaller*
diff than patching every caller individually, and it's the only version that actually stops
a bug from resurfacing through a sibling code path.

## Rules worth knowing

- No unrequested abstractions — no interface for one implementation, no config for a value
  that never changes.
- Deletion over addition; boring over clever.
- A deliberate shortcut that cuts a real corner gets a `ponytail:` comment naming the ceiling
  and the upgrade path — not silently left unexplained.

## When it explicitly does NOT apply

Ponytail never simplifies away input validation at trust boundaries, error handling that
prevents data loss, security measures, or anything a human explicitly asked for. It also
never shortens the *reading* — tracing the actual flow through the codebase always happens
before picking a rung on the ladder.

## Related

- Every real bug-fix summary in this wiki (e.g. [[Fleet Captain Rule Gaps — Batch 1 and 2]],
  [[Lost Work in Worktrees — Three Incidents]]) reflects this discipline in practice —
  targeted fixes at the shared root cause, not scattered patches.
