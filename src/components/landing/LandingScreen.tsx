"use client";

import { useState } from "react";
import { useScan } from "@/lib/store";
import { CURATED_INDUSTRIES } from "@/data";

const EXAMPLES = [
  "Plumber",
  "Motorcycle parts",
  "Restaurant",
  "Cleaning company",
  "HVAC",
  "Dog grooming",
  "Towing",
  "Food trucks",
];

export function LandingScreen() {
  const { startScan } = useScan();
  const [input, setInput] = useState("");

  const submit = () => {
    if (input.trim().length >= 2) startScan(input);
  };

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="radar-grid relative overflow-hidden rounded-3xl border border-line bg-surface/60 px-6 py-14 text-center sm:py-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full border border-accent/20" />
          <div className="absolute inset-[80px] rounded-full border border-accent/15" />
          <div className="absolute inset-[160px] rounded-full border border-accent/10" />
          <div
            className="absolute inset-0 animate-sweep rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(34,211,238,0.18), transparent 70deg)",
            }}
          />
        </div>

        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Business opportunity scanner
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight text-ink sm:text-5xl">
            Find out what&apos;s worth building{" "}
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              before you waste money
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-secondary">
            Type any industry, trade, career, or market. Opportunity Radar maps the
            business opportunities inside it, scores them against your goals and budget,
            and tells you straight: build, test, pivot, or avoid.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Plumber, food trucks, motorcycle parts…"
              className="flex-1 rounded-xl border border-line bg-page px-4 py-3.5 text-ink placeholder-ink-muted outline-none ring-accent/50 transition focus:border-accent/60 focus:ring-2"
              aria-label="Industry, career, or business idea"
              autoFocus
            />
            <button
              onClick={submit}
              disabled={input.trim().length < 2}
              className="rounded-xl bg-accent px-6 py-3.5 font-bold text-page shadow-glow transition hover:bg-accent-glow disabled:opacity-40 disabled:shadow-none"
            >
              Scan industry
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => startScan(ex)}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-secondary transition hover:border-accent/50 hover:text-accent"
              >
                {ex}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs text-ink-muted">
            You don&apos;t have to want to <em>be</em> the plumber. Sell to them, build
            software for them, or find what their customers are missing — the interview
            figures out your angle.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            n: "01",
            title: "Smart interview",
            text: "Eight sharp multiple-choice questions build your goal profile — no endless chatbot back-and-forth.",
          },
          {
            n: "02",
            title: "Opportunity map",
            text: "Every industry branches into direct, niche, support, software, marketplace, product, and education plays — each scored 0–100.",
          },
          {
            n: "03",
            title: "Honest verdict",
            text: "Full validation report with red flags, cheap tests, and a straight answer: Build, Test, Pivot, or Avoid.",
          },
        ].map((f) => (
          <div key={f.n} className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-xs font-bold text-accent">{f.n}</span>
            <h3 className="mt-1 font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-sm text-ink-secondary">{f.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Deep demo data: {CURATED_INDUSTRIES.map((i) => i.name).join(" · ")} — any other
        industry gets a template scan.
      </p>
    </div>
  );
}
