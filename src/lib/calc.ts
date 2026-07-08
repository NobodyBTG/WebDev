/**
 * All money math lives here so every page shows identical numbers.
 *
 * Core assumptions (all user-editable in Settings):
 *   - feeRate 0.35: eBay final value + payment + promoted + returns/shipping loss
 *   - quick-sale price ≈ avg sold price − 25%
 *   - net = gross × (1 − feeRate) − shipping materials − labor (optional view)
 */

import { Bike, Part, Recommendation, Settings } from "./types";

/* ── Per-part derived numbers ────────────────────────────────────────── */

export function sellThroughRate(p: Pick<Part, "soldCount90" | "activeCount">): number {
  if (p.activeCount <= 0) return p.soldCount90 > 0 ? 2 : 0; // no competition + sales = very strong
  return p.soldCount90 / p.activeCount;
}

export function sellThroughLabel(r: number): { label: string; tone: "strong" | "good" | "ok" | "slow" } {
  if (r >= 1.0) return { label: "Very strong", tone: "strong" };
  if (r >= 0.5) return { label: "Good", tone: "good" };
  if (r >= 0.2) return { label: "Okay", tone: "ok" };
  return { label: "Slow mover", tone: "slow" };
}

/** 0-100. High = lots of competing listings relative to demand. */
export function competitionLevel(p: Part): number {
  const st = sellThroughRate(p);
  const crowd = Math.min(p.activeCount / 15, 1); // 15+ actives = fully crowded
  const starve = st < 0.3 ? 0.3 : 0;
  return Math.round(Math.min(1, crowd * 0.7 + starve + (st < 0.15 ? 0.2 : 0)) * 100);
}

export function isFlooded(p: Part): boolean {
  return p.activeCount >= 12 && sellThroughRate(p) < 0.5;
}

/** 0-100 demand score from sold velocity. */
export function demandScore(p: Part): number {
  return Math.round(Math.min(1, p.soldCount90 / 12) * 100);
}

/** 0-100. How fast this converts to cash (sell-through + days to sell). */
export function liquidityScore(p: Part): number {
  const st = Math.min(sellThroughRate(p), 1.5) / 1.5;
  const speed = p.estDaysToSell > 0 ? Math.max(0, 1 - p.estDaysToSell / 60) : 0;
  return Math.round((st * 0.6 + speed * 0.4) * 100);
}

/** 0-100. Risk of sitting on it / eating shipping problems. */
export function riskScore(p: Part): number {
  const st = sellThroughRate(p);
  const stRisk = st >= 1 ? 0 : st >= 0.5 ? 0.2 : st >= 0.2 ? 0.5 : 0.9;
  const shipRisk = (p.shipDifficulty - 1) / 4;
  return Math.round((stRisk * 0.7 + shipRisk * 0.3) * 100);
}

/** Suggested list price: undercut the lowest active comp slightly, else avg. */
export function suggestedListing(p: Part): number {
  if (p.lowestActive > 0) {
    const beat = Math.floor(p.lowestActive * 0.97);
    // Never suggest below quick price — that's leaving money on the table.
    return Math.max(beat, Math.min(p.priceQuick, beat));
  }
  return p.priceAvg;
}

export function partNet(p: Part, s: Settings, price?: number): number {
  const gross = price ?? p.priceQuick;
  return Math.max(0, gross * (1 - s.feeRate) - s.shippingMaterialsPerPart);
}

/** $/hour of labor at quick-sale pricing — the "pull order" metric. */
export function profitPerHour(p: Part, s: Settings): number {
  const net = partNet(p, s);
  const hours = Math.max(p.laborHours, 0.1);
  return Math.round(net / hours);
}

export function effectivePrice(p: Part, kind: "avg" | "quick" | "low" | "listing"): number {
  if (!p.include || p.condition === "missing" || p.condition === "damaged") return 0;
  switch (kind) {
    case "avg": return p.priceAvg;
    case "quick": return p.priceQuick;
    case "low": return p.priceLow;
    case "listing": return p.priceListing || suggestedListing(p);
  }
}

/* ── Bike-level totals ───────────────────────────────────────────────── */

export interface BikeTotals {
  grossAvg: number; // full part-out at average prices
  grossLow: number;
  grossQuick: number; // realistic fast-sale gross
  netQuick: number; // after fee rate + materials
  netAvg: number;
  laborHoursTotal: number;
  laborCost: number;
  fixedCosts: number; // title + transport + storage estimate
  profitQuick: number; // netQuick − purchase − fixed (labor shown separately)
  profitAvg: number;
  profitQuickAfterLabor: number;
  roiQuick: number; // profitQuick / totalInvested
  breakEven: number; // gross sales needed to cover all cash out
  safeMaxBuy: number; // price that still leaves ~30% margin on quick net
  avgSellThrough: number; // value-weighted
  slowValueShare: number; // % of value in slow movers (st < 0.2)
  monthsToLiquidate: number;
  partCount: number;
  listedCount: number;
}

export function bikeTotals(bike: Bike, s: Settings): BikeTotals {
  const parts = bike.parts.filter((p) => p.include && p.worthListing);
  const grossAvg = sum(parts.map((p) => effectivePrice(p, "avg")));
  const grossLow = sum(parts.map((p) => effectivePrice(p, "low")));
  const grossQuick = sum(parts.map((p) => effectivePrice(p, "quick")));

  const materials = parts.filter((p) => effectivePrice(p, "quick") > 0).length * s.shippingMaterialsPerPart;
  const netQuick = grossQuick * (1 - s.feeRate) - materials;
  const netAvg = grossAvg * (1 - s.feeRate) - materials;

  const laborHoursTotal = bike.estLaborHours > 0 ? bike.estLaborHours : sum(parts.map((p) => p.laborHours));
  const laborCost = laborHoursTotal * s.laborRatePerHour;

  const sellableParts = parts.filter((p) => effectivePrice(p, "quick") > 0);
  const daysToClear = sellableParts.length ? Math.max(...sellableParts.map((p) => p.estDaysToSell)) : 0;
  const monthsToLiquidate = Math.max(1, Math.ceil(daysToClear / 30));
  const storageEst = monthsToLiquidate * s.storageCostPerMonth;

  const fixedCosts = (bike.titleCost || 0) + (bike.transportCost || 0) + storageEst;

  const profitQuick = netQuick - bike.purchasePrice - fixedCosts;
  const profitAvg = netAvg - bike.purchasePrice - fixedCosts;
  const profitQuickAfterLabor = profitQuick - laborCost;

  const invested = bike.purchasePrice + fixedCosts;
  const roiQuick = invested > 0 ? profitQuick / invested : 0;

  // Gross sales needed so that net covers purchase + fixed costs.
  const breakEven = (bike.purchasePrice + fixedCosts + materials) / (1 - s.feeRate);

  // Max buy: quick net minus fixed costs, keep 30% margin cushion.
  const safeMaxBuy = Math.max(0, Math.floor((netQuick - fixedCosts) * 0.7 / 50) * 50);

  // Value-weighted sell-through and slow-mover share.
  let wSt = 0;
  let slowValue = 0;
  const totalV = grossQuick || 1;
  for (const p of sellableParts) {
    const v = effectivePrice(p, "quick");
    const st = Math.min(sellThroughRate(p), 2);
    wSt += st * (v / totalV);
    if (sellThroughRate(p) < 0.2) slowValue += v;
  }

  return {
    grossAvg, grossLow, grossQuick, netQuick, netAvg,
    laborHoursTotal, laborCost, fixedCosts,
    profitQuick, profitAvg, profitQuickAfterLabor,
    roiQuick, breakEven, safeMaxBuy,
    avgSellThrough: Math.round(wSt * 100) / 100,
    slowValueShare: Math.round((slowValue / totalV) * 100),
    monthsToLiquidate,
    partCount: bike.parts.length,
    listedCount: parts.length,
  };
}

/* ── Purchase recommendation ─────────────────────────────────────────── */

export interface RecommendationResult {
  recommendation: Recommendation;
  reasons: string[];
  maxBidLow: number;
  maxBidHigh: number;
}

export function recommend(bike: Bike, s: Settings): RecommendationResult {
  const t = bikeTotals(bike, s);
  const reasons: string[] = [];

  const keyPartNames = /engine|frame|ecu|gauge|fairing/i;
  const deadKeyParts = bike.parts.filter(
    (p) => keyPartNames.test(p.name) && !p.isAftermarket && (p.condition === "damaged" || p.condition === "missing")
  );

  // Project-flip compare: what selling it whole (titled) nets vs parting out.
  const projectNet = bike.projectResaleValue > 0
    ? bike.projectResaleValue * 0.9 - bike.purchasePrice // ~10% selling friction, no teardown labor
    : 0;

  const maxBidHigh = t.safeMaxBuy;
  const maxBidLow = Math.max(0, Math.floor(maxBidHigh * 0.8 / 50) * 50);

  let rec: Recommendation;

  if (deadKeyParts.length >= 3) {
    rec = "Avoid";
    reasons.push(`${deadKeyParts.length} key money parts are dead (${deadKeyParts.map((p) => p.name.split("(")[0].trim()).join(", ")}) — the carcass value doesn't cover the work.`);
  } else if (projectNet > t.profitQuick && projectNet > 500 && bike.titleStatus !== "none") {
    rec = "Better to Sell as Project";
    reasons.push(`Selling whole nets ~$${fmt(projectNet)} vs ~$${fmt(t.profitQuick)} parting out — with zero teardown labor and one sale instead of ${t.listedCount}.`);
  } else if (t.profitQuick > 2000 && t.avgSellThrough >= 0.5 && t.slowValueShare < 40 && deadKeyParts.length === 0) {
    rec = "Strong Buy";
    reasons.push(`Quick-sale profit ~$${fmt(t.profitQuick)} at ${Math.round(t.roiQuick * 100)}% ROI with healthy sell-through (${t.avgSellThrough}).`);
  } else if (t.profitQuick > 800 && t.slowValueShare >= 40) {
    rec = "Buy Only Cheap";
    reasons.push(`${t.slowValueShare}% of the value sits in slow movers — profit is real but the cash comes in slowly. Only worth it below $${fmt(maxBidLow)}.`);
  } else if (t.profitQuick > 800) {
    rec = deadKeyParts.length > 0 ? "Buy Only Cheap" : "Strong Buy";
    if (deadKeyParts.length > 0) {
      reasons.push(`Profitable, but ${deadKeyParts.map((p) => p.name.split("(")[0].trim()).join(" + ")} being dead caps the upside — pay accordingly.`);
    } else {
      reasons.push(`Quick-sale profit ~$${fmt(t.profitQuick)} at ${Math.round(t.roiQuick * 100)}% ROI.`);
    }
  } else if (t.profitQuick > 0) {
    rec = "Borderline";
    reasons.push(`Only ~$${fmt(t.profitQuick)} quick-sale profit before labor — one surprise (seized engine, cracked frame) puts you underwater.`);
  } else {
    rec = "Avoid";
    reasons.push(`Quick-sale net $${fmt(t.netQuick)} doesn't cover the $${fmt(bike.purchasePrice)} buy-in plus costs. You'd be $${fmt(-t.profitQuick)} in the hole.`);
  }

  if (deadKeyParts.length > 0 && rec !== "Avoid") {
    reasons.push(`Value killers: ${deadKeyParts.map((p) => p.name).join(", ")}.`);
  }
  if (t.avgSellThrough < 0.3 && rec !== "Avoid") {
    reasons.push("Overall sell-through is weak — expect months of storage, not weeks.");
  }
  if (bike.titleStatus === "none") {
    reasons.push("No title: frame is near-worthless and project-flip exit is off the table.");
  }

  return { recommendation: rec, reasons, maxBidLow, maxBidHigh };
}

/* ── Ranking ─────────────────────────────────────────────────────────── */

export type RankKey = "value" | "sellThrough" | "profitPerHour" | "easiestShip" | "priority";

/** Priority = pull-order score blending value, liquidity and labor cost. */
export function priorityScore(p: Part, s: Settings): number {
  const value = effectivePrice(p, "quick");
  if (value <= 0) return 0;
  const pph = profitPerHour(p, s);
  const liq = liquidityScore(p) / 100;
  return Math.round(value * 0.4 + pph * 2 * 0.35 + value * liq * 0.25);
}

export function rankParts(parts: Part[], s: Settings, key: RankKey): Part[] {
  const sorted = [...parts];
  const val = (p: Part) => effectivePrice(p, "quick");
  switch (key) {
    case "value": sorted.sort((a, b) => val(b) - val(a)); break;
    case "sellThrough": sorted.sort((a, b) => sellThroughRate(b) - sellThroughRate(a)); break;
    case "profitPerHour": sorted.sort((a, b) => profitPerHour(b, s) - profitPerHour(a, s)); break;
    case "easiestShip": sorted.sort((a, b) => a.shipDifficulty - b.shipDifficulty || val(b) - val(a)); break;
    case "priority": sorted.sort((a, b) => priorityScore(b, s) - priorityScore(a, s)); break;
  }
  return sorted;
}

/** Parts not worth the time: low value or dead sell-through. */
export function wasteOfTime(parts: Part[], s: Settings): Part[] {
  return parts.filter(
    (p) => p.include && effectivePrice(p, "quick") > 0 &&
      (partNet(p, s) < 25 || (sellThroughRate(p) < 0.15 && effectivePrice(p, "quick") < 100))
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

export function sum(ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function money(n: number): string {
  return `$${fmt(n)}`;
}
