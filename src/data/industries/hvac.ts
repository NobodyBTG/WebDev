import type { IndustryDataset } from "@/lib/types";

/** Curated demo dataset: HVAC. */
export const hvac: IndustryDataset = {
  id: "hvac",
  name: "HVAC",
  aliases: ["hvac", "heating and cooling", "air conditioning", "ac repair", "furnace", "heating", "hvac company"],
  summary:
    "High-ticket, seasonal, license-gated trade with private-equity roll-ups raising prices — which is creating trust gaps and support-side openings around the remaining independents.",
  branches: [
    {
      id: "hvac-maintenance-plans",
      name: "HVAC Maintenance Plan Business",
      category: "niche",
      description:
        "Recurring seasonal tune-up memberships (spring AC / fall furnace) — subscription revenue for an HVAC operation, or a plan-management layer on top of one.",
      whoPays: "Homeowners at $15–$30/mo for priority service + tune-ups",
      whyItMayWork:
        "Memberships smooth the brutal seasonality, create priority-dispatch loyalty, and feed replacement sales — the industry's highest-margin event.",
      whyItMayFail:
        "Requires licensed techs to deliver; PE-backed consolidators push their own plans hard; plan economics fail if tune-ups aren't route-dense.",
      targetCustomer: "Homeowners with systems 5–15 years old",
      problemSolved: "Surprise mid-summer failures and priority access during peak season",
      entryCostTier: "10000-50000",
      startupCostEstimate: "$10,000+ (licensed capacity, tools, van) — less if layered on an existing shop",
      scores: {
        problemStrength: 6,
        marketDemand: 7,
        competitionOpportunity: 5,
        easeOfEntry: 4,
        entryCost: 5,
        profitPotential: 8,
        differentiation: 5,
        customerAcquisition: 5,
        risk: 5,
      },
      differentiationIdeas: [
        "Transparent 'what we actually check' lists with photo reports",
        "No-pressure guarantee: plan techs don't earn replacement commissions",
        "Partner model: sell/administer plans for small shops that lack them",
      ],
      redFlags: [
        "EPA 608 + state licensing gate the delivery side",
        "Without route density, tune-ups lose money",
      ],
      firstSteps: [
        "Decide: run the trucks, or administer plans for existing shops",
        "Model plan P&L at realistic tune-up durations",
        "Pre-sell 25 plans in one zip code",
        "Deliver season one flawlessly; track conversion to repairs",
        "Expand one adjacent zip at a time",
      ],
      cheapestValidation:
        "Door-hang one neighborhood: '$149/yr, two tune-ups, priority service.' 25 signups in one zip = viable density; 3 = it isn't.",
    },
    {
      id: "hvac-second-opinion",
      name: "HVAC Second-Opinion Service",
      category: "niche",
      description:
        "Flat-fee independent inspections for homeowners quoted a $8,000–$15,000 replacement — verify or refute before they sign.",
      whoPays: "Homeowners holding a scary quote ($149–$299 flat)",
      whyItMayWork:
        "Replacement-pushing is the industry's loudest trust complaint, amplified by PE roll-ups' sales quotas. A no-commission verdict is instantly understandable.",
      whyItMayFail:
        "One-time transactions, demand spikes only in peak season, and you need licensed credibility to render the opinion.",
      targetCustomer: "Homeowners quoted big-ticket replacements who feel pressured",
      problemSolved: "Knowing whether that $12,000 replacement is real or a commission",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,500 (tools, insurance; assumes existing license or licensed partner)",
      scores: {
        problemStrength: 8,
        marketDemand: 5,
        competitionOpportunity: 8,
        easeOfEntry: 5,
        entryCost: 9,
        profitPotential: 5,
        differentiation: 8,
        customerAcquisition: 5,
        risk: 4,
      },
      differentiationIdeas: [
        "'We sell nothing' as the entire brand",
        "Written findings the homeowner can show the original contractor",
        "Repair-path roadmap when replacement isn't needed",
      ],
      redFlags: [
        "Requires real HVAC competence — this branch is for insiders or partnerships",
        "Contractors you contradict will hate you; document everything",
      ],
      firstSteps: [
        "Confirm licensing needed for inspection-only work in your state",
        "Create a findings-report template",
        "Post the service in local groups during first heat wave",
        "Do 10 inspections; track verify-vs-refute ratio",
        "Publicize anonymized savings stories",
      ],
      cheapestValidation:
        "Post during a heat wave: 'Got a big HVAC replacement quote? Flat $199 independent second opinion, we sell nothing.' Local groups will tell you within a week.",
    },
    {
      id: "hvac-dispatch-answering",
      name: "Peak-Season Overflow Call Handling for HVAC",
      category: "support",
      description:
        "Overflow answering + triage + booking for HVAC companies during heat waves and cold snaps, when every phone rings at once.",
      whoPays: "HVAC companies losing peak-season calls (their highest-revenue days)",
      whyItMayWork:
        "During the first heat wave, call volume 5–10×es for two weeks. Nobody staffs for the spike, and each missed call is a $300–$12,000 opportunity gone to whoever answered.",
      whyItMayFail:
        "Extreme demand spikiness cuts both ways — your revenue is seasonal too; you must nail HVAC triage vocabulary to be trusted.",
      targetCustomer: "5–20 truck HVAC companies without 24/7 office staff",
      problemSolved: "Missed calls during exactly the days that fund the whole year",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (VoIP, scripts, booking access)",
      scores: {
        problemStrength: 8,
        marketDemand: 7,
        competitionOpportunity: 6,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 6,
        differentiation: 7,
        customerAcquisition: 5,
        risk: 4,
      },
      differentiationIdeas: [
        "Surge-only pricing: they pay big during spikes, nothing off-season",
        "HVAC-specific triage (no-cool with elderly resident ≠ thermostat question)",
        "Direct booking into their dispatch software",
      ],
      redFlags: [
        "Your staffing spikes exactly when theirs does — plan the bench",
        "Off-season revenue needs a companion service",
      ],
      firstSteps: [
        "Call 20 HVAC companies during a hot week; log voicemail rate",
        "Build triage scripts with one friendly dispatcher's help",
        "Sign 3 companies pre-season at surge pricing",
        "Handle one heat wave; report booked revenue per client",
        "Bundle an off-season plan (see maintenance-plan admin) to flatten income",
      ],
      cheapestValidation:
        "During the next heat wave, call 20 HVAC offices at 4pm. The voicemail percentage IS the pitch deck — screenshot your call log and send it to each one.",
    },
    {
      id: "hvac-lead-gen",
      name: "HVAC Replacement Lead Generation",
      category: "support",
      description:
        "Content + local SEO capturing 'AC replacement cost' searches, selling exclusive high-intent leads to independent HVAC companies.",
      whoPays: "HVAC companies ($75–$300 per exclusive replacement lead)",
      whyItMayWork:
        "Replacement jobs are $8k–$15k tickets, so companies pay real money per lead. Cost-transparency content ranks because contractors refuse to publish prices.",
      whyItMayFail:
        "HVAC PPC is among the most expensive in local services; national aggregators (Angi, Modernize) saturate paid; SEO is a 6–12 month grind.",
      targetCustomer: "Independent HVAC companies competing with PE-consolidated brands",
      problemSolved: "Replacement-job flow without $40 CPC ad wars",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,500 (content, site, tracking)",
      scores: {
        problemStrength: 6,
        marketDemand: 8,
        competitionOpportunity: 4,
        easeOfEntry: 6,
        entryCost: 9,
        profitPotential: 8,
        differentiation: 5,
        customerAcquisition: 5,
        risk: 5,
      },
      differentiationIdeas: [
        "Real local price-range content (the thing contractors won't publish)",
        "Exclusive leads with call recordings — anti-Angi positioning",
        "Sell to ONE independent per metro; their exclusivity is your pitch",
      ],
      redFlags: [
        "Long runway before revenue; algorithm risk",
        "High competition from well-funded aggregators",
      ],
      firstSteps: [
        "Keyword-map replacement-cost queries for your metro",
        "Publish 10 genuinely useful cost/timing articles",
        "Install call tracking from day one",
        "Give the first 5 leads free to one contractor; convert to paid",
        "Stay one metro until it pays",
      ],
      cheapestValidation:
        "Ask 5 independent HVAC owners: 'What do you currently pay per replacement lead, and are they exclusive?' If nobody pays >$75, skip; if they all do, build.",
    },
    {
      id: "hvac-load-calc",
      name: "Load Calculation & Permit Paperwork Service",
      category: "software",
      description:
        "Done-for-you Manual J/S/D load calculations and permit paperwork for small HVAC contractors who hate the desk work.",
      whoPays: "Small HVAC contractors ($75–$250 per calculation package)",
      whyItMayWork:
        "Permits increasingly require formal load calcs; small shops either fudge them (risk) or lose evenings to software they use twice a month. Outsourced desk work is an easy yes.",
      whyItMayFail:
        "Niche volume per contractor is low, existing tools (Wrightsoft, Cool Calc) keep getting easier, and code offices vary wildly by county.",
      targetCustomer: "1–5 truck HVAC shops doing replacements with permits",
      problemSolved: "Compliance paperwork done overnight without owning/learning the software",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$1,500 (software licenses, training)",
      scores: {
        problemStrength: 6,
        marketDemand: 5,
        competitionOpportunity: 7,
        easeOfEntry: 6,
        entryCost: 9,
        profitPotential: 5,
        differentiation: 7,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "Overnight turnaround guarantee",
        "Per-package pricing, no subscription commitment",
        "County-specific permit checklists as a free lead magnet",
      ],
      redFlags: [
        "You must actually learn Manual J — competence is the product",
        "Volume per client is low; you need many small clients",
      ],
      firstSteps: [
        "Learn Manual J/S/D via ACCA materials",
        "Do 5 free calcs for local contractors to build samples",
        "Publish your county's permit checklist",
        "Price at $99–$199/package, overnight",
        "Automate intake with a simple form",
      ],
      cheapestValidation:
        "Post in HVAC contractor groups: 'I do overnight Manual J packages, $99 flat.' The comments will tell you if the desk-work pain is real in your market.",
    },
    {
      id: "hvac-filter-subscription",
      name: "Furnace Filter Subscription Service",
      category: "product",
      description:
        "Right-sized furnace filters auto-shipped (or hand-delivered + installed for seniors) on the correct schedule.",
      whoPays: "Homeowners; premium tier for seniors/landlords with installation included",
      whyItMayWork:
        "Everyone forgets filters, dirty filters cause real failures, and sizes confuse people. Local install tier differentiates from mail-order giants.",
      whyItMayFail:
        "Amazon Subscribe & Save and FilterEasy already own mail-order; margins are thin; the install tier is a route-density business in disguise.",
      targetCustomer: "Forgetful homeowners; seniors; small landlords with many units",
      problemSolved: "The filter gets changed, correctly sized, on time, every time",
      entryCostTier: "0-500",
      startupCostEstimate: "$200–$500 (initial filter stock)",
      scores: {
        problemStrength: 4,
        marketDemand: 5,
        competitionOpportunity: 3,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 4,
        differentiation: 4,
        customerAcquisition: 5,
        risk: 3,
      },
      differentiationIdeas: [
        "Install-included senior tier — the mail-order players can't touch it",
        "Landlord multi-unit dashboards with proof-of-change photos",
        "Bundle CO-detector battery swaps for genuine safety value",
      ],
      redFlags: [
        "Head-on with Amazon on convenience is unwinnable — the install tier IS the business",
        "Low scores overall: treat as an add-on to another local service, not a standalone",
      ],
      firstSteps: [
        "Survey 30 homeowners: when did you last change your filter? (enjoy the answers)",
        "Test the install tier with 10 senior households",
        "Price at $12–$20/visit-month bundled quarterly",
        "Check unit economics per route hour",
        "Pivot to landlord accounts if consumer routes don't dense up",
      ],
      cheapestValidation:
        "Offer 10 senior households a $15/quarter 'we come change it for you' plan via a church or community-center bulletin. Uptake tells you if the service tier exists.",
    },
    {
      id: "hvac-tech-training",
      name: "HVAC Exam Prep & Career Content",
      category: "education",
      description:
        "EPA 608 and state exam prep content + 'first year as a tech' guidance for people entering HVAC.",
      whoPays: "Career-changers and apprentices (exam prep courses, guides)",
      whyItMayWork:
        "HVAC has a genuine technician shortage, EPA 608 is mandatory for everyone touching refrigerant, and exam-prep demand renews every year.",
      whyItMayFail:
        "ESCO/Mainstream and YouTube free content are established; income is back-loaded; requires field credibility on camera.",
      targetCustomer: "18–35 year olds entering the trade; techs upgrading certifications",
      problemSolved: "Passing mandatory certs cheaply and knowing what year one actually looks like",
      entryCostTier: "0-500",
      startupCostEstimate: "$100–$500 (recording gear, course hosting)",
      scores: {
        problemStrength: 6,
        marketDemand: 6,
        competitionOpportunity: 6,
        easeOfEntry: 8,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 5,
        customerAcquisition: 7,
        risk: 3,
      },
      differentiationIdeas: [
        "State-specific licensing paths (the confusing part nobody covers)",
        "'Day in the life' field footage — recruiting content shops will share",
        "Partner with local supply houses and trade schools",
      ],
      redFlags: [
        "Needs real field experience or a tech partner for credibility",
        "12+ months to meaningful revenue",
      ],
      firstSteps: [
        "Map the 20 most-missed EPA 608 exam topics",
        "Publish 5 free prep videos",
        "Collect emails with a free practice test",
        "Pre-sell a $49 full prep course",
        "Expand into state exams by demand",
      ],
      cheapestValidation:
        "Post one genuinely good '608 questions everyone misses' video. This niche is small enough that decent traction in 30 days = real demand.",
    },
  ],
};
