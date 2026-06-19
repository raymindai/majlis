# 07 · Concept One-Pager — Scenario A

**Working name:** *Majlis* (placeholder) — Arabic for the council/gathering where matters are talked through and decided; a briefing companion for the meeting room. Naming is its own later decision.

## In one line
An AI briefing companion that lets an official **interrogate everything that matters for a meeting in natural language** — and answers only what it can **source and rate its confidence on** — so they walk in knowing exactly what they can act on and what to check.

## Who it's for
- **Primary (hero):** a senior official preparing to walk into a high-stakes government meeting — time-compressed, acting for an institution, can't be caught out by something wrong or unverified.
- **Secondary (generalizes):** every other participant preps the same way; the pattern scales from the chair down to each entity's representative. *Designed for the principal; the breadth is the strategic upside, not a second built surface — deliberately kept out of scope to stay deep.*

## The hero interaction — grounded Q&A with confidence & sourcing
The core loop, built deeply:
1. **Ask** in natural language — "Did Entity X deliver the milestone it committed to in March?"
2. **Streamed answer**, assembled from the underlying material.
3. **Inline citations** — every claim carries a source chip; opening it shows the exact passage/figure it came from.
4. **Confidence signal** — each answer (ideally each claim) rated **Confirmed / Likely / Unverified**, with a one-line "why this rating."
5. **Verify / expand** — a source drawer shows the evidence without leaving the answer.
6. **Graceful "not in the material"** — when an answer isn't grounded, it says so plainly and offers what *is* known instead of guessing.

**Entry frame (sketched, not hero):** a briefing view — at-a-glance who's involved, the decision, prior commitments, open risks — from which the official drills into Q&A.
**Accent (lightly built):** risk/sensitivity flags surfaced proactively in the brief and inline in answers.

## The AI's behavioral contract (AI as design material)
- **Answers** only what it can ground in a source.
- **Flags** uncertainty rather than smoothing it — visibly down-rates confidence when sources are stale, conflicting, or thin.
- **Refuses** to fabricate: "I don't have that in the material" beats a confident guess; offers the nearest grounded fact.
- **Surfaces** sensitive/inconsistent items unprompted (a commitment not met; two sources that disagree).
- **Tone:** terse, deferential, audit-aware — a careful chief of staff, not a chatty bot; never editorializes on policy.
- **Degrades** predictably: partial data → partial answer + explicit gaps; no source → empty-but-honest state.

## The confidence & sourcing model (the craft core)
- **Three confidence levels**, each with its own visual language and a stated driver:
  - **Confirmed** — a single authoritative, current source; safe to act on.
  - **Likely** — supported but caveated (slightly stale, single-source, or inferred).
  - **Unverified** — thin, conflicting, or undated; check before acting.
- **Sourcing:** every claim → a source chip → the exact passage/figure, with document name + date. Conflicts are shown side-by-side, not silently resolved.
- **Why it matters here:** for a senior official, *confidence is the difference between acting and checking.* This is where the brief's "make clear what it's confident about and what it's not" becomes the product.

## AI-state inventory (what we'll actually design)
- **Loading / streaming** — answer assembling; sources resolving.
- **Confidence / uncertainty** — the three-level system, inline + per-answer.
- **Sources / citations** — chips, the source drawer, conflicting-source view.
- **Errors** — model/tool failure; "couldn't reach a source."
- **Empty** — no question yet (the briefing entry state); no results.
- **Edge** — answer not in material; stale data; sources disagree; sensitive item.

## Platform / form factor (recommended)
**Desktop-first responsive web app** (comfortable on tablet). The Q&A + evidence interaction wants a two-pane layout — conversation + source drawer — that a phone would cramp. Web for build speed (Claude Code), instant demoability, and DGE stack-fit.

## Scope — build / sketch / cut
- **Build deeply:** grounded Q&A + confidence/sourcing (the loop above) with full AI-state handling.
- **Sketch:** the briefing entry view; risk/sensitivity flags as accents.
- **Cut:** real ingestion; accounts/admin/settings; multi-meeting history; the secondary any-participant surface; live integrations (data is a believable fixture).

## The open choice → next decision (D5)
The one thing that sets the entire simulated dataset: **which concrete meeting.** Recommendation + alternatives are being put to the user.
