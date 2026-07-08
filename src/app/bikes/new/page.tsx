"use client";

/**
 * New Bike Valuation — built for the under-60-second flow:
 * paste a rough description → Parse → confirm fields → Generate Valuation.
 * Everything is also enterable by hand.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Card, CardTitle, Field, Input, Select, Textarea } from "@/components/ui";
import { smartParse } from "@/lib/ai";
import { newBike, saveBike, getSettings } from "@/lib/db";
import { generateParts } from "@/lib/partsEngine";
import { BikeCategory, StorageConcern, TitleStatus } from "@/lib/types";

const EXAMPLE =
  "2025 Yamaha R1, wrecked front end, forks toast, front wheel toast, gauge cluster good, hand controls good, ASV levers, LightTech rearsets, LightTech fuel cap, mirror blocks, swingarm axle extension, title available, bought for $5,000.";

export default function NewBikePage() {
  const router = useRouter();
  const [bike, setBike] = useState(() => newBike());
  const [description, setDescription] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseNote, setParseNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof bike>(key: K, value: (typeof bike)[K]) =>
    setBike((b) => ({ ...b, [key]: value }));

  async function handleParse() {
    if (!description.trim()) return;
    setParsing(true);
    setParseNote(null);
    const { parsed, usedAi } = await smartParse(description);
    setBike((b) => ({
      ...b,
      year: parsed.year ?? b.year,
      make: parsed.make || b.make,
      model: parsed.model || b.model,
      trim: parsed.trim || b.trim,
      category: parsed.category ?? b.category,
      mileage: parsed.mileage ?? b.mileage,
      titleStatus: parsed.titleStatus ?? b.titleStatus,
      purchasePrice: parsed.purchasePrice ?? b.purchasePrice,
      damageNotes: parsed.damageNotes || b.damageNotes,
      missingParts: parsed.missingParts || b.missingParts,
      aftermarketNotes: parsed.aftermarketNotes || b.aftermarketNotes,
      rawDescription: description,
    }));
    setParseNote(
      usedAi
        ? "Parsed with AI — double-check the fields below."
        : `Parsed with built-in rules (confidence: ${parsed.confidence}). Add an API key in .env.local for AI parsing.`
    );
    setParsing(false);
  }

  function handleGenerate() {
    if (!bike.make || !bike.model) {
      setError("Make and model are required — parse a description or fill them in.");
      return;
    }
    const settings = getSettings();
    const toSave = { ...bike, rawDescription: bike.rawDescription || description };
    const gen = generateParts(toSave, settings.quickSaleDiscount);
    toSave.parts = gen.parts;
    if (toSave.estLaborHours <= 0) {
      toSave.estLaborHours = Math.round(gen.parts.reduce((a, p) => a + (p.include ? p.laborHours : 0), 0));
    }
    saveBike(toSave);
    router.push(`/bikes/${toSave.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">New Bike Valuation</h1>
        <p className="text-sm text-garage-500">Paste the auction description, hit Parse, fix anything wrong, generate.</p>
      </div>

      <Card>
        <CardTitle>1 · Paste description (fastest)</CardTitle>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={EXAMPLE}
          rows={4}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={handleParse} disabled={parsing || !description.trim()}>
            {parsing ? "Parsing…" : "Parse Description"}
          </Button>
          <Button variant="ghost" onClick={() => setDescription(EXAMPLE)}>
            Use example
          </Button>
          {parseNote && <span className="text-xs text-garage-400">{parseNote}</span>}
        </div>
      </Card>

      <Card>
        <CardTitle>2 · Bike details</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Year">
            <Input
              type="number"
              value={bike.year || ""}
              onChange={(e) => set("year", parseInt(e.target.value) || 0)}
            />
          </Field>
          <Field label="Make">
            <Input value={bike.make} onChange={(e) => set("make", e.target.value)} placeholder="Yamaha" />
          </Field>
          <Field label="Model">
            <Input value={bike.model} onChange={(e) => set("model", e.target.value)} placeholder="R1" />
          </Field>
          <Field label="Trim / submodel">
            <Input value={bike.trim} onChange={(e) => set("trim", e.target.value)} placeholder="(optional)" />
          </Field>
          <Field label="Category">
            <Select value={bike.category} onChange={(e) => set("category", e.target.value as BikeCategory)}>
              <option value="sportbike">Sportbike</option>
              <option value="cruiser">Cruiser / Harley</option>
              <option value="touring">Touring / Bagger</option>
              <option value="standard">Standard / Naked</option>
              <option value="adventure">Adventure</option>
              <option value="dirt">Dirt</option>
            </Select>
          </Field>
          <Field label="VIN (optional)">
            <Input value={bike.vin} onChange={(e) => set("vin", e.target.value)} />
          </Field>
          <Field label="Mileage">
            <Input
              type="number"
              value={bike.mileage ?? ""}
              onChange={(e) => set("mileage", e.target.value === "" ? null : parseInt(e.target.value) || 0)}
              placeholder="unknown"
            />
          </Field>
          <Field label="Title status">
            <Select value={bike.titleStatus} onChange={(e) => set("titleStatus", e.target.value as TitleStatus)}>
              <option value="clean">Clean</option>
              <option value="salvage">Salvage</option>
              <option value="rebuilt">Rebuilt</option>
              <option value="bill-of-sale">Bill of sale</option>
              <option value="none">No title</option>
            </Select>
          </Field>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Damage notes (what's toast, what's good)">
            <Textarea
              rows={2}
              value={bike.damageNotes}
              onChange={(e) => set("damageNotes", e.target.value)}
              placeholder="forks toast, front wheel toast, gauge cluster good…"
            />
          </Field>
          <Field label="Missing parts (comma separated)">
            <Textarea
              rows={2}
              value={bike.missingParts}
              onChange={(e) => set("missingParts", e.target.value)}
              placeholder="tank, seat…"
            />
          </Field>
          <Field label="Aftermarket / upgrade parts" className="md:col-span-2">
            <Textarea
              rows={2}
              value={bike.aftermarketNotes}
              onChange={(e) => set("aftermarketNotes", e.target.value)}
              placeholder="ASV levers, LighTech rearsets, Akrapovic exhaust…"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle>3 · Deal numbers</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Purchase price ($)">
            <Input
              type="number"
              value={bike.purchasePrice || ""}
              onChange={(e) => set("purchasePrice", parseFloat(e.target.value) || 0)}
              placeholder="5000"
            />
          </Field>
          <Field label="Est. teardown labor (hrs)">
            <Input
              type="number"
              value={bike.estLaborHours || ""}
              onChange={(e) => set("estLaborHours", parseFloat(e.target.value) || 0)}
              placeholder="auto"
            />
          </Field>
          <Field label="Title cost ($)">
            <Input
              type="number"
              value={bike.titleCost || ""}
              onChange={(e) => set("titleCost", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>
          <Field label="Transport cost ($)">
            <Input
              type="number"
              value={bike.transportCost || ""}
              onChange={(e) => set("transportCost", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>
          <Field label="Storage concern">
            <Select value={bike.storageConcern} onChange={(e) => set("storageConcern", e.target.value as StorageConcern)}>
              <option value="low">Low — plenty of space</option>
              <option value="medium">Medium</option>
              <option value="high">High — need it gone fast</option>
            </Select>
          </Field>
          <Field label="Frame/title sellable?">
            <Select
              value={bike.frameSellable ? "yes" : "no"}
              onChange={(e) => set("frameSellable", e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>
          <Field label="Value as whole project ($)">
            <Input
              type="number"
              value={bike.projectResaleValue || ""}
              onChange={(e) => set("projectResaleValue", parseFloat(e.target.value) || 0)}
              placeholder="for part-out vs flip compare"
            />
          </Field>
          <Field label="Location">
            <Input value={bike.location} onChange={(e) => set("location", e.target.value)} placeholder="Copart, local…" />
          </Field>
        </div>
      </Card>

      {error && <Badge tone="red">{error}</Badge>}

      <div className="flex items-center gap-3">
        <Button variant="primary" className="px-6 py-2 text-base" onClick={handleGenerate}>
          Generate Valuation →
        </Button>
        <span className="text-xs text-garage-500">
          Generates the full parts list with prices, sell-through, research links and the buy call.
        </span>
      </div>
    </div>
  );
}
