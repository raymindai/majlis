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
- [x] Author the committee-pack corpus (`content/`) — the live grounding material
- [ ] API keys in `.env.local` (`ANTHROPIC_API_KEY`, `FAL_KEY`) — **blocked on user**
- [ ] Confirm exact fal endpoint id for Nano Banana 2 (check fal docs)
- [ ] Generate imagery: 6 participant portraits · product/brief hero · 5 abstract entity marks
- [ ] Scaffold Next.js app on Vercel
- [ ] Q&A engine: server route → Claude, whole corpus in context, structured `{claims[]}` output
- [ ] Hero UI: ask → streamed answer → inline citations → Confirmed/Likely/Unverified → source drawer
- [ ] AI-states: loading/streaming, confidence, citations, conflict view, "not in material", empty, error
- [ ] Briefing entry view (sketched) + risk flags (accent)
- [ ] Microsite: decision-tree narrative (Trees 1–6) + embedded demo
- [ ] Demo pass · deploy · shareable URL
