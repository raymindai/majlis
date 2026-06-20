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

## D9 — Lifecycle scope · ✅ 👤
- **Date:** 2026-06-20
- **Choice:** build **all three stages substantively** — Before, During, After — connected by the institutional-memory loop.
- **Note:** user chose the most ambitious option over Claude's "Before-deep + 2 signature moments" recommendation. The brief warns to scope down; to de-risk, build a connected end-to-end **spine first** (always demoable), then deepen each stage.
- **Next:** design exploration — build a few rendered hero-screen layout variants to compare before committing (user wants to try a few designs).

## D10 — Design direction & IA · ✅ 👤-steered
- **Date:** 2026-06-20
- **Process correction (user):** combine wireframe + skin, reduce steps, increase density; and the first variants lacked clear hierarchy/data-flow — design for the primary audience.
- **Choice:** rebuilt the Before screen on an **exception-led IA** (`12`): bottom-line + decision (primary) → ranked attention (secondary) → interrogate (on demand), with a provenance flow (claim → confidence → citation → source drawer). Skin = **editorial-institutional** (per criteria `11`: trust, calm, scales, avoids generic-AI). Re-skinnable component system.
- **Live at** `/` (dev :3001); Q&A on mock pending live wiring.

## D11 — Participant avatars · ✅ 👤-requested
- **Date:** 2026-06-20
- **Decision:** generate per-participant avatars via **fal (Nano Banana 2)** for "Who's in the room."
- **Intent:** humanize the room so the DG maps people → what they own; ground the "ask the right person" flow.
- **Style:** a cohesive, dignified **editorial portrait** set — refined, lightly stylized (NOT photoreal), neutral warm background, head-and-shoulders, calm/authoritative. The restricted PSD liaison → an anonymous silhouette (signals "restricted"). Clearly synthetic.
- **Why not photoreal:** avoids the uncanny valley + authenticity concerns; a consistent stylized set reads more premium and honestly synthetic.
- **Build:** generation script → `public/avatars/<id>.png`, wired into the participant cards with the monogram as fallback.

## D12 — References are actual documents · ✅ 👤-requested
- **Date:** 2026-06-20
- **Decision:** make references real, not labels. The committee pack (9 documents) is browsable in Before (a "Committee pack" card), and every citation opens the full source document with the cited passage highlighted. The pack is seeded into Supabase (`corpus_documents`, migration `0002`). A commitment captured in During carries the citation it was grounded in (`commitments.source_ref`, migration `0003`) and shows it in After.
- **Why:** a briefing tool the chair must defend on audit needs provenance the user can open and read, not just a chip that names a source.

## D13 — Workspace architecture: `<Desk>` above the views · ✅ 🤖-found
- **Date:** 2026-06-20
- **Problem:** the citation / participant / meeting / detail providers and the floating-window manager lived *inside* `AppShell`, but each stage view consumes those contexts one level up (a view renders `AppShell`). So a view's opener bound to the default no-op: only the rail opened windows; card chips, card avatars, and meeting rows were silently dead.
- **Decision:** lift the workspace into a new `<Desk>` wrapper *above* the views (pages render `<Desk><View/></Desk>`). `AppShell` is now layout-only and opens the "For reviewers" window via a small `AboutContext`.
- **Consequence:** references and profiles open from the main content, not just the rail; one window manager serves all three stages. Verified in production (home / during / after / process all 200).

## D14 — Deepen During and After around the chair · ✅ 👤-requested
- **Date:** 2026-06-20
- **During:** a "Decision on the table" card reuses the brief's recommended decision (the question, what it hinges on, the options with consequences, Majlis's recommendation), tracks how many entity inputs have been heard, and when the chair rules lets the chair *record the decision* (with its source) into the minutes. Same decision Before recommended, closing Before → During → After.
- **After:** the live minutes now also yield a one-line **risk outlook** and **"Your follow-ups"** (2 to 4 things the chair personally must chase before the next cycle); **"Copy minutes"** exports the whole record as plain text.
- **Why:** the chair is a busy senior official; both stages needed to answer "what do I do now" and "what changed," not just transcribe.

## D15 — Header as product chrome; reviewer guide as a distinct surface · ✅ 👤-requested
- **Date:** 2026-06-20
- **Header, three zones:** left = title, the meeting (session, room, and a situational join control: enter the room Before, "In session" During, "Concluded" After), and the stage spine; centre = the Headlines/Brief/Full zoom; right = theme and profile. Centred with equal flex sides so the zoom never overlaps the left cluster.
- **Meeting info is first-class:** the old per-view free-form "meta" is gone. A new `MeetingBar` carries it in the header; the rail's meeting block now frames the wider programme (name, series position, scale) so the two complement rather than repeat.
- **Reviewer's guide:** "For reviewers" moved out of the header to a fixed bottom-left panel with its own accent-ribbon chrome, deliberately not a draggable window, so it reads as a guide laid over the product. Replaced the old AboutWindow/AboutContext.
- **Zoom reaches the rail:** the "In this brief" table of contents and "The room" now follow the zoom level too, so the sidebar stays honest about what is on screen.

## D16 — Reviewer-led navigation, legible zoom, status-grouped status, sources everywhere · ✅ 👤-requested
- **Date:** 2026-06-20
- **Stage nav as a reviewer surface:** Before/During/After moved from the header into a persistent bottom-left reviewer dock (visible even when the guide is collapsed), framing stage-jumping honestly as a reviewer/demo convenience. The header meeting-status chip is also a stage selector (Before, During / In session, After), so the status doubles as the control that changes it.
- **Zoom made legible:** the detail control now reads as zoom (magnifier + line-density glyphs); rail items and content cards are tiered with a small Brief/Full tag so different zoom-level items look different; participants stay visible at every level.
- **Status-grouped attention:** Needs-attention cards are grouped and tinted by status (Blocker, At risk), and the prose "Also ... on track" line became an "On track" group of cards.
- **Sources everywhere:** citations are no longer hidden at the Headlines zoom and the chips read clearly as clickable source links (accent, dotted underline). A deliberate trade of Headlines minimalism for always-visible provenance, per the reviewer's emphasis that grounded sources must be obvious.
- **Brief-level Regenerate:** moved off the bottom-line card to a brief toolbar with the synthesis attribution, since it regenerates the whole brief.
- **Ask Majlis identity:** branded header (gradient, a fal-generated backdrop, a girih star, a Majlis AI mark); the chat input can also save typed text as a note instead of asking.

## Earlier framing decisions (context)
- **AI is the product, not a feature** — the scenario must make the AI's judgment the experience. 🤖
- **Scope down to 1–2 capabilities built deeply.** 🤖
- **Likelihood is a first-class selection axis.** 👤
- **Decision trees are the presentation device; document the process diligently.** 👤

## Pending decisions (next forks)
- 🔶 **D7 — Product name** (working title: "Majlis").
- **Stack:** Next.js + Vercel + Supabase + live Claude + fal — locked and live.
- **Keys:** Anthropic, fal, and Supabase all in place. Corpus, audit log (`qa_log`), and the commitment loop (`commitments`) are seeded and persisting. Deployed at `https://majlis-xi.vercel.app`.
