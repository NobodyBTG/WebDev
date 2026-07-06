"use client";

import { ScanProvider, useScan, type Step } from "@/lib/store";
import { LandingScreen } from "./landing/LandingScreen";
import { IntakeWizard } from "./intake/IntakeWizard";
import { GoalProfileView } from "./profile/GoalProfileView";
import { OpportunityMap } from "./tree/OpportunityMap";
import { ReportView } from "./report/ReportView";

const STEPS: { id: Step; label: string }[] = [
  { id: "landing", label: "Scan" },
  { id: "intake", label: "Interview" },
  { id: "profile", label: "Profile" },
  { id: "map", label: "Opportunity Map" },
  { id: "report", label: "Report" },
];

function Header() {
  const { step, reset, goToStep, profile, dataset } = useScan();
  const currentIdx = STEPS.findIndex((s) => s.id === step);

  const canVisit = (target: Step): boolean => {
    if (target === "landing") return true;
    if (!dataset) return false;
    if (target === "intake") return true;
    if (!profile) return false;
    if (target === "report") return false; // report needs a selected branch — go via map
    return true;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button onClick={reset} className="group flex items-center gap-2" title="Start over">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-accent/40" />
            <span className="absolute inset-[5px] rounded-full border border-accent/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-scan-pulse" />
          </span>
          <span className="text-sm font-bold tracking-wide text-ink">
            OPPORTUNITY<span className="text-accent">RADAR</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Progress">
          {STEPS.map((s, i) => {
            const state = i < currentIdx ? "done" : i === currentIdx ? "active" : "todo";
            const clickable = canVisit(s.id) && i < currentIdx;
            return (
              <div key={s.id} className="flex items-center">
                {i > 0 && <span className="mx-1 h-px w-4 bg-line" aria-hidden />}
                <button
                  disabled={!clickable}
                  onClick={() => clickable && goToStep(s.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    state === "active"
                      ? "bg-accent/15 text-accent"
                      : state === "done"
                        ? "text-ink-secondary hover:bg-surface-raised hover:text-ink"
                        : "text-ink-muted"
                  } ${clickable ? "cursor-pointer" : "cursor-default"}`}
                >
                  {s.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Future: user account menu + credit balance go here (lib/saas/credits.ts) */}
        <span className="hidden rounded-full border border-line px-2.5 py-1 text-[10px] font-medium text-ink-muted md:block">
          v1 · local demo · AI research coming
        </span>
      </div>
    </header>
  );
}

function CurrentStep() {
  const { step } = useScan();
  switch (step) {
    case "landing":
      return <LandingScreen />;
    case "intake":
      return <IntakeWizard />;
    case "profile":
      return <GoalProfileView />;
    case "map":
      return <OpportunityMap />;
    case "report":
      return <ReportView />;
  }
}

export function ScanApp() {
  return (
    <ScanProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <CurrentStep />
        </main>
        <footer className="border-t border-line py-4 text-center text-xs text-ink-muted">
          Opportunity Radar v1 — mock data + rule-based scoring. Honest by design: not every idea is a good idea.
        </footer>
      </div>
    </ScanProvider>
  );
}
