/**
 * Core domain types for Opportunity Radar.
 *
 * Everything downstream (scoring, reports, validation plans) is driven by
 * these shapes, so future data sources (live research APIs, AI generation,
 * Supabase persistence) only need to produce/consume these types.
 */

// ---------------------------------------------------------------------------
// Opportunity categories
// ---------------------------------------------------------------------------

export type OpportunityCategory =
  | "direct"
  | "niche"
  | "support"
  | "software"
  | "marketplace"
  | "product"
  | "education";

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  direct: "Direct Business",
  niche: "Niche Business",
  support: "Support Business",
  software: "Software Business",
  marketplace: "Marketplace",
  product: "Product Business",
  education: "Education / Content",
};

export const CATEGORY_DESCRIPTIONS: Record<OpportunityCategory, string> = {
  direct: "You provide the industry's main service yourself",
  niche: "A focused, specialized slice of the main business",
  support: "You sell services to businesses in this industry",
  software: "You build tools for the industry",
  marketplace: "You connect buyers and providers",
  product: "You sell physical products",
  education: "You teach, train, or create content",
};

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/** All metrics are 0–10. `risk` is a NEGATIVE metric — higher risk is worse. */
export interface MetricScores {
  problemStrength: number;
  marketDemand: number;
  competitionOpportunity: number;
  easeOfEntry: number;
  entryCost: number;
  profitPotential: number;
  differentiation: number;
  customerAcquisition: number;
  risk: number;
}

export type MetricKey = keyof MetricScores;

export const METRIC_LABELS: Record<MetricKey, string> = {
  problemStrength: "Problem Strength",
  marketDemand: "Market Demand",
  competitionOpportunity: "Competition Opportunity",
  easeOfEntry: "Ease of Entry",
  entryCost: "Entry Cost",
  profitPotential: "Profit Potential",
  differentiation: "Differentiation",
  customerAcquisition: "Customer Acquisition",
  risk: "Risk",
};

export const METRIC_HINTS: Record<MetricKey, string> = {
  problemStrength: "How painful the problem is for customers",
  marketDemand: "Whether enough people want this and will pay",
  competitionOpportunity: "How much room is left in the market",
  easeOfEntry: "How easy it is for you to start",
  entryCost: "Higher score = cheaper to start",
  profitPotential: "Margins, repeat business, pricing power",
  differentiation: "How easily this can stand out",
  customerAcquisition: "How hard it is to get customers",
  risk: "Higher = riskier (this LOWERS the final score)",
};

export type ScoreLabel =
  | "Avoid"
  | "Weak opportunity"
  | "Possible — needs proof"
  | "Strong opportunity"
  | "Excellent opportunity";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type Verdict = "Build" | "Test" | "Pivot" | "Avoid";

export interface ScoredBranch {
  branch: OpportunityBranch;
  /** Metric scores after competitor / pain-point adjustments */
  adjustedScores: MetricScores;
  /** 0–100 weighted score */
  finalScore: number;
  label: ScoreLabel;
  verdict: Verdict;
  /** Whether this branch fits the user's goal profile */
  recommendedForUser: boolean;
  fitNotes: string[];
  /** Honest, direct assessment lines shown in the report */
  straightTalk: string[];
}

// ---------------------------------------------------------------------------
// Budget / cost tiers
// ---------------------------------------------------------------------------

export type BudgetTier = "0-500" | "500-2500" | "2500-10000" | "10000-50000" | "50000+";

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  "0-500": "$0–$500",
  "500-2500": "$500–$2,500",
  "2500-10000": "$2,500–$10,000",
  "10000-50000": "$10,000–$50,000",
  "50000+": "$50,000+",
};

/** Entry-cost scoring logic from the spec: cheaper = higher score. */
export const BUDGET_TIER_SCORE: Record<BudgetTier, number> = {
  "0-500": 10,
  "500-2500": 9,
  "2500-10000": 7,
  "10000-50000": 5,
  "50000+": 2,
};

export const BUDGET_TIER_ORDER: BudgetTier[] = [
  "0-500",
  "500-2500",
  "2500-10000",
  "10000-50000",
  "50000+",
];

// ---------------------------------------------------------------------------
// Opportunity branch
// ---------------------------------------------------------------------------

export interface OpportunityBranch {
  id: string;
  name: string;
  category: OpportunityCategory;
  description: string;
  whoPays: string;
  whyItMayWork: string;
  whyItMayFail: string;
  targetCustomer: string;
  problemSolved: string;
  /** Estimated tier of startup cost */
  entryCostTier: BudgetTier;
  startupCostEstimate: string;
  scores: MetricScores;
  differentiationIdeas: string[];
  redFlags: string[];
  firstSteps: string[];
  cheapestValidation: string;
}

export interface IndustryDataset {
  id: string;
  name: string;
  /** lowercase strings matched against user input */
  aliases: string[];
  summary: string;
  branches: OpportunityBranch[];
  /** true when generated from templates rather than curated demo data */
  generated?: boolean;
}

// ---------------------------------------------------------------------------
// Intake / goal profile
// ---------------------------------------------------------------------------

export interface IntakeOption {
  id: string;
  label: string;
}

export interface IntakeQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: IntakeOption[];
  /** allow multiple selections (e.g. resources) */
  multi?: boolean;
}

/** questionId -> selected option id(s) */
export type IntakeAnswers = Record<string, string[]>;

export interface GoalProfile {
  industryName: string;
  direction: string;
  directionId: string;
  goal: string;
  budget: BudgetTier;
  resources: string[];
  handsOn: string;
  handsOnId: string;
  experience: string;
  experienceId: string;
  locality: string;
  riskTolerance: string;
  riskToleranceId: string;
  bestFit: string;
  answeredCount: number;
  totalQuestions: number;
}

// ---------------------------------------------------------------------------
// Competitors
// ---------------------------------------------------------------------------

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  location?: string;
  pricingNotes?: string;
  /** 1–5 stars */
  reviewRating?: number;
  strengths?: string;
  weaknesses?: string;
  complaints?: string;
  websiteQuality?: QualityLevel;
  brandingQuality?: QualityLevel;
  speedConvenience?: QualityLevel;
  trustLevel?: QualityLevel;
}

export type QualityLevel = "poor" | "average" | "strong";

// ---------------------------------------------------------------------------
// Pain points
// ---------------------------------------------------------------------------

export type PainCategory =
  | "price"
  | "speed"
  | "quality"
  | "trust"
  | "convenience"
  | "availability"
  | "customerService"
  | "technology"
  | "branding"
  | "transparency";

export const PAIN_CATEGORY_LABELS: Record<PainCategory, string> = {
  price: "Price problem",
  speed: "Speed problem",
  quality: "Quality problem",
  trust: "Trust problem",
  convenience: "Convenience problem",
  availability: "Availability problem",
  customerService: "Customer service problem",
  technology: "Technology problem",
  branding: "Branding problem",
  transparency: "Transparency problem",
};

export interface PainPointMatch {
  category: PainCategory;
  /** the line/snippet of pasted text that triggered the match */
  snippet: string;
  keyword: string;
}

export interface PainPointAnalysis {
  totalLines: number;
  matches: PainPointMatch[];
  counts: Record<PainCategory, number>;
  /** categories that repeat (2+ hits) — the interesting signal */
  repeatedPatterns: PainCategory[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Validation plan
// ---------------------------------------------------------------------------

export interface ValidationStep {
  title: string;
  detail: string;
  cost: string;
  effort: "low" | "medium" | "high";
}

export interface ValidationPlan {
  steps: ValidationStep[];
  cheapestTest: string;
  budgetNote: string;
}
