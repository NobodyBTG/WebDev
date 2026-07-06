import { preferredCategories } from "./profile";
import type {
  BudgetTier,
  Competitor,
  ConfidenceLevel,
  GoalProfile,
  MetricKey,
  MetricScores,
  OpportunityBranch,
  PainPointAnalysis,
  ScoreLabel,
  ScoredBranch,
  Verdict,
} from "./types";
import { BUDGET_LABELS, BUDGET_TIER_ORDER } from "./types";

/**
 * Opportunity scoring engine.
 *
 * Final score is a weighted sum of nine 0–10 metrics, mapped to 0–100.
 * Risk is a NEGATIVE metric: it is inverted (10 - risk) before weighting,
 * so high risk drags the final score down.
 *
 * // Future AI route: mid model
 * // A mid-tier model would EXPLAIN scores in context ("competition is 7/10
 * // because most local competitors have sub-4-star ratings") and could
 * // propose metric adjustments from live research. The arithmetic below
 * // stays deterministic either way — the model annotates, the code computes.
 */

export const METRIC_WEIGHTS: Record<MetricKey, number> = {
  problemStrength: 0.15,
  marketDemand: 0.15,
  competitionOpportunity: 0.15,
  easeOfEntry: 0.1,
  entryCost: 0.1,
  profitPotential: 0.15,
  differentiation: 0.1,
  customerAcquisition: 0.05,
  risk: 0.05,
};

const clamp = (v: number, min = 0, max = 10) => Math.min(max, Math.max(min, v));

export function computeFinalScore(scores: MetricScores): number {
  let total = 0;
  for (const key of Object.keys(METRIC_WEIGHTS) as MetricKey[]) {
    const raw = key === "risk" ? 10 - scores.risk : scores[key];
    total += clamp(raw) * METRIC_WEIGHTS[key] * 10;
  }
  return Math.round(total);
}

export function scoreLabel(score: number): ScoreLabel {
  if (score <= 30) return "Avoid";
  if (score <= 50) return "Weak opportunity";
  if (score <= 65) return "Possible — needs proof";
  if (score <= 80) return "Strong opportunity";
  return "Excellent opportunity";
}

// ---------------------------------------------------------------------------
// Competitor-driven adjustments
// ---------------------------------------------------------------------------

/**
 * Turn manually-entered competitor intel into metric adjustments.
 *
 * Weak competitors (low ratings, listed weaknesses/complaints, poor sites)
 * OPEN the market: competition opportunity, differentiation, and problem
 * strength go up. Strong competitors close it and add risk.
 */
export function competitorAdjustments(competitors: Competitor[]): Partial<MetricScores> {
  if (competitors.length === 0) return {};

  let weakSignals = 0;
  let strongSignals = 0;

  for (const c of competitors) {
    if (c.reviewRating !== undefined) {
      if (c.reviewRating <= 3.5) weakSignals += 1.5;
      else if (c.reviewRating >= 4.5) strongSignals += 1.5;
    }
    if (c.weaknesses?.trim()) weakSignals += 1;
    if (c.complaints?.trim()) weakSignals += 1;
    if (c.strengths?.trim()) strongSignals += 0.5;
    for (const q of [c.websiteQuality, c.brandingQuality, c.speedConvenience, c.trustLevel]) {
      if (q === "poor") weakSignals += 0.5;
      if (q === "strong") strongSignals += 0.5;
    }
  }

  const perCompetitor = (weakSignals - strongSignals) / competitors.length;
  // perCompetitor roughly ranges -3 (all strong) .. +4 (all weak)
  const openness = Math.max(-1.5, Math.min(2, perCompetitor * 0.6));

  return {
    competitionOpportunity: openness,
    differentiation: openness > 0 ? Math.min(1.5, openness) : openness * 0.5,
    problemStrength: openness > 0 ? Math.min(1, openness * 0.5) : 0,
    customerAcquisition: openness > 0 ? Math.min(0.5, openness * 0.25) : 0,
    risk: openness < 0 ? Math.min(1, -openness * 0.5) : -Math.min(0.5, openness * 0.25),
  };
}

// ---------------------------------------------------------------------------
// Pain-point-driven adjustments
// ---------------------------------------------------------------------------

/**
 * Repeated complaint patterns are demand evidence: they nudge problem
 * strength and differentiation up slightly. Capped small — pasted complaints
 * are a signal, not proof.
 */
export function painPointAdjustments(analysis: PainPointAnalysis | null): Partial<MetricScores> {
  if (!analysis || analysis.matches.length === 0) return {};
  const repeated = analysis.repeatedPatterns.length;
  return {
    problemStrength: Math.min(1.5, repeated * 0.5),
    differentiation: Math.min(1, repeated * 0.25),
  };
}

export function applyAdjustments(
  base: MetricScores,
  ...adjustments: Partial<MetricScores>[]
): MetricScores {
  const out = { ...base };
  for (const adj of adjustments) {
    for (const [key, delta] of Object.entries(adj) as [MetricKey, number][]) {
      out[key] = clamp(Math.round((out[key] + delta) * 10) / 10);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Profile fit + verdicts
// ---------------------------------------------------------------------------

function budgetIndex(tier: BudgetTier): number {
  return BUDGET_TIER_ORDER.indexOf(tier);
}

export function budgetCompatible(profile: GoalProfile, branch: OpportunityBranch): boolean {
  return budgetIndex(branch.entryCostTier) <= budgetIndex(profile.budget);
}

interface FitResult {
  recommended: boolean;
  notes: string[];
}

function assessFit(profile: GoalProfile, branch: OpportunityBranch): FitResult {
  const notes: string[] = [];
  let points = 0;

  const preferred = preferredCategories(profile);
  if (preferred.includes(branch.category)) {
    points += 2;
    notes.push("Matches the direction you said you want.");
  } else {
    notes.push("Outside the direction you described — treat as a stretch option.");
  }

  if (budgetCompatible(profile, branch)) {
    points += 2;
  } else {
    points -= 3;
    notes.push(
      `Estimated entry cost (${BUDGET_LABELS[branch.entryCostTier]}) exceeds your stated budget (${BUDGET_LABELS[profile.budget]}).`
    );
  }

  if (
    (branch.category === "direct" || branch.category === "niche") &&
    (profile.experienceId === "none" || profile.experienceId === "interest-only")
  ) {
    points -= 1;
    notes.push("You have no hands-on experience in this trade — expect a licensing/skills ramp.");
  }
  if (profile.experienceId === "professional" && (branch.category === "direct" || branch.category === "niche")) {
    points += 1;
    notes.push("Your professional experience is a real edge here.");
  }

  if (profile.riskToleranceId === "very-low" && branch.scores.risk >= 6) {
    points -= 2;
    notes.push("Risk level of this branch conflicts with your low risk tolerance.");
  }

  return { recommended: points >= 3, notes };
}

function decideVerdict(
  finalScore: number,
  fit: FitResult,
  profile: GoalProfile,
  branch: OpportunityBranch
): Verdict {
  const overBudget = !budgetCompatible(profile, branch);
  if (finalScore <= 45) return "Avoid";
  if (finalScore <= 60) return "Pivot";
  if (overBudget) return finalScore > 75 ? "Test" : "Pivot"; // good idea, wrong wallet
  if (finalScore <= 78 || !fit.recommended) return "Test";
  return "Build";
}

/** Honest, direct assessment lines — the app should not hype every idea. */
function straightTalk(
  finalScore: number,
  scores: MetricScores,
  fit: FitResult,
  profile: GoalProfile,
  branch: OpportunityBranch,
  hasCompetitorData: boolean
): string[] {
  const lines: string[] = [];

  if (!budgetCompatible(profile, branch)) {
    lines.push("This idea is too expensive for your stated budget.");
  }
  if (scores.marketDemand <= 5) {
    lines.push("This sounds good, but demand proof is weak. Do not skip validation.");
  }
  if (scores.competitionOpportunity <= 4) {
    lines.push("This market is crowded. Only enter if you can prove competitors have obvious service gaps.");
  } else if (scores.competitionOpportunity >= 7 && hasCompetitorData) {
    lines.push("This market is crowded, but the competitors you logged have obvious service gaps.");
  }
  if (scores.differentiation <= 4) {
    lines.push("Hard to stand out here. This could work if you niche down further.");
  }
  if (branch.category === "software" && scores.problemStrength <= 6) {
    lines.push("This is not a full business yet. It is a feature. Find who pays before building.");
  }
  if (scores.risk >= 7) {
    lines.push("Risk is high enough to kill this — read the red flags before spending anything.");
  }
  if (finalScore > 60 && finalScore <= 80) {
    lines.push("Test this before spending real money.");
  }
  if (lines.length === 0) {
    lines.push("Strong on paper — but paper is cheap. Run the validation plan before committing.");
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function scoreBranch(
  branch: OpportunityBranch,
  profile: GoalProfile,
  competitors: Competitor[],
  painAnalysis: PainPointAnalysis | null
): ScoredBranch {
  const adjustedScores = applyAdjustments(
    branch.scores,
    competitorAdjustments(competitors),
    painPointAdjustments(painAnalysis)
  );
  const finalScore = computeFinalScore(adjustedScores);
  const fit = assessFit(profile, branch);
  const verdict = decideVerdict(finalScore, fit, profile, branch);

  return {
    branch,
    adjustedScores,
    finalScore,
    label: scoreLabel(finalScore),
    verdict,
    recommendedForUser: fit.recommended,
    fitNotes: fit.notes,
    straightTalk: straightTalk(finalScore, adjustedScores, fit, profile, branch, competitors.length > 0),
  };
}

export function scoreAllBranches(
  branches: OpportunityBranch[],
  profile: GoalProfile,
  competitors: Competitor[],
  painAnalysis: PainPointAnalysis | null
): ScoredBranch[] {
  return branches
    .map((b) => scoreBranch(b, profile, competitors, painAnalysis))
    .sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Confidence: v1 heuristic based on how much signal the user gave us.
 * Later, live research data would raise this.
 */
export function confidenceLevel(
  profile: GoalProfile,
  competitors: Competitor[],
  painAnalysis: PainPointAnalysis | null
): ConfidenceLevel {
  let points = 0;
  if (profile.answeredCount >= profile.totalQuestions) points += 2;
  else if (profile.answeredCount >= 5) points += 1;
  if (competitors.length >= 2) points += 2;
  else if (competitors.length === 1) points += 1;
  if (painAnalysis && painAnalysis.matches.length >= 3) points += 1;

  if (points >= 4) return "High";
  if (points >= 2) return "Medium";
  return "Low";
}
