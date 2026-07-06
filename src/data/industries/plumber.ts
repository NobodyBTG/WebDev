import type { IndustryDataset } from "@/lib/types";

/**
 * Curated demo dataset: Plumbing.
 * // Future AI route: mid model — generateBetterBranches would produce this
 * // shape live for any industry, enriched with real local market data.
 */
export const plumber: IndustryDataset = {
  id: "plumber",
  name: "Plumbing",
  aliases: ["plumber", "plumbing", "plumbers", "plumbing company", "drain", "pipefitter"],
  summary:
    "High-urgency home service trade. Aging workforce, strong emergency demand, and widespread customer complaints about availability and pricing transparency — which creates room on both the service side and the support side.",
  branches: [
    {
      id: "plumber-drain-cleaning",
      name: "Drain Cleaning Specialist",
      category: "niche",
      description:
        "A company that ONLY does drain cleaning and clearing — flat-rate, fast, no general plumbing.",
      whoPays: "Homeowners, landlords, and property managers with clogged drains",
      whyItMayWork:
        "Drain jobs are frequent, urgent, and don't require a master plumber license in many states. Specializing lets you undercut general plumbers on price and beat them on speed.",
      whyItMayFail:
        "Franchise players (Roto-Rooter, Zoom Drain) own the search results in many metros, and one machine breakdown can wipe a week of profit.",
      targetCustomer: "Homeowners 30–65 and small landlords in a single metro area",
      problemSolved: "Clogged drains fixed same-day at a known price, without a $300 mystery invoice",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$8,000 (drain machine, camera, van wrap, insurance)",
      scores: {
        problemStrength: 8,
        marketDemand: 8,
        competitionOpportunity: 5,
        easeOfEntry: 6,
        entryCost: 7,
        profitPotential: 7,
        differentiation: 6,
        customerAcquisition: 6,
        risk: 4,
      },
      differentiationIdeas: [
        "Published flat-rate pricing on the website — most competitors hide prices",
        "Same-day guarantee with a discount if you miss the window",
        "Free camera inspection footage sent to the customer's phone",
      ],
      redFlags: [
        "Check local licensing rules — some states require a plumbing license even for drains",
        "Franchise competitors outspend you on ads 10:1",
      ],
      firstSteps: [
        "Verify licensing requirements for drain-only work in your state",
        "Price 10 competitor quotes by calling as a customer",
        "Buy a used drain machine before a new one",
        "Set up a one-page site with flat-rate pricing",
        "Run a $50 local ad for 'same-day drain cleaning'",
      ],
      cheapestValidation:
        "Call 10 local plumbers asking for a drain job today. Count how many can actually come same-day and what they quote — the gap is your market.",
    },
    {
      id: "plumber-water-heater",
      name: "Water Heater Replacement Specialist",
      category: "niche",
      description:
        "Same-day water heater replacement only. One product, fixed install prices, stocked vans.",
      whoPays: "Homeowners with a dead water heater (an emergency purchase)",
      whyItMayWork:
        "Nobody shops around long with cold showers. Ticket sizes of $1,500–$3,500, and specialization means faster installs and bulk unit pricing.",
      whyItMayFail:
        "Requires plumbing license in most states, real capital for stocked inventory, and big-box stores (Home Depot) route install work to their own networks.",
      targetCustomer: "Homeowners in an emergency; secondarily, landlords replacing proactively",
      problemSolved: "Hot water restored today, at a price quoted upfront over the phone",
      entryCostTier: "10000-50000",
      startupCostEstimate: "$15,000–$40,000 (license, van, inventory, insurance)",
      scores: {
        problemStrength: 9,
        marketDemand: 8,
        competitionOpportunity: 5,
        easeOfEntry: 4,
        entryCost: 5,
        profitPotential: 8,
        differentiation: 6,
        customerAcquisition: 6,
        risk: 5,
      },
      differentiationIdeas: [
        "True upfront phone quotes (competitors insist on paid site visits)",
        "Install-today guarantee before 2pm calls",
        "Tank + tankless comparison calculator on the website",
      ],
      redFlags: [
        "Licensing is non-negotiable here",
        "Inventory ties up cash; a slow month hurts",
        "Permit requirements vary by county",
      ],
      firstSteps: [
        "Confirm you can operate under a licensed master plumber or get licensed",
        "Call 5 competitors for quotes to map pricing",
        "Negotiate contractor pricing with a supply house",
        "Build a landing page testing 'today or it's $100 off'",
        "Track cost-per-lead on one paid ad campaign",
      ],
      cheapestValidation:
        "Run a $50 ad for 'same-day water heater replacement + upfront price' pointing at a landing page with a phone number. Count calls before buying anything.",
    },
    {
      id: "plumber-call-answering",
      name: "After-Hours Call Answering for Plumbers",
      category: "support",
      description:
        "A human + software answering service that books emergency jobs for plumbing companies at night and on weekends.",
      whoPays: "Small plumbing companies (1–10 trucks) that miss after-hours calls",
      whyItMayWork:
        "A missed emergency call is a lost $500+ job. Most small shops can't staff nights; generic answering services don't know plumbing and can't triage or book.",
      whyItMayFail:
        "Answering services are a crowded, low-margin space; you must prove booked-job ROI fast or churn kills you.",
      targetCustomer: "Owner-operator plumbing companies doing $300k–$3M revenue",
      problemSolved: "Emergency calls answered and booked while the owner sleeps",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (VoIP number, call scripts, simple CRM)",
      scores: {
        problemStrength: 8,
        marketDemand: 7,
        competitionOpportunity: 6,
        easeOfEntry: 9,
        entryCost: 10,
        profitPotential: 7,
        differentiation: 7,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "Plumbing-specific triage scripts (gas leak vs. drip = different urgency)",
        "Charge per booked job, not per minute — align with the plumber's revenue",
        "Text the owner a morning digest of every call handled",
      ],
      redFlags: [
        "You personally ARE the night shift until revenue funds coverage",
        "One badly triaged emergency can lose a client",
      ],
      firstSteps: [
        "Cold-call 20 plumbers at 7pm — count how many calls go to voicemail",
        "Write triage scripts for the 10 most common emergencies",
        "Offer 2 plumbers a free 2-week pilot",
        "Set up call forwarding + booking flow with off-the-shelf tools",
        "Convert pilots to $200–$400/mo or per-booking pricing",
      ],
      cheapestValidation:
        "Call 20 plumbing companies after 6pm. Every voicemail you hit is a prospect; pitch them the next morning with 'I called at 7:12pm and nobody answered.'",
    },
    {
      id: "plumber-lead-gen",
      name: "Plumbing Lead-Generation Website",
      category: "support",
      description:
        "Rank local 'emergency plumber near me' style pages and sell the calls to one plumber per territory.",
      whoPays: "Plumbing companies buying exclusive leads or renting the site",
      whyItMayWork:
        "Plumbers pay $50–$150 per qualified emergency lead. One well-ranked local site can produce dozens of calls monthly with near-zero marginal cost.",
      whyItMayFail:
        "Local SEO takes 6–12 months, Google's local algorithm shifts can erase rankings overnight, and Home Advisor/Angi dominate paid placements.",
      targetCustomer: "Growth-hungry plumbing companies without marketing staff",
      problemSolved: "Steady inbound emergency calls without the plumber learning marketing",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,000 (domains, hosting, content, citations)",
      scores: {
        problemStrength: 7,
        marketDemand: 8,
        competitionOpportunity: 5,
        easeOfEntry: 7,
        entryCost: 9,
        profitPotential: 8,
        differentiation: 5,
        customerAcquisition: 6,
        risk: 5,
      },
      differentiationIdeas: [
        "Exclusive territories (Angi sells the same lead to 4 plumbers)",
        "Call recordings so the plumber can verify lead quality",
        "Pay-per-booked-job pricing for trust",
      ],
      redFlags: [
        "Google algorithm dependency is real platform risk",
        "Months of work before first revenue",
        "Lead-gen sites can violate Google's local guidelines if faked — stay clean",
      ],
      firstSteps: [
        "Keyword-research 5 nearby cities for volume vs. competition",
        "Build one city site with genuinely useful content",
        "Track calls with a forwarding number from day one",
        "Sell the first month of calls at a discount to one plumber",
        "Reinvest into city #2 only after city #1 pays",
      ],
      cheapestValidation:
        "Before building anything, ask 5 plumbers: 'Would you pay $75 for an exclusive emergency call in your service area?' Get a yes in writing.",
    },
    {
      id: "plumber-review-mgmt",
      name: "Review Management for Plumbers",
      category: "support",
      description:
        "Done-for-you Google review growth: automated post-job requests, response writing, and reputation monitoring for plumbing companies.",
      whoPays: "Plumbing companies losing jobs to better-reviewed competitors",
      whyItMayWork:
        "Reviews decide who gets the emergency call. Most small plumbers have 12 dusty reviews and no system; going 12 → 150 visibly changes their inbound volume.",
      whyItMayFail:
        "Generic reputation-management SaaS (Podium, NiceJob) sells the same thing cheaper at scale; you must win on service, not software.",
      targetCustomer: "Plumbing companies with good service but weak online presence",
      problemSolved: "Turning satisfied customers into visible 5-star proof automatically",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$300 (white-label review tool + outreach)",
      scores: {
        problemStrength: 6,
        marketDemand: 7,
        competitionOpportunity: 5,
        easeOfEntry: 9,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 4,
        customerAcquisition: 5,
        risk: 2,
      },
      differentiationIdeas: [
        "Plumbing-only positioning with before/after review-count case studies",
        "Human-written responses to negative reviews within 4 hours",
        "Bundle with a monthly 'reputation report card'",
      ],
      redFlags: [
        "This is a feature more than a business — expect to expand into broader local marketing",
        "Never incentivize reviews; it violates Google policy and can get clients penalized",
      ],
      firstSteps: [
        "Audit 20 local plumbers' review counts vs. the market leader",
        "Send each an audit screenshot with one improvement tip",
        "Close 3 at $150–$300/mo",
        "Deliver with a white-label tool + manual QA",
        "Upsell winners into local SEO",
      ],
      cheapestValidation:
        "Email 20 plumbers a one-line audit: 'You have 14 reviews; the top plumber in town has 212. Want the system they use?' Count replies.",
    },
    {
      id: "plumber-quote-platform",
      name: "Plumbing Quote Comparison Platform",
      category: "marketplace",
      description:
        "Homeowners describe a job once and receive comparable flat quotes from vetted local plumbers.",
      whoPays: "Plumbers pay per qualified quote request or a monthly membership",
      whyItMayWork:
        "Price opacity is the #1 homeowner complaint in plumbing. Nobody has cracked true apples-to-apples plumbing quotes at local scale.",
      whyItMayFail:
        "Classic two-sided cold-start: no plumbers without homeowners, no homeowners without plumbers. Angi/Thumbtack have burned customer trust in the category, and you'll fight that shadow.",
      targetCustomer: "Homeowners planning non-emergency work (remodels, replacements)",
      problemSolved: "Comparing plumbing prices without four site visits and sales pitches",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$10,000 (platform build, two-sided acquisition)",
      scores: {
        problemStrength: 8,
        marketDemand: 6,
        competitionOpportunity: 4,
        easeOfEntry: 3,
        entryCost: 7,
        profitPotential: 7,
        differentiation: 6,
        customerAcquisition: 3,
        risk: 8,
      },
      differentiationIdeas: [
        "Standardized job templates so quotes are truly comparable",
        "One metro only until liquidity — don't spread thin",
        "Publish real local price ranges as SEO content",
      ],
      redFlags: [
        "Two-sided marketplaces routinely need years and capital",
        "Plumbers hate marketplaces that commoditize them — pricing model matters",
        "This is the highest-risk branch in this industry",
      ],
      firstSteps: [
        "Manually broker 5 quote comparisons via a Google Form",
        "Interview both sides after each brokered job",
        "Publish one 'real cost of a water heater in [city]' article",
        "Only build software after 25 manual matches",
        "Charge plumbers from match #1 — free plumbers never convert",
      ],
      cheapestValidation:
        "Post in a local Facebook group: 'I'll get you 3 comparable plumbing quotes for free.' If homeowners don't take a FREE offer, the platform is dead on arrival.",
    },
    {
      id: "plumber-parts-delivery",
      name: "Jobsite Parts Delivery for Plumbers",
      category: "support",
      description:
        "On-demand courier service running fittings and parts from supply houses to plumbers stuck on a job.",
      whoPays: "Plumbing companies whose tech would otherwise leave the jobsite for an hour",
      whyItMayWork:
        "A plumber leaving a job to fetch a $15 part costs the company $100+ in lost billable time. Supply houses don't deliver small orders fast.",
      whyItMayFail:
        "Thin margins per run, demand is bursty, and larger supply houses are slowly adding delivery. Density is everything — one metro with enough plumbers or it doesn't math.",
      targetCustomer: "Multi-truck plumbing companies in a dense metro",
      problemSolved: "Techs stay on the job; parts come to them within the hour",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$500 (you + a vehicle + relationships at supply houses)",
      scores: {
        problemStrength: 7,
        marketDemand: 5,
        competitionOpportunity: 7,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 7,
        customerAcquisition: 6,
        risk: 4,
      },
      differentiationIdeas: [
        "Flat $25–$35 per run, 60-minute promise inside a defined zone",
        "Text-to-order: photo of the part + address, done",
        "Monthly accounts with net-30 for established shops",
      ],
      redFlags: [
        "Hard to scale beyond your own driving hours without dispatch software",
        "Check courier insurance requirements",
      ],
      firstSteps: [
        "Park at a plumbing supply house at 7am and talk to 15 plumbers",
        "Get 5 shops' numbers; text them your service card",
        "Do 10 paid runs personally",
        "Track time and fuel per run to verify unit economics",
        "Recruit a second driver only when you're turning down runs",
      ],
      cheapestValidation:
        "Stand outside a supply house one morning and ask plumbers: 'Would you pay $30 to have this brought to your jobsite instead of driving here?' Ten conversations = your answer.",
    },
    {
      id: "plumber-training-content",
      name: "Apprentice Plumbing Training Content",
      category: "education",
      description:
        "YouTube channel + paid study guides prepping apprentices for licensing exams and first-year field skills.",
      whoPays: "Apprentices (exam prep), later sponsors and trade schools",
      whyItMayWork:
        "Trades content is under-served and licensing exams create recurring, motivated demand every year. Evergreen content compounds.",
      whyItMayFail:
        "Slow build — 12–24 months before meaningful income. Monetization per viewer is modest unless you sell courses.",
      targetCustomer: "17–30 year olds entering the trade; career changers",
      problemSolved: "Passing the exam and surviving year one without expensive prep courses",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (mic, lighting, editing tools)",
      scores: {
        problemStrength: 6,
        marketDemand: 6,
        competitionOpportunity: 7,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 6,
        customerAcquisition: 7,
        risk: 3,
      },
      differentiationIdeas: [
        "State-specific exam prep (most content is generic)",
        "Field-filmed 'first year mistakes' series",
        "Partner with supply houses for sponsorship",
      ],
      redFlags: [
        "Requires actual plumbing knowledge or a partner who has it",
        "Income is back-loaded; don't quit anything for this",
      ],
      firstSteps: [
        "List the 20 most-searched apprentice exam questions",
        "Publish 5 videos answering them",
        "Build an email list with a free formula sheet",
        "Pre-sell a $29 state exam guide",
        "Double down only on what the analytics reward",
      ],
      cheapestValidation:
        "Post 3 exam-prep videos. If none clears a few hundred views in 60 days in this niche, the demand isn't where you thought.",
    },
  ],
};
