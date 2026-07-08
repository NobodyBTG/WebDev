"use client";

/**
 * Dashboard: every saved bike with invested / projected gross / net /
 * profit and an inventory-risk read, plus fleet totals up top.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Stat, recommendationTone } from "@/components/ui";
import { bikeTotals, money, recommend } from "@/lib/calc";
import { deleteBike, duplicateBike, getBikes, getSettings, subscribe } from "@/lib/db";
import { Bike, Settings } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [bikes, setBikes] = useState<Bike[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const load = () => {
      setBikes(getBikes());
      setSettings(getSettings());
    };
    load();
    return subscribe(load);
  }, []);

  if (!bikes || !settings) {
    return <div className="py-20 text-center text-garage-500">Loading garage…</div>;
  }

  const active = bikes.filter((b) => b.status !== "sold" && b.status !== "passed");
  const rows = bikes.map((b) => ({ bike: b, totals: bikeTotals(b, settings), rec: recommend(b, settings) }));
  const fleet = rows
    .filter((r) => r.bike.status !== "sold" && r.bike.status !== "passed")
    .reduce(
      (acc, r) => ({
        invested: acc.invested + r.bike.purchasePrice + r.totals.fixedCosts,
        gross: acc.gross + r.totals.grossQuick,
        net: acc.net + r.totals.netQuick,
        profit: acc.profit + r.totals.profitQuick,
        slowShare: acc.slowShare + r.totals.slowValueShare,
      }),
      { invested: 0, gross: 0, net: 0, profit: 0, slowShare: 0 }
    );
  const avgSlow = active.length ? Math.round(fleet.slowShare / active.length) : 0;
  const riskLabel = avgSlow >= 40 ? "High" : avgSlow >= 25 ? "Medium" : "Low";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-garage-500">
            {active.length} active bike{active.length === 1 ? "" : "s"} · quick-sale numbers, {Math.round(settings.feeRate * 100)}% fee loss baked in
          </p>
        </div>
        <Link href="/bikes/new">
          <Button variant="primary">+ Value a Bike</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total Invested" value={money(fleet.invested)} />
        <Stat label="Projected Gross" value={money(fleet.gross)} sub="quick-sale pricing" />
        <Stat label="Projected Net" value={money(fleet.net)} sub={`after ${Math.round(settings.feeRate * 100)}% fees`} />
        <Stat
          label="Expected Profit"
          value={money(fleet.profit)}
          tone={fleet.profit >= 0 ? "profit" : "loss"}
          sub="before labor"
        />
        <Stat
          label="Inventory Risk"
          value={riskLabel}
          tone={riskLabel === "High" ? "loss" : riskLabel === "Medium" ? "caution" : "profit"}
          sub={`${avgSlow}% value in slow movers`}
        />
      </div>

      {rows.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="mb-4 text-garage-400">No bikes yet.</p>
          <Link href="/bikes/new">
            <Button variant="primary">Value your first bike</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-garage-700">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bike</th>
                <th>Status</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Quick Gross</th>
                <th className="text-right">Net</th>
                <th className="text-right">Profit</th>
                <th className="text-right">ROI</th>
                <th>Call</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ bike, totals, rec }) => (
                <tr key={bike.id} className="cursor-pointer" onClick={() => router.push(`/bikes/${bike.id}`)}>
                  <td className="font-medium text-white">
                    {bike.year} {bike.make} {bike.model} {bike.trim}
                    <div className="text-xs font-normal text-garage-500">
                      {bike.parts.filter((p) => p.include).length} parts · title: {bike.titleStatus}
                    </div>
                  </td>
                  <td>
                    <Badge tone={bike.status === "parting-out" ? "orange" : bike.status === "purchased" ? "blue" : "gray"}>
                      {bike.status}
                    </Badge>
                  </td>
                  <td className="text-right font-mono">{money(bike.purchasePrice)}</td>
                  <td className="text-right font-mono">{money(totals.grossQuick)}</td>
                  <td className="text-right font-mono">{money(totals.netQuick)}</td>
                  <td className={`text-right font-mono font-bold ${totals.profitQuick >= 0 ? "text-profit" : "text-loss"}`}>
                    {money(totals.profitQuick)}
                  </td>
                  <td className="text-right font-mono">{Math.round(totals.roiQuick * 100)}%</td>
                  <td>
                    <Badge tone={recommendationTone(rec.recommendation)}>{rec.recommendation}</Badge>
                  </td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-xs"
                        title="Duplicate valuation"
                        onClick={() => {
                          const copy = duplicateBike(bike.id);
                          if (copy) router.push(`/bikes/${copy.id}`);
                        }}
                      >
                        Duplicate
                      </Button>
                      <Button
                        variant="danger"
                        className="px-2 py-1 text-xs"
                        onClick={() => {
                          if (confirm(`Delete ${bike.year} ${bike.make} ${bike.model}? This can't be undone.`)) {
                            deleteBike(bike.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
