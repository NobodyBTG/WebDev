"use client";

import type { OpportunityCategory, Verdict } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

/** Small shared UI primitives. */

// Categorical palette — validated (CVD ΔE 23.7, all ≥3:1 on #111827).
// Category identity is never color-alone: badges always carry the label text.
export const CATEGORY_COLORS: Record<OpportunityCategory, string> = {
  direct: "#3987e5",
  niche: "#199e70",
  support: "#c98500",
  software: "#9085e9",
  marketplace: "#e66767",
  product: "#d55181",
  education: "#d95926",
};

export function CategoryBadge({ category }: { category: OpportunityCategory }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={{ borderColor: `${color}55`, color, background: `${color}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {CATEGORY_LABELS[category]}
    </span>
  );
}

/** Score band → status color. Always paired with the numeric label (never color-alone). */
export function scoreColor(score0to100: number): string {
  if (score0to100 <= 30) return "#d03b3b"; // critical
  if (score0to100 <= 50) return "#ec835a"; // serious
  if (score0to100 <= 65) return "#fab219"; // warning
  return "#0ca30c"; // good
}

export function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${score} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#233150" strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#f1f5fd"
        fontSize={size / 3.4}
        fontWeight={700}
      >
        {score}
      </text>
    </svg>
  );
}

/** Horizontal 0–10 metric meter. Neutral accent fill — magnitude, not status. */
export function MetricBar({
  label,
  value,
  hint,
  negative = false,
}: {
  label: string;
  value: number;
  hint?: string;
  negative?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value * 10));
  return (
    <div title={hint}>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs text-ink-secondary">
          {label}
          {negative && <span className="ml-1 text-[10px] text-serious">(lowers score)</span>}
        </span>
        <span className="text-xs font-semibold tabular-nums text-ink">{value.toFixed(1)}/10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: negative ? "#ec835a" : "#22d3ee" }}
        />
      </div>
    </div>
  );
}

const VERDICT_STYLES: Record<Verdict, { color: string; icon: string }> = {
  Build: { color: "#0ca30c", icon: "▲" },
  Test: { color: "#fab219", icon: "◆" },
  Pivot: { color: "#ec835a", icon: "↻" },
  Avoid: { color: "#d03b3b", icon: "✕" },
};

export function VerdictBadge({ verdict, large = false }: { verdict: Verdict; large?: boolean }) {
  const { color, icon } = VERDICT_STYLES[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-bold ${
        large ? "px-4 py-1.5 text-lg" : "px-2 py-0.5 text-xs"
      }`}
      style={{ borderColor: `${color}66`, color, background: `${color}18` }}
    >
      <span aria-hidden>{icon}</span>
      {verdict}
    </span>
  );
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {sub && <p className="mt-0.5 text-sm text-ink-muted">{sub}</p>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-card ${className}`}>
      {children}
    </div>
  );
}
