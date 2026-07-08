"use client";

/**
 * Settings — business assumptions used by every valuation.
 * Stored locally; changes apply instantly to all bikes.
 */

import { useEffect, useState } from "react";
import { Button, Card, CardTitle, Field, Input } from "@/components/ui";
import { getSettings, saveSettings } from "@/lib/db";
import { DEFAULT_SETTINGS, Settings } from "@/lib/types";

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setS(getSettings()), []);
  if (!s) return <div className="py-20 text-center text-garage-500">Loading…</div>;

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setS({ ...s, [key]: value });
    setSaved(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-garage-500">These assumptions drive every number in the app.</p>
      </div>

      <Card>
        <CardTitle>Fees &amp; pricing</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total fee loss (%) — eBay + payment + promoted + returns/shipping loss">
            <Input
              type="number" min={0} max={90} step={1}
              value={Math.round(s.feeRate * 100)}
              onChange={(e) => set("feeRate", Math.min(90, Math.max(0, parseFloat(e.target.value) || 0)) / 100)}
            />
          </Field>
          <Field label="Quick-sale discount (%) below average sold price">
            <Input
              type="number" min={0} max={75} step={5}
              value={Math.round(s.quickSaleDiscount * 100)}
              onChange={(e) => set("quickSaleDiscount", Math.min(75, Math.max(0, parseFloat(e.target.value) || 0)) / 100)}
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-garage-500">
          Net = gross × (1 − fee%). Default 35% covers final value fees, payment processing, promoted
          listings, returns and shipping surprises.
        </p>
      </Card>

      <Card>
        <CardTitle>Costs</CardTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Field label="Your labor rate ($/hr)">
            <Input type="number" value={s.laborRatePerHour}
              onChange={(e) => set("laborRatePerHour", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Storage cost ($/month)">
            <Input type="number" value={s.storageCostPerMonth}
              onChange={(e) => set("storageCostPerMonth", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Shipping materials ($/part)">
            <Input type="number" value={s.shippingMaterialsPerPart}
              onChange={(e) => set("shippingMaterialsPerPart", parseFloat(e.target.value) || 0)} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle>Branding</CardTitle>
        <Field label="Business name (shown on exported reports)">
          <Input value={s.businessName} onChange={(e) => set("businessName", e.target.value)} />
        </Field>
      </Card>

      <Card>
        <CardTitle>API keys</CardTitle>
        <p className="text-sm text-garage-400">
          AI parsing and live eBay counts are optional upgrades. Add keys to <code className="text-accent">.env.local</code>{" "}
          (see <code className="text-accent">.env.example</code>): <code>ANTHROPIC_API_KEY</code> or{" "}
          <code>OPENAI_API_KEY</code> for AI parsing, <code>EBAY_CLIENT_ID</code>/<code>EBAY_CLIENT_SECRET</code> for the
          Browse API. Without keys the app uses its built-in parser and generated research links — fully functional.
        </p>
      </Card>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => { saveSettings(s); setSaved(true); }}>
          Save settings
        </Button>
        <Button variant="ghost" onClick={() => { setS(DEFAULT_SETTINGS); saveSettings(DEFAULT_SETTINGS); setSaved(true); }}>
          Reset to defaults
        </Button>
        {saved && <span className="text-sm text-profit">Saved ✓</span>}
      </div>
    </div>
  );
}
