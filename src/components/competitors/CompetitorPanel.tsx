"use client";

import { useState } from "react";
import { useScan } from "@/lib/store";
import type { QualityLevel } from "@/lib/types";
import { Card } from "@/components/ui/bits";

/**
 * Competitor input panel. Entries feed lib/scoring.ts#competitorAdjustments:
 * weak competitors raise Competition Opportunity / Differentiation / Problem
 * Strength; strong ones lower them and add Risk.
 *
 * // Future AI route: mid model — summarizeCompetitors digests these entries.
 * // Future AI route: deep research model — complexCompetitorAnalysis would
 * // pull sites/reviews automatically instead of manual entry.
 */

const QUALITY_OPTIONS: { id: QualityLevel; label: string }[] = [
  { id: "poor", label: "Poor" },
  { id: "average", label: "Average" },
  { id: "strong", label: "Strong" },
];

interface Draft {
  name: string;
  website: string;
  location: string;
  pricingNotes: string;
  reviewRating: string;
  strengths: string;
  weaknesses: string;
  complaints: string;
  websiteQuality?: QualityLevel;
  brandingQuality?: QualityLevel;
  speedConvenience?: QualityLevel;
  trustLevel?: QualityLevel;
}

const EMPTY: Draft = {
  name: "", website: "", location: "", pricingNotes: "",
  reviewRating: "", strengths: "", weaknesses: "", complaints: "",
};

export function CompetitorPanel() {
  const { competitors, addCompetitor, removeCompetitor } = useScan();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    if (!draft.name.trim()) return;
    const rating = parseFloat(draft.reviewRating);
    addCompetitor({
      name: draft.name.trim(),
      website: draft.website.trim() || undefined,
      location: draft.location.trim() || undefined,
      pricingNotes: draft.pricingNotes.trim() || undefined,
      reviewRating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : undefined,
      strengths: draft.strengths.trim() || undefined,
      weaknesses: draft.weaknesses.trim() || undefined,
      complaints: draft.complaints.trim() || undefined,
      websiteQuality: draft.websiteQuality,
      brandingQuality: draft.brandingQuality,
      speedConvenience: draft.speedConvenience,
      trustLevel: draft.trustLevel,
    });
    setDraft(EMPTY);
    setOpen(false);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Competitor intel</h3>
          <p className="text-xs text-ink-muted">Real competitors sharpen every score.</p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border border-accent/50 px-2.5 py-1 text-xs font-bold text-accent transition hover:bg-accent/10"
        >
          {open ? "Close" : "+ Add"}
        </button>
      </div>

      {competitors.length > 0 && (
        <ul className="mt-3 space-y-2">
          {competitors.map((c) => (
            <li key={c.id} className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-ink">{c.name}</span>
                <div className="flex items-center gap-2">
                  {c.reviewRating !== undefined && (
                    <span className="tabular-nums text-warning">{c.reviewRating.toFixed(1)}★</span>
                  )}
                  <button
                    onClick={() => removeCompetitor(c.id)}
                    className="text-ink-muted transition hover:text-critical"
                    aria-label={`Remove ${c.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              {(c.weaknesses || c.complaints) && (
                <p className="mt-1 line-clamp-2 text-ink-muted">
                  Gaps: {[c.weaknesses, c.complaints].filter(Boolean).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {competitors.length > 0 && (
        <p className="mt-2 text-[11px] text-accent">
          ✓ {competitors.length} competitor{competitors.length > 1 ? "s" : ""} factored into
          Competition, Differentiation, Problem Strength &amp; Risk.
        </p>
      )}

      {open && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          <Input placeholder="Business name *" value={draft.name} onChange={(v) => set({ name: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Website" value={draft.website} onChange={(v) => set({ website: v })} />
            <Input placeholder="Location" value={draft.location} onChange={(v) => set({ location: v })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Review rating (1–5)"
              value={draft.reviewRating}
              onChange={(v) => set({ reviewRating: v })}
              type="number"
            />
            <Input placeholder="Pricing notes" value={draft.pricingNotes} onChange={(v) => set({ pricingNotes: v })} />
          </div>
          <TextArea placeholder="Strengths" value={draft.strengths} onChange={(v) => set({ strengths: v })} />
          <TextArea placeholder="Weaknesses" value={draft.weaknesses} onChange={(v) => set({ weaknesses: v })} />
          <TextArea
            placeholder="Customer complaints (paste from reviews)"
            value={draft.complaints}
            onChange={(v) => set({ complaints: v })}
          />

          {(
            [
              ["websiteQuality", "Website"],
              ["brandingQuality", "Branding"],
              ["speedConvenience", "Speed"],
              ["trustLevel", "Trust"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-xs text-ink-muted">{label}</span>
              <div className="flex gap-1">
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => set({ [key]: draft[key] === q.id ? undefined : q.id })}
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-medium transition ${
                      draft[key] === q.id
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-line text-ink-muted hover:text-ink"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={save}
            disabled={!draft.name.trim()}
            className="w-full rounded-lg bg-accent px-3 py-2 text-xs font-bold text-page transition hover:bg-accent-glow disabled:opacity-40"
          >
            Save competitor
          </button>
        </div>
      )}
    </Card>
  );
}

function Input({
  placeholder, value, onChange, type = "text",
}: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-page px-3 py-2 text-xs text-ink placeholder-ink-muted outline-none focus:border-accent/60"
    />
  );
}

function TextArea({
  placeholder, value, onChange,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="w-full resize-none rounded-lg border border-line bg-page px-3 py-2 text-xs text-ink placeholder-ink-muted outline-none focus:border-accent/60"
    />
  );
}
