# Part Bike Value

A part-out valuation tool for motorcycle salvage buyers. Enter a wrecked/auction
bike, get a full parts list with prices, sell-through rates, competition counts,
eBay research links, fee-adjusted net numbers, a safe max bid, and a plain-English
buy/pass call — in under a minute.

Built for a real used-parts business (mostly eBay sales), not a generic pricing
calculator: quick-sale bias, 35% fee/shipping-loss haircut, labor and storage in
the math, slow-mover warnings, and damage logic (forks toast → forks $0 + inspect
the triple trees).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

A demo bike is pre-loaded: **2025 Yamaha R1, bought for $5,000** — wrecked front
end, forks + front wheel toast, good gauge cluster and hand controls, ASV levers,
LighTech rearsets / fuel cap / mirror blocks / axle extension, clean title.

## Pages

| Route | What it does |
|---|---|
| `/` | Dashboard — saved bikes, total invested, projected gross/net/profit, inventory risk |
| `/bikes/new` | New valuation — paste a rough description, Parse fills the form (AI if a key is set, built-in rules otherwise), Generate builds the parts list |
| `/bikes/[id]` | Full report — money tiles, buy call + max bid, plain-English report, editable parts table with eBay active/sold research links, rankings, what-if buy prices, fee breakdown, CSV/PDF export |
| `/settings` | Fee %, quick-sale discount, labor rate, storage cost, shipping materials |

## How the numbers work

- **Sell-through** = sold (90d) / active listings. 1.0+ very strong · 0.50–0.99 good · 0.20–0.49 okay · <0.20 slow mover.
- **Quick-sale price** = average sold price − 25% (editable).
- **Net** = gross × (1 − fee%) − shipping materials. Default fee loss **35%** (eBay final value + payment + promoted + returns/shipping loss).
- **Profit** = net − purchase − title/transport/storage; shown before and after labor.
- **Safe max buy** = (quick-sale net − fixed costs) × 0.7 — keeps a 30% cushion.
- **Damage logic**: damaged/missing parts count $0; front-end hits flag triple trees, wheel, brakes, gauge and frame neck for inspection; no title cuts the frame to scrap money; high mileage discounts drivetrain.
- **Recommendation**: Strong Buy / Buy Only Cheap / Borderline / Avoid / Better to Sell as Project / Better to Repair — driven by profit, sell-through, slow-mover share, dead key parts, and the project-flip comparison.

Every generated number is an estimate meant to be corrected by research: each
part row expands to show suggested search terms, terms to avoid (R1 ≠ R1M/R6/R7),
and ready-made eBay **active** and **sold** search links. Enter the real counts
and prices and every total updates instantly.

## Data & API keys (all optional)

Data is stored locally in the browser (`localStorage`) behind a repository-style
layer (`src/lib/db.ts`) that can be swapped for Supabase/SQLite without touching
the pages.

Copy `.env.example` → `.env.local` to enable upgrades:

- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` — AI description parsing (`/api/ai/parse`)
- `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` — live active-listing counts via the eBay Browse API (`/api/ebay`)

Without keys the app is fully functional using the rule-based parser and
generated research links.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS ·
shadcn-style components (`src/components/ui.tsx`) · localStorage persistence.

```
src/
  app/            pages + API routes
  components/     UI kit + parts table
  lib/
    types.ts        domain model
    partsEngine.ts  parts templates, value tiers, damage/aftermarket logic
    calc.ts         all money math (sell-through, net, ROI, recommendation)
    search.ts       eBay search terms + URLs, fitment year ranges
    parser.ts       rule-based description parser
    ai.ts           AI abstraction (falls back to parser.ts)
    report.ts       plain-English report generator
    db.ts           localStorage repository + demo seed
    exporters.ts    CSV / PDF (print) export
```
