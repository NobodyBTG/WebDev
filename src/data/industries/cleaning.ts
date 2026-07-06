import type { IndustryDataset } from "@/lib/types";

/** Curated demo dataset: Cleaning Company. */
export const cleaning: IndustryDataset = {
  id: "cleaning",
  name: "Cleaning Company",
  aliases: [
    "cleaning company", "cleaning", "house cleaning", "commercial cleaning",
    "janitorial", "maid service", "cleaners",
  ],
  summary:
    "Low-barrier, recurring-revenue service industry. Easy entry means heavy competition at the bottom — the money is in niches, commercial contracts, and reliability (the industry's chronic weakness).",
  branches: [
    {
      id: "clean-airbnb-turnover",
      name: "Airbnb Turnover Cleaning Specialist",
      category: "niche",
      description:
        "Cleaning exclusively for short-term rentals: fixed checklists, photo proof, restocking, and same-day turnarounds between guests.",
      whoPays: "Airbnb/VRBO hosts and STR property managers",
      whyItMayWork:
        "Hosts live in fear of a bad cleanliness review, turnovers are deadline-critical, and generic cleaners don't do staging/restock/damage reporting. Recurring by definition.",
      whyItMayFail:
        "Seasonal in tourist markets, hosts are price-sensitive, and platforms like Turno make it easy for competitors to find the same clients.",
      targetCustomer: "Hosts with 2–20 listings who've been burned by unreliable cleaners",
      problemSolved: "Guaranteed guest-ready units on deadline, with photo proof, every time",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (supplies, insurance down payment)",
      scores: {
        problemStrength: 8,
        marketDemand: 7,
        competitionOpportunity: 6,
        easeOfEntry: 9,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 6,
        customerAcquisition: 6,
        risk: 4,
      },
      differentiationIdeas: [
        "Photo-verified checklist sent to the host after every turnover",
        "Guaranteed turnover window with a penalty credit if missed",
        "Restocking + damage reports included, not upsold",
      ],
      redFlags: [
        "One missed turnover can cost the whole client",
        "Tourist-market seasonality — model the slow months",
      ],
      firstSteps: [
        "Join Turno/host Facebook groups; study complaint patterns",
        "Define a 40-point STR checklist with photo proof",
        "Clean 3 units at a competitive intro rate",
        "Ask each host for one referral after 5 flawless turnovers",
        "Raise rates once you're the reliable option",
      ],
      cheapestValidation:
        "Post in 3 local host groups: 'STR-specialist cleaner, photo proof, guaranteed windows.' Host groups complain about cleaners weekly — replies will tell you instantly.",
    },
    {
      id: "clean-move-out",
      name: "Move-Out / Deep Clean Only",
      category: "niche",
      description:
        "No recurring maids — only high-ticket move-out, deep, and post-renovation cleans at flat rates.",
      whoPays: "Tenants chasing deposits, landlords flipping units, homeowners post-reno",
      whyItMayWork:
        "One-time deep cleans are $250–$600 tickets, deadline-driven, and less price-shopped than weekly cleaning. No route-density problem to solve.",
      whyItMayFail:
        "No recurring revenue base; every month starts at zero. Lead flow must be constant.",
      targetCustomer: "Movers and landlords with deadlines and deposits at stake",
      problemSolved: "Deposit-back / rent-ready cleanliness on a hard deadline",
      entryCostTier: "0-500",
      startupCostEstimate: "$200–$500 (equipment, supplies, insurance)",
      scores: {
        problemStrength: 7,
        marketDemand: 7,
        competitionOpportunity: 5,
        easeOfEntry: 9,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 5,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "'Deposit-back guarantee' — free re-clean if the landlord flags anything",
        "Instant online flat quotes by bedroom count (competitors make people call)",
        "Landlord accounts: standing priority for unit flips",
      ],
      redFlags: [
        "Zero recurring revenue — marketing never stops",
        "Physically demanding; your body is the asset early on",
      ],
      firstSteps: [
        "Price 10 competitors' move-out rates by phone",
        "Publish flat-rate pricing on a one-page site",
        "Do 5 jobs at intro pricing; photograph everything",
        "Pitch 10 property managers on priority unit-flip service",
        "Build reviews aggressively in month one",
      ],
      cheapestValidation:
        "List a flat-rate move-out clean on Facebook Marketplace and Nextdoor this week. Bookings within 7 days = demand; silence = pricing or market problem.",
    },
    {
      id: "clean-commercial-contracts",
      name: "Small Office / Medical Commercial Cleaning",
      category: "direct",
      description:
        "Night janitorial contracts for small offices, clinics, and dental practices — recurring monthly contracts, not houses.",
      whoPays: "Office managers and practice administrators on monthly contracts",
      whyItMayWork:
        "Commercial contracts are recurring, higher-value, and stickier than residential. Medical/dental adds compliance requirements that scare off casual competitors.",
      whyItMayFail:
        "Sales cycles are slow, incumbents have relationships, and underbidding franchises race to the bottom. Nights and weekends are the job.",
      targetCustomer: "5,000–20,000 sq ft offices and small medical practices",
      problemSolved: "Reliable, insured, compliance-aware cleaning the office manager never thinks about",
      entryCostTier: "500-2500",
      startupCostEstimate: "$1,000–$2,500 (equipment, bonding, insurance)",
      scores: {
        problemStrength: 6,
        marketDemand: 7,
        competitionOpportunity: 5,
        easeOfEntry: 7,
        entryCost: 9,
        profitPotential: 7,
        differentiation: 5,
        customerAcquisition: 4,
        risk: 4,
      },
      differentiationIdeas: [
        "Medical-grade protocols as the wedge (bloodborne pathogen training is cheap to get)",
        "QR code in each room: instant issue reporting to you, not the office manager",
        "Month-to-month contracts when incumbents demand annual",
      ],
      redFlags: [
        "Contracts churn slowly BOTH ways — winning them takes months too",
        "Bonding/insurance required before the first pitch",
      ],
      firstSteps: [
        "Get insured and bonded; get bloodborne-pathogen certified",
        "Walk 30 small offices at 5pm; note who looks dirty and who's leaving",
        "Bid 10 contracts even to lose — learn local pricing",
        "Win one anchor contract; over-deliver visibly",
        "Ask for referrals to neighboring suites",
      ],
      cheapestValidation:
        "Cold-walk 20 offices asking one question: 'Happy with your cleaning crew?' The face they make is your market research.",
    },
    {
      id: "clean-recruiting",
      name: "Cleaner Recruiting & Vetting Service",
      category: "support",
      description:
        "You recruit, background-check, and trial-shift cleaning staff for cleaning companies drowning in turnover.",
      whoPays: "Cleaning company owners (placement fee or subscription)",
      whyItMayWork:
        "Staff turnover is THE operational crisis in cleaning — owners universally rank hiring above getting customers. Generic staffing agencies don't understand the role.",
      whyItMayFail:
        "You inherit the same labor shortage they face; bad placements damage trust fast; single-metro market size is limited.",
      targetCustomer: "Cleaning companies with 5–50 staff and constant churn",
      problemSolved: "A steady bench of vetted cleaners without the owner living on Indeed",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (job ads, screening tools)",
      scores: {
        problemStrength: 8,
        marketDemand: 6,
        competitionOpportunity: 7,
        easeOfEntry: 7,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 7,
        customerAcquisition: 5,
        risk: 4,
      },
      differentiationIdeas: [
        "90-day replacement guarantee on every placement",
        "Working-interview coordination (agencies just send resumes)",
        "Cleaning-only focus = a real candidate pipeline over time",
      ],
      redFlags: [
        "You're selling into a labor market you don't control",
        "Background-check compliance (FCRA) has rules — learn them",
      ],
      firstSteps: [
        "Interview 10 cleaning company owners about cost-per-hire and churn",
        "Run one job ad; screen candidates with a phone script",
        "Place 2 cleaners free for one company; track retention",
        "Price at $300–$600/placement with guarantee",
        "Systematize sourcing channels that actually produced",
      ],
      cheapestValidation:
        "Ask 10 cleaning owners: 'Would you pay $400 for a vetted cleaner who shows up, with a 90-day guarantee?' This pain is so acute the answers will be immediate.",
    },
    {
      id: "clean-booking-software",
      name: "Booking & Quoting Tool for Cleaning Companies",
      category: "software",
      description:
        "Instant online quotes + booking + scheduling for small cleaning companies still running on texts and paper.",
      whoPays: "Cleaning company owners ($50–$150/mo SaaS)",
      whyItMayWork:
        "Instant online booking measurably lifts conversion, and thousands of small operators still quote by phone tag.",
      whyItMayFail:
        "Jobber, Housecall Pro, ZenMaid, Launch27 already fight over this space with sales teams and integrations. Late entry needs a sharp wedge.",
      targetCustomer: "1–10 person cleaning companies",
      problemSolved: "Leads booking themselves instead of dying in voicemail",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$10,000 (dev time or contracted MVP)",
      scores: {
        problemStrength: 6,
        marketDemand: 6,
        competitionOpportunity: 3,
        easeOfEntry: 4,
        entryCost: 7,
        profitPotential: 6,
        differentiation: 3,
        customerAcquisition: 4,
        risk: 6,
      },
      differentiationIdeas: [
        "Pick ONE underserved wedge: e.g. STR-turnover scheduling with host portals",
        "White-glove migration from the shoebox of paper",
        "Flat cheap pricing vs. per-user gouging",
      ],
      redFlags: [
        "Crowded incumbent field — do not build the generic version",
        "This is a feature war you can't win head-on; niche or don't",
      ],
      firstSteps: [
        "Interview 15 owners: what do they still do manually DESPITE existing tools?",
        "Find the wedge the incumbents ignore",
        "Prototype only that wedge",
        "Get 5 design partners at $0 then convert to paid",
        "Decide honestly: business or feature?",
      ],
      cheapestValidation:
        "Before any code: mock 3 screens of the wedge feature and show 10 owners. 'Would you switch tools for this?' If the answer is 'nice but no', stop.",
    },
    {
      id: "clean-supplies-subscription",
      name: "Cleaning Supplies Subscription for Pros",
      category: "product",
      description:
        "Auto-replenishing monthly supply kits (chemicals, cloths, consumables) sized to a cleaning company's team and job count.",
      whoPays: "Cleaning companies replacing Costco runs",
      whyItMayWork:
        "Owners waste hours on supply runs and stockouts mid-job are common. Consumption is predictable — perfect subscription mechanics.",
      whyItMayFail:
        "Thin margins vs. warehouse clubs; Amazon Business exists; differentiation is logistics, which is capital-hungry.",
      targetCustomer: "Cleaning companies with 3+ teams",
      problemSolved: "Never running out, never driving to Costco at 7am",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$2,500–$8,000 (initial inventory, packaging)",
      scores: {
        problemStrength: 4,
        marketDemand: 5,
        competitionOpportunity: 4,
        easeOfEntry: 6,
        entryCost: 7,
        profitPotential: 4,
        differentiation: 4,
        customerAcquisition: 5,
        risk: 5,
      },
      differentiationIdeas: [
        "Kit sized by jobs/week, not generic boxes",
        "Include the compliance stuff (SDS sheets, dilution charts)",
        "Local same-week top-ups when a team runs dry",
      ],
      redFlags: [
        "Price competition with giants is a losing frame — convenience is the only pitch",
        "Weak scores across the board; validate ruthlessly before stocking anything",
      ],
      firstSteps: [
        "Survey 15 owners on monthly supply spend + time",
        "Design 3 kit sizes with real distributor pricing",
        "Pre-sell 10 subscriptions before buying inventory",
        "Fulfill month one by hand",
        "Kill it fast if churn appears by month three",
      ],
      cheapestValidation:
        "Pre-sell: '$149/mo, everything your 2-team company uses, delivered.' Ten yeses before you buy a single case, or don't do it.",
    },
    {
      id: "clean-training-cert",
      name: "Professional Cleaner Training Program",
      category: "education",
      description:
        "Online training + certification for new cleaners and cleaning-company onboarding (speed cleaning, chemicals, STR protocols).",
      whoPays: "Cleaning companies (team onboarding) and individuals entering the trade",
      whyItMayWork:
        "Every company trains from scratch with zero materials; a ready-made onboarding system saves owner-hours and reduces churn-from-confusion.",
      whyItMayFail:
        "Willingness to pay is unproven at the individual level; company-level sales need volume; content is cloneable.",
      targetCustomer: "Cleaning company owners onboarding constantly (see: turnover crisis)",
      problemSolved: "Turning day-one hires into consistent cleaners without the owner shadowing them",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (filming, course platform)",
      scores: {
        problemStrength: 6,
        marketDemand: 5,
        competitionOpportunity: 7,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 6,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "Sell to COMPANIES as onboarding-in-a-box, not to individuals",
        "Spanish-language versions — huge underserved need",
        "Completion certificates owners can show clients",
      ],
      redFlags: [
        "Individual consumers rarely pay to learn cleaning — B2B or bust",
        "Pairs naturally with the recruiting branch; consider bundling",
      ],
      firstSteps: [
        "Ask 10 owners how they onboard today and what it costs in owner-hours",
        "Film a 10-video core curriculum",
        "Pilot with 2 companies' new hires",
        "Measure time-to-independent-work vs. their baseline",
        "Price per-seat or flat company license",
      ],
      cheapestValidation:
        "Pitch 10 owners: '$299 one-time, your next 5 hires train themselves.' The turnover pain is real — see if it converts to a card number.",
    },
  ],
};
