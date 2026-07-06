import type { IndustryDataset } from "@/lib/types";

/** Curated demo dataset: Restaurant. */
export const restaurant: IndustryDataset = {
  id: "restaurant",
  name: "Restaurant",
  aliases: ["restaurant", "restaurants", "food", "cafe", "food truck", "food trucks", "catering"],
  summary:
    "Brutal margins and high failure rates in the core business — but the industry's operators are underserved on the support side, and focused food concepts with low overhead still work.",
  branches: [
    {
      id: "rest-ghost-kitchen",
      name: "Single-Concept Delivery Kitchen",
      category: "niche",
      description:
        "One tight menu (e.g. smash burgers or wings), delivery/pickup only, run from a commissary or rented kitchen — no dining room.",
      whoPays: "Delivery-app customers within a 3–5 mile radius",
      whyItMayWork:
        "Cuts the two things that kill restaurants: front-of-house labor and rent. One menu = simpler ops, lower waste, faster training.",
      whyItMayFail:
        "Delivery apps take 15–30%, the ghost-kitchen gold rush already crowded many metros, and with no storefront your brand is only as visible as your app ranking.",
      targetCustomer: "Convenience-driven 20–45 year olds ordering weeknight dinner",
      problemSolved: "Consistent, craveable single-item food delivered fast",
      entryCostTier: "10000-50000",
      startupCostEstimate: "$15,000–$40,000 (kitchen deposit, equipment, permits, launch)",
      scores: {
        problemStrength: 5,
        marketDemand: 7,
        competitionOpportunity: 4,
        easeOfEntry: 5,
        entryCost: 5,
        profitPotential: 6,
        differentiation: 5,
        customerAcquisition: 5,
        risk: 7,
      },
      differentiationIdeas: [
        "One hero item done 10/10, not a 40-item menu done 6/10",
        "Own the reorder: QR insert pushing direct ordering to escape app fees",
        "Local social presence with real kitchen content",
      ],
      redFlags: [
        "App commissions can consume the entire margin",
        "Health permits and commissary rules vary by county",
        "High failure category — validate hard first",
      ],
      firstSteps: [
        "Audit delivery apps in your zone: what's missing or badly rated?",
        "Cook the menu 20 times; time every step",
        "Do 3 weekend pop-ups before signing any lease",
        "Model P&L at 25% app commission honestly",
        "Launch in a rented commissary, not a build-out",
      ],
      cheapestValidation:
        "Run 2 weekend pop-ups at a brewery. Sell-out + repeat visitors = signal. Struggling to sell 50 units with novelty on your side = walk away.",
    },
    {
      id: "rest-reservation-recovery",
      name: "No-Show Recovery System for Restaurants",
      category: "support",
      description:
        "A service that fills cancelled reservations and no-shows from a standby waitlist via automated texts.",
      whoPays: "Reservation-driven restaurants losing $200–$1,000 per empty table night",
      whyItMayWork:
        "No-shows run 10–20% at many reservation restaurants and directly torch prime-time revenue. Filling even half of them is measurable money.",
      whyItMayFail:
        "OpenTable/Resy are adding waitlist features; you're building in a platform's shadow. Only works for restaurants that are actually turning people away.",
      targetCustomer: "Popular independent restaurants with reservation books",
      problemSolved: "Empty prime-time tables that someone else wanted",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,000 (SMS tooling, simple waitlist app)",
      scores: {
        problemStrength: 7,
        marketDemand: 5,
        competitionOpportunity: 5,
        easeOfEntry: 7,
        entryCost: 9,
        profitPotential: 6,
        differentiation: 6,
        customerAcquisition: 5,
        risk: 5,
      },
      differentiationIdeas: [
        "Charge per filled seat — pure performance pricing",
        "Restaurant-branded texts (you're invisible infrastructure)",
        "Weekly 'revenue recovered' report",
      ],
      redFlags: [
        "Platform risk from reservation incumbents is real",
        "SMS compliance (TCPA) requires opt-in hygiene",
      ],
      firstSteps: [
        "Interview 10 restaurant managers about no-show rates",
        "Run the service manually for one restaurant one weekend",
        "Track seats filled and revenue recovered",
        "Price at 20–30% of recovered revenue",
        "Automate after 3 paying restaurants",
      ],
      cheapestValidation:
        "Offer one busy restaurant: 'I'll fill your no-shows this Friday by hand, free. If it works, we talk.' One night of results beats a pitch deck.",
    },
    {
      id: "rest-social-content",
      name: "Restaurant Social Media Content Service",
      category: "support",
      description:
        "Monthly on-site filming turned into a feed of short-form video content for restaurants that have zero time for social.",
      whoPays: "Independent restaurants that know they need TikTok/Reels and can't do it",
      whyItMayWork:
        "Short-form food video demonstrably drives visits, owners are in the weeds nightly, and generic agencies don't shoot food well.",
      whyItMayFail:
        "Content services are easy to start — so everyone starts one. Churn is high when owners can't attribute covers to posts.",
      targetCustomer: "Independent restaurants doing $500k–$3M with no marketing hire",
      problemSolved: "A consistent, appetizing social presence without the owner touching a phone",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$500 (phone gimbal, editing apps)",
      scores: {
        problemStrength: 6,
        marketDemand: 7,
        competitionOpportunity: 4,
        easeOfEntry: 9,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 4,
        customerAcquisition: 6,
        risk: 3,
      },
      differentiationIdeas: [
        "Food-only portfolio; nobody hires a generalist for steam shots",
        "Tie reporting to bookings/directions taps, not likes",
        "Batch-shoot one visit into 12 posts",
      ],
      redFlags: [
        "Crowded, low-moat service — your edge is craft + retention, not the idea",
        "Price too low and you've bought a job",
      ],
      firstSteps: [
        "Film 3 free shoots at friendly spots for portfolio",
        "Package at $750–$1,500/mo for 8–12 posts",
        "Pitch 20 restaurants with a 30-second sample edit OF THEIR FOOD",
        "Close 3; systematize shooting day",
        "Raise prices with every 3 clients",
      ],
      cheapestValidation:
        "Make one unsolicited 30-second edit for a local restaurant and DM it: 'Made this for you — want one monthly?' Ten DMs, count replies.",
    },
    {
      id: "rest-supplier-audit",
      name: "Food Cost & Supplier Audit Service",
      category: "support",
      description:
        "You analyze a restaurant's invoices, find overcharges and cheaper equivalent suppliers, and split the savings.",
      whoPays: "Restaurant owners — out of found money, not new budget",
      whyItMayWork:
        "Food costs are 28–35% of revenue and invoice creep is universal. 'I only get paid from what I save you' is the easiest pitch in B2B.",
      whyItMayFail:
        "Needs genuine supply-chain knowledge; owners are private about finances; savings can be one-time rather than recurring.",
      targetCustomer: "Independent full-service restaurants without a purchasing manager",
      problemSolved: "Silent margin leaks in weekly supplier invoices",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$200 (spreadsheets and shoe leather)",
      scores: {
        problemStrength: 7,
        marketDemand: 6,
        competitionOpportunity: 7,
        easeOfEntry: 6,
        entryCost: 10,
        profitPotential: 7,
        differentiation: 7,
        customerAcquisition: 4,
        risk: 3,
      },
      differentiationIdeas: [
        "Pure gain-share pricing — zero risk to the owner",
        "Benchmark database grows with every client (compounding moat)",
        "Quarterly re-audit subscription after the initial win",
      ],
      redFlags: [
        "Trust barrier: owners must hand you their books",
        "You need food-distribution literacy or a partner who has it",
      ],
      firstSteps: [
        "Learn broadline distributor pricing games (case sizes, substitutions)",
        "Audit one friendly restaurant free",
        "Document savings found; get a testimonial",
        "Pitch 10 owners with the case study at 50/50 gain-share",
        "Build the price benchmark DB from every audit",
      ],
      cheapestValidation:
        "Ask one restaurant-owner acquaintance for 4 weeks of invoices. If you can't find 3–5% savings in an afternoon, this business isn't there (or you need a partner who can).",
    },
    {
      id: "rest-pos-data",
      name: "Menu Profitability Dashboard",
      category: "software",
      description:
        "Software that merges POS sales with ingredient costs to show item-level profit — which dishes make money and which quietly lose it.",
      whoPays: "Independent restaurants and small groups (2–10 locations)",
      whyItMayWork:
        "Most independents literally don't know their per-dish margin. POS systems have the sales data but not the recipe costs; the merge is the product.",
      whyItMayFail:
        "Requires recipe data entry (the death of many resto-SaaS tools), POS integrations are a grind, and Toast/Square keep absorbing adjacent features.",
      targetCustomer: "Owner-operators who feel busy but not profitable",
      problemSolved: "Knowing which menu items to kill, reprice, or promote",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$10,000 (dev time, integration work)",
      scores: {
        problemStrength: 8,
        marketDemand: 6,
        competitionOpportunity: 4,
        easeOfEntry: 3,
        entryCost: 7,
        profitPotential: 7,
        differentiation: 5,
        customerAcquisition: 4,
        risk: 6,
      },
      differentiationIdeas: [
        "Done-with-you recipe costing onboarding (the tool everyone else makes DIY)",
        "One killer report: 'kill these 3 dishes, promote these 3'",
        "Start as a service, productize the repeated parts",
      ],
      redFlags: [
        "POS platform risk — incumbents can bundle this feature",
        "Data-entry burden kills activation; solve that or die",
        "This is not a full business yet if it's just a report — find the recurring loop",
      ],
      firstSteps: [
        "Do menu-profitability analysis manually for 3 restaurants as a paid service",
        "Note every repeated step — that's the software spec",
        "Check Toast/Square app marketplaces for distribution",
        "Build MVP for the ONE POS your first clients use",
        "Charge from day one ($99–$299/mo)",
      ],
      cheapestValidation:
        "Sell a one-time '$500 menu profit audit' to 3 restaurants. If nobody buys the analysis, nobody will subscribe to the software version of it.",
    },
    {
      id: "rest-equipment-flip",
      name: "Used Restaurant Equipment Resale",
      category: "product",
      description:
        "Buy equipment from closing restaurants at auction, refurbish lightly, sell to opening ones.",
      whoPays: "New and expanding food businesses avoiding new-equipment prices",
      whyItMayWork:
        "Restaurant churn guarantees supply (closures) and demand (openings) forever. Auction prices at closures run 10–20 cents on the dollar.",
      whyItMayFail:
        "Heavy, space-hungry inventory; refrigeration is a gamble; established dealers have relationships with auctioneers.",
      targetCustomer: "First-time restaurant/food-truck owners and caterers",
      problemSolved: "Commercial equipment at 30–50% of new cost, tested and warrantied",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$10,000 (first inventory lots, storage, trailer)",
      scores: {
        problemStrength: 6,
        marketDemand: 6,
        competitionOpportunity: 5,
        easeOfEntry: 6,
        entryCost: 7,
        profitPotential: 6,
        differentiation: 5,
        customerAcquisition: 6,
        risk: 5,
      },
      differentiationIdeas: [
        "30-day warranty on refrigeration — the category's biggest fear",
        "Delivery + install included (dealers charge extra)",
        "Video-test everything; post the videos in listings",
      ],
      redFlags: [
        "Refrigeration repairs can erase a flip's margin",
        "Storage costs are the silent killer — model them",
      ],
      firstSteps: [
        "Attend 2 restaurant liquidation auctions, buy nothing, log prices",
        "Compare against sold listings for the same units",
        "Buy 3 easy items (tables, sinks, gas ranges — no compressors)",
        "Flip them; compute real margin including transport",
        "Add refrigeration only with a repair contact in place",
      ],
      cheapestValidation:
        "Go to one liquidation auction with a price list of sold comps. If hammer prices leave <40% gross margin after transport, this market is picked over locally.",
    },
    {
      id: "rest-opening-consultant",
      name: "Restaurant Opening Playbook + Consulting",
      category: "education",
      description:
        "Paid step-by-step playbooks (permits, buildout, POS, hiring) plus hourly consulting for first-time restaurant owners.",
      whoPays: "First-time owners about to spend $200k+ and terrified of mistakes",
      whyItMayWork:
        "Opening a restaurant involves 50 unfamiliar decisions with expensive failure modes. People pay for certainty at exactly this moment.",
      whyItMayFail:
        "Needs credible operating experience to sell; buyers appear one at a time (no recurring revenue); free content competition is thick.",
      targetCustomer: "First-time restaurant and food-truck founders",
      problemSolved: "Avoiding the $20,000 mistakes every first-timer makes",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$300 (content production)",
      scores: {
        problemStrength: 7,
        marketDemand: 5,
        competitionOpportunity: 6,
        easeOfEntry: 7,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 5,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "City-specific permit walkthroughs (generic guides can't compete)",
        "'Opening budget reality check' spreadsheet as the lead magnet",
        "Productized reviews: '$500 and I'll tear apart your business plan'",
      ],
      redFlags: [
        "Without operating credibility this won't sell — partner with an operator if needed",
        "One-shot buyers; you must keep filling the funnel",
      ],
      firstSteps: [
        "Document one real opening end-to-end (yours or a partner's)",
        "Publish the permit-timeline post for your city",
        "Build an email list from it",
        "Pre-sell the full playbook at $99–$299",
        "Add 1:1 consulting at $150+/hr for hot leads",
      ],
      cheapestValidation:
        "Post a detailed 'what it actually costs to open a restaurant in [your city]' thread. If it doesn't pull strong engagement and DMs, the paid version won't sell.",
    },
  ],
};
