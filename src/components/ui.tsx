/**
 * Minimal shadcn-style UI kit (dark garage theme).
 * Kept in one file for a small dependency surface; swap for real
 * shadcn/ui components any time — the class conventions match.
 */

"use client";

import { clsx } from "clsx";
import React from "react";

/* ── Button ──────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "secondary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent text-black hover:bg-accent-hover",
        variant === "secondary" && "border border-garage-600 bg-garage-800 text-garage-300 hover:border-garage-500 hover:text-white",
        variant === "ghost" && "text-garage-400 hover:bg-garage-800 hover:text-white",
        variant === "danger" && "border border-loss/40 bg-transparent text-loss hover:bg-loss/10",
        className
      )}
      {...props}
    />
  );
}

/* ── Card ────────────────────────────────────────────────────────────── */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-lg border border-garage-700 bg-garage-900 p-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx("mb-3 text-xs font-semibold uppercase tracking-wider text-garage-400", className)}
      {...props}
    />
  );
}

/* ── Form controls ───────────────────────────────────────────────────── */

const fieldClasses =
  "w-full rounded-md border border-garage-600 bg-garage-850 px-2.5 py-1.5 text-sm text-garage-300 placeholder-garage-500 focus:border-accent focus:outline-none";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={clsx(fieldClasses, className)} {...props} />;
  }
);

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(fieldClasses, "min-h-[80px]", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(fieldClasses, className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={clsx("mb-1 block text-xs font-medium text-garage-400", className)} {...props}>
      {children}
    </label>
  );
}

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────── */

type BadgeTone = "orange" | "green" | "red" | "yellow" | "gray" | "blue";

const badgeTones: Record<BadgeTone, string> = {
  orange: "bg-accent/15 text-accent border-accent/30",
  green: "bg-profit/15 text-profit border-profit/30",
  red: "bg-loss/15 text-loss border-loss/30",
  yellow: "bg-caution/15 text-caution border-caution/30",
  gray: "bg-garage-700/40 text-garage-400 border-garage-600",
  blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

export function Badge({
  tone = "gray",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium",
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}

/* ── Stat tile ───────────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "profit" | "loss" | "accent" | "caution";
}) {
  return (
    <Card className="flex flex-col gap-1 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-garage-500">{label}</div>
      <div
        className={clsx(
          "stat-number",
          tone === "profit" && "text-profit",
          tone === "loss" && "text-loss",
          tone === "accent" && "text-accent",
          tone === "caution" && "text-caution",
          tone === "default" && "text-white"
        )}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-garage-500">{sub}</div>}
    </Card>
  );
}

/* ── Tone helpers shared by pages ────────────────────────────────────── */

export function sellThroughTone(tone: "strong" | "good" | "ok" | "slow"): BadgeTone {
  return tone === "strong" ? "green" : tone === "good" ? "blue" : tone === "ok" ? "yellow" : "red";
}

export function recommendationTone(rec: string): BadgeTone {
  if (rec === "Strong Buy") return "green";
  if (rec === "Buy Only Cheap") return "yellow";
  if (rec === "Borderline") return "yellow";
  if (rec === "Avoid") return "red";
  return "blue"; // project / repair
}
