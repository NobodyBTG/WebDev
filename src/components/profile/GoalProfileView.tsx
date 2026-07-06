"use client";

import { useScan } from "@/lib/store";
import { BUDGET_LABELS } from "@/lib/types";
import { Card } from "@/components/ui/bits";

/** User Goal Profile — shown before generating branches. */
export function GoalProfileView() {
  const { profile, dataset, goToMap, goToStep, confidence } = useScan();
  if (!profile || !dataset) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Industry", value: profile.industryName },
    { label: "Direction", value: profile.direction },
    { label: "Main goal", value: profile.goal },
    { label: "Budget", value: BUDGET_LABELS[profile.budget] },
    {
      label: "Strongest resources",
      value: profile.resources.length ? profile.resources.join(", ") : "Not specified",
    },
    { label: "Hands-on preference", value: profile.handsOn },
    { label: "Industry experience", value: profile.experience },
    { label: "Local / online", value: profile.locality },
    { label: "Risk tolerance", value: profile.riskTolerance },
  ];

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Goal profile locked
        </p>
        <h2 className="mt-2 text-3xl font-black text-ink">Here&apos;s what you&apos;re actually looking for</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Every opportunity gets scored against this profile — budget mismatches and
          direction conflicts get flagged, not hidden.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid sm:grid-cols-2">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`border-line px-5 py-3.5 ${i % 2 === 0 ? "sm:border-r" : ""} ${
                i < rows.length - (rows.length % 2 === 0 ? 2 : 1) ? "border-b" : ""
              }`}
            >
              <p className="text-[11px] uppercase tracking-wide text-ink-muted">{r.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{r.value}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-accent/30 bg-accent/5 px-5 py-4">
          <p className="text-[11px] uppercase tracking-wide text-accent">Best fit (radar&apos;s read)</p>
          <p className="mt-1 font-bold text-ink">{profile.bestFit}</p>
        </div>
      </Card>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
        <span>
          {profile.answeredCount}/{profile.totalQuestions} questions answered · scan
          confidence starts at <span className="font-semibold text-ink-secondary">{confidence}</span>
        </span>
        <button onClick={() => goToStep("intake")} className="underline-offset-2 hover:text-ink hover:underline">
          Edit answers
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={goToMap}
          className="rounded-xl bg-accent px-8 py-3.5 font-bold text-page shadow-glow transition hover:bg-accent-glow"
        >
          Generate opportunity map →
        </button>
      </div>
    </div>
  );
}
