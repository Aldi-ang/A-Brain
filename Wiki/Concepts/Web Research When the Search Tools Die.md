---
title: "Web Research When the Search Tools Die"
description: The working fallback for web research here when WebSearch, WebFetch and firecrawl all fail - DuckDuckGo's HTML endpoint in the built-in browser, read with one JS line.
type: concept
created: 2026-10-03
updated: 2026-10-03
confidence: high
checked: 2026-10-03
tags: [research, tooling, browser, fallback]
---

# Web Research When the Search Tools Die

On 2026-10-03 every search tool failed at once: `WebSearch` died with
*"There's an issue with the selected model (cc/claude-haiku-4-5-20251001)"* (the haiku route),
`firecrawl_search` refused keyless access, and Bing in the built-in browser threw a CAPTCHA on
the second query (never solve those).

**What worked:** the built-in browser on `https://html.duckduckgo.com/html/?q=<query>`, then one
`javascript_tool` call instead of `get_page_text` (which wastes ~700 chars on the region list).
The line maps every `.result` node to `title | url | snippet` using the `.result__a`,
`.result__url` and `.result__snippet` selectors, first 6 results.

Batch several `navigate` + that line pairs in one `browser_batch`: 3-4 queries per round trip.
Snippets carry dates and numbers, which was enough to verify 9 of 11 claims for
[[Tembakau Rajangan 2026 - Panas, Aroma Tipis, Imbon Molor]].

**Reading a full page:** `await fetch(location.href).then(r=>r.text())` from inside the page, strip
the tags, regex for the sentence. Works when `innerText` is empty (lazy or shadow-DOM pages).

**Viewing a private artifact:** the browser pane is not signed in to claude.ai, and signing in
is not ours to do. Serve the scratchpad through a temporary `.claude/launch.json` entry
(`npx vite <scratchpad> --port 4195`), give the LAB view charset + viewport meta (never the
published file), remove the entry after.
