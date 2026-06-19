# 09 · Build Plan & Checklist

The execution plan for the live prototype + microsite. Checked off as we go.

## Stack (proceeding unless changed)
- **Next.js (App Router) + Vercel** — one deployable app for prototype *and* microsite; a server route holds the API keys so nothing leaks to the browser.
- **Live Claude (Anthropic)** for grounded Q&A; structured outputs for claims `{text, sourceId, confidence}`.
- **fal.ai (Nano Banana 2)** for generated meeting imagery.
- **Desktop-first responsive**; product working name **"Majlis"**.

## Why live is trustworthy here (D8 rationale)
Bounded meeting corpus → the whole pack fits in context (no retrieval gaps) + structured outputs + tight behavioral-contract prompt + honest out-of-scope. Live **and** reliable.

## Image division of labour
- **AI images (Nano Banana 2):** participant portraits, product/brief hero, abstract entity marks.
- **Real rendered UI (not AI images):** charts, tables, document views, status dashboards — sharper and truer than generated images, and they're the actual product surface.

## Checklist
- [x] Author the committee-pack corpus (`content/`)
- [x] Scaffold Next.js app (TS / Tailwind / App Router) + SDKs
- [x] Anthropic key in `.env.local` — **fal + Supabase keys still pending (user)**
- [x] Q&A engine: server route → Claude (opus-4-8), whole corpus in context, structured `{claims[]}`
- [x] Before UI: ask → answer → confidence → citations → source drawer + AI-states (loading / conflict / not-in-material / empty / error)
- [x] During stage (live feed, inconsistency flag, commitment capture)
- [x] After stage (minutes + write-to-memory) and the loop
- [x] Skin chooser (Institutional / Dossier)
- [x] Production build clean (deploy-ready)
- [ ] fal imagery — blocked on `FAL_KEY` (offer stands)
- [ ] Supabase persistence — optional (loop runs on localStorage)
- [ ] Microsite: decision-tree narrative — left for the user's shape input
- [ ] Deploy: add `ANTHROPIC_API_KEY` to Vercel + promote
