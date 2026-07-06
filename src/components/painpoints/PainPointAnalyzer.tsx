"use client";

import { useScan } from "@/lib/store";
import { PAIN_CATEGORY_LABELS, type PainCategory } from "@/lib/types";
import { Card } from "@/components/ui/bits";

/**
 * Pain Point Analyzer — paste complaints/reviews/Reddit comments; the
 * keyword classifier (lib/painpoints.ts) buckets them into 10 problem types
 * and surfaces repeated patterns. Repeated patterns nudge Problem Strength
 * and Differentiation up (lib/scoring.ts#painPointAdjustments).
 */
export function PainPointAnalyzer() {
  const { painText, setPainText, analyzePain, painAnalysis } = useScan();

  const categoriesWithHits = painAnalysis
    ? (Object.keys(painAnalysis.counts) as PainCategory[])
        .filter((c) => painAnalysis.counts[c] > 0)
        .sort((a, b) => painAnalysis.counts[b] - painAnalysis.counts[a])
    : [];
  const maxCount = categoriesWithHits.length
    ? painAnalysis!.counts[categoriesWithHits[0]]
    : 0;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-ink">Pain point analyzer</h3>
      <p className="text-xs text-ink-muted">
        Paste real complaints, reviews, or Reddit comments. Repeated patterns = demand evidence.
      </p>

      <textarea
        value={painText}
        onChange={(e) => setPainText(e.target.value)}
        rows={5}
        placeholder={
          "e.g.\n\"Called three plumbers, nobody called back for two days\"\n\"Quote was $200 more than what they said on the phone\"\n\"Great work but impossible to book\""
        }
        className="mt-3 w-full resize-y rounded-lg border border-line bg-page px-3 py-2 text-xs text-ink placeholder-ink-muted outline-none focus:border-accent/60"
      />
      <button
        onClick={analyzePain}
        disabled={painText.trim().length < 10}
        className="mt-2 w-full rounded-lg bg-accent2 px-3 py-2 text-xs font-bold text-page transition hover:opacity-90 disabled:opacity-40"
      >
        Analyze pain points
      </button>

      {painAnalysis && (
        <div className="mt-3 border-t border-line pt-3">
          {categoriesWithHits.length > 0 ? (
            <>
              <div className="space-y-1.5">
                {categoriesWithHits.map((c) => {
                  const count = painAnalysis.counts[c];
                  const repeated = painAnalysis.repeatedPatterns.includes(c);
                  return (
                    <div key={c} className="flex items-center gap-2">
                      <span className="w-36 shrink-0 text-[11px] text-ink-secondary">
                        {PAIN_CATEGORY_LABELS[c]}
                        {repeated && <span className="ml-1 text-accent" title="Repeated pattern">●</span>}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-accent2"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-4 text-right text-[11px] font-semibold tabular-nums text-ink">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 rounded-lg border border-accent2/30 bg-accent2/10 p-2.5 text-xs leading-relaxed text-ink-secondary">
                {painAnalysis.summary}
              </p>
              {painAnalysis.repeatedPatterns.length > 0 && (
                <p className="mt-2 text-[11px] text-accent">
                  ✓ Repeated patterns applied to Problem Strength &amp; Differentiation scores.
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-ink-muted">{painAnalysis.summary}</p>
          )}
        </div>
      )}
    </Card>
  );
}
