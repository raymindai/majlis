# 08 · Scenario Instance — the "Manarah" steering review

A synthetic, clearly-fictional fixture that makes the prototype concrete. **All entities, figures, and documents below are invented for the demo** — no real performance data is implied.

## The setup
- **The meeting:** the **Q2 steering committee** of the **Manarah Programme** — a national effort to consolidate Abu Dhabi government digital services onto one unified platform.
- **The user (hero):** the **Programme Director-General**, walking into the committee in ~20 minutes, who will be asked to confirm status, unblock dependencies, and decide a budget reallocation.
- **The room (secondary personas):** the 5 entity representatives — each preps from the same material.
- **The product:** *Majlis* assembles the brief and answers grounded questions over the shared committee pack.

## The 5 participating entities
| Entity | Status | Headline |
|---|---|---|
| Health Services Authority (HSA) | ✅ On track | 10/10 services migrated; met its March commitment |
| Education & Knowledge Dept (EKD) | ⚠️ At risk | Parent portal slipped June → August; recovery only informally claimed |
| Municipalities & Transport Authority (MTA) | ✅ On track | Delivering, but budget figures conflict across sources |
| Public Security Directorate (PSD) | 🔒 Restricted | Detailed status redacted from the shared pack |
| Economic Development Dept (EDD) | ⛔ Slipped | Single-sign-on integration slipped — a dependency blocking others |

## The source fixture (what the AI grounds on)
1. **Programme Charter v2.1** (~10 months old) — scope, the 5 entities, target milestones, total budget AED 240M. *Authoritative but partly superseded.*
2. **Q1 Steering Minutes** — the commitments each entity made last quarter. *Authoritative, dated.*
3. **Q2 Entity Status Reports** (one per entity, current) — milestone progress, spend, blockers. *Official, current → Confirmed.*
4. **Risk Register** (updated this week) — open risks with severity/owner. *Confirmed.*
5. **An informal PMO note** (undated email) — EKD "expects to catch up by next month." *Unverified.*

## The five designed tensions (the "teeth")
1. **Confidence contrast** — EKD's slip is Confirmed (Q2 report); its recovery is Unverified (PMO email). The AI must rate them differently.
2. **Consistency catch** — EKD's March commitment (Q1 Minutes) vs. Q2 reality: it did *not* deliver. The AI surfaces the contradiction.
3. **Source conflict** — MTA budget: Charter says AED 40M, Q2 report shows AED 52M committed. The AI shows both, flags it, doesn't pick.
4. **Sensitivity / graceful refusal** — PSD's detail is restricted; the AI says it's not in the shared material rather than guessing.
5. **Consequential risk** — EDD's SSO slip is a cross-entity dependency blocking HSA and EKD launches: the one thing the DG can't miss.

## The demo script (example Q&A, with ratings + citations)
**"Give me the one thing I can't miss."**
→ EDD's single-sign-on integration has slipped, and it's a dependency blocking HSA and EKD go-lives. **[Confirmed — EDD Q2 Report; Risk Register R-07]**

**"Did EKD meet the commitment it made in March?"**
→ No. In Q1 it committed to launch the parent portal by June **[Confirmed — Q1 Minutes, p.4]**; the Q2 report shows it slipped to August **[Confirmed — EKD Q2 Report]**. An informal note claims a catch-up, but it's unverified **[Unverified — PMO email, undated]**.

**"What's MTA's programme budget?"**
→ Sources disagree: the Charter lists AED 40M **[Charter v2.1]**, while MTA's Q2 report shows AED 52M committed **[MTA Q2 Report]**. Recommend confirming before the reallocation vote. **[Unverified — conflict]**

**"How is PSD tracking?"**
→ PSD's detailed status is marked restricted and isn't in the shared pack, so I can't show it here. PSD is a participating entity **[Charter]**; request the restricted annex if needed. **[Not in material]**

**"What's the citizen satisfaction score?"**
→ Not in the shared material — the committee pack doesn't include satisfaction data. **[Empty — honest]**

## How this exercises the AI-state inventory
Confirmed / Likely / Unverified all appear · inline citations on every claim · a source-conflict view · a "not in material" refusal · an empty state · and a proactive risk flag — the whole inventory from `07` shows up naturally in one demo.
