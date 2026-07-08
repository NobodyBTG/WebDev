/**
 * Plain-English valuation report generator.
 *
 * Writes the way an experienced part-out buyer talks: conservative numbers,
 * quick-sale bias, explicit warnings about slow movers and value killers.
 * Works fully offline; if an AI key is configured the /api/ai/report route
 * can rewrite/extend this draft, but the numbers always come from calc.ts.
 */

import { Bike, Settings } from "./types";
import {
  bikeTotals, recommend, rankParts, wasteOfTime,
  sellThroughRate, money, fmt, effectivePrice, profitPerHour,
} from "./calc";

export interface ReportData {
  headline: string;
  paragraphs: string[];
  topParts: { name: string; quick: number; note: string }[];
  valueKillers: string[];
  assumptions: string[];
  maxBid: string;
  strategy: string[];
  recommendation: string;
  reasons: string[];
}

export function buildReport(bike: Bike, s: Settings): ReportData {
  const t = bikeTotals(bike, s);
  const rec = recommend(bike, s);
  const byValue = rankParts(bike.parts, s, "value").filter((p) => effectivePrice(p, "quick") > 0);
  const top5 = byValue.slice(0, 5);
  const dead = bike.parts.filter((p) => p.condition === "damaged" || p.condition === "missing");
  const slow = bike.parts.filter((p) => p.include && effectivePrice(p, "quick") > 100 && sellThroughRate(p) < 0.3);
  const waste = wasteOfTime(bike.parts, s);

  const bikeName = `${bike.year} ${bike.make} ${bike.model}${bike.trim ? " " + bike.trim : ""}`;

  const paragraphs: string[] = [];

  // Opening: honest read on the deal.
  const profitTone =
    t.profitQuick > 3000 ? "looks strongly profitable" :
    t.profitQuick > 1500 ? "looks profitable but not a home run" :
    t.profitQuick > 0 ? "is thin — workable only if nothing surprises you" :
    "does not pencil out at this buy-in";
  const deadNote = dead.length
    ? ` The deal is weaker than it first appears because ${listNames(dead.slice(0, 3))} ${dead.length === 1 ? "is" : "are"} dead value.`
    : "";
  paragraphs.push(
    `Based on the current parts market, this ${bikeName} ${profitTone} at a ${money(bike.purchasePrice)} buy-in.${deadNote}` +
    (top5.length ? ` Most of the money is in the ${listNames(top5.slice(0, 4))}.` : "")
  );

  // Numbers paragraph — ranges, quick-sale bias.
  paragraphs.push(
    `Estimated gross part-out value is ${money(t.grossLow)}–${money(t.grossAvg)} at patient pricing. ` +
    `Quick-sale value is closer to ${money(t.grossQuick)}. After the ${Math.round(s.feeRate * 100)}% eBay/fee/shipping-loss haircut, ` +
    `realistic net is about ${money(t.netQuick)} fast or ${money(t.netAvg)} patient — before labor (~${Math.round(t.laborHoursTotal)} hrs) ` +
    `and ${money(t.fixedCosts)} in title/transport/storage. That puts quick-sale profit at roughly ${money(t.profitQuick)} ` +
    `(${Math.round(t.roiQuick * 100)}% ROI), or ${money(t.profitQuickAfterLabor)} if you pay yourself ${money(s.laborRatePerHour)}/hr.`
  );

  // Sell-through / cash-flow reality.
  if (slow.length > 0 || t.slowValueShare >= 30) {
    paragraphs.push(
      `Watch the slow movers: ${t.slowValueShare}% of the value is in parts with weak sell-through` +
      (slow.length ? ` (${listNames(slow.slice(0, 3))})` : "") +
      `. Plan on roughly ${t.monthsToLiquidate} month${t.monthsToLiquidate > 1 ? "s" : ""} to move the bulk of it — price the big slow items at quick-sale numbers from day one instead of chasing top dollar.`
    );
  } else {
    paragraphs.push(
      `Sell-through across the sellable parts is healthy (weighted ${t.avgSellThrough}). At quick-sale pricing most of the cash should land inside ${t.monthsToLiquidate} month${t.monthsToLiquidate > 1 ? "s" : ""}.`
    );
  }

  // Project-flip comparison.
  if (bike.projectResaleValue > 0 && bike.titleStatus !== "none") {
    const projectNet = bike.projectResaleValue * 0.9 - bike.purchasePrice;
    paragraphs.push(
      projectNet > t.profitQuick
        ? `Listing it as a titled project at ${money(bike.projectResaleValue)} likely nets ${money(projectNet)} — more than parting out, with one sale and zero teardown. That's the smarter exit unless you want the inventory.`
        : `A whole-bike flip at ${money(bike.projectResaleValue)} nets about ${money(projectNet)} — parting out beats it by ${money(t.profitQuick - projectNet)}, so the teardown is worth the labor if you have the space.`
    );
  }

  const assumptions = [
    `${Math.round(s.feeRate * 100)}% total loss to eBay fees, payment processing, promoted listings, returns and shipping variance.`,
    `Quick-sale price = average sold price minus ${Math.round(s.quickSaleDiscount * 100)}%.`,
    `${money(s.shippingMaterialsPerPart)}/part packing materials; storage ${money(s.storageCostPerMonth)}/mo for ~${t.monthsToLiquidate} mo.`,
    `Damaged and missing parts counted at $0 — inspection can only move numbers up.`,
    bike.mileage != null ? `Mileage ${fmt(bike.mileage)} mi factored into engine/drivetrain pricing.` : "Mileage unknown — engine priced with an untested discount.",
    `Market counts are estimates until you click the research links and enter real active/sold numbers.`,
  ];

  const strategy: string[] = [
    `List the top ${Math.min(5, top5.length)} money parts the same week you get the bike — they fund the whole deal.`,
    `Match or slightly undercut the lowest active competitor on anything you want gone in under two weeks.`,
  ];
  if (waste.length) {
    strategy.push(`Don't burn hours on: ${listNames(waste.slice(0, 4))} — bundle them into lots or scrap them.`);
  }
  if (bike.parts.some((p) => p.isAftermarket)) {
    strategy.push(`Aftermarket parts (${listNames(bike.parts.filter((p) => p.isAftermarket).slice(0, 4))}) sell to a different buyer than OEM — list them separately with the brand name first in the title.`);
  }
  const heavies = bike.parts.filter((p) => p.include && p.shipDifficulty >= 5 && effectivePrice(p, "quick") > 0);
  if (heavies.length) {
    strategy.push(`${listNames(heavies)}: offer local pickup + freight-quote-on-request rather than flat-rate shipping — freight surprises are where the 35% loss estimate blows up.`);
  }

  return {
    headline: `${bikeName} — ${rec.recommendation}`,
    paragraphs,
    topParts: top5.map((p) => ({
      name: p.name,
      quick: effectivePrice(p, "quick"),
      note: `${money(effectivePrice(p, "quick"))} quick / ${money(effectivePrice(p, "avg"))} patient · ~$${profitPerHour(p, s)}/hr`,
    })),
    valueKillers: dead.map((p) => `${p.name} (${p.condition})`),
    assumptions,
    maxBid: `${money(rec.maxBidLow)}–${money(rec.maxBidHigh)}`,
    strategy,
    recommendation: rec.recommendation,
    reasons: rec.reasons,
  };
}

function listNames(parts: { name: string }[]): string {
  const names = parts.map((p) => p.name.split("(")[0].trim().toLowerCase());
  if (names.length <= 1) return names.join("");
  return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}
