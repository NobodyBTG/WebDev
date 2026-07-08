/**
 * Report export: CSV download (parts table + totals) and PDF via the
 * browser print dialog (the bike page has a print stylesheet).
 */

import { Bike, Settings } from "./types";
import { bikeTotals, effectivePrice, partNet, profitPerHour, sellThroughRate, money } from "./calc";

export function exportCsv(bike: Bike, s: Settings): void {
  const t = bikeTotals(bike, s);
  const rows: string[][] = [
    ["Part", "Group", "Condition", "Low", "Avg", "Quick", "List", "Active", "Sold 90d", "Sell-Through", "Net (quick)", "$/hr", "Ship Difficulty", "Labor hrs", "Days to Sell", "Include", "Notes"],
    ...bike.parts.map((p) => [
      p.name, p.group, p.condition,
      String(p.priceLow), String(p.priceAvg), String(p.priceQuick), String(p.priceListing),
      String(p.activeCount), String(p.soldCount90),
      sellThroughRate(p).toFixed(2),
      String(Math.round(partNet(p, s))),
      String(profitPerHour(p, s)),
      String(p.shipDifficulty), String(p.laborHours), String(p.estDaysToSell),
      p.include ? "yes" : "no",
      p.notes,
    ]),
    [],
    ["TOTALS"],
    ["Gross (avg pricing)", String(Math.round(t.grossAvg))],
    ["Gross (quick-sale)", String(Math.round(t.grossQuick))],
    [`Net after ${Math.round(s.feeRate * 100)}% (quick)`, String(Math.round(t.netQuick))],
    ["Purchase price", String(bike.purchasePrice)],
    ["Fixed costs (title/transport/storage)", String(Math.round(t.fixedCosts))],
    ["Profit (quick, before labor)", String(Math.round(t.profitQuick))],
    ["Profit (quick, after labor)", String(Math.round(t.profitQuickAfterLabor))],
    ["ROI", `${Math.round(t.roiQuick * 100)}%`],
    ["Break-even gross", String(Math.round(t.breakEven))],
    ["Safe max buy", String(t.safeMaxBuy)],
  ];

  const csv = rows
    .map((r) => r.map((c) => (/[",\n]/.test(c ?? "") ? `"${(c ?? "").replace(/"/g, '""')}"` : c ?? "")).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${bike.year}-${bike.make}-${bike.model}-partout.csv`.replace(/\s+/g, "-").toLowerCase();
  a.click();
  URL.revokeObjectURL(url);
}

/** PDF export = print dialog; the bike page carries print CSS. */
export function exportPdf(): void {
  window.print();
}

export { money, effectivePrice };
