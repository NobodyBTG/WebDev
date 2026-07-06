"use client";

import type { ScoredBranch } from "@/lib/types";
import { BUDGET_LABELS } from "@/lib/types";
import { CategoryBadge, ScoreRing, VerdictBadge, CATEGORY_COLORS } from "@/components/ui/bits";

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-surface-raised px-1 py-1.5">
      <span className="text-sm font-bold tabular-nums text-ink">{value.toFixed(0)}</span>
      <span className="text-[9px] leading-tight text-ink-muted">{label}</span>
    </div>
  );
}

export function BranchCard({
  scored,
  onInspect,
}: {
  scored: ScoredBranch;
  onInspect: () => void;
}) {
  const { branch, adjustedScores, finalScore, verdict, recommendedForUser, label } = scored;
  const color = CATEGORY_COLORS[branch.category];

  return (
    <button
      onClick={onInspect}
      className="group relative flex w-full flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow"
      style={{ borderTopColor: `${color}88`, borderTopWidth: 2 }}
    >
      {recommendedForUser && (
        <span className="absolute -top-2.5 right-4 rounded-full border border-accent/60 bg-page px-2 py-0.5 text-[10px] font-bold text-accent">
          ★ Recommended for you
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <CategoryBadge category={branch.category} />
          <h3 className="mt-2 font-bold leading-snug text-ink group-hover:text-accent">
            {branch.name}
          </h3>
        </div>
        <div className="shrink-0">
          <ScoreRing score={finalScore} size={64} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-ink-secondary">{branch.description}</p>

      <div className="mt-3 space-y-1.5 text-xs">
        <p className="text-ink-muted">
          <span className="font-semibold text-ink-secondary">Who pays: </span>
          {branch.whoPays}
        </p>
        <p className="line-clamp-2 text-ink-muted">
          <span className="font-semibold text-ink-secondary">Why it may work: </span>
          {branch.whyItMayWork}
        </p>
        <p className="text-ink-muted">
          <span className="font-semibold text-ink-secondary">Entry cost: </span>
          {BUDGET_LABELS[branch.entryCostTier]}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        <MiniStat label="Ease" value={adjustedScores.easeOfEntry} />
        <MiniStat label="Compete" value={adjustedScores.competitionOpportunity} />
        <MiniStat label="Profit" value={adjustedScores.profitPotential} />
        <MiniStat label="Demand" value={adjustedScores.marketDemand} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-2">
          <VerdictBadge verdict={verdict} />
          <span className="text-[11px] text-ink-muted">{label}</span>
        </div>
        <span className="text-xs font-semibold text-accent opacity-0 transition group-hover:opacity-100">
          Inspect →
        </span>
      </div>
    </button>
  );
}
