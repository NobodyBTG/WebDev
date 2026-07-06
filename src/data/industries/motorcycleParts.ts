import type { IndustryDataset } from "@/lib/types";

/** Curated demo dataset: Motorcycle Parts. */
export const motorcycleParts: IndustryDataset = {
  id: "motorcycle-parts",
  name: "Motorcycle Parts",
  aliases: [
    "motorcycle parts", "motorcycle", "bike parts", "motorbike parts",
    "motorcycle salvage", "used motorcycle parts", "powersports parts",
  ],
  summary:
    "Fragmented aftermarket with passionate buyers. Used/OEM parts are hard to find and fitment confusion is the #1 buyer complaint — strong angles in sourcing, data, and specialized commerce.",
  branches: [
    {
      id: "moto-used-ecommerce",
      name: "Used Motorcycle Parts E-commerce",
      category: "product",
      description:
        "Part out salvage bikes and sell tested used parts on eBay and your own store.",
      whoPays: "Riders and repair shops hunting discontinued or cheaper OEM parts",
      whyItMayWork:
        "A parted-out bike routinely sells for 2–3× its whole-bike price. Older-model OEM parts are discontinued, so supply is scarce and buyers are motivated.",
      whyItMayFail:
        "Inventory-heavy, space-heavy, and every listing is unique — photographing and describing hundreds of one-off parts is real labor.",
      targetCustomer: "DIY riders keeping 5–20 year old bikes alive; small repair shops",
      problemSolved: "Finding a working OEM part without paying dealer prices — or when the dealer no longer stocks it",
      entryCostTier: "500-2500",
      startupCostEstimate: "$1,000–$2,500 (first 2–3 salvage bikes, tools, shelving)",
      scores: {
        problemStrength: 7,
        marketDemand: 7,
        competitionOpportunity: 6,
        easeOfEntry: 7,
        entryCost: 9,
        profitPotential: 7,
        differentiation: 5,
        customerAcquisition: 7,
        risk: 4,
      },
      differentiationIdeas: [
        "Video-test every electrical part before listing — the used-parts trust gap is huge",
        "Specialize in 2–3 popular model families instead of everything",
        "30-day no-questions returns (rare in salvage)",
      ],
      redFlags: [
        "Title/paperwork rules for salvage vehicles vary by state",
        "eBay fees + shipping eat margins on heavy parts",
      ],
      firstSteps: [
        "Pick one popular model family (e.g. SV650, Sportster) and study sold listings",
        "Buy ONE wrecked bike at auction or Facebook Marketplace",
        "Part it out completely; track hours and revenue per part",
        "Compute real hourly rate after fees and shipping",
        "Scale to 2–3 bikes/month only if the math works",
      ],
      cheapestValidation:
        "Before buying a bike, list 10 parts you already own or can flip. If selling is fun and profitable at 10 items, it survives at 500.",
    },
    {
      id: "moto-salvage-pickup",
      name: "Local Motorcycle Salvage Pickup",
      category: "direct",
      description:
        "Free or paid removal of dead project bikes, feeding your own part-out pipeline or flipping to rebuilders.",
      whoPays: "Two sides: owners sometimes pay for removal; rebuilders/parters pay you for the bikes",
      whyItMayWork:
        "Garages are full of abandoned projects owners feel guilty about. Car junk-removal exists everywhere; bike-specific pickup barely does.",
      whyItMayFail:
        "Inconsistent supply, title paperwork friction, and you need somewhere to put the bikes.",
      targetCustomer: "Owners of non-running bikes; downstream, salvage buyers",
      problemSolved: "Getting a dead bike out of the garage with zero effort and clean paperwork",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,000 (trailer or ramp + straps, storage space)",
      scores: {
        problemStrength: 5,
        marketDemand: 5,
        competitionOpportunity: 8,
        easeOfEntry: 8,
        entryCost: 9,
        profitPotential: 6,
        differentiation: 7,
        customerAcquisition: 6,
        risk: 4,
      },
      differentiationIdeas: [
        "Handle ALL title paperwork for the seller — that's the real product",
        "Same-week pickup promise",
        "Offer cash for clean-title bikes, free removal for junk",
      ],
      redFlags: [
        "Never take a bike without proper title/bill-of-sale process",
        "Storage fills faster than bikes sell",
      ],
      firstSteps: [
        "Learn your state's abandoned/salvage title process cold",
        "Post 'free dead motorcycle removal' in 5 local groups",
        "Do 3 pickups; sell or part each within 30 days",
        "Build a contact list of rebuilders who buy projects",
        "Decide: flip whole bikes or feed a part-out operation",
      ],
      cheapestValidation:
        "One free post: 'I remove dead motorcycles, free, this Saturday.' The reply count tells you supply; a call to two rebuilders tells you demand.",
    },
    {
      id: "moto-fitment-db",
      name: "Motorcycle Parts Fitment Database",
      category: "software",
      description:
        "A structured 'does this part fit my bike?' database with cross-model compatibility, sold as API/widget to parts sellers.",
      whoPays: "Parts e-commerce stores and marketplaces; possibly rider subscriptions",
      whyItMayWork:
        "Fitment uncertainty is the #1 cause of returns and abandoned carts in used parts. Car parts have solved this (partially); bikes haven't. Cross-model OEM interchange data is tribal knowledge.",
      whyItMayFail:
        "Data acquisition is brutal — thousands of models, no clean public source. This is a multi-year data moat play, not a quick win.",
      targetCustomer: "Used-parts sellers drowning in 'will this fit?' messages",
      problemSolved: "Instant, reliable fitment answers instead of forum archaeology",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$2,500–$10,000 (data collection, dev time)",
      scores: {
        problemStrength: 8,
        marketDemand: 6,
        competitionOpportunity: 7,
        easeOfEntry: 3,
        entryCost: 7,
        profitPotential: 7,
        differentiation: 8,
        customerAcquisition: 4,
        risk: 6,
      },
      differentiationIdeas: [
        "Start with ONE brand's interchange data done perfectly",
        "Crowdsource verification with reputation scoring",
        "Free rider-facing checker as lead gen for the B2B API",
      ],
      redFlags: [
        "OEM data may have licensing constraints — verify before scraping",
        "Chicken-and-egg: sparse data = no users = no data corrections",
      ],
      firstSteps: [
        "Interview 10 used-parts sellers about their returns/questions volume",
        "Manually compile interchange data for one model family",
        "Ship a one-brand fitment checker as a free tool",
        "Measure usage; pre-sell API access to 3 sellers",
        "Expand brand-by-brand, never all at once",
      ],
      cheapestValidation:
        "Ask 10 eBay motorcycle-parts sellers: 'What % of your returns are fitment mistakes, and would you pay to cut that in half?' Their answers are your business case.",
    },
    {
      id: "moto-auction-sourcing",
      name: "Wrecked Bike Auction Sourcing Service",
      category: "support",
      description:
        "You watch Copart/IAA salvage auctions and source specific wrecked bikes for parters and rebuilders, for a flat finder's fee.",
      whoPays: "Part-out businesses and rebuilders who lack auction access or time",
      whyItMayWork:
        "Salvage auctions require broker licenses/registration many small operators don't have, and auction-watching is time-intensive. You become their sourcing arm.",
      whyItMayFail:
        "Small total market in any one region; brokers already exist for cars and can extend to bikes; trust takes time when money moves through you.",
      targetCustomer: "Small part-out operations and flip-focused rebuilders",
      problemSolved: "Getting the right wrecked bike at the right price without auction access or daily monitoring",
      entryCostTier: "0-500",
      startupCostEstimate: "$0–$500 (broker registration or partnership, spreadsheet ops)",
      scores: {
        problemStrength: 6,
        marketDemand: 5,
        competitionOpportunity: 7,
        easeOfEntry: 7,
        entryCost: 10,
        profitPotential: 5,
        differentiation: 6,
        customerAcquisition: 5,
        risk: 4,
      },
      differentiationIdeas: [
        "Bike-only focus with model-level value estimates (brokers are generalists)",
        "Flat fee, not percentage — predictable for buyers",
        "Weekly 'undervalued lots' email as marketing",
      ],
      redFlags: [
        "Broker/dealer licensing rules vary by state and auction house",
        "Handling other people's purchase money requires clean process",
      ],
      firstSteps: [
        "Map access requirements for Copart/IAA in your state",
        "Follow bike auctions for 2 weeks; log hammer prices vs. part-out value",
        "Publish 5 'this lot was a steal' breakdowns",
        "Offer sourcing to 5 part-out sellers for a flat $150/bike",
        "Do 3 deals end-to-end before any automation",
      ],
      cheapestValidation:
        "DM 10 part-out sellers on eBay/Instagram: 'I find underpriced wrecked bikes at auction — want my weekly list?' Free list first; fee when they buy.",
    },
    {
      id: "moto-shop-supplier",
      name: "Motorcycle Repair Shop Parts Supplier",
      category: "product",
      description:
        "B2B supplier of fast-moving consumables (brake pads, filters, chains, batteries) to independent repair shops with same-day delivery.",
      whoPays: "Independent motorcycle repair shops",
      whyItMayWork:
        "Shops lose bay time waiting on parts. Distributors have minimums and 2–5 day shipping; a local rep with stocked fast-movers and same-day drop-off wins loyalty.",
      whyItMayFail:
        "You're competing with national distributors' pricing, carrying inventory risk, and shops guard existing supplier relationships.",
      targetCustomer: "Independent bike shops (1–5 mechanics) in one metro",
      problemSolved: "Bikes stop sitting on lifts waiting for a $20 consumable",
      entryCostTier: "2500-10000",
      startupCostEstimate: "$3,000–$10,000 (initial consumables inventory, vehicle)",
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
        "Same-day delivery inside a defined zone — the whole pitch",
        "Consignment shelf stocked in each shop, billed monthly",
        "Text-to-order with photo recognition later",
      ],
      redFlags: [
        "Inventory is cash in boxes; buy only proven fast-movers",
        "Distributor accounts may require business history",
      ],
      firstSteps: [
        "Visit 10 shops; ask which 20 SKUs they run out of",
        "Open accounts with 1–2 distributors",
        "Stock only the top-20 consensus SKUs",
        "Run a weekly delivery route to 5 committed shops",
        "Add SKUs only when asked twice",
      ],
      cheapestValidation:
        "Walk into 10 repair shops with a one-page SKU list and ask: 'If I delivered these same-day at distributor prices, would you order weekly?' Signatures, not nods.",
    },
    {
      id: "moto-oem-marketplace",
      name: "Specialty Used OEM Parts Marketplace",
      category: "marketplace",
      description:
        "A vertical marketplace for verified used OEM motorcycle parts with fitment data built in — the anti-eBay for bike parts.",
      whoPays: "Sellers via commission or listing fees",
      whyItMayWork:
        "eBay is where used bike parts live today, but search is noisy, fitment is guesswork, and trust is uneven. A vertical with structured fitment could be genuinely better.",
      whyItMayFail:
        "Cold-start against a giant: sellers won't leave eBay's traffic, and 'better UX' rarely beats liquidity. Very capital- and time-hungry.",
      targetCustomer: "Riders restoring/maintaining older bikes; sellers wanting less noise",
      problemSolved: "Finding the exact used OEM part that FITS, from a seller you can trust",
      entryCostTier: "10000-50000",
      startupCostEstimate: "$10,000+ (platform, two-sided growth, fitment data)",
      scores: {
        problemStrength: 7,
        marketDemand: 6,
        competitionOpportunity: 3,
        easeOfEntry: 2,
        entryCost: 5,
        profitPotential: 7,
        differentiation: 7,
        customerAcquisition: 3,
        risk: 8,
      },
      differentiationIdeas: [
        "Launch as a curated storefront layer over existing sellers, not a new destination",
        "Fitment-verified badge as the core trust primitive",
        "One marque community first (e.g. vintage Honda) for density",
      ],
      redFlags: [
        "This is the classic 'better mousetrap vs. liquidity' trap",
        "Do NOT build this before the fitment database exists",
        "Too expensive for most starting budgets",
      ],
      firstSteps: [
        "Run the fitment-database branch first — it's the wedge",
        "Curate a weekly 'best used OEM finds' newsletter to test buyer pull",
        "Recruit 10 anchor sellers with zero fees",
        "Broker sales manually before building checkout",
        "Raise or partner if liquidity appears",
      ],
      cheapestValidation:
        "Start a free weekly newsletter of hand-picked used OEM deals for one marque. If you can't get 500 subscribers, you can't get a marketplace.",
    },
    {
      id: "moto-partout-analytics",
      name: "Motorcycle Part-Out Analytics Tool",
      category: "software",
      description:
        "Software that tells parters what a wrecked bike is worth in parts: expected sale price and sell-through time per component, from sold-listing data.",
      whoPays: "Part-out sellers and salvage buyers making bid decisions",
      whyItMayWork:
        "Every parter does this math by hand in a notebook today. Sold-listing data exists; nobody has productized 'bid ceiling per VIN' for bikes.",
      whyItMayFail:
        "The hardcore-parter market is small; casual sellers won't pay. Data pipeline (eBay sold listings) has API/ToS constraints to navigate.",
      targetCustomer: "Serious part-out operators buying 2+ bikes a month",
      problemSolved: "Knowing your maximum profitable bid before the auction, not after",
      entryCostTier: "500-2500",
      startupCostEstimate: "$500–$2,500 (data pipeline, MVP dev)",
      scores: {
        problemStrength: 7,
        marketDemand: 4,
        competitionOpportunity: 8,
        easeOfEntry: 5,
        entryCost: 9,
        profitPotential: 5,
        differentiation: 8,
        customerAcquisition: 4,
        risk: 5,
      },
      differentiationIdeas: [
        "'Bid ceiling' number as the headline feature — one number, big font",
        "Sell-through-time estimates, not just prices (cash flow matters)",
        "Free tier for 1 bike/month to seed word of mouth",
      ],
      redFlags: [
        "Small TAM — this may be a $5k/mo business, not a startup. Decide if that's fine.",
        "Check eBay API terms for sold-data usage",
      ],
      firstSteps: [
        "Manually build part-out valuations for 5 popular models in a spreadsheet",
        "Sell the spreadsheet for $20 to test willingness to pay",
        "Interview buyers about what they'd pay monthly",
        "Automate only the models people bought",
        "Ship a web MVP at $19–$49/mo",
      ],
      cheapestValidation:
        "Sell a hand-made 'SV650 part-out value sheet' for $20 in parter Facebook groups. Ten sales proves the pain; zero sales saves you months of coding.",
    },
  ],
};
