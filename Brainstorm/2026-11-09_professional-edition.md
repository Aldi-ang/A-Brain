---
title: Professional edition - a serious face for customers, the game edition kept as his resume
created: 2026-11-09
status: answered - option C; plan next (his order: fix every open bug first)
tags: [brainstorm, business, redesign, certification]
---

# Professional edition

## His ask (verbatim, 2026-11-09)
> "i want to change most of the UI and make it as professional and as ergonomics as possible for business use, erase all
> the concept and animation for the gaming stuff ... make sure that all the logic inside this app will still be intact,
> what different is only the UI and button and animation and concept ... i want u to create this version of this app on
> the other project, i dont want u to overwrite this whole app, i want the recent app we build as my resume ... we might
> also need to prepare to find the certification for this app as well ... but of course all of this idea is after we
> have done all the fix and bug that exist right now"

## Facts that shape it (measured 2026-11-09)
- The look and the logic share files: App.jsx 5,835 lines, MerchantSalesView.jsx 3,768, FleetCanvasManager.jsx 1,835.
  A new face on those screens edits the same file that does the money math.
- Safety net that can PROVE "logic intact": logicFixes.selfcheck 2,855 checks, integration.audit 725, 17 rules-test files.
- One code already builds two apps: the demo build (`VITE_DEMO=1`, firebase.js IS_DEMO) on its own project kpm-demo-f4d74.
- The app is already multi-tenant (one Firebase project, every company under its owner's folder) - Wiki Multi-Tenant Architecture.
- His design taste file is full of game picks (nixie counters 2026-09-18 and 2026-11-08, "cooler more gamelike"); the
  professional edition reverses them for a different audience - not a reversal of his taste for the showcase.

## Options for "another project"
| | How | Cost |
|---|---|---|
| A. Copy, both kept alive | new repo, both get fixes | every fix twice forever; "logic 100% same" stops being true within weeks |
| B. One code, two looks | a build switch like the demo | every screen carries two faces; slow, complex |
| **C. Freeze + move on (recommended)** | the game edition is FROZEN as a showcase on the demo project (fake company, its own address); the professional edition is the one that gets all future work, on the real database | no double work; real staff keep their data (same data shape) |

## Risk list (pre-mortem)
- A redesign of a mixed file breaks a money path silently -> step 0 = move the logic out of the big screens into their
  own files FIRST, in today's look, the checks proving nothing changed; then the new screens only call it.
- Old laws clash with business conventions: palette law (no blue, no green) vs green = paid / red = owed; nixie and the
  sci-fi words go; capybara + Ponder lessons: keep a quiet version or drop (his call).
- Owner first-time setup (his idea, same day) belongs to the professional edition - building it in the game look first
  means building it twice.

## Certification / value (from knowledge - verify costs and rules before spending)
- Legal in Indonesia: a business entity + NIB (OSS); PSE registration at Komdigi for an electronic system serving users in
  Indonesia; UU PDP 27/2022 (in force Oct 2024) - privacy policy, consent, breach procedure (the app holds customer
  names, phones, locations).
- Cheap value: DJKI copyright record for the software (proves he owns it - resume + sale).
- Later, when a big buyer asks: ISO/IEC 27001 (organisation-level, audited, costly).
- Free trust line: hosted on Google Cloud (Firebase) whose infrastructure is ISO 27001 / SOC 2 certified - the
  infrastructure, not the app; an independent security test report is the app-level equivalent.

## Open questions put to him
1. Who is the first customer he would show it to (trade, size, how many salesmen)?
2. His own company's staff: move to the professional edition, or keep using the game one? (decides C vs A)
3. Capybara + lessons in the professional edition: quiet version, or gone?
4. Owner setup: wait and build it as the professional edition's first screens? (recommended)

## His answers (verbatim, 2026-11-09)
> "well the first customer will still be cigarette factory that own by my mom uncle, around 25 salesman total, 2 company staff will use the professional edition of course, capybara will stay as our tutors and mascot for our company even in professional version,yes lets build the setup screen in professional edition next, there is few things that i want u to keep of course so please dont change all the animation features components, some button and animation could still also be used, like those intro, i want to keep it that way, either way just ask me before u make changes and give me the draft like the usual work we use to do"

- First customer: a cigarette factory (his mother's uncle), ~25 salesmen.
- Both companies' staff use the professional edition -> option C: the game edition is frozen as his showcase, no double work.
- Capybara stays: tutor + company mascot, in the professional edition too.
- Owner setup = the professional edition's first screens.
- KEEP LIST is his: some animations, buttons, components stay (the intro named). Nothing is removed without his yes on a draft (board), the usual way.
- Next: a keep/change board of every animation and component, then the plan.

Models applied: Second-Order Thinking (two live copies -> double fixes), Reversibility Test (freezing is reversible; a
second database is close to one-way), Pre-Mortem (silent money break in mixed files), Opportunity Cost (redesign time vs
the open bug list and the first customer).
not-chosen: B (one code, two looks) - flips if his own staff must keep the game look while customers get the serious one.
