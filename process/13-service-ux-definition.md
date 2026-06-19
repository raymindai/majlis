# 13 · Service & UX Definition

Proper definition before pixels — to **minimise risk** and ensure the product is **truly useful**, not just well-skinned. Lean and time-boxed; most of it doubles as process-walkthrough material.

**Honest framing:** with no access to real Director-Generals in 5 days, this is *assumption-led* design. The **Assumptions & Risks** register (below) is the core de-risking tool: make the bets explicit, design mitigations into the product, and validate the cheap ones with the user.

**Sequence:** Define (this doc) → Wireframe (`12`) → Skin (the variants) → Build (spine-first).

---

## Primary persona — the Programme Director-General
- **Who:** accountable owner of the Manarah programme; chairs the Q2 steering committee.
- **Context of use:** 15–20 minutes before the committee, at a desk, high stakes and protocol.
- **Goals:** walk in decision-ready; not get caught out; defend decisions credibly; drive the right outcomes (unblock SSO, handle the budget vote).
- **Pains today:** status arrives as fat decks/emails across five entities; hard to see what matters; numbers conflict; no fast way to verify a claim; risk of acting on stale/unverified info; "did they keep their prior commitment?" is manual memory.
- **Gains sought:** the one thing that matters, surfaced; a trust signal on every fact; instant verification; the confidence to act — or the knowledge to check.

**Secondary persona:** entity representatives / participants — prep from the same pack. Served by the same structure; out of build scope.

## Jobs To Be Done
- **Primary:** *"When I'm minutes from a high-stakes meeting, help me grasp what I can't miss and what I can trust, so I decide with confidence and don't get caught out."*
- **Supporting:** verify a claim fast · check whether an entity kept its prior commitment · know what's safe to act/say vs. what to check · capture what's decided so it isn't lost.

## Service blueprint (lean)
Per stage: **Frontstage** (user) · **Backstage** (AI/system) · **Data** · **Moment of truth** · **Risk if it fails**.

**BEFORE — prep & rehearse**
- Frontstage: opens Majlis → reads bottom-line + decision → scans ranked attention → asks to verify → opens a source.
- Backstage: assembles the brief from the corpus; ranks exceptions; scores confidence per claim; resolves citations; answers grounded Q&A; refuses out-of-scope.
- Data: the committee pack (corpus); prior commitments + qa_log (Supabase).
- Moment of truth: the headline is trusted, and any claim verifies in one click.
- Risk if it fails: DG ignores it (untrusted) or acts on a wrong/unverified claim.

**DURING — live support**
- Frontstage: glances at the watch-list; sees a flag when a statement contradicts the record; captures commitments/decisions.
- Backstage: matches statements to the record, detects inconsistency; structures captured commitments.
- Data: corpus + live capture → Supabase.
- Moment of truth: the inconsistency flag fires correctly and discreetly; capture is effortless.
- Risk if it fails: false flag (embarrassing) or missed flag; capture friction.

**AFTER — minutes & the loop**
- Frontstage: reviews auto-drafted minutes; edits; approves; sends; commitments written back.
- Backstage: drafts minutes from captured decisions + confidence; extracts actions; writes commitments to memory.
- Data: Supabase — minutes + commitments → next cycle's prior positions.
- Moment of truth: minutes are accurate, and the loop closes (commitments persist).
- Risk if it fails: minutes wrong/hallucinated; the loop doesn't actually feed the next Before.

**The loop:** After-commitments → next Before's prior-commitment check. This is what makes "consistency with prior positions" real rather than asserted.

## Assumptions & Risks register (the de-risk core)
**Assumptions** (must be true for this to be useful):
- **A1** — the DG will rely on an AI brief *if* confidence + provenance are credible. → Mitigation: rigorous confidence model + one-click source; honest "Unverified — check first"; never hide uncertainty.
- **A2** — a bounded meeting corpus is enough for genuinely useful live Q&A. → Mitigation: whole-corpus-in-context; honest "not in the material."
- **A3** — exception-led triage matches how a DG reads. → Mitigation: validate the hierarchy with the user (in progress); keep "show all" available.
- **A4** — the lifecycle loop is valuable, not gimmicky. → Mitigation: keep it concrete (commitments → next prior-check); don't over-build.

**Risks** (ranked):
- **R1 trust-too-much** — DG acts on a wrong claim. → confidence + provenance must be rigorous; default to caution; show conflicts, never resolve silently.
- **R2 trust-too-little** — DG ignores it. → fast, glanceable, obviously right on the headline; earn trust with verifiable accuracy.
- **R3 false inconsistency flag (During)** — embarrassing. → high precision; show the evidence; frame as "for your eyes," DG decides.
- **R4 scope blowout (3 stages in 5 days)** — → spine-first; deepen Before; signature During/After.
- **R5 hallucinated minutes (After)** — → build from captured structured data, grounded, with confidence + edit-before-send.

## Success criteria — what "truly useful" means
- The DG can, in **<90 seconds**, state the one thing they can't miss + the decision at stake — and cite it.
- **Every fact carries confidence + a one-click source.**
- The signal **changes behaviour**: green → act, red → check first.
- The inconsistency flag catches the EKD-style contradiction **without false alarms**.
- The loop **demonstrably closes**: a commitment captured After appears in the next Before's prior-commitment check.
- Felt experience: **calm, in control, "I won't be caught out."**

## Done vs. new
Already banked: concept `07`, scenario/data `08`, journey + features `10`, design criteria `11`, IA/hierarchy/flow `12`. New here: sharpened persona + JTBD, the service blueprint, the assumptions/risks register, and the success criteria.
