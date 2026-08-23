---
title: "n8n Automation Templates Archive"
description: A local, permanent copy of the awesome-n8n-templates repo — 347 ready-made automation workflows — plus how to find one. Kept because upstream can vanish.
type: summary
created: 2026-08-23
updated: 2026-08-23
confidence: high
checked: 2026-08-23
tags: [reference, automation, n8n, archive]
---

# n8n Automation Templates Archive

Aldi's ask, 2026-08-23: *"make sure that we saved this github even when the owner delete all of
this on purpose this could be useful for us in the future"*.

**n8n** is a self-hosted automation tool — you wire services together (Gmail → Sheets → Telegram)
without writing code. Each template here is one ready-made wiring, exported as JSON, that can be
imported into n8n and edited.

## What is saved, and where

| | |
|---|---|
| Source | `github.com/enescingoz/awesome-n8n-templates` (CC-BY-4.0) |
| Copied | 2026-08-23, `git clone --depth 1` |
| Location | `A-Brain/Archive/awesome-n8n-templates/` |
| Size | 8.1 MB · 392 files · **347 workflow JSONs** across 19 categories |
| Full index | [[n8n-workflow-index\|Archive/n8n-workflow-index.md]] — every workflow, its node count, and the services it touches |

**The upstream `.git` was deleted on purpose.** These files are now ordinary files committed into
A-Brain, so they survive even if the original repo is taken down — which is the whole point. The
cost of that choice: `git pull` cannot update them. To refresh, re-clone and re-run the index.

## Categories

| Category | Workflows |
|---|---|
| OpenAI and LLMs | 92 |
| Other Integrations and Use Cases | 45 |
| AI Research RAG and Data Analysis | 43 |
| Gmail and Email Automation | 26 |
| Telegram | 26 |
| Google Drive and Google Sheets | 21 |
| PDF and Document Processing | 18 |
| Instagram Twitter Social Media | 14 |
| Notion | 10 |
| Slack | 9 |
| WhatsApp | 8 |
| WordPress | 6 |
| Airtable | 5 |
| Database and Storage | 5 |
| devops | 5 |
| Discord | 4 |
| Forms and Surveys | 4 |
| HR and Recruitment | 4 |
| Other | 1 |
| (repo root) | 1 |

## How to use it

1. Search the index by what you want to connect — the "Main integrations" column lists the real
   services each workflow touches (`telegram`, `googleSheets`, `openAi`, …), plumbing stripped out.
2. Open the matching `.json` under `Archive/awesome-n8n-templates/<Category>/`.
3. Import it into n8n and set your own credentials.

**n8n is NOT installed on this machine** (checked 2026-08-23: not on PATH, no `~/.n8n`). This is a
parts bin for later, not a live system. Nothing here runs on its own.

## Honest limits

- **8 of 347 files are malformed JSON upstream** and could not be indexed. They are still saved.
  Named at the bottom of the index.
- These are community templates. **Review one before running it** — a workflow can touch real
  accounts and send real messages. The upstream README says the same.
- Frozen at 2026-08-23. Upstream keeps adding; this copy will not.

## Related

- [[../../Automation-Setup|Automation-Setup]] — what automation is actually live on this machine.
