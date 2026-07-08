/**
 * eBay research link + search term generation.
 *
 * Works with zero API keys: for every part we build good search terms,
 * terms to exclude, and ready-to-click eBay active & sold search URLs.
 * If EBAY_CLIENT_ID is ever added, the Browse API route (/api/ebay) can
 * fill activeCount/lowestActive automatically — same term structure.
 */

import { Bike } from "./types";

/** Sister-model confusion map: models that pollute search results. */
const CONFUSED_MODELS: Record<string, string[]> = {
  R1: ["R1M", "R6", "R7", "R3", "R125"],
  R1M: ["R1S", "R6", "R7"],
  R6: ["R1", "R7", "R3"],
  R7: ["R1", "R6", "R3"],
  "ZX-10R": ["ZX-6R", "ZX-14", "ZX-12"],
  ZX10R: ["ZX6R", "ZX14"],
  GSXR1000: ["GSXR600", "GSXR750", "Hayabusa"],
  "GSX-R1000": ["GSX-R600", "GSX-R750"],
  CBR1000RR: ["CBR600RR", "CBR500R", "CBR650"],
  S1000RR: ["S1000R", "S1000XR"],
  "Street Glide": ["Road Glide", "Electra Glide"],
  "Road Glide": ["Street Glide", "Road King"],
  Sportster: ["Softail", "Dyna"],
};

/** Model generation year ranges — parts interchange inside a generation. */
const GENERATIONS: { make: RegExp; model: RegExp; ranges: [number, number][] }[] = [
  { make: /yamaha/i, model: /^R1/i, ranges: [[2020, 2026], [2015, 2019], [2009, 2014], [2007, 2008], [2004, 2006]] },
  { make: /yamaha/i, model: /^R6/i, ranges: [[2017, 2020], [2008, 2016], [2006, 2007], [2003, 2005]] },
  { make: /kawasaki/i, model: /zx-?10/i, ranges: [[2021, 2026], [2016, 2020], [2011, 2015]] },
  { make: /suzuki/i, model: /gsx-?r? ?1000/i, ranges: [[2017, 2026], [2009, 2016], [2007, 2008]] },
  { make: /honda/i, model: /cbr ?1000/i, ranges: [[2021, 2026], [2017, 2020], [2012, 2016], [2008, 2011]] },
  { make: /bmw/i, model: /s ?1000 ?rr/i, ranges: [[2023, 2026], [2019, 2022], [2015, 2018], [2009, 2014]] },
];

/** Full display names help searches: "YZF-R1" for "R1" etc. */
const MODEL_EXPANSIONS: Record<string, string> = {
  R1: "YZF R1",
  R6: "YZF R6",
  R7: "YZF R7",
  "ZX-10R": "Ninja ZX10R",
  CBR1000RR: "CBR 1000RR Fireblade",
};

export interface SearchTermSet {
  terms: string[];
  avoid: string[];
  fitmentYears: string; // "2020-2026" generation range
}

/** Simplify a template part name into what people actually type on eBay. */
function searchNoun(partName: string): { noun: string; alt: string[]; avoid: string[] } {
  const n = partName.toLowerCase();
  if (n.startsWith("engine")) return { noun: "engine", alt: ["motor", "engine assembly"], avoid: ["stator only", "cover only", "engine cover", "mount", "gasket", "case only"] };
  if (n.includes("ecu")) return { noun: "ECU", alt: ["ECM", "computer"], avoid: ["flash", "flashing service", "mail-in"] };
  if (n.includes("gauge")) return { noun: "gauge cluster", alt: ["speedometer", "dash", "instrument cluster"], avoid: ["cover", "bracket", "screen protector"] };
  if (n.includes("front wheel")) return { noun: "front wheel", alt: ["front rim"], avoid: ["rear", "axle only", "spacer", "sticker"] };
  if (n.includes("rear wheel")) return { noun: "rear wheel", alt: ["rear rim"], avoid: ["front", "axle only", "sprocket only", "sticker"] };
  if (n.includes("fork")) return { noun: "front forks", alt: ["fork set", "front suspension"], avoid: ["seal", "seals", "spring only", "cap", "guard"] };
  if (n.includes("triple")) return { noun: "triple tree", alt: ["triple clamp", "yoke"], avoid: ["stem nut", "bearing only"] };
  if (n.includes("swingarm") && !n.includes("slider")) return { noun: "swingarm", alt: ["swing arm"], avoid: ["spool", "slider", "sticker", "stand"] };
  if (n.startsWith("frame")) return { noun: "frame", alt: ["main frame chassis"], avoid: ["slider", "sliders", "plug", "sticker", "subframe"] };
  if (n.includes("tank")) return { noun: "fuel tank", alt: ["gas tank"], avoid: ["pad", "grip", "cover", "cap only", "bra"] };
  if (n.includes("fairing")) return { noun: "fairing", alt: ["fairings set", "bodywork"], avoid: ["chinese", "unpainted", "bolt kit", "screen only"] };
  if (n.includes("subframe")) return { noun: "subframe", alt: ["rear subframe"], avoid: ["main frame"] };
  if (n.includes("caliper")) return { noun: "brake calipers", alt: ["front calipers"], avoid: ["rebuild kit", "seal kit", "pads only", "bracket"] };
  if (n.includes("rotor")) return { noun: "brake rotors", alt: ["brake discs"], avoid: ["bolts", "pads"] };
  if (n.includes("radiator")) return { noun: "radiator", alt: ["radiator OEM"], avoid: ["guard", "cap only", "hose", "fan only"] };
  if (n.includes("exhaust")) return { noun: "exhaust", alt: ["exhaust system", "headers"], avoid: ["gasket", "hanger", "shield only", "tip"] };
  if (n.includes("throttle bod")) return { noun: "throttle bodies", alt: ["throttle body"], avoid: ["cable", "grip", "tube"] };
  if (n.includes("airbox")) return { noun: "airbox", alt: ["air box"], avoid: ["filter only"] };
  if (n.includes("harness")) return { noun: "wiring harness", alt: ["wire harness", "main harness"], avoid: ["sub harness", "cut", "pigtail", "connector only"] };
  if (n.includes("hand controls") || n.includes("switchgear")) return { noun: "switch controls", alt: ["handlebar switch", "control switches"], avoid: [] };
  if (n.includes("clip-on") || n.includes("handlebar")) return { noun: "clip ons handlebars", alt: ["clip-on bars"], avoid: ["riser", "grips only", "end"] };
  if (n.includes("rearset")) return { noun: "rearsets", alt: ["rear sets", "foot pegs assembly"], avoid: ["peg only", "bracket only"] };
  if (n.includes("shock")) return { noun: "rear shock", alt: ["shock absorber"], avoid: ["spring only", "linkage only"] };
  if (n.includes("abs")) return { noun: "ABS pump", alt: ["ABS module", "ABS unit"], avoid: [] };
  if (n.includes("headlight")) return { noun: "headlight", alt: ["headlamp assembly"], avoid: ["bulb", "LED bulbs", "protector", "cover film"] };
  if (n.includes("tail light")) return { noun: "tail light", alt: ["taillight brake light"], avoid: ["bulb", "smoked lens film"] };
  if (n.includes("seat")) return { noun: "seat", alt: ["seats front rear"], avoid: ["cover", "cowl only", "bolt"] };
  if (n.includes("fuel pump")) return { noun: "fuel pump", alt: ["fuel pump assembly"], avoid: ["filter only", "relay"] };
  if (n.includes("clutch")) return { noun: "clutch", alt: ["clutch basket assembly"], avoid: ["lever", "cable", "cover only", "plates only"] };
  if (n.includes("stator")) return { noun: "stator", alt: ["generator stator"], avoid: ["cover only", "gasket"] };
  if (n.includes("rectifier")) return { noun: "rectifier regulator", alt: ["voltage regulator"], avoid: [] };
  if (n.includes("starter")) return { noun: "starter motor", alt: ["starter"], avoid: ["relay", "solenoid only", "clutch gear"] };
  if (n.includes("mirror") && !n.includes("block")) return { noun: "mirrors", alt: ["mirror set OEM"], avoid: ["block off", "extension"] };
  if (n.includes("saddlebag")) return { noun: "saddlebags", alt: ["hard bags"], avoid: ["liner", "lock only", "latch"] };
  if (n.includes("fender")) return { noun: "fender", alt: [], avoid: ["eliminator", "washer", "bolt"] };
  if (n.includes("transmission")) return { noun: "transmission", alt: ["gearbox"], avoid: ["fluid", "gasket"] };
  if (n.includes("primary")) return { noun: "primary", alt: ["primary complete"], avoid: ["fluid", "gasket", "cover only"] };
  if (n.includes("floorboard") || n.includes("foot controls")) return { noun: "foot controls", alt: ["floorboards forward controls"], avoid: [] };
  // Aftermarket lines: use the brand name verbatim.
  return { noun: partName.replace(/\(.*?\)/g, "").trim(), alt: [], avoid: [] };
}

/** Fitment year range for a bike's generation (fallback: year ±1). */
export function fitmentYears(bike: Pick<Bike, "year" | "make" | "model">): [number, number] {
  for (const g of GENERATIONS) {
    if (g.make.test(bike.make) && g.model.test(bike.model.replace(/\s/g, ""))) {
      const r = g.ranges.find(([a, b]) => bike.year >= a && bike.year <= b);
      if (r) return r;
    }
  }
  return [bike.year - 1, bike.year + 1];
}

export function buildSearchTerms(
  bike: Pick<Bike, "year" | "make" | "model">,
  partName: string,
  isAftermarket = false
): SearchTermSet {
  const { noun, alt, avoid } = searchNoun(partName);
  const [y0, y1] = fitmentYears(bike);
  const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
  const yearsStr = years.join(" ");
  const modelKey = bike.model.replace(/\s/g, "").toUpperCase();
  const expansion = MODEL_EXPANSIONS[bike.model] ?? MODEL_EXPANSIONS[modelKey];

  const terms: string[] = [];
  if (isAftermarket) {
    // Brand parts fit many bikes — lead with brand + part, then add fitment.
    terms.push(noun);
    terms.push(`${noun} ${bike.model}`);
    terms.push(`${noun} ${bike.make} ${bike.model}`);
  } else {
    terms.push(`${bike.year} ${bike.make} ${bike.model} ${noun}`);
    terms.push(`${yearsStr} ${bike.make} ${bike.model} ${alt[0] ?? noun}`);
    if (expansion) terms.push(`${bike.make} ${expansion} ${noun}`);
    for (const a of alt.slice(1)) terms.push(`${bike.make} ${bike.model} ${a}`);
  }

  const confused = CONFUSED_MODELS[bike.model] ?? CONFUSED_MODELS[modelKey] ?? [];
  const avoidAll = [...confused, ...avoid];

  return { terms: terms.filter(Boolean), avoid: avoidAll, fitmentYears: `${y0}-${y1}` };
}

/* ── URL builders ────────────────────────────────────────────────────── */

/**
 * eBay search URL. `sold` adds the Sold+Completed filter.
 * Excluded terms are baked into the query with eBay's minus syntax.
 */
export function ebayUrl(term: string, avoid: string[], sold: boolean): string {
  const minus = avoid
    .slice(0, 8) // keep URLs sane
    .map((a) => (a.includes(" ") ? `-(${a.replace(/\s+/g, ",")})` : `-${a}`))
    .join(" ");
  const q = encodeURIComponent(`${term} ${minus}`.trim());
  const base = `https://www.ebay.com/sch/i.html?_nkw=${q}&_sacat=6028`; // 6028 = eBay Motors parts
  return sold ? `${base}&LH_Sold=1&LH_Complete=1` : base;
}

export function ebayActiveUrl(term: string, avoid: string[]): string {
  return ebayUrl(term, avoid, false);
}

export function ebaySoldUrl(term: string, avoid: string[]): string {
  return ebayUrl(term, avoid, true);
}
