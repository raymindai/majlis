# 01 · The Role and the Brief

## The role (AI Experience Designer — DGE, Abu Dhabi)
- Delivering a **multi-sector national programme** for the UAE: procurement, internal tooling, recruitment, reporting.
- **AI-first by default** — Claude and Claude Code *before* Figma; prototype and validate with AI, then move to high fidelity.
- Extremely fast-paced: shipping **live production products in ~6 weeks** (not POCs).
- Wants a **product & business thinker**, not a UI executor — someone who challenges the "why" behind a feature.
- Can deliver **functional prototypes in ~4 weeks**; autonomous; works closely with engineering.

## The brief ("The Briefing Companion" — GovAI / DGE AI Factory)
Design and build a **functional prototype of an AI assistant that prepares a senior government official for a meeting, decision, or public appearance.** It gathers context from many sources, summarizes what matters, surfaces risks, and answers questions — **always making clear what it is confident about and what it is not.**

> The AI is **not a feature bolted on — it is the product.** The user acts on behalf of an institution, under time pressure and protocol, and **cannot afford to act on something wrong or unverified.**

### Four candidate capabilities (pick 1–2 to build deeply)
1. **Pre-meeting briefing** — who's involved, the decision at hand, relevant history & prior commitments, open risks; decide what's at-a-glance vs. on-demand.
2. **Grounded Q&A** — natural-language follow-ups answered from the underlying material, each claim traceable to its source.
3. **Confidence & sourcing signals** — every answer conveys how confident the assistant is and what it relies on.
4. **Risk & sensitivity flags** — proactively surfaces items that are sensitive, consequential, or inconsistent with prior positions.

### What they evaluate
- **Thinking** — the problem chosen and why, who it's for, trade-offs, and *what you deliberately chose not to build.*
- **UI craft** — typography, hierarchy, layout, motion, and **AI-specific states**: loading/streaming, confidence/uncertainty, sources/citations, errors, empty/edge.
- **Working with LLMs** — shaping the AI's behavior as a design material (tone, when it answers vs. flags uncertainty, graceful failure) **and** using AI to generate, code, and construct the build.

### Deliverables & constraints
- **01 Functional prototype** — genuinely interactive, demoable in real time; at least one core interaction feels truly AI-driven. Simulated AI is fine if it shows thinking + craft. Static Figma / click-throughs won't suffice.
- **02 Process walkthrough** — video, live walkthrough, annotated deck, or **microsite**.
- **5 days.** Tools used won't be judged — only *how well.* Name it anything. **If tempted toward a large product, scope down.**

## What the brief is *really* testing (the selection signals)
1. **The AI *is* the product** → pick a moment where the AI's judgment is the experience.
2. **"Cannot act on wrong/unverified"** → there must be a costly, concrete failure mode (the impact filter).
3. **"Time pressure and protocol"** → compressed moment of use → drives platform + the at-a-glance vs. on-demand problem.
4. **Craft judged on AI-states** → pick a moment where **confidence genuinely varies**, so those states have something real to express.
5. **"Shape AI behavior as material"** → favors a crisp behavioral contract (when it flags, when it refuses).
6. **"Scope down"** → favors a scenario with an obvious hero interaction.
