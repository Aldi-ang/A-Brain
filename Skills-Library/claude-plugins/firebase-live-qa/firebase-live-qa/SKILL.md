---
name: "firebase-live-qa"
description: "Test a PR or feature against a live Firebase/Firestore app via browser automation, with root-cause diagnosis and safe cleanup of test data. Use when Aldi asks to verify, test, or QA a merged PR or feature against the real KPM app (or any other Firebase-backed app), not just review the code."
---

---
name: firebase-live-qa
description: Test a PR or feature against a live Firebase/Firestore app via browser automation, with root-cause diagnosis and safe cleanup of test data. Use when asked to verify, test, or QA a merged PR or feature against a real Firebase-backed app, not just review the code.
---

# Firebase Live QA

Use this when the user wants a PR or feature actually verified against a running Firebase/
Firestore app, not just reviewed in the diff. This is about proving behavior against real
data and infrastructure, the same discipline used on the KPM (Cello Inventory Manager)
project.

## Core principle: never trust the UI alone

The single most important rule: **the UI showing success does not mean the operation
succeeded.** Always verify the actual backend state — the Firestore document, the Storage
object, the console — not just what the screen displays. This exact bug class ("UI says yes,
server says no") has recurred multiple times on real projects. If the app shows a checkmark
or success toast, that is a claim to verify, not a fact to report.

## Workflow

1. **Get the exact flow to test.** If given a PR description or feature spec, extract the
   concrete user steps (what to click, what to enter, what should result) rather than testing
   vaguely.

2. **Use browser automation (Chrome MCP), not screenshots alone.** Navigate the actual app,
   perform the flow, and inspect real state:
   - The relevant Firestore document(s) — read the actual field values in the console, don't
     infer them from the UI.
   - Firebase Storage, if files/photos are involved — confirm the object actually exists at
     the expected path, not just that an upload spinner completed.
   - Browser console messages — check for silent errors that don't surface in the UI.

3. **If a test requires touching real data** (e.g., no safe test product/record exists and the
   flow only works against real inventory), **say so explicitly before proceeding**, do the
   minimum necessary, and plan for cleanup from the start. Don't discover this after the fact.

4. **Diagnose root cause, don't just report pass/fail.** If something fails, trace it to the
   actual cause (a missing Storage bucket, a permission rule, a null field) with evidence —
   the specific document path, the specific console error. "It doesn't work" is not a finished
   diagnosis.

5. **If multiple test cases share the same root cause, don't re-run them all to "confirm."**
   Explain why the remaining cases would fail identically, and stop. Burning cycles
   reproducing an already-understood failure wastes time without adding information.

6. **Clean up test data afterward.** Delete any test documents you created. If a test touched
   real records in a way that can't be cleanly undone (e.g. a real product's stock count
   changed), say so plainly in the final report — don't leave it undiscovered, and don't try
   to silently "fix" real data without telling the user first.

7. **Never make billing, plan, or infrastructure changes yourself** (e.g. upgrading a Firebase
   project from Spark to Blaze). If a fix requires that, stop, explain exactly what's needed
   and why, and let the user decide — this mirrors the project's standing rule that security
   and infrastructure changes need the user present, not just the code.

## Final report format

- Pass/fail per test case, with the actual evidence (document path, field value, console
  error) — not just a verdict.
- Root cause for any failure, traced to a specific mechanism.
- What was cleaned up, and what (if anything) still needs the user's attention because it
  touched real data or requires a decision only they can make.
- Keep it factual and specific — avoid vague language like "seems to work" when you have
  concrete state to point to instead.

