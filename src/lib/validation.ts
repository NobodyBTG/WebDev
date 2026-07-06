import type {
  GoalProfile,
  OpportunityBranch,
  ValidationPlan,
  ValidationStep,
} from "./types";
import { BUDGET_LABELS } from "./types";

/**
 * Validation Test Generator — cheap ways to prove demand before building.
 *
 * // Future AI route: mid model
 * // A mid-tier model would write a bespoke validation plan referencing the
 * // exact branch, local market, and the user's resources. v1 composes from
 * // category-specific templates + universal cheap tests.
 */

type StepTemplate = (industry: string, branch: OpportunityBranch) => ValidationStep;

const CATEGORY_STEPS: Record<OpportunityBranch["category"], StepTemplate[]> = {
  direct: [
    (ind) => ({
      title: "Call 20 potential customers",
      detail: `Call 20 homeowners or businesses who recently needed ${ind.toLowerCase()} work. Ask what they paid, how long they waited, and what annoyed them.`,
      cost: "$0",
      effort: "medium",
    }),
    (ind) => ({
      title: "Post in local Facebook groups",
      detail: `Offer the service in 3–5 local community groups. Count real inquiries in 7 days — not likes, inquiries.`,
      cost: "$0",
      effort: "low",
    }),
    () => ({
      title: "Offer the service manually first",
      detail: "Do 3 paid jobs yourself (or subcontract them) before buying any equipment or branding.",
      cost: "$0–$200",
      effort: "high",
    }),
  ],
  niche: [
    (ind) => ({
      title: "Run a $50 ad test on the niche offer",
      detail: `Run one ad with the exact niche promise (e.g. same-day, flat-rate). If cost-per-lead is sane for ${ind.toLowerCase()}, the niche has pull.`,
      cost: "$50",
      effort: "low",
    }),
    () => ({
      title: "Create a one-page landing page",
      detail: "One page, one offer, one phone number. Measure calls and form fills for two weeks.",
      cost: "$0–$30",
      effort: "low",
    }),
    () => ({
      title: "Search reviews for the niche complaint",
      detail: "Read 50 competitor reviews. Count how many complaints your niche promise would fix. Fewer than 10? Weak niche.",
      cost: "$0",
      effort: "low",
    }),
  ],
  support: [
    (ind) => ({
      title: `Cold email 30 ${ind.toLowerCase()} businesses`,
      detail: "Short pitch, one specific pain, one price. 3+ interested replies out of 30 = real signal.",
      cost: "$0",
      effort: "medium",
    }),
    (ind) => ({
      title: "Offer it free to 2 businesses for 2 weeks",
      detail: `Deliver the service manually to two ${ind.toLowerCase()} companies. If they won't take it free, they'll never pay for it.`,
      cost: "$0",
      effort: "high",
    }),
    () => ({
      title: "Pre-sell a monthly package",
      detail: "Ask for a paid first month before you build anything. A verbal 'yes' is not validation — a payment is.",
      cost: "$0",
      effort: "medium",
    }),
  ],
  software: [
    (ind) => ({
      title: `Interview 10 ${ind.toLowerCase()} operators`,
      detail: "Ask how they handle this workflow today. If the answer is 'spreadsheet + cursing', keep going. If it's 'existing tool works fine', stop.",
      cost: "$0",
      effort: "medium",
    }),
    () => ({
      title: "Build a fake checkout / waitlist page",
      detail: "Landing page with pricing and a 'Start trial' button that captures emails. Measure click-to-signup rate.",
      cost: "$0–$50",
      effort: "low",
    }),
    () => ({
      title: "Sell the outcome as a manual service first",
      detail: "Deliver the software's outcome by hand (concierge MVP) to 3 paying customers before writing real code.",
      cost: "$0",
      effort: "high",
    }),
  ],
  marketplace: [
    () => ({
      title: "Broker 5 transactions manually",
      detail: "Be the marketplace yourself: match buyer and provider by phone/text. If you can't broker 5 deals manually, software won't fix that.",
      cost: "$0",
      effort: "high",
    }),
    () => ({
      title: "Build a waitlist for both sides",
      detail: "Two landing pages — one per side of the market. The side that signs up slower is your real constraint.",
      cost: "$0–$50",
      effort: "medium",
    }),
    (ind) => ({
      title: "Test demand with a $50 ad",
      detail: `Run a lead-gen ad for the buyer side ("compare ${ind.toLowerCase()} quotes"). Cost per lead tells you if the economics can work.`,
      cost: "$50",
      effort: "low",
    }),
  ],
  product: [
    () => ({
      title: "List on Facebook Marketplace / eBay first",
      detail: "Test a simple offer on existing marketplaces before building a store. Real orders beat surveys.",
      cost: "$0–$100",
      effort: "low",
    }),
    () => ({
      title: "Pre-sell the product",
      detail: "Take deposits or pre-orders with a clear ship date. Refund everyone if you don't hit a minimum.",
      cost: "$0",
      effort: "medium",
    }),
    (ind) => ({
      title: "Check sell-through and margins",
      detail: `Price 10 comparable ${ind.toLowerCase()} listings. Estimate your landed cost. Under 30% margin after fees and shipping? Walk away.`,
      cost: "$0",
      effort: "low",
    }),
  ],
  education: [
    () => ({
      title: "Publish 5 pieces of content",
      detail: "Five videos/posts answering the most-searched beginner questions. Watch which one pulls — that's your product.",
      cost: "$0",
      effort: "medium",
    }),
    () => ({
      title: "Make a waitlist for the paid version",
      detail: "Offer a paid guide/course at the end of free content. Waitlist signups are the demand test.",
      cost: "$0",
      effort: "low",
    }),
    (ind) => ({
      title: "Pre-sell a cohort or guide",
      detail: `Pre-sell to your first 10 students at a discount before producing the full ${ind.toLowerCase()} course.`,
      cost: "$0",
      effort: "medium",
    }),
  ],
};

export function generateValidationPlan(
  branch: OpportunityBranch,
  profile: GoalProfile
): ValidationPlan {
  const steps: ValidationStep[] = CATEGORY_STEPS[branch.category].map((t) =>
    t(profile.industryName, branch)
  );

  // Universal closing steps
  steps.push({
    title: "Search reviews for repeated complaints",
    detail:
      "Read 30–50 reviews of existing options. Repeated complaints are your differentiation roadmap; silence is a warning.",
    cost: "$0",
    effort: "low",
  });
  steps.push({
    title: "Set a kill criteria before you start",
    detail:
      "Write down the number that kills the idea (e.g. 'fewer than 3 paying interests in 14 days = stop'). Decide it now, not after you're emotionally invested.",
    cost: "$0",
    effort: "low",
  });

  const lowBudget = profile.budget === "0-500";
  return {
    steps: steps.slice(0, 5),
    cheapestTest: branch.cheapestValidation,
    budgetNote: lowBudget
      ? `Your budget is ${BUDGET_LABELS[profile.budget]} — every step above except the ad test is free. Do the free ones first.`
      : `With a ${BUDGET_LABELS[profile.budget]} budget you can afford to run 2–3 of these tests in parallel. Still: spend on proof, not on logos.`,
  };
}
