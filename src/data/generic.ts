import type { BudgetTier, IndustryDataset, MetricScores, OpportunityBranch, OpportunityCategory } from "@/lib/types";

/**
 * Generic branch generator — used when the user's industry has no curated
 * dataset. Produces plausible template branches so the whole flow still works
 * for ANY input ("dog grooming", "towing", "small town websites"...).
 *
 * // Future AI route: cheap model — generateBasicBranches replaces this with
 * // real industry-aware generation. // Future AI route: deep research model —
 * // deepMarketResearch would ground the scores in live data instead of
 * // hash-seeded defaults.
 */

/** Deterministic tiny hash so the same industry always gets the same scores (SSR-safe, no Math.random). */
function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function vary(base: number, seed: number, salt: number): number {
  const delta = ((seed + salt * 2654435761) % 5) - 2; // -2..+2
  return Math.min(10, Math.max(1, base + delta * 0.5));
}

interface BranchTemplate {
  key: string;
  category: OpportunityCategory;
  name: (ind: string) => string;
  description: (ind: string) => string;
  whoPays: (ind: string) => string;
  whyItMayWork: (ind: string) => string;
  whyItMayFail: (ind: string) => string;
  targetCustomer: (ind: string) => string;
  problemSolved: (ind: string) => string;
  entryCostTier: BudgetTier;
  startupCostEstimate: string;
  baseScores: MetricScores;
  differentiationIdeas: (ind: string) => string[];
  redFlags: (ind: string) => string[];
  firstSteps: (ind: string) => string[];
  cheapestValidation: (ind: string) => string;
}

const lower = (s: string) => s.toLowerCase();

const TEMPLATES: BranchTemplate[] = [
  {
    key: "direct",
    category: "direct",
    name: (i) => `Independent ${i} Business`,
    description: (i) => `Start the core ${lower(i)} business yourself, competing on reliability and communication.`,
    whoPays: (i) => `Direct customers of ${lower(i)} services/products`,
    whyItMayWork: (i) => `Most local ${lower(i)} operators compete poorly on responsiveness and professionalism — showing up and communicating well is a real edge.`,
    whyItMayFail: () => "You inherit every hard part of the core business: skills, licensing, equipment, and slow trust-building.",
    targetCustomer: (i) => `Existing buyers of ${lower(i)} services in your area`,
    problemSolved: (i) => `Getting ${lower(i)} work done by someone who answers the phone and shows up`,
    entryCostTier: "2500-10000",
    startupCostEstimate: "$2,500–$10,000 (varies heavily by trade)",
    baseScores: { problemStrength: 6, marketDemand: 6, competitionOpportunity: 4, easeOfEntry: 5, entryCost: 7, profitPotential: 6, differentiation: 5, customerAcquisition: 5, risk: 5 },
    differentiationIdeas: (i) => [
      "Guaranteed response times when competitors go silent",
      "Transparent upfront pricing",
      `Reviews-first strategy: become the best-reviewed ${lower(i)} option in one zip code`,
    ],
    redFlags: (i) => [
      `Check licensing/certification requirements for ${lower(i)} in your state`,
      "Direct entry is the most expensive and slowest branch — validate demand first",
    ],
    firstSteps: (i) => [
      `Research licensing and startup requirements for ${lower(i)}`,
      "Call 10 competitors as a customer; note response time and pricing",
      "Define one clear differentiator you can actually deliver",
      "Do 3 jobs (or sales) before buying anything expensive",
      "Collect reviews from day one",
    ],
    cheapestValidation: (i) => `Call 10 local ${lower(i)} providers as a customer. Slow callbacks, vague pricing, or rude service = your opening. Crisp professional responses = crowded market.`,
  },
  {
    key: "niche",
    category: "niche",
    name: (i) => `Specialized ${i} Niche Service`,
    description: (i) => `A narrow, focused slice of ${lower(i)} — one service, one customer type, done faster or better than generalists.`,
    whoPays: (i) => `Customers with a specific urgent ${lower(i)} need generalists handle poorly`,
    whyItMayWork: () => "Specialists charge more, market simpler, and operate leaner than generalists. One repeated complaint = one niche.",
    whyItMayFail: () => "Pick the wrong niche and the market is too small; the niche must map to a real, frequent complaint.",
    targetCustomer: (i) => `The most underserved customer segment in ${lower(i)}`,
    problemSolved: (i) => `The one ${lower(i)} job generalists do slowly, badly, or overpriced`,
    entryCostTier: "500-2500",
    startupCostEstimate: "$500–$2,500",
    baseScores: { problemStrength: 7, marketDemand: 6, competitionOpportunity: 6, easeOfEntry: 6, entryCost: 9, profitPotential: 6, differentiation: 7, customerAcquisition: 6, risk: 4 },
    differentiationIdeas: () => [
      "Flat-rate published pricing for the one thing you do",
      "Same-day or speed guarantee generalists can't match",
      "Own one search phrase completely",
    ],
    redFlags: () => ["Niche size is unproven until you count actual demand", "Generalists can copy you if the niche is shallow"],
    firstSteps: (i) => [
      `Read 50 reviews of local ${lower(i)} businesses; list repeated complaints`,
      "Pick the complaint that appears most and is fixable by focus",
      "Build a one-page offer around fixing exactly that",
      "Test with a $50 ad or 5 group posts",
      "Deliver 3 jobs; refine the offer",
    ],
    cheapestValidation: (i) => `Read 50 competitor reviews in ${lower(i)}. If one complaint keeps repeating, post an offer that fixes exactly that complaint and count inquiries in 7 days.`,
  },
  {
    key: "support",
    category: "support",
    name: (i) => `B2B Services for ${i} Businesses`,
    description: (i) => `Sell the picks and shovels: marketing, admin, call answering, or ops support for ${lower(i)} businesses.`,
    whoPays: (i) => `${i} business owners buying back their time`,
    whyItMayWork: (i) => `Most small ${lower(i)} operators are great at the work and bad at everything around it — leads, reviews, phones, paperwork.`,
    whyItMayFail: () => "Small businesses are slow to trust outsiders and quick to cancel anything without visible ROI.",
    targetCustomer: (i) => `1–10 person ${lower(i)} companies with no office staff`,
    problemSolved: (i) => `The owner stops losing revenue to missed calls, weak reviews, or invisible marketing`,
    entryCostTier: "0-500",
    startupCostEstimate: "$0–$500",
    baseScores: { problemStrength: 7, marketDemand: 6, competitionOpportunity: 6, easeOfEntry: 8, entryCost: 10, profitPotential: 6, differentiation: 6, customerAcquisition: 5, risk: 3 },
    differentiationIdeas: (i) => [
      `${i}-only specialization — speak their language, show their case studies`,
      "Performance pricing tied to booked jobs or measurable results",
      "Monthly plain-English ROI report",
    ],
    redFlags: () => ["Generic agencies compete on price; specialization is mandatory", "Expect high churn until you prove ROI fast"],
    firstSteps: (i) => [
      `Interview 10 ${lower(i)} owners: what eats their time or loses them money?`,
      "Pick ONE painful, provable problem",
      "Deliver it manually for 2 businesses (cheap or free)",
      "Document results; convert to $200–$500/mo retainers",
      "Systematize before scaling",
    ],
    cheapestValidation: (i) => `Cold-call or email 20 ${lower(i)} businesses with one specific offer. 3+ interested replies = signal worth pursuing.`,
  },
  {
    key: "software",
    category: "software",
    name: (i) => `Software Tool for the ${i} Industry`,
    description: (i) => `A focused tool fixing one broken workflow for ${lower(i)} operators — quoting, scheduling, follow-ups, or compliance.`,
    whoPays: (i) => `${i} businesses on monthly SaaS subscriptions`,
    whyItMayWork: (i) => `Trades and niche industries run on spreadsheets, texts, and memory. One workflow, done right for ${lower(i)} specifically, can beat horizontal tools.`,
    whyItMayFail: () => "Horizontal incumbents (Jobber, Housecall Pro, industry ERPs) may already cover it 'well enough', and small-business SaaS sales are grinding.",
    targetCustomer: (i) => `${i} operators drowning in one specific manual workflow`,
    problemSolved: (i) => `One painful ${lower(i)} workflow goes from an hour of admin to five minutes`,
    entryCostTier: "2500-10000",
    startupCostEstimate: "$2,500–$10,000 (or your own dev time)",
    baseScores: { problemStrength: 6, marketDemand: 5, competitionOpportunity: 5, easeOfEntry: 4, entryCost: 7, profitPotential: 7, differentiation: 6, customerAcquisition: 4, risk: 6 },
    differentiationIdeas: (i) => [
      `Industry-exact vocabulary and templates for ${lower(i)}`,
      "White-glove onboarding (incumbents make setup DIY)",
      "One killer workflow instead of 50 mediocre features",
    ],
    redFlags: () => [
      "Do NOT write code before 10 operator interviews",
      "If it's one feature, it's not a business yet — find the recurring loop",
    ],
    firstSteps: (i) => [
      `Interview 10 ${lower(i)} operators about their most-hated admin task`,
      "Mock 3 screens; show them before building",
      "Deliver the outcome manually first (concierge MVP)",
      "Build the smallest version for design partners",
      "Charge from the first real user",
    ],
    cheapestValidation: (i) => `Interview 10 ${lower(i)} operators. If fewer than 7 name the same broken workflow unprompted, there's no wedge yet.`,
  },
  {
    key: "marketplace",
    category: "marketplace",
    name: (i) => `${i} Marketplace / Lead Platform`,
    description: (i) => `Connect ${lower(i)} buyers with providers — comparison, booking, or lead marketplace.`,
    whoPays: (i) => `Providers pay per lead/booking; possibly buyer-side fees later`,
    whyItMayWork: (i) => `If finding a good ${lower(i)} provider is genuinely painful, aggregated trust + comparison has value on both sides.`,
    whyItMayFail: () => "Two-sided cold start is the hardest problem in business, and horizontal players (Angi, Thumbtack) loom over every local vertical.",
    targetCustomer: (i) => `Buyers frustrated with finding good ${lower(i)} options`,
    problemSolved: (i) => `Finding a trustworthy ${lower(i)} provider without gambling`,
    entryCostTier: "2500-10000",
    startupCostEstimate: "$2,500–$10,000+",
    baseScores: { problemStrength: 6, marketDemand: 5, competitionOpportunity: 4, easeOfEntry: 3, entryCost: 7, profitPotential: 7, differentiation: 5, customerAcquisition: 3, risk: 7 },
    differentiationIdeas: () => [
      "Broker deals manually before building any platform",
      "One city, one category, until liquidity",
      "Exclusive leads — the anti-aggregator position",
    ],
    redFlags: () => [
      "Highest-risk category on this map",
      "Never build the platform before manually matching 25 deals",
    ],
    firstSteps: (i) => [
      `Manually match 5 buyers with ${lower(i)} providers via a form + phone`,
      "Interview both sides after every match",
      "Charge providers from match #1",
      "Track which side is harder to get — that's the constraint",
      "Only then consider software",
    ],
    cheapestValidation: (i) => `Offer free matchmaking in a local group: "Tell me what ${lower(i)} help you need, I'll find you 3 vetted options." No takers for FREE = no marketplace.`,
  },
  {
    key: "product",
    category: "product",
    name: (i) => `${i} Products / Supplies Business`,
    description: (i) => `Sell physical products into the ${lower(i)} world — consumables, kits, specialty gear, or branded goods.`,
    whoPays: (i) => `${i} businesses and enthusiasts buying repeatedly`,
    whyItMayWork: (i) => `Operators buy consumables forever, and niche ${lower(i)} products are often only available from distant distributors with slow shipping.`,
    whyItMayFail: () => "Amazon shadow, thin margins, and inventory risk. Products without a niche edge get crushed on price.",
    targetCustomer: (i) => `Repeat buyers in ${lower(i)} underserved on speed, selection, or expertise`,
    problemSolved: (i) => `Getting the right ${lower(i)} product fast, from someone who knows the use case`,
    entryCostTier: "500-2500",
    startupCostEstimate: "$500–$2,500 initial inventory",
    baseScores: { problemStrength: 5, marketDemand: 6, competitionOpportunity: 4, easeOfEntry: 6, entryCost: 9, profitPotential: 5, differentiation: 4, customerAcquisition: 5, risk: 5 },
    differentiationIdeas: () => [
      "Curation + expertise (kits, bundles) instead of raw catalog",
      "Same-day local delivery where distributors ship in a week",
      "Niche depth Amazon won't bother with",
    ],
    redFlags: () => ["If Amazon sells it cheaper tomorrow, you don't have a business", "Inventory is cash you can't spend twice"],
    firstSteps: (i) => [
      `List 20 products ${lower(i)} people buy repeatedly`,
      "Check Amazon/eBay pricing honestly against your landed cost",
      "Test sell 10 units on existing marketplaces",
      "Keep only >30% margin winners",
      "Build a store only after marketplace traction",
    ],
    cheapestValidation: (i) => `List 5 ${lower(i)} products on eBay/Facebook Marketplace before holding inventory (dropship or small test batch). Real orders answer the question in two weeks.`,
  },
  {
    key: "education",
    category: "education",
    name: (i) => `${i} Content & Training Business`,
    description: (i) => `Teach the industry: beginner guides, certification prep, YouTube content, or paid training for ${lower(i)}.`,
    whoPays: (i) => `People entering ${lower(i)}, plus sponsors/affiliates once the audience exists`,
    whyItMayWork: (i) => `Every industry mints new entrants who are confused about the same things. Evergreen ${lower(i)} content compounds while you sleep.`,
    whyItMayFail: () => "12–24 months of unpaid work before real income, and free content competes with you forever.",
    targetCustomer: (i) => `Beginners and career-changers entering ${lower(i)}`,
    problemSolved: (i) => `Cutting months off the confusing early phase of ${lower(i)}`,
    entryCostTier: "0-500",
    startupCostEstimate: "$0–$500",
    baseScores: { problemStrength: 5, marketDemand: 5, competitionOpportunity: 6, easeOfEntry: 8, entryCost: 10, profitPotential: 5, differentiation: 5, customerAcquisition: 7, risk: 3 },
    differentiationIdeas: () => [
      "Hyper-specific beats general (state/city/model-specific content)",
      "Show real numbers and real work — authenticity is the moat",
      "Build the email list from video #1",
    ],
    redFlags: () => ["Slow burn; never a quick income replacement", "Requires genuine knowledge or a credible partner"],
    firstSteps: (i) => [
      `Find the 20 most-asked beginner questions in ${lower(i)}`,
      "Publish 5 pieces answering the top ones",
      "Watch which pulls; double down",
      "Collect emails with a free resource",
      "Pre-sell the first paid product to the list",
    ],
    cheapestValidation: (i) => `Publish 3 beginner-focused ${lower(i)} posts/videos. 60 days of analytics beats 60 days of planning.`,
  },
];

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

export function generateGenericDataset(rawInput: string): IndustryDataset {
  const name = titleCase(rawInput.trim());
  const seed = hashSeed(rawInput.trim().toLowerCase());
  const slug = rawInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const branches: OpportunityBranch[] = TEMPLATES.map((t, idx) => ({
    id: `${slug}-${t.key}`,
    name: t.name(name),
    category: t.category,
    description: t.description(name),
    whoPays: t.whoPays(name),
    whyItMayWork: t.whyItMayWork(name),
    whyItMayFail: t.whyItMayFail(name),
    targetCustomer: t.targetCustomer(name),
    problemSolved: t.problemSolved(name),
    entryCostTier: t.entryCostTier,
    startupCostEstimate: t.startupCostEstimate,
    scores: Object.fromEntries(
      Object.entries(t.baseScores).map(([k, v], mIdx) => [k, vary(v, seed, idx * 9 + mIdx)])
    ) as unknown as MetricScores,
    differentiationIdeas: t.differentiationIdeas(name),
    redFlags: t.redFlags(name),
    firstSteps: t.firstSteps(name),
    cheapestValidation: t.cheapestValidation(name),
  }));

  return {
    id: slug,
    name,
    aliases: [rawInput.trim().toLowerCase()],
    summary: `No curated dataset for "${name}" yet — these are template opportunities generated from universal business patterns. Scores are rough defaults: treat them as a starting map, not research. (Live AI research will replace this.)`,
    branches,
    generated: true,
  };
}
