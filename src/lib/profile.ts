import { INTAKE_QUESTIONS } from "./questions";
import type { BudgetTier, GoalProfile, IntakeAnswers, OpportunityCategory } from "./types";

/**
 * Build a User Goal Profile from intake answers.
 *
 * // Future AI route: cheap model
 * // A cheap model would summarize the intake answers into a natural-language
 * // profile and infer "best fit" more intelligently. For v1 this is
 * // deterministic rule-based mapping — which also makes it testable.
 */

function labelFor(questionId: string, optionId: string | undefined): string {
  if (!optionId) return "Not answered";
  const q = INTAKE_QUESTIONS.find((q) => q.id === questionId);
  return q?.options.find((o) => o.id === optionId)?.label ?? "Not answered";
}

const DIRECTION_SUMMARIES: Record<string, string> = {
  "start-main": "Start and run the core business",
  "related-idea": "Find a business around the industry, not necessarily in it",
  "sell-to-industry": "Sell to businesses in this industry (B2B)",
  "build-software": "Build software for this industry",
  "find-problems": "Hunt for unsolved customer problems",
  unsure: "Exploring — open to any angle",
};

function inferBestFit(answers: IntakeAnswers): string {
  const direction = answers.direction?.[0];
  const budget = (answers.budget?.[0] ?? "0-500") as BudgetTier;
  const handsOn = answers.handsOn?.[0];
  const resources = answers.resources ?? [];
  const lowBudget = budget === "0-500" || budget === "500-2500";

  if (direction === "build-software" || handsOn === "software") {
    return "Software or tooling for the industry — start with one painful workflow";
  }
  if (direction === "sell-to-industry") {
    return lowBudget
      ? "Low-cost B2B support service (you sell TO the industry, not in it)"
      : "B2B service or product supplying the industry";
  }
  if (direction === "start-main") {
    return lowBudget
      ? "A narrow, niched-down version of the main business with minimal equipment"
      : "The core business, differentiated on speed, trust, or specialization";
  }
  if (handsOn === "middleman") {
    return "Lead generation or marketplace-style middleman model";
  }
  if (resources.includes("marketing") || resources.includes("audience")) {
    return "Marketing-led support business or content/education play";
  }
  if (lowBudget) {
    return "Low-cost support or service business around the industry";
  }
  return "Support or niche business, validated cheaply before committing capital";
}

export function buildGoalProfile(industryName: string, answers: IntakeAnswers): GoalProfile {
  const directionId = answers.direction?.[0] ?? "unsure";
  const answeredCount = INTAKE_QUESTIONS.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;

  return {
    industryName,
    directionId,
    direction: DIRECTION_SUMMARIES[directionId] ?? labelFor("direction", directionId),
    goal: labelFor("goal", answers.goal?.[0]),
    budget: (answers.budget?.[0] ?? "0-500") as BudgetTier,
    resources: (answers.resources ?? []).map((r) => labelFor("resources", r)),
    handsOnId: answers.handsOn?.[0] ?? "not-sure",
    handsOn: labelFor("handsOn", answers.handsOn?.[0]),
    experienceId: answers.experience?.[0] ?? "none",
    experience: labelFor("experience", answers.experience?.[0]),
    locality: labelFor("locality", answers.locality?.[0]),
    riskToleranceId: answers.risk?.[0] ?? "medium",
    riskTolerance: labelFor("risk", answers.risk?.[0]),
    bestFit: inferBestFit(answers),
    answeredCount,
    totalQuestions: INTAKE_QUESTIONS.length,
  };
}

/**
 * Which opportunity categories align with the user's stated direction.
 * Used to mark branches as "recommended for you".
 */
export function preferredCategories(profile: GoalProfile): OpportunityCategory[] {
  const byDirection: Record<string, OpportunityCategory[]> = {
    "start-main": ["direct", "niche"],
    "related-idea": ["niche", "support", "marketplace", "product", "education"],
    "sell-to-industry": ["support", "product", "software"],
    "build-software": ["software"],
    "find-problems": ["support", "software", "marketplace"],
    unsure: ["direct", "niche", "support", "software", "marketplace", "product", "education"],
  };
  const byHandsOn: Record<string, OpportunityCategory[]> = {
    physical: ["direct", "niche"],
    manage: ["direct", "niche", "support"],
    "sell-online": ["product", "marketplace", "education"],
    software: ["software"],
    middleman: ["marketplace", "support"],
    automated: ["software", "marketplace", "education", "support"],
  };

  const dir = byDirection[profile.directionId] ?? byDirection.unsure;
  const hands = byHandsOn[profile.handsOnId];
  if (!hands) return dir;

  const overlap = dir.filter((c) => hands.includes(c));
  // If direction and hands-on preferences don't overlap, direction wins
  return overlap.length > 0 ? overlap : dir;
}
