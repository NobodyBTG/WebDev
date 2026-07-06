# Opportunity Radar

**An AI business scanner that helps you figure out what business is worth testing before you waste money building it.**

Type any industry, trade, career, or market ("Plumber", "Motorcycle parts", "Food trucks"…). Opportunity Radar interviews you, builds a goal profile, maps the business opportunities inside that industry across seven categories, scores each one 0–100 against your goals and budget, and delivers an honest verdict: **Build, Test, Pivot, or Avoid**.

Version 1 is fully local and clickable — mock data + rule-based logic, architected so real AI calls, accounts, credits, and Stripe drop in later without a rebuild.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Requires Node 18.18+ (tested on Node 22).

## The flow

1. **Landing** — enter an industry (or click an example chip).
2. **Smart Intent Discovery** — 8 multiple-choice questions (direction, goal, budget, resources, hands-on preference, experience, locality, risk). Single-choice questions auto-advance; skipping lowers scan confidence.
3. **Goal Profile** — your answers summarized, with the radar's "best fit" read.
4. **Opportunity Map** — branch cards across 7 categories (Direct, Niche, Support, Software, Marketplace, Product, Education), each scored and tagged with a verdict. Filter by category or "For you".
5. **Research panel** (on the map) — add competitors manually and paste customer complaints into the pain-point analyzer. Both **adjust scores live**.
6. **Report** — click any branch: radar chart, metric breakdown, case for/against, differentiation ideas, red flags, profile fit, first 5 steps, cheap validation plan, and straight-talk verdict.

## Files that matter most

```
src/
├── lib/
│   ├── types.ts          # All domain types — start here
│   ├── scoring.ts        # THE scoring engine (weights, adjustments, verdicts)
│   ├── questions.ts      # Intake question definitions
│   ├── profile.ts        # Answers → GoalProfile + category preferences
│   ├── painpoints.ts     # Keyword-based pain classifier (10 categories)
│   ├── validation.ts     # Validation plan generator (per category)
│   ├── store.tsx         # Client state (serializable → future saved scans)
│   ├── ai/router.ts      # AI task registry + model-tier routing (mock)
│   └── saas/credits.ts   # Future credit system costs + notes
├── data/
│   ├── industries/       # Curated demo data: plumber, motorcycle parts,
│   │                     #   restaurant, cleaning, hvac
│   ├── generic.ts        # Template branch generator for ANY other industry
│   └── index.ts          # Input → dataset resolution
└── components/
    ├── ScanApp.tsx       # Step machine + header
    ├── landing/ intake/ profile/ tree/ report/
    ├── competitors/ painpoints/ validation/
    └── ui/bits.tsx       # ScoreRing, MetricBar, badges, palette
```

## How scoring works

Nine metrics, each 0–10, weighted into a 0–100 final score (`lib/scoring.ts`):

| Metric | Weight | Notes |
|---|---|---|
| Problem Strength | 15% | |
| Market Demand | 15% | |
| Competition Opportunity | 15% | High competition lowers it unless competitors are weak |
| Ease of Entry | 10% | |
| Entry Cost | 10% | $0–500 = 10 … $50k+ = 2 (cheaper = better) |
| Profit Potential | 15% | |
| Differentiation | 10% | |
| Customer Acquisition | 5% | |
| Risk | 5% | **Inverted** (`10 − risk`) — high risk drags the score down |

Labels: ≤30 Avoid · 31–50 Weak · 51–65 Possible (needs proof) · 66–80 Strong · 81–100 Excellent.

**Adjustments:** competitor entries (ratings, weaknesses, complaints, quality ratings) shift Competition Opportunity, Differentiation, Problem Strength, Customer Acquisition, and Risk. Repeated pain-point patterns nudge Problem Strength and Differentiation. All adjustments are clamped and recompute live.

**Verdict:** final score + budget compatibility + profile fit → Build / Test / Pivot / Avoid. An over-budget idea can never be "Build".

**Confidence:** Low/Medium/High from questions answered + competitors added + pain evidence pasted.

## Where AI plugs in

All future model calls route through `src/lib/ai/router.ts` (one typed `runAiTask` seam). Grep for `Future AI route:` to find every integration point.

- **Cheap model:** intent classification, intake summary, follow-up questions, pain-point categorization, basic branch generation (replaces `data/generic.ts`)
- **Mid model:** better branches, score explanations, bespoke validation plans, competitor summaries
- **Deep research model:** live market research, full written reports, automated competitor analysis, strategy

Planned wiring: a `/api/ai` route handler authenticates (Supabase), debits credits (`lib/saas/credits.ts`: scan 1 · score 2 · competitor analysis 3 · market report 5 · deep research 10), routes to the tier's model, and validates output against the existing TypeScript types.

## What to build next

1. **Real AI branch generation** — wire `generateBasicBranches` so unknown industries get real branches instead of templates (highest-value single change).
2. **Persistence** — Supabase auth + save/restore the (already serializable) scan state.
3. **Live pain-point mining** — pull reviews/Reddit automatically instead of paste-in.
4. **Stripe + credits** — subscriptions granting monthly credits; gate deep-research tasks.
5. **Export & share** — PDF export and signed share links for reports.
