"use client";

import { useMemo, useState } from "react";
import { useScan } from "@/lib/store";
import type { OpportunityCategory } from "@/lib/types";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "@/lib/types";
import { BranchCard } from "./BranchCard";
import { CATEGORY_COLORS } from "@/components/ui/bits";
import { CompetitorPanel } from "@/components/competitors/CompetitorPanel";
import { PainPointAnalyzer } from "@/components/painpoints/PainPointAnalyzer";

type Filter = "all" | "recommended" | OpportunityCategory;

/**
 * Opportunity Branch Map — the industry fans out into category branches,
 * each holding scored opportunity cards. Competitor intel and pain-point
 * evidence (right column) adjust the scores live.
 */
export function OpportunityMap() {
  const { dataset, profile, scoredBranches, selectBranch, confidence, competitors, painAnalysis } =
    useScan();
  const [filter, setFilter] = useState<Filter>("all");

  const categories = useMemo(() => {
    const present = new Set(scoredBranches.map((s) => s.branch.category));
    return (Object.keys(CATEGORY_LABELS) as OpportunityCategory[]).filter((c) => present.has(c));
  }, [scoredBranches]);

  if (!dataset || !profile) return null;

  const visible = scoredBranches.filter((s) => {
    if (filter === "all") return true;
    if (filter === "recommended") return s.recommendedForUser;
    return s.branch.category === filter;
  });

  const topPick = scoredBranches.find((s) => s.recommendedForUser) ?? scoredBranches[0];
  const adjustmentsActive = competitors.length > 0 || (painAnalysis?.matches.length ?? 0) > 0;

  return (
    <div className="animate-fade-up">
      {/* Industry header */}
      <div className="mb-6 rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Opportunity map
            </p>
            <h1 className="mt-1 text-2xl font-black text-ink">{dataset.name}</h1>
            <p className="mt-1.5 text-sm text-ink-secondary">{dataset.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right text-xs">
            <span className="rounded-full border border-line px-3 py-1 text-ink-secondary">
              {scoredBranches.length} branches scanned
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-ink-secondary">
              Confidence: <span className="font-bold text-ink">{confidence}</span>
              {adjustmentsActive && <span className="ml-1 text-accent">· intel applied</span>}
            </span>
            {topPick && (
              <button
                onClick={() => selectBranch(topPick.branch.id)}
                className="mt-1 rounded-full bg-accent/15 px-3 py-1 font-semibold text-accent transition hover:bg-accent/25"
              >
                Top pick: {topPick.branch.name} ({topPick.finalScore}) →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Category branch rail */}
          <div className="mb-4 flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`All (${scoredBranches.length})`} />
            <FilterChip
              active={filter === "recommended"}
              onClick={() => setFilter("recommended")}
              label={`★ For you (${scoredBranches.filter((s) => s.recommendedForUser).length})`}
              accent
            />
            {categories.map((c) => (
              <FilterChip
                key={c}
                active={filter === c}
                onClick={() => setFilter(c)}
                label={CATEGORY_LABELS[c]}
                dotColor={CATEGORY_COLORS[c]}
                title={CATEGORY_DESCRIPTIONS[c]}
              />
            ))}
          </div>

          {/* Branch cards, connected by a spine */}
          <div className="relative">
            <div className="absolute bottom-4 left-3 top-0 hidden w-px bg-gradient-to-b from-accent/50 via-line to-transparent sm:block" aria-hidden />
            <div className="grid gap-4 sm:pl-8 md:grid-cols-2">
              {visible.map((s) => (
                <div key={s.branch.id} className="relative">
                  <span className="absolute -left-8 top-8 hidden h-px w-8 bg-line sm:block" aria-hidden />
                  <BranchCard scored={s} onInspect={() => selectBranch(s.branch.id)} />
                </div>
              ))}
            </div>
            {visible.length === 0 && (
              <p className="rounded-xl border border-line bg-surface p-6 text-center text-sm text-ink-muted">
                Nothing in this filter. That itself is information — this industry&apos;s
                map has no {filter === "recommended" ? "profile-fit" : "such"} branches.
              </p>
            )}
          </div>
        </div>

        {/* Research side panel: adjusts scores live */}
        <aside className="space-y-4">
          <CompetitorPanel />
          <PainPointAnalyzer />
        </aside>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  dotColor,
  accent,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
  accent?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? accent
            ? "border-accent bg-accent/15 text-accent"
            : "border-ink-secondary bg-surface-overlay text-ink"
          : "border-line bg-surface text-ink-secondary hover:text-ink"
      }`}
    >
      {dotColor && <span className="h-2 w-2 rounded-full" style={{ background: dotColor }} />}
      {label}
    </button>
  );
}
