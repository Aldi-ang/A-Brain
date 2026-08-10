---
title: 9Router Subordinate AI Delegation
description: Practice of delegating grunt-work subtasks to free/cheap models via 9Router, and logging what each model is actually good at so future prompts to them get sharper.
type: concept
created: 2026-07-31
updated: 2026-07-31
confidence: high
checked: 2026-07-31
tags: [tooling, 9router, ai-delegation, cost]
---

# 9Router Subordinate AI Delegation

Aldi runs [9Router](https://github.com/decolua/9router) locally (`http://localhost:20128`),
an OpenAI-compatible gateway that fans out to 40+ AI providers/models behind one endpoint.
Claude Code (this session) can `curl` it directly from Bash — no install, no new tool, just
an HTTP call — to hand a subtask to another model instead of generating it itself.

## The actual mechanism

```bash
curl -s http://localhost:20128/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"kr/deepseek-3.2","messages":[{"role":"user","content":"..."}]}'
```

That's it. No API key required locally (auth disabled on this instance). Response comes back
as the model's text; Claude Code reads it, verifies it, uses it.

## What this is NOT

Not the built-in Agent/subagent tool — that only ever spawns Claude models (sonnet/opus/
haiku/fable), no config slot for anything else. This is a manual, curl-based delegation path
that exists because Claude Code has generic Bash access, not a native Claude Code feature.

Also does not make "Claude Code usage never run out" — Claude Code (this agent) still runs
every turn and decides when to delegate; that's still Claude token spend. What it *does* do:
push the heavy *output* generation for a subtask onto a cheaper/free model, so Claude spends
tokens reviewing instead of generating.

## Why this page exists

Aldi's ask: capture what each subordinate model turns out to be good (or bad) at, so future
delegation prompts are sharper instead of re-learning the same thing every session — "learn
cheap, with someone else's tokens." Append a dated entry below every time a subordinate call
teaches something non-obvious. Don't log routine successes with no new information.

## Confirmed free tiers (2026-07-31)

Three providers connected and free, no card required:

- **Kiro AI** (`kr/` prefix) — `kr/claude-sonnet-4.5`, `kr/claude-haiku-4.5`, `kr/glm-5`,
  `kr/MiniMax-M2.5`, `kr/qwen3-coder-next`, `kr/deepseek-3.2`. Login via AWS/Google/GitHub,
  no API key, unlimited.
- **OpenCode Free** — no auth at all, models auto-fetched.
- **Vertex AI** — needs a GCP service account JSON; $300 free credit for new accounts (90
  days), then paid.

**Kimi is NOT free** despite looking like it belongs in the same bucket — README prices it at
$9/month flat (`kimi/kimi-k2.5`, `kimi/kimi-k2.5-thinking`), and the dashboard's key-check
returns "Invalid" when the Moonshot account balance is $0, even with a real key pasted in.
Not worth chasing; the `kr/*` free tier already covers Claude/GLM/MiniMax/DeepSeek/Qwen at
zero cost.

## Delegation log

**2026-07-31 — test 1, Minecraft Forge bug (synthetic, ~60-word question)**
Model: `kr/deepseek-3.2`. Correctly spotted inverted boolean condition in 3 sentences.
Cost: `0.024` kiro_credits. Note: `prompt_tokens: 3040` for a short question — 9Router injects
a system prompt overhead; fine for occasional use, would add up at volume.

**2026-07-31 — test 2, Coin flip animation video (real, heavy-output delegation)**
Model: `kr/deepseek-3.2`. Prompt: write complete production-ready Remotion React video component
(coin flip, 3D rotation, random heads/tails, bounce physics, intro/outro). Delivered 2500+ tokens
of full TypeScript code, zero stubs, ready to render. Cost: `0.071` kiro_credits.
**Why this matters:** This is the intended use case — DeepSeek handled ~2500 tokens of boilerplate
code generation, Aldi's Claude subscription stays intact for verification + orchestration. Saves
Claude's quota on heavy-output tasks; subordinate handles volume.

Model: `kimi/kimi-for-coding` — 401 "invalid or expired" on the same call. Root cause found
later: Moonshot account had $0 balance, not a bad key. See "Confirmed free tiers" above.

**2026-08-01 — the endpoint STREAMS by default. This is the big one.**
`/v1/chat/completions` returns **SSE chunks** (`data: {...}` lines, one per delta) unless the
request body sets `"stream": false`. A naive `json.load()` on the saved response fails with
`JSONDecodeError: Expecting value: line 1 column 1` — which reads exactly like an empty or
failed response and sends you hunting for auth/rate-limit problems that do not exist. The
calls were succeeding the whole time.

Two fixes, either works:
- Add `"stream": false` to the JSON body (preferred — simplest).
- Or parse the SSE: concatenate `choices[0].delta.content` across `data:` lines.

Note the asymmetry that makes this extra confusing: **error** responses come back as a single
plain JSON object, so failures parse fine and successes do not. Errors look healthy, successes
look broken.

**2026-08-01 — model-id gotchas on the Kiro backend**
- `kr/gpt-5.6-*` (sol / terra / luna) appear in `GET /v1/models` but return
  `{"reason":"INVALID_MODEL_ID"}`. Listed ≠ usable. Always fall back to the confirmed-free six.
- The `-thinking` / `-agentic` suffixed variants (`kr/claude-sonnet-4.5-thinking`, etc.) return
  `{"reason":"REQUEST_BODY_INVALID"}` on a plain chat-completions body. **Use the plain ids.**
- Sanity-check a new model id with a one-word "reply PONG" call before sending a long prompt —
  the failure is instant and costs nothing, and it isolates model-id errors from body errors.

**2026-08-01 — prompt overhead confirmed again:** a ~10-word ping billed `prompt_tokens: 4132`.
Consistent with the 2026-07-31 note; 9Router injects a sizeable system prompt. Delegation is
worth it for heavy *output*, never for many small round-trips.

## Related

- [[Ponytail Philosophy]] — same "minimum that actually works" instinct applied to which
  model does a subtask, not just how much code gets written.
