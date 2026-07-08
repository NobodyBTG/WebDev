"use client";

/**
 * Valuation report page — the full working report for one bike:
 * totals, buy recommendation, AI-style plain-English report, editable
 * parts table with research links, rankings, what-if buy prices, exports.
 */

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PartsTable } from "@/components/PartsTable";
import { Badge, Button, Card, CardTitle, Input, Select, Stat, recommendationTone, sellThroughTone } from "@/components/ui";
import {
  bikeTotals, effectivePrice, money, partNet, priorityScore, profitPerHour,
  rankParts, recommend, sellThroughLabel, sellThroughRate, wasteOfTime, RankKey,
} from "@/lib/calc";
import { deleteBike, duplicateBike, getBike, getSettings, saveBike } from "@/lib/db";
import { exportCsv, exportPdf } from "@/lib/exporters";
import { generateParts, uid } from "@/lib/partsEngine";
import { buildReport } from "@/lib/report";
import { buildSearchTerms } from "@/lib/search";
import { Bike, BikeStatus, Part, Settings } from "@/lib/types";

export default function BikePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [bike, setBike] = useState<Bike | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rankKey, setRankKey] = useState<RankKey>("priority");
  const [whatIf, setWhatIf] = useState<number[]>([]);

  useEffect(() => {
    const b = getBike(params.id);
    if (!b) { setNotFound(true); return; }
    setBike(b);
    setSettings(getSettings());
    setWhatIf([Math.round(b.purchasePrice * 0.7), b.purchasePrice, Math.round(b.purchasePrice * 1.3)]);
  }, [params.id]);

  function save(updated: Bike) {
    setBike(updated);
    saveBike(updated);
  }

  const totals = useMemo(() => (bike && settings ? bikeTotals(bike, settings) : null), [bike, settings]);
  const rec = useMemo(() => (bike && settings ? recommend(bike, settings) : null), [bike, settings]);
  const report = useMemo(() => (bike && settings ? buildReport(bike, settings) : null), [bike, settings]);

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-garage-400">Bike not found.</p>
        <Link href="/"><Button>Back to dashboard</Button></Link>
      </div>
    );
  }
  if (!bike || !settings || !totals || !rec || !report) {
    return <div className="py-20 text-center text-garage-500">Loading valuation…</div>;
  }

  const ranked = rankParts(bike.parts.filter((p) => p.include && effectivePrice(p, "quick") > 0), settings, rankKey);
  const waste = wasteOfTime(bike.parts, settings);
  const feePct = Math.round(settings.feeRate * 100);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {bike.year} {bike.make} {bike.model} {bike.trim}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-garage-500">
            <Badge tone={recommendationTone(rec.recommendation)} className="text-xs">{rec.recommendation}</Badge>
            <span>Paid {money(bike.purchasePrice)}</span>
            <span>· title: {bike.titleStatus}</span>
            {bike.mileage != null && <span>· {bike.mileage.toLocaleString()} mi</span>}
            <span>· {bike.parts.filter((p) => p.include).length} parts in play</span>
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Select
            className="w-auto"
            value={bike.status}
            onChange={(e) => save({ ...bike, status: e.target.value as BikeStatus })}
          >
            <option value="evaluating">Evaluating</option>
            <option value="purchased">Purchased</option>
            <option value="parting-out">Parting out</option>
            <option value="sold">Sold</option>
            <option value="passed">Passed</option>
          </Select>
          <Button onClick={() => exportCsv(bike, settings)}>CSV</Button>
          <Button onClick={() => exportPdf()}>PDF</Button>
          <Button onClick={() => { const c = duplicateBike(bike.id); if (c) router.push(`/bikes/${c.id}`); }}>
            Duplicate
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Delete this bike and its valuation?")) { deleteBike(bike.id); router.push("/"); }
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ── Money tiles ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <Stat label="Gross (patient)" value={money(totals.grossAvg)} sub={`${money(totals.grossLow)} low end`} />
        <Stat label="Gross (quick-sale)" value={money(totals.grossQuick)} tone="accent" />
        <Stat label={`Net after ${feePct}%`} value={money(totals.netQuick)} sub={`${money(totals.netAvg)} patient`} />
        <Stat
          label="Profit (before labor)"
          value={money(totals.profitQuick)}
          tone={totals.profitQuick >= 0 ? "profit" : "loss"}
          sub={`${money(totals.profitQuickAfterLabor)} after ${Math.round(totals.laborHoursTotal)}h labor`}
        />
        <Stat label="ROI" value={`${Math.round(totals.roiQuick * 100)}%`} tone={totals.roiQuick > 0.5 ? "profit" : totals.roiQuick > 0 ? "caution" : "loss"} />
        <Stat label="Break-even gross" value={money(totals.breakEven)} sub="sales needed to cover cash out" />
        <Stat label="Safe max buy" value={money(totals.safeMaxBuy)} tone="accent" sub={`bid range ${report.maxBid}`} />
      </div>

      {/* ── Recommendation + report ────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle>Buy Call</CardTitle>
          <div className="mb-2">
            <Badge tone={recommendationTone(rec.recommendation)} className="px-2 py-1 text-sm">
              {rec.recommendation}
            </Badge>
          </div>
          <ul className="space-y-2 text-sm text-garage-300">
            {rec.reasons.map((r, i) => (
              <li key={i} className="flex gap-2"><span className="text-accent">▸</span>{r}</li>
            ))}
          </ul>
          <div className="mt-3 border-t border-garage-700 pt-3 text-sm">
            <span className="text-garage-500">Suggested max bid: </span>
            <span className="font-mono font-bold text-accent">{report.maxBid}</span>
          </div>
          <div className="mt-3 border-t border-garage-700 pt-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">Risk read</div>
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={totals.avgSellThrough >= 0.5 ? "green" : totals.avgSellThrough >= 0.2 ? "yellow" : "red"}>
                sell-through {totals.avgSellThrough}
              </Badge>
              <Badge tone={totals.slowValueShare >= 40 ? "red" : totals.slowValueShare >= 25 ? "yellow" : "green"}>
                {totals.slowValueShare}% slow-mover value
              </Badge>
              <Badge tone="gray">~{totals.monthsToLiquidate} mo to liquidate</Badge>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Part-Out Report</CardTitle>
          <div className="space-y-3 text-sm leading-relaxed text-garage-300">
            {report.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {report.valueKillers.length > 0 && (
            <div className="mt-3 text-sm">
              <span className="font-semibold text-loss">Value killers: </span>
              {report.valueKillers.join(" · ")}
            </div>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">Top money parts</div>
              <ol className="space-y-1 text-sm">
                {report.topParts.map((p, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="text-white">{i + 1}. {p.name}</span>
                    <span className="whitespace-nowrap font-mono text-xs text-garage-400">{p.note}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">Listing strategy</div>
              <ul className="space-y-1 text-sm text-garage-300">
                {report.strategy.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent">▸</span>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <details className="mt-4 text-xs text-garage-500">
            <summary className="cursor-pointer font-semibold uppercase tracking-wider">Assumptions</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {report.assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </details>
        </Card>
      </div>

      {/* ── What-if purchase prices ────────────────────────────────── */}
      <Card className="no-print">
        <CardTitle>Compare purchase prices</CardTitle>
        <div className="flex flex-wrap items-end gap-4">
          {whatIf.map((price, i) => {
            const profit = totals.netQuick - price - totals.fixedCosts;
            const roi = price + totals.fixedCosts > 0 ? profit / (price + totals.fixedCosts) : 0;
            return (
              <div key={i} className="min-w-[140px]">
                <label className="text-[11px] font-medium text-garage-500">Buy at</label>
                <Input
                  type="number"
                  className="mb-1 font-mono"
                  value={price}
                  onChange={(e) => setWhatIf(whatIf.map((w, j) => (j === i ? parseFloat(e.target.value) || 0 : w)))}
                />
                <div className={`font-mono text-lg font-bold ${profit >= 0 ? "text-profit" : "text-loss"}`}>
                  {money(profit)}
                </div>
                <div className="text-xs text-garage-500">{Math.round(roi * 100)}% ROI · quick-sale, pre-labor</div>
              </div>
            );
          })}
          <Button variant="ghost" onClick={() => setWhatIf([...whatIf, totals.safeMaxBuy])}>+ column</Button>
        </div>
      </Card>

      {/* ── Parts table ────────────────────────────────────────────── */}
      <div>
        <div className="no-print mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-white">Parts ({bike.parts.length})</h2>
            <p className="text-xs text-garage-500">
              Click a row to open research links + manual market entry. Edits save automatically and update every total.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const name = prompt("Part name?");
                if (!name) return;
                const st = buildSearchTerms(bike, name);
                const part: Part = {
                  id: uid(), name, group: "Custom", condition: "good", isAftermarket: false,
                  priceLow: 0, priceAvg: 0, priceQuick: 0, priceListing: 0, conditionMultiplier: 1,
                  activeCount: 0, soldCount90: 0, lowestActive: 0, highestSold: 0, avgSold: 0,
                  marketDataSource: "manual", estDaysToSell: 21, shipDifficulty: 2, laborHours: 0.5,
                  worthListing: true, include: true, notes: "",
                  searchTerms: st.terms, avoidTerms: st.avoid,
                };
                save({ ...bike, parts: [...bike.parts, part] });
              }}
            >
              + Add part
            </Button>
            <Button
              onClick={() => {
                if (!confirm("Regenerate the parts list from the bike details? Manual edits to parts will be lost.")) return;
                const gen = generateParts(bike, settings.quickSaleDiscount);
                save({ ...bike, parts: gen.parts });
              }}
            >
              ↻ Regenerate
            </Button>
          </div>
        </div>
        <PartsTable parts={bike.parts} settings={settings} onChange={(parts) => save({ ...bike, parts })} />
      </div>

      {/* ── Rankings ───────────────────────────────────────────────── */}
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="mb-0">Pull order / rankings</CardTitle>
          <div className="no-print flex flex-wrap gap-1">
            {([
              ["priority", "Priority"],
              ["value", "Highest value"],
              ["sellThrough", "Fastest sell-through"],
              ["profitPerHour", "Best $/hr"],
              ["easiestShip", "Easiest to ship"],
            ] as [RankKey, string][]).map(([k, label]) => (
              <Button
                key={k}
                variant={rankKey === k ? "primary" : "ghost"}
                className="px-2.5 py-1 text-xs"
                onClick={() => setRankKey(k)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Part</th><th className="text-right">Quick $</th><th className="text-right">Active</th>
                <th className="text-right">Sold 90d</th><th>Sell-Through</th><th className="text-right">Net</th>
                <th className="text-right">$/hr</th><th>Ship</th><th className="text-right">Priority</th>
              </tr>
            </thead>
            <tbody>
              {ranked.slice(0, 12).map((p, i) => {
                const stInfo = sellThroughLabel(sellThroughRate(p));
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-garage-500">{i + 1}</td>
                    <td className="font-medium text-white">{p.name}</td>
                    <td className="text-right font-mono">{money(effectivePrice(p, "quick"))}</td>
                    <td className="text-right font-mono">{p.activeCount}</td>
                    <td className="text-right font-mono">{p.soldCount90}</td>
                    <td><Badge tone={sellThroughTone(stInfo.tone)}>{sellThroughRate(p).toFixed(2)}</Badge></td>
                    <td className="text-right font-mono text-profit">{money(partNet(p, settings))}</td>
                    <td className="text-right font-mono">${profitPerHour(p, settings)}</td>
                    <td className="font-mono text-garage-400">{"▮".repeat(p.shipDifficulty)}{"▯".repeat(5 - p.shipDifficulty)}</td>
                    <td className="text-right font-mono text-accent">{priorityScore(p, settings)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {waste.length > 0 && (
          <div className="mt-3 rounded-md border border-caution/30 bg-caution/5 px-3 py-2 text-sm">
            <span className="font-semibold text-caution">Don&apos;t waste time on: </span>
            <span className="text-garage-300">
              {waste.map((p) => p.name).join(" · ")}
            </span>
            <span className="text-garage-500"> — bundle into lots, sell locally, or scrap.</span>
          </div>
        )}
      </Card>

      {/* ── Fee / cost breakdown ───────────────────────────────────── */}
      <Card>
        <CardTitle>Fees &amp; costs breakdown (quick-sale scenario)</CardTitle>
        <div className="grid gap-x-8 gap-y-1 text-sm md:grid-cols-2">
          <Row label="Gross (quick-sale)" value={money(totals.grossQuick)} />
          <Row label={`eBay/payment/promoted/returns loss (${feePct}%)`} value={`− ${money(totals.grossQuick * settings.feeRate)}`} negative />
          <Row label="Shipping materials" value={`− ${money(totals.grossQuick > 0 ? totals.grossQuick - totals.netQuick - totals.grossQuick * settings.feeRate : 0)}`} negative />
          <Row label="Net proceeds" value={money(totals.netQuick)} bold />
          <Row label="Purchase price" value={`− ${money(bike.purchasePrice)}`} negative />
          <Row label="Title / transport / storage" value={`− ${money(totals.fixedCosts)}`} negative />
          <Row label="Profit before labor" value={money(totals.profitQuick)} bold tone={totals.profitQuick >= 0 ? "profit" : "loss"} />
          <Row label={`Labor (${Math.round(totals.laborHoursTotal)}h × ${money(settings.laborRatePerHour)})`} value={`− ${money(totals.laborCost)}`} negative />
          <Row label="Profit after labor" value={money(totals.profitQuickAfterLabor)} bold tone={totals.profitQuickAfterLabor >= 0 ? "profit" : "loss"} />
        </div>
        <p className="no-print mt-3 text-xs text-garage-500">
          Fee percentage and labor rate are editable in <Link className="text-accent hover:underline" href="/settings">Settings</Link>.
        </p>
      </Card>
    </div>
  );
}

function Row({ label, value, negative, bold, tone }: { label: string; value: string; negative?: boolean; bold?: boolean; tone?: "profit" | "loss" }) {
  return (
    <div className={`flex justify-between border-b border-garage-800 py-1 ${bold ? "font-semibold text-white" : ""}`}>
      <span className="text-garage-400">{label}</span>
      <span className={`font-mono ${tone === "profit" ? "text-profit" : tone === "loss" ? "text-loss" : negative ? "text-garage-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}
