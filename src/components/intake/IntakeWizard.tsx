"use client";

import { useState } from "react";
import { INTAKE_QUESTIONS } from "@/lib/questions";
import { useScan } from "@/lib/store";

/**
 * Smart Intent Discovery — one question per screen, keyboard-fast,
 * with a progress bar. Multi-select questions cap at 3 picks.
 */
export function IntakeWizard() {
  const { dataset, answers, setAnswer, finishIntake } = useScan();
  const [idx, setIdx] = useState(0);

  const q = INTAKE_QUESTIONS[idx];
  const selected = answers[q.id] ?? [];
  const isLast = idx === INTAKE_QUESTIONS.length - 1;
  const progress = (idx / INTAKE_QUESTIONS.length) * 100;

  const choose = (optionId: string) => {
    if (q.multi) {
      const next = selected.includes(optionId)
        ? selected.filter((s) => s !== optionId)
        : selected.length >= 3
          ? selected
          : [...selected, optionId];
      setAnswer(q.id, next);
    } else {
      setAnswer(q.id, [optionId]);
      // auto-advance on single-choice for speed
      setTimeout(() => (isLast ? finishIntake() : setIdx((i) => i + 1)), 180);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-up" key={q.id}>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-muted">
          <span>
            Scanning: <span className="font-semibold text-accent">{dataset?.name}</span>
          </span>
          <span className="tabular-nums">
            Question {idx + 1} of {INTAKE_QUESTIONS.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink">{q.title}</h2>
      {q.subtitle && <p className="mt-1 text-sm text-ink-muted">{q.subtitle}</p>}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {q.options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "border-accent bg-accent/10 text-accent shadow-glow"
                  : "border-line bg-surface text-ink-secondary hover:border-accent/40 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-lg px-4 py-2 text-sm text-ink-muted transition hover:text-ink disabled:opacity-30"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => (isLast ? finishIntake() : setIdx((i) => i + 1))}
            className="rounded-lg px-4 py-2 text-sm text-ink-muted transition hover:text-ink"
            title="Skipping lowers scan confidence"
          >
            Skip
          </button>
          {(q.multi || selected.length > 0) && (
            <button
              onClick={() => (isLast ? finishIntake() : setIdx((i) => i + 1))}
              disabled={selected.length === 0}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-page transition hover:bg-accent-glow disabled:opacity-40"
            >
              {isLast ? "Build my profile →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
