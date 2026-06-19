# Good morning ☀️ — Majlis is built and live

You asked me to build everything I could overnight and leave the choices for you. Here's where it landed.

## TL;DR
- The full product is **built, working, and pushed** to `raymindai/majlis` (private). The production build is **clean → deploy-ready**.
- It is a **genuinely live** AI product (real `claude-opus-4-8` calls), spanning the whole meeting lifecycle — **Before → During → After** — with the institutional-memory **loop** closing.
- A few **choices await you** (below). None block anything — I built options so you can just pick.

## Run it
```bash
cd /Users/hyunsangcho/Desktop/Projects/dgeassignment
npm run dev
```
Open the printed URL (likely **http://localhost:3001**, since :3000 may be taken by your other server). Your Anthropic key in `.env.local` powers the live Q&A.

## The ~3-minute demo path
1. **Before** (`/`) — the brief: *bottom line + decision*, then *ranked exceptions*. Now **ask it**: "Did EKD meet its March commitment?" It works (loading state), then answers **"No"** with **confidence ratings + citations**; click a citation chip → the **source drawer** shows the exact passage. Then ask **"what's the citizen satisfaction score?"** → it honestly says **not in the material** (no fabrication).
2. **During** (`/during`) — click **Next speaker**. When EKD says "we're confident," Majlis raises the **inconsistency flag** against the recorded August slip. **Capture** the EDD + MTA commitments and the Chair's decision.
3. **After** (`/after`) — the **minutes** draft from what you captured; click **Write to institutional memory**.
4. Back to **Before** (`/`) — those items now appear as **"carried over — verify these were kept."** *The loop is closed.*
- Bottom-right **Skin** switcher: Institutional ↔ Dossier.
- `/after` has a **Reset demo** link to clear captured state and run it again.

## What's built (all live + verified)
- **Live grounded Q&A** — `claude-opus-4-8` with structured output: every claim carries a **confidence** rating + a **passage-level citation**; the system prompt is the behavioral contract (cite exact passages, rate confidence, surface conflicts, refuse honestly, terse/audit-aware). `app/api/ask`.
- **Before** — exception-led IA (bottom line → decision → ranked attention → interrogate) with the AI-states the brief grades: loading, confidence, citations, source drawer, conflict, not-in-material, error.
- **During** — live feed, the inconsistency flag, commitment capture.
- **After** — drafted minutes + write-to-memory.
- **The loop** — commitments flow Before→During→After→next Before (localStorage; no DB needed to demo).
- **Skin chooser** — Institutional / Dossier, live.
- **Synthetic dataset** — the *Manarah* committee pack (`content/`, mirrored in `lib/corpus.ts`).
- **Process archive** — `process/00–13`: the decision-tree story, selection criteria, information architecture, service/UX definition, journey + feature inventory.

## Choices for you (pick anytime — I'll apply)
1. **Skin** — Institutional (default) or Dossier, switchable live. Want a **dark "situation room"** too? I scoped it out overnight (it needs the accent tones re-themed cleanly) — say the word, ~30 min.
2. **Product name** — working title **"Majlis"** (the Emirati council where matters are decided). Alternatives if you'd prefer: *Diwan*, *Rased* ("observer"), *Sanad* ("support/backing").
3. **Deploy** — Vercel's connected, so pushes build. To make the **live API work in production**, add `ANTHROPIC_API_KEY` to the Vercel project (Settings → Environment Variables) and redeploy. Want me to script/walk it?
4. **Images** — the product is deliberately **text/data-first** (sharper for a trust tool, and `FAL_KEY` wasn't set, so I couldn't generate any). If you want fal / Nano-Banana **participant avatars** in "who's in the room" or a brand hero, drop `FAL_KEY` in `.env.local` and I'll generate + wire them.
5. **Supabase** — the loop uses localStorage so the demo is fully self-contained. If you want real persistence + an audit log (and to exercise the Supabase part of the stack), add the 3 Supabase keys and I'll wire the store to it.

## The big remaining piece (deliverable #2)
The **process-walkthrough microsite**. All of its content already exists in `process/` (decision trees, criteria, IA, definition). I left it as the next build so you could weigh in on its shape — it's a focused chunk of work to assemble. Alternative: keep the walkthrough as the `process/` docs + a short recorded demo of the prototype.

## What I deliberately did NOT build (and why)
- **Real document ingestion** — the corpus is a believable fixture; the point is the interaction, not a pipeline.
- **Accounts / admin / settings** — out of scope for the demo.
- **A dark theme** — scoped out to avoid a risky overnight refactor (easy to add cleanly now).
- **Decorative imagery** — kept the focus on the AI interaction.

## Repo
**github.com/raymindai/majlis** — `main`. The commit history tells the story: corpus → Before rebuild on the corrected IA → live engine → During/After/loop → skin chooser. Decisions + the full conversation are logged in `process/05-decision-log.md` and `process/06-conversation-log.md`.

— Everything above is real and runs. Nothing is mocked except the synthetic dataset, by design. Sleep well; ping me when you're up and we'll pick the open choices and build the microsite.
