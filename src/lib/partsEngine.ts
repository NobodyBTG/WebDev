/**
 * Parts Value Engine.
 *
 * Generates a realistic part-out list for a bike from category templates.
 * Prices are seeded from base numbers for a reference bike in each category
 * (modern liter sportbike / big-twin Harley), then scaled by the bike's
 * value tier (age, displacement class inferred from the model name).
 *
 * Everything this engine outputs is an ESTIMATE meant to be corrected by
 * real eBay research — every field stays user-editable, and each part gets
 * ready-made sold/active search links (see search.ts).
 */

import {
  Bike,
  BikeCategory,
  Part,
  PartCondition,
  ShipDifficulty,
} from "./types";
import { buildSearchTerms } from "./search";

let idCounter = 0;
export function uid(prefix = "p"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

interface PartTemplate {
  name: string;
  group: string;
  /** [low, avg] price for the reference bike in this category, USD. */
  base: [number, number];
  /** Typical sold/90d and active counts for a popular model — scaled by demand. */
  sold90: number;
  active: number;
  ship: ShipDifficulty;
  labor: number; // removal + clean + photo + list hours
  days: number; // typical days to sell at avg price
  notes?: string;
  keyPart?: boolean; // "money part" — drives the buy recommendation
}

/* ── Category templates ──────────────────────────────────────────────── */

const SPORTBIKE_PARTS: PartTemplate[] = [
  { name: "Engine (complete, running)", group: "Drivetrain", base: [1800, 2800], sold90: 9, active: 7, ship: 5, labor: 5, days: 30, keyPart: true, notes: "Video of it running before teardown doubles buyer confidence." },
  { name: "ECU / CDI", group: "Electronics", base: [200, 380], sold90: 14, active: 10, ship: 1, labor: 0.4, days: 12, keyPart: true },
  { name: "Gauge cluster / dash", group: "Electronics", base: [280, 520], sold90: 12, active: 9, ship: 1, labor: 0.5, days: 14, keyPart: true, notes: "Photograph mileage on powered-up cluster." },
  { name: "Front wheel", group: "Rolling", base: [180, 320], sold90: 10, active: 12, ship: 4, labor: 0.7, days: 21 },
  { name: "Rear wheel", group: "Rolling", base: [200, 360], sold90: 10, active: 11, ship: 4, labor: 0.8, days: 21 },
  { name: "Front forks (pair)", group: "Suspension", base: [350, 650], sold90: 8, active: 9, ship: 4, labor: 1.2, days: 25, keyPart: true },
  { name: "Triple trees (upper + lower)", group: "Suspension", base: [120, 220], sold90: 7, active: 8, ship: 3, labor: 0.8, days: 25 },
  { name: "Swingarm", group: "Chassis", base: [180, 320], sold90: 5, active: 7, ship: 4, labor: 1.5, days: 35 },
  { name: "Frame (with paperwork)", group: "Chassis", base: [700, 1300], sold90: 4, active: 6, ship: 5, labor: 3, days: 45, keyPart: true, notes: "Value assumes clean paperwork. No title = local scrap or track-bike money." },
  { name: "Fuel tank", group: "Body", base: [250, 450], sold90: 8, active: 10, ship: 4, labor: 0.6, days: 21, notes: "Dents/rust kill value. Ship drained, HAZMAT rules apply." },
  { name: "Fairing set / plastics", group: "Body", base: [400, 900], sold90: 9, active: 14, ship: 4, labor: 1.5, days: 28, keyPart: true, notes: "Sell as a set if 80%+ complete, else piece out." },
  { name: "Subframe", group: "Chassis", base: [90, 170], sold90: 6, active: 8, ship: 3, labor: 0.8, days: 30 },
  { name: "Front brake calipers (pair)", group: "Brakes", base: [180, 340], sold90: 11, active: 9, ship: 2, labor: 0.6, days: 14, keyPart: true },
  { name: "Front brake rotors (pair)", group: "Brakes", base: [120, 240], sold90: 9, active: 10, ship: 3, labor: 0.5, days: 21 },
  { name: "Rear brake caliper + master", group: "Brakes", base: [60, 120], sold90: 8, active: 9, ship: 2, labor: 0.5, days: 21 },
  { name: "Radiator", group: "Cooling", base: [140, 260], sold90: 9, active: 8, ship: 3, labor: 0.7, days: 18, notes: "Straighten fins, pressure-test if possible." },
  { name: "Exhaust (full system)", group: "Exhaust", base: [200, 400], sold90: 7, active: 10, ship: 4, labor: 1, days: 28 },
  { name: "Throttle bodies", group: "Fuel", base: [150, 280], sold90: 8, active: 7, ship: 2, labor: 0.8, days: 18 },
  { name: "Airbox", group: "Fuel", base: [60, 120], sold90: 6, active: 7, ship: 3, labor: 0.4, days: 25 },
  { name: "Wiring harness (main)", group: "Electronics", base: [150, 280], sold90: 9, active: 7, ship: 2, labor: 1.5, days: 18, notes: "Label connectors before pulling. Uncut harnesses only." },
  { name: "Hand controls / switchgear", group: "Controls", base: [80, 160], sold90: 10, active: 9, ship: 1, labor: 0.5, days: 14 },
  { name: "Clip-ons / handlebars", group: "Controls", base: [50, 100], sold90: 9, active: 10, ship: 2, labor: 0.3, days: 18 },
  { name: "Rearsets (OEM pair)", group: "Controls", base: [80, 150], sold90: 8, active: 9, ship: 2, labor: 0.6, days: 21 },
  { name: "Rear shock", group: "Suspension", base: [150, 280], sold90: 7, active: 8, ship: 3, labor: 1, days: 25 },
  { name: "ABS pump / module", group: "Brakes", base: [180, 350], sold90: 8, active: 6, ship: 2, labor: 0.8, days: 18 },
  { name: "Headlight assembly", group: "Body", base: [180, 380], sold90: 11, active: 10, ship: 3, labor: 0.5, days: 14, keyPart: true },
  { name: "Tail light", group: "Body", base: [50, 100], sold90: 9, active: 11, ship: 2, labor: 0.3, days: 18 },
  { name: "Seats (front + rear)", group: "Body", base: [80, 160], sold90: 8, active: 10, ship: 3, labor: 0.2, days: 21 },
  { name: "Fuel pump", group: "Fuel", base: [80, 160], sold90: 10, active: 8, ship: 2, labor: 0.5, days: 14 },
  { name: "Clutch assembly / basket", group: "Drivetrain", base: [100, 200], sold90: 7, active: 8, ship: 2, labor: 1.2, days: 25 },
  { name: "Stator + cover", group: "Electrical", base: [90, 170], sold90: 9, active: 8, ship: 2, labor: 0.8, days: 18 },
  { name: "Rectifier / regulator", group: "Electrical", base: [50, 100], sold90: 11, active: 9, ship: 1, labor: 0.3, days: 12 },
  { name: "Starter motor", group: "Electrical", base: [60, 120], sold90: 9, active: 8, ship: 2, labor: 0.6, days: 16 },
  { name: "Mirrors (pair)", group: "Body", base: [40, 90], sold90: 8, active: 12, ship: 2, labor: 0.2, days: 21 },
  { name: "Fender / hugger / misc brackets", group: "Body", base: [40, 90], sold90: 6, active: 10, ship: 2, labor: 0.4, days: 30 },
];

const CRUISER_PARTS: PartTemplate[] = [
  { name: "Engine (complete, running)", group: "Drivetrain", base: [2200, 3500], sold90: 7, active: 6, ship: 5, labor: 6, days: 35, keyPart: true, notes: "Twin Cam/M8 engines move well with proof of compression." },
  { name: "Transmission", group: "Drivetrain", base: [500, 900], sold90: 6, active: 6, ship: 4, labor: 3, days: 30, keyPart: true },
  { name: "Frame (with paperwork)", group: "Chassis", base: [600, 1200], sold90: 4, active: 6, ship: 5, labor: 4, days: 50, keyPart: true },
  { name: "Front wheel", group: "Rolling", base: [200, 400], sold90: 8, active: 10, ship: 4, labor: 0.7, days: 25 },
  { name: "Rear wheel", group: "Rolling", base: [200, 400], sold90: 8, active: 10, ship: 4, labor: 0.8, days: 25 },
  { name: "Front forks / front end", group: "Suspension", base: [300, 600], sold90: 6, active: 8, ship: 4, labor: 1.5, days: 30 },
  { name: "Fuel tank", group: "Body", base: [300, 600], sold90: 8, active: 9, ship: 4, labor: 0.6, days: 21, keyPart: true, notes: "Paint sets match fenders — sell as set when possible." },
  { name: "Front fender", group: "Body", base: [100, 220], sold90: 7, active: 9, ship: 3, labor: 0.4, days: 25 },
  { name: "Rear fender", group: "Body", base: [120, 260], sold90: 7, active: 9, ship: 3, labor: 0.6, days: 25 },
  { name: "Saddlebags (pair)", group: "Body", base: [300, 650], sold90: 9, active: 8, ship: 4, labor: 0.4, days: 18, keyPart: true },
  { name: "Fairing / batwing + inner", group: "Body", base: [400, 900], sold90: 8, active: 8, ship: 4, labor: 1, days: 21, keyPart: true },
  { name: "Exhaust (full system)", group: "Exhaust", base: [250, 500], sold90: 8, active: 11, ship: 4, labor: 1, days: 25 },
  { name: "Primary (complete)", group: "Drivetrain", base: [250, 500], sold90: 6, active: 7, ship: 4, labor: 2, days: 30 },
  { name: "Hand controls / switchgear", group: "Controls", base: [100, 200], sold90: 9, active: 9, ship: 2, labor: 0.6, days: 16 },
  { name: "Foot controls / floorboards", group: "Controls", base: [100, 220], sold90: 8, active: 9, ship: 3, labor: 0.6, days: 21 },
  { name: "Seat", group: "Body", base: [120, 260], sold90: 9, active: 11, ship: 3, labor: 0.2, days: 18 },
  { name: "Gauge / speedo", group: "Electronics", base: [150, 300], sold90: 9, active: 8, ship: 1, labor: 0.5, days: 16, keyPart: true },
  { name: "ECU / ECM", group: "Electronics", base: [180, 350], sold90: 10, active: 8, ship: 1, labor: 0.4, days: 14, keyPart: true },
  { name: "Wiring harness (main)", group: "Electronics", base: [150, 300], sold90: 8, active: 7, ship: 2, labor: 1.5, days: 21 },
  { name: "Brake calipers + masters", group: "Brakes", base: [150, 300], sold90: 8, active: 9, ship: 2, labor: 0.8, days: 21 },
  { name: "Headlight / nacelle", group: "Lighting", base: [100, 220], sold90: 8, active: 10, ship: 3, labor: 0.4, days: 21 },
  { name: "Tail light + turn signals", group: "Lighting", base: [60, 130], sold90: 8, active: 10, ship: 2, labor: 0.4, days: 21 },
  { name: "Chrome covers / accessories lot", group: "Accessories", base: [100, 250], sold90: 6, active: 12, ship: 2, labor: 1, days: 35, notes: "Bundle small chrome into lots — singles waste listing time." },
  { name: "Rear shocks (pair)", group: "Suspension", base: [80, 180], sold90: 7, active: 9, ship: 3, labor: 0.6, days: 25 },
  { name: "Stator / charging", group: "Electrical", base: [80, 160], sold90: 8, active: 8, ship: 2, labor: 1, days: 20 },
  { name: "Starter motor", group: "Electrical", base: [70, 140], sold90: 8, active: 8, ship: 2, labor: 0.7, days: 20 },
];

/** Standard/naked/adventure/dirt bikes reuse the sportbike list minus fairings. */
function genericParts(category: BikeCategory): PartTemplate[] {
  if (category === "cruiser" || category === "touring") return CRUISER_PARTS;
  if (category === "sportbike") return SPORTBIKE_PARTS;
  return SPORTBIKE_PARTS.filter((p) => p.name !== "Fairing set / plastics").concat([
    { name: "Body panels / shrouds", group: "Body", base: [120, 280], sold90: 7, active: 10, ship: 3, labor: 0.8, days: 25 },
  ]);
}

/* ── Value tier scaling ──────────────────────────────────────────────── */

/**
 * Scale factor vs the reference bike (2020+ liter sportbike / 2015+ big twin).
 * Newer + bigger displacement = parts worth more; old commuter = much less.
 */
export function valueTier(bike: Pick<Bike, "year" | "model" | "category">): number {
  const age = new Date().getFullYear() - bike.year;
  let tier = 1.0;

  // Age curve: parts fall fast for the first decade, then flatten (classics excluded).
  if (age <= 2) tier = 1.15;
  else if (age <= 5) tier = 1.0;
  else if (age <= 10) tier = 0.75;
  else if (age <= 18) tier = 0.55;
  else tier = 0.4;

  // Displacement class guessed from model name digits (R1/ZX-10 vs R3/Ninja 400).
  const digits = bike.model.match(/(\d{2,4})/);
  if (digits) {
    const n = parseInt(digits[1], 10);
    const cc = n < 20 ? n * 100 : n; // "R1"→handled below, "ZX10"→1000, "600"→600
    if (cc >= 900) tier *= 1.0;
    else if (cc >= 600) tier *= 0.85;
    else if (cc >= 400) tier *= 0.6;
    else if (cc >= 250) tier *= 0.45;
  }
  const flagship = /\b(R1|ZX-?10|GSX-?R? ?1000|CBR ?1000|S1000|1290|1299|V4|R1M|H2)\b/i;
  if (flagship.test(bike.model)) tier = Math.max(tier, age <= 3 ? 1.2 : 0.9);

  return Math.round(tier * 100) / 100;
}

/* ── Condition adjustments ───────────────────────────────────────────── */

export const CONDITION_MULTIPLIER: Record<PartCondition, number> = {
  good: 1.0,
  unknown: 0.75, // untested discount
  damaged: 0.0, // assume scrap unless the user overrides
  missing: 0.0,
  aftermarket: 1.0, // priced on its own comps
};

/** Damage keywords → parts that should be zeroed + parts to flag for inspection. */
const DAMAGE_RULES: {
  pattern: RegExp;
  zero: RegExp[];
  inspect: RegExp[];
  warning: string;
}[] = [
  {
    pattern: /front[\s-]?end|forks?\b.*(toast|bent|damag|blown)|fork(s)? (are )?toast/i,
    zero: [/front forks/i],
    inspect: [/triple tree/i, /front wheel/i, /front brake/i, /headlight/i, /gauge/i, /radiator/i, /frame/i],
    warning: "Front-end hit: inspect triple trees, steering stops, frame neck, radiator and gauge mounts before valuing them at full price.",
  },
  {
    pattern: /front wheel.*(toast|bent|crack|damag)|wheel.*toast/i,
    zero: [/front wheel/i],
    inspect: [/front brake rotor/i, /front forks/i],
    warning: "Front wheel damaged: rotors that took the same hit are often warped — check runout.",
  },
  {
    pattern: /rear[\s-]?end|swing ?arm.*(bent|damag)/i,
    zero: [/swingarm/i],
    inspect: [/rear wheel/i, /subframe/i, /rear shock/i, /tail light/i],
    warning: "Rear-end hit: check subframe alignment and rear wheel before listing.",
  },
  {
    pattern: /fire|burn/i,
    zero: [/wiring/i, /fairing|plastics|body panels/i, /seat/i, /airbox/i, /tank/i],
    inspect: [/engine/i, /ecu/i, /gauge/i],
    warning: "Fire damage: wiring, plastics and anything rubber are scrap. Heat near the engine kills its value too — be very conservative.",
  },
  {
    pattern: /flood|submerg|water damage/i,
    zero: [/ecu/i, /gauge/i, /wiring/i],
    inspect: [/engine/i, /starter/i, /stator/i, /fuel pump/i],
    warning: "Flood bike: electronics are unsellable as 'good'. Engine must be torn down before claiming it runs.",
  },
];

/** Aftermarket brand knowledge — recognized names get their own part lines. */
const AFTERMARKET_CATALOG: { pattern: RegExp; name: string; base: [number, number]; ship: ShipDifficulty; labor: number; notes: string }[] = [
  { pattern: /asv.*(lever|c5|f3)|(\blevers?\b.*asv)/i, name: "ASV levers (pair)", base: [90, 140], ship: 1, labor: 0.2, notes: "ASV holds value — list at 60-70% of new." },
  { pattern: /(light ?tech|lightech).*rear ?sets?|rear ?sets?.*(light ?tech|lightech)/i, name: "LighTech rearsets", base: [250, 400], ship: 2, labor: 0.7, notes: "LighTech rearsets retail $500+. Strong demand from track riders." },
  { pattern: /(light ?tech|lightech).*(fuel|gas) ?cap/i, name: "LighTech fuel cap", base: [60, 110], ship: 1, labor: 0.1, notes: "Small, ships cheap, easy money." },
  { pattern: /(light ?tech|lightech).*mirror ?block/i, name: "LighTech mirror block-offs", base: [25, 50], ship: 1, labor: 0.1, notes: "Bundle with other small LighTech bits if slow." },
  { pattern: /(light ?tech|lightech).*(axle|swing ?arm) ?(extension|slider|spool)/i, name: "LighTech swingarm axle sliders/extension", base: [40, 80], ship: 1, labor: 0.2, notes: "" },
  { pattern: /akrapovic|akra\b/i, name: "Akrapovic exhaust", base: [400, 750], ship: 4, labor: 1, notes: "Ti systems hold 50-60% of retail even used." },
  { pattern: /yoshimura|yosh\b/i, name: "Yoshimura exhaust", base: [250, 450], ship: 4, labor: 1, notes: "" },
  { pattern: /ohlins|öhlins/i, name: "Ohlins suspension", base: [400, 800], ship: 3, labor: 1, notes: "Ohlins always sells. Note valving/spring rate in listing." },
  { pattern: /brembo.*(master|rcs)/i, name: "Brembo RCS master cylinder", base: [150, 250], ship: 1, labor: 0.3, notes: "" },
  { pattern: /power ?commander|pc-?[v5]/i, name: "Power Commander", base: [120, 220], ship: 1, labor: 0.3, notes: "" },
  { pattern: /quick ?shifter/i, name: "Quickshifter", base: [80, 180], ship: 1, labor: 0.4, notes: "" },
  { pattern: /woodcraft|vortex.*(rear ?sets?)/i, name: "Aftermarket rearsets", base: [150, 280], ship: 2, labor: 0.7, notes: "" },
  { pattern: /frame slider/i, name: "Frame sliders", base: [30, 60], ship: 1, labor: 0.3, notes: "" },
  { pattern: /fender eliminator|tail tidy/i, name: "Fender eliminator kit", base: [30, 70], ship: 1, labor: 0.3, notes: "" },
];

/* ── Generation ──────────────────────────────────────────────────────── */

function round5(n: number): number {
  return Math.max(0, Math.round(n / 5) * 5);
}

export interface GenerateResult {
  parts: Part[];
  warnings: string[];
  tier: number;
}

/**
 * Build the full parts list for a bike:
 *  1. category template scaled by value tier
 *  2. condition set from damage notes / missing list
 *  3. recognized aftermarket parts added as their own lines
 *  4. search terms attached per part
 */
export function generateParts(bike: Bike, quickSaleDiscount = 0.25): GenerateResult {
  const tier = valueTier(bike);
  const warnings: string[] = [];
  const damageText = `${bike.damageNotes} ${bike.rawDescription}`;
  const missingText = bike.missingParts.toLowerCase();

  // Which damage rules fire?
  const firedRules = DAMAGE_RULES.filter((r) => r.pattern.test(damageText));
  firedRules.forEach((r) => warnings.push(r.warning));

  // Also match explicit "X good / X damaged" phrases from notes.
  const goodMatches = extractConditionMentions(damageText, /(good|works?|mint|clean|perfect)/i);
  const badMatches = extractConditionMentions(damageText, /(toast|bent|crack|broken|damaged|smashed|destroyed|scratched|blown)/i);

  const parts: Part[] = genericParts(bike.category).map((t) => {
    let condition: PartCondition = "unknown";
    const nameLc = t.name.toLowerCase();

    if (firedRules.some((r) => r.zero.some((z) => z.test(t.name)))) condition = "damaged";
    else if (badMatches.some((m) => nameMatches(nameLc, m))) condition = "damaged";
    else if (goodMatches.some((m) => nameMatches(nameLc, m))) condition = "good";
    if (missingText && missingText.split(/[,;\n]/).some((m) => m.trim() && nameMatches(nameLc, m.trim()))) {
      condition = "missing";
    }

    const needsInspection = firedRules.some((r) => r.inspect.some((z) => z.test(t.name)));
    const mult = CONDITION_MULTIPLIER[condition] * (needsInspection && condition !== "damaged" && condition !== "missing" ? 0.9 : 1);

    // Frame value depends on title / sellability.
    let frameMult = 1;
    if (/frame/i.test(t.name)) {
      if (!bike.frameSellable || bike.titleStatus === "none") {
        frameMult = 0.15;
        warnings.push("Frame has no sellable paperwork — valued at track/scrap money only.");
      } else if (bike.titleStatus === "salvage" || bike.titleStatus === "bill-of-sale") {
        frameMult = 0.6;
      }
    }

    // High mileage discounts wear items.
    let mileageMult = 1;
    if (bike.mileage && bike.mileage > 30000 && /engine|transmission|clutch|forks|shock/i.test(t.name)) {
      mileageMult = 0.75;
    } else if (bike.mileage !== null && bike.mileage >= 0 && bike.mileage < 5000 && /engine|transmission/i.test(t.name)) {
      mileageMult = 1.1;
    }

    const low = round5(t.base[0] * tier * mult * frameMult * mileageMult);
    const avg = round5(t.base[1] * tier * mult * frameMult * mileageMult);
    const quick = round5(avg * (1 - quickSaleDiscount));
    const st = buildSearchTerms(bike, t.name);

    const inspectionNote = needsInspection && condition !== "damaged" ? "⚠ Inspect before pricing — took load in the crash. " : "";

    return {
      id: uid(),
      name: t.name,
      group: t.group,
      condition,
      isAftermarket: false,
      priceLow: low,
      priceAvg: avg,
      priceQuick: quick,
      priceListing: avg, // refined against lowestActive by calc layer / user
      conditionMultiplier: Math.round(mult * frameMult * mileageMult * 100) / 100,
      activeCount: t.active,
      soldCount90: t.sold90,
      lowestActive: 0,
      highestSold: 0,
      avgSold: 0,
      marketDataSource: "estimate" as const,
      estDaysToSell: condition === "damaged" || condition === "missing" ? 0 : t.days,
      shipDifficulty: t.ship,
      laborHours: t.labor,
      worthListing: avg >= 40 && condition !== "damaged" && condition !== "missing",
      include: condition !== "missing",
      notes: `${inspectionNote}${t.notes ?? ""}`.trim(),
      searchTerms: st.terms,
      avoidTerms: st.avoid,
    };
  });

  // Aftermarket lines from notes + raw description.
  const amText = `${bike.aftermarketNotes} ${bike.rawDescription}`;
  for (const am of AFTERMARKET_CATALOG) {
    if (am.pattern.test(amText)) {
      const st = buildSearchTerms(bike, am.name, true);
      const avg = round5(am.base[1]);
      parts.push({
        id: uid(),
        name: am.name,
        group: "Aftermarket",
        condition: "aftermarket",
        isAftermarket: true,
        priceLow: round5(am.base[0]),
        priceAvg: avg,
        priceQuick: round5(avg * (1 - quickSaleDiscount)),
        priceListing: avg,
        conditionMultiplier: 1,
        activeCount: 6,
        soldCount90: 8,
        lowestActive: 0,
        highestSold: 0,
        avgSold: 0,
        marketDataSource: "estimate",
        estDaysToSell: 14,
        shipDifficulty: am.ship,
        laborHours: am.labor,
        worthListing: true,
        include: true,
        notes: am.notes,
        searchTerms: st.terms,
        avoidTerms: st.avoid,
      });
    }
  }

  if (tier < 0.6) {
    warnings.push("Older/small-displacement bike: part prices are low — labor per part eats margin fast. Only pull the top sellers.");
  }

  return { parts, warnings, tier };
}

/** Pull "<part words> <condition word>" mentions out of free text. */
function extractConditionMentions(text: string, conditionWord: RegExp): string[] {
  const found: string[] = [];
  const sentences = text.split(/[,.;\n]/);
  for (const s of sentences) {
    if (conditionWord.test(s)) {
      found.push(s.toLowerCase());
    }
  }
  return found;
}

/** Loose match between a template part name and a free-text mention. */
function nameMatches(partNameLc: string, mention: string): boolean {
  const aliases: Record<string, string[]> = {
    "gauge cluster / dash": ["gauge", "cluster", "dash", "speedo"],
    "hand controls / switchgear": ["hand control", "controls", "switchgear", "switch gear"],
    "front forks (pair)": ["fork"],
    "front wheel": ["front wheel", "front rim"],
    "rear wheel": ["rear wheel", "rear rim"],
    "fairing set / plastics": ["fairing", "plastics", "bodywork"],
    "fuel tank": ["tank"],
    "engine (complete, running)": ["engine", "motor"],
    "headlight assembly": ["headlight", "head light"],
    "gauge / speedo": ["gauge", "speedo", "cluster"],
  };
  const keys = aliases[partNameLc] ?? [partNameLc.split("(")[0].trim()];
  return keys.some((k) => mention.includes(k));
}
