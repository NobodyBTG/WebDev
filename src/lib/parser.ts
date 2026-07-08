/**
 * Rule-based description parser.
 *
 * Turns a pasted auction description like
 *   "2025 Yamaha R1, wrecked front end, forks toast, ... bought for $5,000"
 * into structured bike fields. This is the no-API-key fallback; when an
 * AI key is configured, /api/ai/parse refines the same structure (ai.ts).
 */

import { BikeCategory, TitleStatus } from "./types";

export interface ParsedBike {
  year: number | null;
  make: string;
  model: string;
  trim: string;
  category: BikeCategory;
  mileage: number | null;
  titleStatus: TitleStatus | null;
  purchasePrice: number | null;
  damageNotes: string;
  missingParts: string;
  aftermarketNotes: string;
  confidence: "high" | "medium" | "low";
}

const MAKES: { pattern: RegExp; name: string; defaultCategory: BikeCategory }[] = [
  { pattern: /\byamaha\b/i, name: "Yamaha", defaultCategory: "sportbike" },
  { pattern: /\bhonda\b/i, name: "Honda", defaultCategory: "sportbike" },
  { pattern: /\bkawasaki\b/i, name: "Kawasaki", defaultCategory: "sportbike" },
  { pattern: /\bsuzuki\b/i, name: "Suzuki", defaultCategory: "sportbike" },
  { pattern: /\bharley|hd\b|h-d/i, name: "Harley-Davidson", defaultCategory: "cruiser" },
  { pattern: /\bindian\b/i, name: "Indian", defaultCategory: "cruiser" },
  { pattern: /\bducati\b/i, name: "Ducati", defaultCategory: "sportbike" },
  { pattern: /\bbmw\b/i, name: "BMW", defaultCategory: "sportbike" },
  { pattern: /\btriumph\b/i, name: "Triumph", defaultCategory: "standard" },
  { pattern: /\bktm\b/i, name: "KTM", defaultCategory: "sportbike" },
  { pattern: /\baprilia\b/i, name: "Aprilia", defaultCategory: "sportbike" },
  { pattern: /\bvictory\b/i, name: "Victory", defaultCategory: "cruiser" },
];

/** Known models with category + canonical spelling. Extend freely. */
const MODELS: { pattern: RegExp; name: string; category: BikeCategory }[] = [
  { pattern: /\br1m\b/i, name: "R1M", category: "sportbike" },
  { pattern: /\b(yzf[-\s]?)?r1\b/i, name: "R1", category: "sportbike" },
  { pattern: /\b(yzf[-\s]?)?r6\b/i, name: "R6", category: "sportbike" },
  { pattern: /\b(yzf[-\s]?)?r7\b/i, name: "R7", category: "sportbike" },
  { pattern: /\b(yzf[-\s]?)?r3\b/i, name: "R3", category: "sportbike" },
  { pattern: /\bmt-?0?9\b/i, name: "MT-09", category: "standard" },
  { pattern: /\bmt-?0?7\b/i, name: "MT-07", category: "standard" },
  { pattern: /\bzx-?10r?\b/i, name: "ZX-10R", category: "sportbike" },
  { pattern: /\bzx-?6r?\b/i, name: "ZX-6R", category: "sportbike" },
  { pattern: /\bninja 400\b/i, name: "Ninja 400", category: "sportbike" },
  { pattern: /\bninja 650\b/i, name: "Ninja 650", category: "sportbike" },
  { pattern: /\bgsx-?r ?1000\b|\bgixxer ?1000\b/i, name: "GSX-R1000", category: "sportbike" },
  { pattern: /\bgsx-?r ?750\b/i, name: "GSX-R750", category: "sportbike" },
  { pattern: /\bgsx-?r ?600\b/i, name: "GSX-R600", category: "sportbike" },
  { pattern: /\bhayabusa\b/i, name: "Hayabusa", category: "sportbike" },
  { pattern: /\bcbr ?1000 ?rr(-r)?\b/i, name: "CBR1000RR", category: "sportbike" },
  { pattern: /\bcbr ?600 ?rr\b/i, name: "CBR600RR", category: "sportbike" },
  { pattern: /\bcbr ?500\b/i, name: "CBR500R", category: "sportbike" },
  { pattern: /\bgrom\b/i, name: "Grom", category: "standard" },
  { pattern: /\bs ?1000 ?rr\b/i, name: "S1000RR", category: "sportbike" },
  { pattern: /\bpanigale( v[24])?\b/i, name: "Panigale", category: "sportbike" },
  { pattern: /\bstreet glide\b/i, name: "Street Glide", category: "touring" },
  { pattern: /\broad glide\b/i, name: "Road Glide", category: "touring" },
  { pattern: /\broad king\b/i, name: "Road King", category: "touring" },
  { pattern: /\belectra glide\b/i, name: "Electra Glide", category: "touring" },
  { pattern: /\bsportster\b|\bxl ?1200\b|\bxl ?883\b|\biron 883\b/i, name: "Sportster", category: "cruiser" },
  { pattern: /\bsoftail\b/i, name: "Softail", category: "cruiser" },
  { pattern: /\bdyna\b/i, name: "Dyna", category: "cruiser" },
  { pattern: /\bfat boy\b/i, name: "Fat Boy", category: "cruiser" },
  { pattern: /\bbreakout\b/i, name: "Breakout", category: "cruiser" },
  { pattern: /\bchief(tain)?\b/i, name: "Chieftain", category: "cruiser" },
  { pattern: /\bscout\b/i, name: "Scout", category: "cruiser" },
  { pattern: /\bafrica twin\b/i, name: "Africa Twin", category: "adventure" },
  { pattern: /\bgs ?1250\b|\br ?1250 ?gs\b/i, name: "R1250GS", category: "adventure" },
  { pattern: /\btenere\b/i, name: "Tenere 700", category: "adventure" },
];

const DAMAGE_HINTS = /wreck|crash|toast|bent|broken|damag|smash|slid|laid down|lowside|highside|totaled|fire|flood|blown|seized|cracked|scratch/i;
const AFTERMARKET_HINTS = /asv|lightech|light ?tech|akrapovic|yoshimura|ohlins|öhlins|brembo rcs|power ?commander|quick ?shifter|woodcraft|vortex|frame slider|fender eliminator|aftermarket|rearsets|full system|slip[- ]?on/i;

export function parseDescription(text: string): ParsedBike {
  const result: ParsedBike = {
    year: null, make: "", model: "", trim: "", category: "sportbike",
    mileage: null, titleStatus: null, purchasePrice: null,
    damageNotes: "", missingParts: "", aftermarketNotes: "",
    confidence: "low",
  };

  // Year: 1970-2029, prefer one adjacent to a make/model mention.
  const yearMatches = text.match(/\b(19[7-9]\d|20[0-2]\d)\b/g);
  if (yearMatches) result.year = parseInt(yearMatches[0], 10);

  for (const m of MAKES) {
    if (m.pattern.test(text)) {
      result.make = m.name;
      result.category = m.defaultCategory;
      break;
    }
  }

  for (const m of MODELS) {
    if (m.pattern.test(text)) {
      result.model = m.name;
      result.category = m.category;
      break;
    }
  }
  // Infer make from model if missing (R1 → Yamaha etc.)
  if (!result.make && result.model) {
    const byModel: Record<string, string> = {
      R1: "Yamaha", R1M: "Yamaha", R6: "Yamaha", R7: "Yamaha", R3: "Yamaha", "MT-09": "Yamaha", "MT-07": "Yamaha", "Tenere 700": "Yamaha",
      "ZX-10R": "Kawasaki", "ZX-6R": "Kawasaki", "Ninja 400": "Kawasaki", "Ninja 650": "Kawasaki",
      "GSX-R1000": "Suzuki", "GSX-R750": "Suzuki", "GSX-R600": "Suzuki", Hayabusa: "Suzuki",
      CBR1000RR: "Honda", CBR600RR: "Honda", CBR500R: "Honda", Grom: "Honda", "Africa Twin": "Honda",
      S1000RR: "BMW", R1250GS: "BMW", Panigale: "Ducati",
      "Street Glide": "Harley-Davidson", "Road Glide": "Harley-Davidson", "Road King": "Harley-Davidson",
      "Electra Glide": "Harley-Davidson", Sportster: "Harley-Davidson", Softail: "Harley-Davidson",
      Dyna: "Harley-Davidson", "Fat Boy": "Harley-Davidson", Breakout: "Harley-Davidson",
      Chieftain: "Indian", Scout: "Indian",
    };
    result.make = byModel[result.model] ?? "";
  }

  // Trim/submodel hints
  const trimMatch = text.match(/\b(SP|SE|R Edition|Carbon|M package|Anniversary|Special|Limited|ABS)\b/);
  if (trimMatch && trimMatch[1] !== result.model) result.trim = trimMatch[1];

  // Mileage: "12,345 miles" / "12k miles"
  const mi = text.match(/([\d,]+)\s*(?:k\s*)?miles?/i);
  if (mi) {
    let n = parseInt(mi[1].replace(/,/g, ""), 10);
    if (/(\d+)\s*k\s*miles/i.test(text)) n *= 1000;
    if (n > 0 && n < 200000) result.mileage = n;
  }

  // Title
  if (/clean title/i.test(text)) result.titleStatus = "clean";
  else if (/salvage/i.test(text)) result.titleStatus = "salvage";
  else if (/rebuilt/i.test(text)) result.titleStatus = "rebuilt";
  else if (/bill of sale|bos only/i.test(text)) result.titleStatus = "bill-of-sale";
  else if (/no title/i.test(text)) result.titleStatus = "none";
  else if (/title (available|in hand|included|present)/i.test(text)) result.titleStatus = "clean";

  // Purchase price: "bought for $5,000" / "paid 5000" / "$5k"
  const price = text.match(/(?:bought|paid|purchase[d]?|won|got)(?:\s+(?:it|for|at))*\s*\$?\s*([\d,]+)(k)?/i)
    ?? text.match(/\$\s?([\d,]{3,7})(k)?\b/);
  if (price) {
    let n = parseInt(price[1].replace(/,/g, ""), 10);
    if (price[2]) n *= 1000;
    if (n >= 50 && n <= 100000) result.purchasePrice = n;
  }

  // Split clauses into damage vs aftermarket vs missing buckets.
  const clauses = text.split(/[,.;\n]/).map((c) => c.trim()).filter(Boolean);
  const damage: string[] = [];
  const aftermarket: string[] = [];
  const missing: string[] = [];
  for (const c of clauses) {
    if (/missing|gone|stripped|no\s+(engine|motor|wheels|forks|ecu|gauge|tank|fairings)/i.test(c)) missing.push(c);
    else if (AFTERMARKET_HINTS.test(c)) aftermarket.push(c);
    else if (DAMAGE_HINTS.test(c) || /\bgood\b|works|tested/i.test(c)) damage.push(c);
  }
  result.damageNotes = damage.join(", ");
  result.aftermarketNotes = aftermarket.join(", ");
  result.missingParts = missing
    .map((m) => m.replace(/missing|no\s+/gi, "").trim())
    .join(", ");

  const hits = [result.year, result.make, result.model].filter(Boolean).length;
  result.confidence = hits === 3 ? "high" : hits === 2 ? "medium" : "low";

  return result;
}
