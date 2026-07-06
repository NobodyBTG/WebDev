"use client";

import type { ValidationPlan } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/bits";

const EFFORT_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Low effort",
  medium: "Medium effort",
  high: "High effort",
};

/** Cheap validation plan for the selected branch. */
export function ValidationPlanView({ plan }: { plan: ValidationPlan }) {
  return (
    <Card className="p-5">
      <SectionTitle sub="Prove demand with the least money possible — in order.">
        Validation plan
      </SectionTitle>

      <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-accent">
          Cheapest possible test — start here
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{plan.cheapestTest}</p>
      </div>

      <ol className="space-y-3">
        {plan.steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-xs font-bold text-accent">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ink">{step.title}</span>
                <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-medium tabular-nums text-ink-secondary">
                  {step.cost}
                </span>
                <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                  {EFFORT_LABEL[step.effort]}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">{plan.budgetNote}</p>
    </Card>
  );
}
