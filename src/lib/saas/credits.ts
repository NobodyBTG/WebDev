/**
 * FUTURE SaaS scaffolding — credit-based usage system (NOT active in v1).
 *
 * Planned wiring:
 *  - User accounts + auth: Supabase (or NextAuth). Session read in route
 *    handlers; user id keys every table below.
 *  - Stripe: subscription tiers grant a monthly credit allowance; one-off
 *    credit packs via Checkout. Webhook (/api/stripe/webhook) updates the
 *    `credits` balance.
 *  - Saved scans: persist { industry, answers, profile, competitors,
 *    painText, timestamps } per user — the whole ScanState in store.tsx is
 *    already serializable for exactly this reason.
 *  - Shareable reports / PDF export: server-render the report route and
 *    pipe through a PDF service; share links are signed slugs.
 *  - Team workspaces: workspace_id on scans; role-based access.
 *  - Admin dashboard: usage per task tier, credit burn, conversion.
 */

export const CREDIT_COSTS = {
  basicBranchScan: 1,
  ideaScore: 2,
  competitorAnalysis: 3,
  fullMarketReport: 5,
  deepResearchReport: 10,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

/**
 * v1: everything is free and local; this always succeeds.
 * Later: check + debit the user's balance server-side before running the task.
 */
export async function spendCredits(action: CreditAction): Promise<{ ok: boolean; cost: number }> {
  // Future: POST /api/credits/spend { action } -> { ok, remaining }
  return { ok: true, cost: CREDIT_COSTS[action] };
}
