"use client";

import { useState } from "react";
import type { MetricKey, MetricScores } from "@/lib/types";
import { METRIC_HINTS, METRIC_LABELS } from "@/lib/types";

const AXES: MetricKey[] = [
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

const SHORT: Record<MetricKey, string> = {
  problemStrength: "Problem",
  marketDemand: "Demand",
  competitionOpportunity: "Compete",
  easeOfEntry: "Ease",
  entryCost: "Cost",
  profitPotential: "Profit",
  differentiation: "Differ",
  customerAcquisition: "Acquire",
  risk: "Risk⁻",
};

/**
 * 9-axis radar of metric scores. Single series (accent cyan) — no legend
 * needed; every vertex is direct-labeled and hoverable.
 * Risk is plotted INVERTED (10 - risk) so "bigger polygon = better" holds
 * on every axis; the label marks it with ⁻.
 */
export function RadarChart({ scores, size = 320 }: { scores: MetricScores; size?: number }) {
  const [hover, setHover] = useState<MetricKey | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 44;

  const angle = (i: number) => (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
  const plotted = (key: MetricKey) => (key === "risk" ? 10 - scores.risk : scores[key]);
  const point = (i: number, value: number) => {
    const r = (value / 10) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };

  const polygon = AXES.map((k, i) => point(i, plotted(k)).join(",")).join(" ");
  const rings = [2.5, 5, 7.5, 10];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[360px]"
        role="img"
        aria-label="Radar chart of the nine opportunity metrics"
      >
        {/* grid rings */}
        {rings.map((v) => (
          <polygon
            key={v}
            points={AXES.map((_, i) => point(i, v).join(",")).join(" ")}
            fill="none"
            stroke="#233150"
            strokeWidth={1}
          />
        ))}
        {/* spokes */}
        {AXES.map((k, i) => {
          const [x, y] = point(i, 10);
          return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="#233150" strokeWidth={1} />;
        })}

        {/* data polygon */}
        <polygon points={polygon} fill="rgba(34,211,238,0.18)" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" />

        {/* vertices + hover targets */}
        {AXES.map((k, i) => {
          const v = plotted(k);
          const [x, y] = point(i, v);
          const [lx, ly] = point(i, 12.3);
          const active = hover === k;
          return (
            <g key={k}>
              <circle
                cx={x}
                cy={y}
                r={active ? 5 : 3.5}
                fill="#22d3ee"
                stroke="#111827"
                strokeWidth={2}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontWeight={active ? 700 : 500}
                fill={active ? "#f1f5fd" : "#a8b3cc"}
              >
                {SHORT[k]}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={700}
                fill={active ? "#22d3ee" : "#6b7793"}
              >
                {v.toFixed(1)}
              </text>
              {/* generous invisible hit target */}
              <circle
                cx={x}
                cy={y}
                r={16}
                fill="transparent"
                onMouseEnter={() => setHover(k)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-1 min-h-[36px] text-center text-xs text-ink-muted" aria-live="polite">
        {hover ? (
          <>
            <span className="font-semibold text-ink">{METRIC_LABELS[hover]}: </span>
            {METRIC_HINTS[hover]}
            {hover === "risk" && ` — plotted inverted (${(10 - scores.risk).toFixed(1)} = ${scores.risk.toFixed(1)} risk).`}
          </>
        ) : (
          "Hover a point for detail. Risk⁻ is plotted inverted so bigger is always better."
        )}
      </div>
    </div>
  );
}
