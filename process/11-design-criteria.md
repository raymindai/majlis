# 11 · Design-Direction Selection Criteria

Before choosing between the three rendered variants (Institutional / Situation room / Dossier), fix the criteria — so the choice is reasoned, not vibes. Drawn from three places: the brief's evaluation rubric, the user's reality, and our build reality.

## Must-pass gates (non-negotiable — any direction has to clear these)
- **Accessible & legible.** WCAG-AA contrast (this is a government product), readable at a glance, and **color is never the only signal** — confidence and risk must also carry shape/text, not hue alone.
- **No generic-AI tells.** No purple/pink "AI" gradients, no chatbot-bubble clichés. Must feel intentional and authored.

## Weighted differentiators (these actually decide it)
1. **Carries the AI states — HEAVIEST.** The brief judges craft on exactly this: *"confidence and uncertainty, sources and citations, loading and streaming, errors, empty and edge."* The direction that makes **confidence and provenance instantly readable** — without clutter — wins. This is the product's whole reason to exist.
2. **Trust & institutional fit.** Reads as something a senior official acts on for an institution — gravitas and composure, not consumer flash.
3. **Calm under pressure.** Emotional register: the user is time-pressured and the stakes are real. The UI should *lower* the temperature (composed, reassuring), not raise it (alarms, hype).
4. **Scales across the lifecycle + density.** We're building all three stages: a calm **Before** brief, a dense live **During** view, and a document-like **After** minutes. The visual language has to flex across all three without breaking.
5. **Distinctiveness / memorability.** It's also a portfolio piece judged beside other candidates — it should show taste and leave an impression.

> Tie-breaker: when two directions are close, #1 (carries the AI states) decides it.

## What each variant is betting on (and its risk)
- **Institutional** — bets on calm trust + legibility. Risk: can read "plain" if not crafted with conviction.
- **Situation room** — bets on density + a live, "serious-AI" feel. Risk: raises the temperature (tension), and a dark cockpit can read generic if not precisely tuned.
- **Dossier** — bets on gravitas + provenance (footnoted citations). Risk: a static document feel may undersell the *live, interactive* AI and the dense During stage.

## How we'll decide
Score the three against the weighted differentiators (gates are pass/fail first). The user weights/adjusts; Claude offers a read. Decision logged in `05-decision-log.md`.
