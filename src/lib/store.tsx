"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { resolveIndustry } from "@/data";
import { buildGoalProfile } from "./profile";
import { analyzePainPoints } from "./painpoints";
import { confidenceLevel, scoreAllBranches } from "./scoring";
import type {
  Competitor,
  ConfidenceLevel,
  GoalProfile,
  IndustryDataset,
  IntakeAnswers,
  PainPointAnalysis,
  ScoredBranch,
} from "./types";

/**
 * Client-side scan state (v1: in-memory only).
 *
 * The whole state object is intentionally serializable so that "saved scans"
 * (Supabase persistence per user) can be added later by snapshotting/restoring
 * this shape. // Future: user accounts + saved scans persist ScanState rows.
 */

export type Step = "landing" | "intake" | "profile" | "map" | "report";

interface ScanState {
  step: Step;
  industryInput: string;
  dataset: IndustryDataset | null;
  answers: IntakeAnswers;
  profile: GoalProfile | null;
  competitors: Competitor[];
  painText: string;
  painAnalysis: PainPointAnalysis | null;
  selectedBranchId: string | null;
  // derived
  scoredBranches: ScoredBranch[];
  selectedBranch: ScoredBranch | null;
  confidence: ConfidenceLevel;
  // actions
  startScan: (input: string) => void;
  setAnswer: (questionId: string, optionIds: string[]) => void;
  finishIntake: () => void;
  goToMap: () => void;
  selectBranch: (branchId: string) => void;
  backToMap: () => void;
  addCompetitor: (c: Omit<Competitor, "id">) => void;
  removeCompetitor: (id: string) => void;
  setPainText: (text: string) => void;
  analyzePain: () => void;
  reset: () => void;
  goToStep: (step: Step) => void;
}

const ScanContext = createContext<ScanState | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<Step>("landing");
  const [industryInput, setIndustryInput] = useState("");
  const [dataset, setDataset] = useState<IndustryDataset | null>(null);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [profile, setProfile] = useState<GoalProfile | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [painText, setPainText] = useState("");
  const [painAnalysis, setPainAnalysis] = useState<PainPointAnalysis | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [competitorCounter, setCompetitorCounter] = useState(0);

  // Latest answers, readable from stale closures: the intake wizard's
  // auto-advance timer may call finishIntake from a render captured before
  // the final setAnswer, which would silently drop the last answer.
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const scoredBranches = useMemo(() => {
    if (!dataset || !profile) return [];
    return scoreAllBranches(dataset.branches, profile, competitors, painAnalysis);
  }, [dataset, profile, competitors, painAnalysis]);

  const selectedBranch = useMemo(
    () => scoredBranches.find((s) => s.branch.id === selectedBranchId) ?? null,
    [scoredBranches, selectedBranchId]
  );

  const confidence = useMemo(
    () => (profile ? confidenceLevel(profile, competitors, painAnalysis) : "Low"),
    [profile, competitors, painAnalysis]
  );

  const value: ScanState = {
    step,
    industryInput,
    dataset,
    answers,
    profile,
    competitors,
    painText,
    painAnalysis,
    selectedBranchId,
    scoredBranches,
    selectedBranch,
    confidence,
    startScan: (input) => {
      setIndustryInput(input);
      setDataset(resolveIndustry(input));
      setAnswers({});
      setProfile(null);
      setCompetitors([]);
      setPainText("");
      setPainAnalysis(null);
      setSelectedBranchId(null);
      setStep("intake");
    },
    setAnswer: (questionId, optionIds) =>
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: optionIds };
        answersRef.current = next;
        return next;
      }),
    finishIntake: () => {
      if (!dataset) return;
      // Future AI route: cheap model — summarizeIntake would generate a richer
      // natural-language profile here (see lib/ai/router.ts).
      setProfile(buildGoalProfile(dataset.name, answersRef.current));
      setStep("profile");
    },
    goToMap: () => setStep("map"),
    selectBranch: (branchId) => {
      setSelectedBranchId(branchId);
      setStep("report");
    },
    backToMap: () => setStep("map"),
    addCompetitor: (c) => {
      setCompetitors((prev) => [...prev, { ...c, id: `comp-${competitorCounter}` }]);
      setCompetitorCounter((n) => n + 1);
    },
    removeCompetitor: (id) => setCompetitors((prev) => prev.filter((c) => c.id !== id)),
    setPainText,
    analyzePain: () => {
      // Future AI route: cheap model — categorizePainPoints replaces the
      // keyword classifier with a real classification call.
      setPainAnalysis(analyzePainPoints(painText));
    },
    reset: () => {
      setStep("landing");
      setIndustryInput("");
      setDataset(null);
      setAnswers({});
      setProfile(null);
      setCompetitors([]);
      setPainText("");
      setPainAnalysis(null);
      setSelectedBranchId(null);
    },
    goToStep: setStep,
  };

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScan(): ScanState {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScan must be used inside <ScanProvider>");
  return ctx;
}
