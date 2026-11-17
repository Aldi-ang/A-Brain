---
name: delegate-coding-task
description: Use this skill whenever the user wants to hand off a coding task, bugfix, feature, or investigation to an autonomous coding agent (Claude Code, Cowork, or similar) rather than doing it directly in this conversation. Trigger on phrases like "write a prompt for Claude Code", "make Cowork do X", "delegate this", or any request to fix/build something in a real codebase that isn't a trivial one-line answer. Also trigger when the user wants to reduce token/usage costs on agentic coding tools, or wants a repeatable, reliable way to hand off investigation-heavy or security-sensitive changes. Encodes a token-efficient, high-reliability prompt structure built from real recurring failures (lost work in abandoned git worktrees, commit messages that didn't match their actual diffs, permission checks that matched the UI but not the backend rules).
---

# Delegate Coding Task

A reusable structure for writing prompts to autonomous coding agents operating on a real
codebase. Two goals at once: use fewer tokens per task, and catch more real bugs before they
reach production — these aren't in tension if the prompt is built right.

## The core prompt structure — use this shape every time

1. **Context.** The problem, why it matters, and any *already-known* facts so the agent
   doesn't spend tokens re-discovering them. If a project has a facts/architecture reference
   file (see below), point to it here instead of re-explaining everything inline.
2. **Investigate first.** For anything beyond a one-line fix, require the agent to confirm the
   actual current code matches what's described *before* changing anything. Never let it
   assume the bug report is 100% accurate — bug reports are sometimes wrong about *why*
   something fails even when they're right that it fails.
3. **What to do.** The actual task, scoped tightly. One task per prompt where reasonable;
   batch together only genuinely independent, already-understood, low-risk items.
4. **Scope guardrails.** Explicitly say what NOT to touch. This is often what saves the most
   tokens — an unscoped agent will "helpfully" wander into unrelated refactors.
5. **Verify.** What actually proves this works. For anything risky, require real executed
   evidence (a test run, an emulator, a live trace) — not just "the code looks correct."
6. **Output format.** Ask for: files changed, a plain-language explanation, what to test.
   Keeping this consistent makes every report fast to review, which is where a human's time
   actually gets spent.

## The mandatory anti-recurrence check — every single time, no exceptions

Before any task is described as "done," or any commit is made: **diff the actual staged/
committed content against the literal claim being made about it, file by file.** This one
check would have prevented two separate real incidents in this project where a commit message
described finished work that the actual commit didn't contain — the real code was left behind,
uncommitted, in an abandoned git worktree, and nobody noticed until much later live testing.

Bake this in as a required last step of every prompt: *"before committing, run the equivalent
of `git diff --cached --stat`, list every file the commit message is about to claim, and
confirm they match exactly — stop if they don't."*

## Token-efficiency principles

- **Reference, don't restate.** If a persistent project-facts file already covers the
  architecture, don't re-explain it inline — point to it.
- **Scale prompt ceremony to risk, not to task size.** A one-line typo fix needs almost no
  process. A security/permission change needs the full investigate → test → draft-not-deploy
  treatment every time, no matter how small the diff looks.
- **Batch only genuinely-independent, low-risk items.** Never bundle a real judgment call (a
  design decision with trade-offs) in with mechanical, already-decided fixes — resolve the
  judgment call first, execute afterward.
- **Check for orphaned work after any abandoned session.** If an agent's work was ever left in
  a separate worktree/branch and not obviously merged, explicitly check for forgotten real work
  before starting something new — cheap to check, expensive to lose.

## Escalated rigor for security/authorization changes — always, regardless of how small

Any change to server-side permission enforcement (security rules, auth checks, anything
gating who can read/write what) gets extra treatment every time:
- Investigate the *actual current* enforcement directly — never trust a code comment
  describing what was *supposed* to happen, or an assumption that a past fix is still live.
  When in doubt about whether something is actually deployed/live, check the real system
  directly (the actual console, the actual running app) rather than inferring from documents
  or memory.
- Test against a real rules-emulator or equivalent — executed evidence, not reasoning alone.
- Never auto-deploy. Leave it as a reviewed, tested draft for the human to deploy themselves,
  physically present for it, with an immediate post-deploy verification pass afterward.

## Recognizing the recurring "UI says yes, server says no" bug class

Watch for: a client-side permission check using a narrower, broader, or simply *different*
condition than what the backend actually enforces. This exact bug shape has recurred multiple
times across unrelated features in real projects. When investigating any permission-gated
feature, check **both sides** against each other explicitly — what the UI allows, and what the
backend actually allows for the same action — don't assume they already agree just because
nobody's complained yet.

## Using a project-specific facts file

If working within a project that has established architecture facts, a tier/permission
system, or known recurring gotchas, check for a project-specific reference file (e.g.
`references/<project-name>-facts.md` alongside this skill) and load it instead of re-deriving
any of this from scratch. If no such file exists yet for a project you're working in
repeatedly, consider creating one — it pays for itself after the second or third session.
