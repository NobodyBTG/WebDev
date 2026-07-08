"use client";

/**
 * Editable parts table — the working surface of a valuation.
 *
 * Every price/count cell edits in place and totals update instantly.
 * Each row expands to show research links (active/sold eBay searches),
 * suggested + avoid search terms, and manual market-data entry.
 */

import { clsx } from "clsx";
import { useState } from "react";
import { Badge, Button, Input, Select, sellThroughTone } from "@/components/ui";
import {
  competitionLevel, demandScore, isFlooded, liquidityScore, money, partNet,
  profitPerHour, riskScore, sellThroughLabel, sellThroughRate, suggestedListing,
} from "@/lib/calc";
import { ebayActiveUrl, ebaySoldUrl } from "@/lib/search";
import { Part, PartCondition, Settings, ShipDifficulty } from "@/lib/types";
import { CONDITION_MULTIPLIER } from "@/lib/partsEngine";

const CONDITIONS: PartCondition[] = ["good", "unknown", "damaged", "missing", "aftermarket"];

export function PartsTable({
  parts,
  settings,
  onChange,
}: {
  parts: Part[];
  settings: Settings;
  onChange: (parts: Part[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);

  function update(id: string, patch: Partial<Part>) {
    onChange(parts.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  /** Condition change re-applies the standard multiplier to estimated prices. */
  function setCondition(p: Part, condition: PartCondition) {
    const oldMult = p.conditionMultiplier || 1;
    const newMult = CONDITION_MULTIPLIER[condition];
    const rescale = (n: number) => (oldMult > 0 ? Math.round((n / oldMult) * newMult / 5) * 5 : 0);
    update(p.id, {
      condition,
      conditionMultiplier: newMult,
      priceLow: rescale(p.priceLow),
      priceAvg: rescale(p.priceAvg),
      priceQuick: rescale(p.priceQuick),
      priceListing: rescale(p.priceListing),
      include: condition !== "missing",
      worthListing: condition !== "missing" && condition !== "damaged" && rescale(p.priceAvg) >= 40,
    });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-garage-700">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-6"></th>
            <th>Part</th>
            <th>Condition</th>
            <th className="text-right">Quick $</th>
            <th className="text-right">Avg $</th>
            <th className="text-right">List $</th>
            <th className="text-right">Active</th>
            <th className="text-right">Sold 90d</th>
            <th>Sell-Through</th>
            <th className="text-right">Net</th>
            <th className="text-right">$/hr</th>
            <th className="text-center">In</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => {
            const st = sellThroughRate(p);
            const stInfo = sellThroughLabel(st);
            const dead = p.condition === "missing" || p.condition === "damaged";
            const expanded = open === p.id;
            return (
              <RowPair
                key={p.id}
                p={p}
                st={st}
                stInfo={stInfo}
                dead={dead}
                expanded={expanded}
                settings={settings}
                onToggle={() => setOpen(expanded ? null : p.id)}
                onUpdate={(patch) => update(p.id, patch)}
                onCondition={(c) => setCondition(p, c)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RowPair({
  p, st, stInfo, dead, expanded, settings, onToggle, onUpdate, onCondition,
}: {
  p: Part;
  st: number;
  stInfo: ReturnType<typeof sellThroughLabel>;
  dead: boolean;
  expanded: boolean;
  settings: Settings;
  onToggle: () => void;
  onUpdate: (patch: Partial<Part>) => void;
  onCondition: (c: PartCondition) => void;
}) {
  const num = (field: keyof Part, value: string) => onUpdate({ [field]: parseFloat(value) || 0 } as Partial<Part>);
  const flooded = isFlooded(p);
  const listSuggestion = suggestedListing(p);

  return (
    <>
      <tr className={clsx(dead && "opacity-50", !p.include && "opacity-40")}>
        <td className="cursor-pointer text-center text-garage-500" onClick={onToggle}>
          {expanded ? "▾" : "▸"}
        </td>
        <td className="max-w-[220px] cursor-pointer" onClick={onToggle}>
          <span className={clsx("font-medium", p.isAftermarket ? "text-accent" : "text-white")}>{p.name}</span>
          <div className="flex flex-wrap gap-1 text-[10px] text-garage-500">
            {p.group}
            {flooded && <Badge tone="red">flooded market</Badge>}
            {!p.worthListing && p.include && !dead && <Badge tone="yellow">low value</Badge>}
          </div>
        </td>
        <td>
          <Select
            className="w-[110px] px-1 py-0.5 text-xs"
            value={p.condition}
            onChange={(e) => onCondition(e.target.value as PartCondition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </td>
        <td className="text-right">
          <input className="cell-input" type="number" value={p.priceQuick} onChange={(e) => num("priceQuick", e.target.value)} />
        </td>
        <td className="text-right">
          <input className="cell-input" type="number" value={p.priceAvg} onChange={(e) => num("priceAvg", e.target.value)} />
        </td>
        <td className="text-right">
          <input
            className="cell-input"
            type="number"
            value={p.priceListing}
            title={p.lowestActive > 0 ? `Suggested: ${money(listSuggestion)} (beats lowest active ${money(p.lowestActive)})` : "Suggested = avg until you enter a lowest-active price"}
            onChange={(e) => num("priceListing", e.target.value)}
          />
        </td>
        <td className="text-right">
          <input className="cell-input w-14" type="number" value={p.activeCount} onChange={(e) => num("activeCount", e.target.value)} />
        </td>
        <td className="text-right">
          <input className="cell-input w-14" type="number" value={p.soldCount90} onChange={(e) => num("soldCount90", e.target.value)} />
        </td>
        <td>
          <Badge tone={sellThroughTone(stInfo.tone)}>
            {st.toFixed(2)} · {stInfo.label}
          </Badge>
        </td>
        <td className="text-right font-mono text-profit">{dead || !p.include ? "—" : money(partNet(p, settings))}</td>
        <td className="text-right font-mono">{dead || !p.include ? "—" : `$${profitPerHour(p, settings)}`}</td>
        <td className="text-center">
          <input
            type="checkbox"
            checked={p.include}
            onChange={(e) => onUpdate({ include: e.target.checked })}
            className="h-4 w-4 accent-[#ff6b1a]"
          />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={12} className="bg-garage-850 !py-3">
            <div className="grid gap-4 px-2 md:grid-cols-3">
              {/* Research links */}
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">
                  eBay research
                </div>
                <div className="space-y-1">
                  {p.searchTerms.slice(0, 3).map((term, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-garage-400">“{term}”</span>
                      <a className="text-accent hover:underline" href={ebayActiveUrl(term, p.avoidTerms)} target="_blank" rel="noreferrer">
                        active ↗
                      </a>
                      <a className="text-profit hover:underline" href={ebaySoldUrl(term, p.avoidTerms)} target="_blank" rel="noreferrer">
                        sold ↗
                      </a>
                    </div>
                  ))}
                  {p.avoidTerms.length > 0 && (
                    <div className="text-[11px] text-garage-500">
                      Avoid: {p.avoidTerms.map((t) => `“${t}”`).join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Manual market data */}
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">
                  Market data (enter from research)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-[11px] text-garage-500">
                    Lowest active $
                    <Input type="number" className="mt-0.5 px-1.5 py-1 text-xs" value={p.lowestActive || ""} placeholder="—"
                      onChange={(e) => {
                        const lowestActive = parseFloat(e.target.value) || 0;
                        onUpdate({ lowestActive, marketDataSource: "manual", ...(lowestActive > 0 ? { priceListing: Math.floor(lowestActive * 0.97) } : {}) });
                      }} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Highest sold $
                    <Input type="number" className="mt-0.5 px-1.5 py-1 text-xs" value={p.highestSold || ""} placeholder="—"
                      onChange={(e) => onUpdate({ highestSold: parseFloat(e.target.value) || 0, marketDataSource: "manual" })} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Avg sold $
                    <Input type="number" className="mt-0.5 px-1.5 py-1 text-xs" value={p.avgSold || ""} placeholder="—"
                      onChange={(e) => {
                        const avgSold = parseFloat(e.target.value) || 0;
                        onUpdate({
                          avgSold, marketDataSource: "manual",
                          ...(avgSold > 0 ? {
                            priceAvg: avgSold,
                            priceQuick: Math.round(avgSold * (1 - settings.quickSaleDiscount) / 5) * 5,
                          } : {}),
                        });
                      }} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Low est. $
                    <Input type="number" className="mt-0.5 px-1.5 py-1 text-xs" value={p.priceLow} onChange={(e) => num("priceLow", e.target.value)} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Labor hrs
                    <Input type="number" step="0.1" className="mt-0.5 px-1.5 py-1 text-xs" value={p.laborHours} onChange={(e) => num("laborHours", e.target.value)} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Days to sell
                    <Input type="number" className="mt-0.5 px-1.5 py-1 text-xs" value={p.estDaysToSell} onChange={(e) => num("estDaysToSell", e.target.value)} />
                  </label>
                  <label className="text-[11px] text-garage-500">
                    Ship difficulty
                    <Select className="mt-0.5 px-1.5 py-1 text-xs" value={p.shipDifficulty}
                      onChange={(e) => onUpdate({ shipDifficulty: parseInt(e.target.value) as ShipDifficulty })}>
                      <option value={1}>1 · envelope/small box</option>
                      <option value={2}>2 · standard box</option>
                      <option value={3}>3 · large box</option>
                      <option value={4}>4 · oversize/awkward</option>
                      <option value={5}>5 · freight/local</option>
                    </Select>
                  </label>
                </div>
                {p.avgSold > 0 && (
                  <div className="mt-1 text-[11px] text-garage-500">
                    Entering avg sold updates Avg/Quick prices automatically.
                  </div>
                )}
              </div>

              {/* Scores + notes */}
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-garage-500">Scores</div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <Badge tone="blue">demand {demandScore(p)}</Badge>
                  <Badge tone="green">liquidity {liquidityScore(p)}</Badge>
                  <Badge tone={competitionLevel(p) > 60 ? "red" : "gray"}>competition {competitionLevel(p)}</Badge>
                  <Badge tone={riskScore(p) > 60 ? "red" : "gray"}>risk {riskScore(p)}</Badge>
                  {p.lowestActive > 0 && (
                    <Badge tone="orange">beat market: {money(Math.floor(p.lowestActive * 0.97))}</Badge>
                  )}
                </div>
                {flooded && (
                  <div className="mb-2 text-[11px] text-loss">
                    ⚠ Flooded: {p.activeCount} active vs {p.soldCount90} sold/90d — price at quick-sale or skip.
                  </div>
                )}
                <Input
                  className="px-1.5 py-1 text-xs"
                  value={p.notes}
                  placeholder="notes…"
                  onChange={(e) => onUpdate({ notes: e.target.value })}
                />
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => onUpdate({ worthListing: !p.worthListing })}
                  >
                    {p.worthListing ? "Mark as not worth listing" : "Mark as worth listing"}
                  </Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
