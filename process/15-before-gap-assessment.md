# 15 · Before, gap assessment

Re-assessed before moving on to During and After.

## Verdict

Before *looks* complete and is highly polished, but its core briefing is **static mock data**.
The only genuinely live AI in Before is the **chat Q&A**. The bottom line, the ranked
exceptions, the decision, the likely questions, and the prep checklist are all hardcoded
constants in `lib/mock.ts`. So the product currently **answers questions** but does not yet
**write the brief**, which is the whole promise of "an AI briefing companion".

This is the headline gap. Everything else is secondary.

## What Before already does well

- Exception-led IA: bottom line → decision → ranked attention → the room → series → prep → likely Qs.
- Live grounded Q&A with confidence + citations, save-as-note, selection → Ask Majlis.
- A real participant system (profiles, contacts, track record, "ask them"), reflected everywhere.
- The institutional-memory loop (carried-over commitments).
- Craft: stackable windows, click-to-reveal tooltips, an acronym glossary, self-explaining pills.

## The gaps, prioritised

### Tier 1, the core
1. **The brief is mocked; only the chat is live.** The AI should read the pack and synthesise
   the brief, the bottom line, the ranked exceptions, the decision framing, the likely questions,
   the prep, as structured output with confidence + citations, on the same grounding contract as
   the Q&A. A `/api/brief` route + a loading state turns the whole stage genuinely live.
2. **Nothing streams.** The brief grades streaming. The chat awaits a full JSON response; the brief
   is static. The synthesis should stream in.

### Tier 2, depth
3. **Decision support is thin.** "Your decision" states the decision and what it hinges on, but gives
   no recommendation and no trade-offs (approve vs defer, and the risk of each). A deciding official
   needs the recommended call and why.
4. **Today's agenda is absent from Before.** The series shows *other* meetings; today's agenda and the
   official's role per item live only in During. Prep should show what is on the table today.
5. **Provenance is inconsistent.** Bottom line and attention carry confidence + citations; the decision,
   likely questions, and prep do not. Every claim should show its work.

### Tier 3, polish
6. **No starter questions in the chat** (the sample Q&A exists but is not surfaced as clickable probes).
7. **The conflict flag** on the bottom line prints raw source codes instead of the friendly citation chip.
8. **No mobile fallback** (rail + chat are hidden below `lg`). Acceptable for the laptop target.

## Recommendation

Close Tier 1 first: make the brief **live and streamed**. It is the difference between a
convincing mock and a working prototype, and it is the most defensible thing to show for an
AI-experience brief. Tier 2 (decision support, today's agenda, provenance) deepens it; Tier 3
is quick polish. Then carry the same live-synthesis pattern into During and After.
