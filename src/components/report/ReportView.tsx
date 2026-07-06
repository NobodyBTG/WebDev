"use client";

import { useMemo } from "react";
import { useScan } from "@/lib/store";
import { generateValidationPlan } from "@/lib/validation";
import { scoreLabel } from "@/lib/scoring";
import { BUDGET_LABELS, METRIC_HINTS, METRIC_LABELS, type MetricKey } from "@/lib/types";
import { Card, CategoryBadge, MetricBar, ScoreRing, SectionTitle, VerdictBadge } from "@/components/ui/bits";
import { RadarChart } from "./RadarChart";
import { ValidationPlanView } from "@/components/validation/ValidationPlanView";

const METRIC_ORDER: MetricKey[] = [
  "problemStrength",
  "marketDemand",
  "competitionOpportunity",
  "easeOfEntry",
  "entryCost",
  "profitPotential",
  "differentiation",
  "customerAcquisition",
  "risk",
];

const VERDICT_EXPLANATION: Record<string, string> = {
  Build: "Score, budget fit, and profile fit all line up. Run the validation plan fast, then commit.",
  Test: "Promising, but something needs proof before real money — run the validation plan first.",
  Pivot: "The core insight has value but this exact shape doesn't fit you or the market. Reshape it (niche down, change who pays) and re-scan.",
  Avoid: "The numbers don't support this for you right now. Walking away from a weak idea is a win, not a failure.",
};

/**
 * Business Validation Report for the selected branch.
 *
 * // Future AI route: deep research model — fullFinalReport would generate a
 * // long-form written report grounded in live market data; this view is its
 * // structured skeleton. Export-to-PDF and share links attach here later.
 */
export function ReportView() {
  const { selectedBranch, dataset, profile, backToMap, confidence } = useScan();

  const plan = useMemo(
    () => (selectedBranch && profile ? generateValidationPlan(selectedBranch.branch, profile) : null),
    [selectedBranch, profile]
  );

  if (!selectedBranch || !dataset || !profile || !plan) return null;
  const { branch, adjustedScores, finalScore, verdict, recommendedForUser, fitNotes, straightTalk, label } =
    selectedBranch;

  return (
    <div className="animate-fade-up">
      <button onClick={backToMap} className="mb-4 text-sm text-ink-muted transition hover:text-ink">
        ← Back to opportunity map
      </button>

      {/* Report header */}
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={branch.category} />
              <span className="text-xs text-ink-muted">Industry: {dataset.name}</span>
              {recommendedForUser && (
                <span className="rounded-full border border-accent/60 px-2 py-0.5 text-[10px] font-bold text-accent">
                  ★ Fits your profile
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-black text-ink">{branch.name}</h1>
            <p className="mt-2 text-sm text-ink-secondary">{branch.description}</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <InfoRow label="Target customer" value={branch.targetCustomer} />
              <InfoRow label="Who pays" value={branch.whoPays} />
              <InfoRow label="Problem being solved" value={branch.problemSolved} />
              <InfoRow label="Startup cost estimate" value={branch.startupCostEstimate} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={finalScore} size={110} />
            <span className="text-sm font-bold text-ink">{label}</span>
            <VerdictBadge verdict={verdict} large />
            <span className="text-[11px] text-ink-muted">Confidence: {confidence}</span>
          </div>
        </div>

        {/* Straight talk — the honest lines */}
        <div className="mt-5 rounded-xl border border-line bg-surface-raised p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">Straight talk</p>
          <ul className="mt-1.5 space-y-1">
            {straightTalk.map((line) => (
              <li key={line} className="text-sm font-medium leading-relaxed text-ink">
                “{line}”
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2 text-xs text-ink-secondary">
            <span className="font-bold">{verdict}: </span>
            {VERDICT_EXPLANATION[verdict]}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score dashboard */}
        <Card className="p-5">
          <SectionTitle sub="Weighted: Problem/Demand/Competition/Profit 15% · Ease/Cost/Differentiation 10% · Acquisition/Risk 5%. Risk counts against the score.">
            Score breakdown
          </SectionTitle>
          <div className="flex justify-center">
            <RadarChart scores={adjustedScores} />
          </div>
          <div className="mt-4 space-y-3">
            {METRIC_ORDER.map((key) => (
              <MetricBar
                key={key}
                label={METRIC_LABELS[key]}
                hint={METRIC_HINTS[key]}
                value={adjustedScores[key]}
                negative={key === "risk"}
              />
            ))}
          </div>
          <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
            Final: <span className="font-bold tabular-nums text-ink">{finalScore}/100</span> —{" "}
            {scoreLabel(finalScore)}. Competitor intel and pain-point patterns you add on the map
            adjust these live.
          </p>
        </Card>

        <div className="space-y-6">
          {/* Why it may work / fail */}
          <Card className="p-5">
            <SectionTitle>The case for and against</SectionTitle>
            <div className="space-y-3">
              <div className="rounded-xl border border-good/30 bg-good/10 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-good">Why this may work</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{branch.whyItMayWork}</p>
              </div>
              <div className="rounded-xl border border-serious/30 bg-serious/10 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-serious">Why this may fail</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{branch.whyItMayFail}</p>
              </div>
            </div>
          </Card>

          {/* Differentiation + red flags */}
          <Card className="p-5">
            <SectionTitle>Standing out & red flags</SectionTitle>
            <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Differentiation ideas</p>
            <ul className="mt-1.5 space-y-1.5">
              {branch.differentiationIdeas.map((d) => (
                <li key={d} className="flex gap-2 text-sm text-ink-secondary">
                  <span className="text-accent">◆</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-critical">Red flags</p>
            <ul className="mt-1.5 space-y-1.5">
              {branch.redFlags.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-ink-secondary">
                  <span className="text-critical">⚑</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          {/* Profile fit */}
          <Card className="p-5">
            <SectionTitle sub={`Scored against your profile: ${profile.direction.toLowerCase()} · budget ${BUDGET_LABELS[profile.budget]} · ${profile.riskTolerance.toLowerCase()}.`}>
              Fit with your goals
            </SectionTitle>
            <ul className="space-y-1.5">
              {fitNotes.map((n) => (
                <li key={n} className="flex gap-2 text-sm text-ink-secondary">
                  <span className={recommendedForUser ? "text-good" : "text-warning"}>
                    {recommendedForUser ? "✓" : "!"}
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* First steps + validation plan */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle sub="The first five moves if you pursue this branch.">
            First 5 steps
          </SectionTitle>
          <ol className="space-y-2.5">
            {branch.firstSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-ink-secondary">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-bold text-ink">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        <ValidationPlanView plan={plan} />
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={backToMap}
          className="rounded-xl border border-line px-6 py-3 text-sm font-bold text-ink-secondary transition hover:border-accent/50 hover:text-ink"
        >
          ← Compare other branches
        </button>
        {/* Future: Export to PDF + shareable link buttons (see lib/saas/credits.ts) */}
        <button
          disabled
          title="Coming with accounts & credits"
          className="cursor-not-allowed rounded-xl border border-line px-6 py-3 text-sm font-bold text-ink-muted opacity-50"
        >
          Export report (soon)
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink-secondary">{value}</p>
    </div>
  );
}
