# 05 · Decision Log

The running record of every meaningful decision, why it was made, and who made it.
Maintained each working session; newest appended. This is the source material for the decision-tree presentation.

Legend: ✅ locked · 🔶 open · 👤 user call · 🤖 Claude recommendation

---

## D1 — Scenario to build · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** Scenario **A — the meeting-prep / briefing assistant** (prepares someone for a meeting / decision / public appearance).
- **Options considered:** A (public-appearance / meeting briefing), B (procurement award sign-off), C (bilateral prep), E (council submission), D (crisis brief).
- **Claude recommended B** (procurement) — highest impact × likelihood × on-mandate fit, cleanest dataset to simulate.
- **User overrode to A.** Rationale: the briefing pattern is **not limited to high-positioned personnel — every participant in every meeting can use it**, which raises its real-world likelihood and reach beyond a single principal.
- **Open sub-question (🔶 → D3):** anchor the hero on a *senior official* (brief's stated user; keeps stakes high) while showing it generalizes — or design explicitly for any participant?

## D2 — Process presentation format · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** **AI-built microsite** + embedded 2–3 min demo, with the **decision trees as its spine**.
- **Options considered:** microsite (chosen), narrated video + tree slides, annotated deck.
- **Rationale:** the medium itself proves the AI-first skill DGE is hiring for; the trees show "how I think" and "what I chose not to build."
- **Guardrail:** the prototype is non-negotiable #1; the microsite must not eat its time. Fallback = video + tree slides.

## D3 — Persona & breadth · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** **Primary = senior-official hero; secondary = any participant.** Design the hero for a senior official preparing for a high-stakes meeting; treat "the same pattern serves every participant" as an explicit secondary tier in the narrative (not a separately built surface).
- **Rationale:** keeps the brief's stakes/protocol intact while honoring the user's reach argument — stakes-first, breadth as upside.

## D4 — Hero capabilities · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** **Grounded Q&A + confidence/sourcing** built deeply. Briefing = entry frame (sketched); risk/sensitivity flags = accents.
- **Rationale:** richest on the AI-states the brief grades (streaming, citations, confidence, uncertainty) and the most AI-native hero; for this user, confidence is the difference between acting and checking.

## D5 — Meeting context · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** **Cross-government programme steering committee review.** A senior official prepping for a quarterly steering committee where ~5 entities report status.
- **Rationale:** best "every participant preps the same way" fit (honors the secondary persona), richest data for grounded Q&A, natural confidence variation + consistency hooks.
- **Instantiated** in `08-scenario-instance.md` — synthetic *Manarah* programme, 5 entities, 5-document source fixture, five designed tensions, demo Q&A.

## D8 — Build approach · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** **Live** ("all live, or close to it"). A working prototype should genuinely run live.
- **Rationale (user):** a single meeting is *bounded* — there's a ceiling on what can be asked — so live over the full pack is realistic and reliable.
- **How we keep live trustworthy:** whole corpus in context (no retrieval gaps) + structured outputs for claims/confidence/citations + behavioral-contract system prompt + honest out-of-scope. Supersedes Claude's earlier hybrid recommendation.
- **Consequence:** needs `ANTHROPIC_API_KEY` (Claude) and `FAL_KEY` (fal.ai / Nano Banana 2 imagery), provided by the user.

## Earlier framing decisions (context)
- **AI is the product, not a feature** — the scenario must make the AI's judgment the experience. 🤖
- **Scope down to 1–2 capabilities built deeply.** 🤖
- **Likelihood is a first-class selection axis.** 👤
- **Decision trees are the presentation device; document the process diligently.** 👤

## Pending decisions (next forks)
- 🔶 **D7 — Product name** (working title: "Majlis").
- **Stack:** proceeding with Next.js + Vercel + live Claude + fal.ai (Nano Banana 2), desktop-first — unless changed.
- **Blocked on user:** API keys (`ANTHROPIC_API_KEY`, `FAL_KEY`) → `.env.local`.
