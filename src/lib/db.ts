/**
 * Local database layer (browser localStorage).
 *
 * Tables (keys): bikes, settings, comps. Each is JSON under a namespaced key.
 * The API is deliberately shaped like an async repository so it can be
 * swapped for Supabase/SQLite later without touching the pages:
 * replace the bodies here with fetch() calls and everything keeps working.
 *
 * A demo bike (2025 Yamaha R1) is seeded on first run so the app is
 * testable immediately.
 */

import { Bike, DEFAULT_SETTINGS, MarketComp, Settings } from "./types";
import { generateParts, uid } from "./partsEngine";

const KEYS = {
  bikes: "pbv.bikes.v1",
  settings: "pbv.settings.v1",
  comps: "pbv.comps.v1",
  seeded: "pbv.seeded.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  notify();
}

/* Simple change notification so open pages stay in sync. */
const listeners = new Set<() => void>();
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify(): void {
  listeners.forEach((fn) => fn());
}

/* ── Settings ────────────────────────────────────────────────────────── */

export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
}

export function saveSettings(s: Settings): void {
  write(KEYS.settings, s);
}

/* ── Bikes ───────────────────────────────────────────────────────────── */

export function getBikes(): Bike[] {
  seedIfNeeded();
  return read<Bike[]>(KEYS.bikes, []);
}

export function getBike(id: string): Bike | undefined {
  return getBikes().find((b) => b.id === id);
}

export function saveBike(bike: Bike): void {
  const bikes = getBikes();
  const i = bikes.findIndex((b) => b.id === bike.id);
  bike.updatedAt = new Date().toISOString();
  if (i >= 0) bikes[i] = bike;
  else bikes.unshift(bike);
  write(KEYS.bikes, bikes);
}

export function deleteBike(id: string): void {
  write(KEYS.bikes, getBikes().filter((b) => b.id !== id));
}

export function duplicateBike(id: string): Bike | undefined {
  const src = getBike(id);
  if (!src) return undefined;
  const copy: Bike = JSON.parse(JSON.stringify(src));
  copy.id = uid("bike");
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  copy.status = "evaluating";
  copy.parts = copy.parts.map((p) => ({ ...p, id: uid() }));
  saveBike(copy);
  return copy;
}

/** Blank bike skeleton with sane defaults. */
export function newBike(): Bike {
  const now = new Date().toISOString();
  return {
    id: uid("bike"),
    createdAt: now,
    updatedAt: now,
    status: "evaluating",
    year: new Date().getFullYear(),
    make: "",
    model: "",
    trim: "",
    vin: "",
    mileage: null,
    category: "sportbike",
    titleStatus: "clean",
    frameSellable: true,
    damageNotes: "",
    missingParts: "",
    aftermarketNotes: "",
    location: "",
    purchasePrice: 0,
    estLaborHours: 0,
    storageConcern: "low",
    projectResaleValue: 0,
    titleCost: 0,
    transportCost: 0,
    rawDescription: "",
    parts: [],
  };
}

/* ── Comps ───────────────────────────────────────────────────────────── */

export function getComps(bikeId?: string): MarketComp[] {
  const all = read<MarketComp[]>(KEYS.comps, []);
  return bikeId ? all.filter((c) => c.bikeId === bikeId) : all;
}

export function saveComp(comp: MarketComp): void {
  const all = read<MarketComp[]>(KEYS.comps, []);
  const i = all.findIndex((c) => c.id === comp.id);
  if (i >= 0) all[i] = comp;
  else all.push(comp);
  write(KEYS.comps, all);
}

export function deleteComp(id: string): void {
  write(KEYS.comps, read<MarketComp[]>(KEYS.comps, []).filter((c) => c.id !== id));
}

/* ── Demo seed ───────────────────────────────────────────────────────── */

function seedIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEYS.seeded)) return;
  window.localStorage.setItem(KEYS.seeded, "1");

  const existing = read<Bike[]>(KEYS.bikes, []);
  if (existing.length > 0) return;

  const demo = newBike();
  demo.year = 2025;
  demo.make = "Yamaha";
  demo.model = "R1";
  demo.category = "sportbike";
  demo.titleStatus = "clean";
  demo.frameSellable = true;
  demo.purchasePrice = 5000;
  demo.mileage = 3200;
  demo.location = "Local auction";
  demo.storageConcern = "low";
  demo.projectResaleValue = 11000;
  demo.damageNotes =
    "Wrecked front end, forks toast, front wheel toast, gauge cluster good, hand controls good";
  demo.aftermarketNotes =
    "ASV levers, LighTech rearsets, LighTech fuel cap, LighTech mirror blocks, LighTech swingarm axle extension";
  demo.rawDescription =
    "2025 Yamaha R1, wrecked front end, forks toast, front wheel toast, gauge cluster good, hand controls good, ASV levers, LightTech rearsets, LightTech fuel cap, mirror blocks, swingarm axle extension, title available, bought for $5,000.";
  demo.status = "purchased";

  const gen = generateParts(demo, DEFAULT_SETTINGS.quickSaleDiscount);
  demo.parts = gen.parts;
  demo.estLaborHours = Math.round(gen.parts.reduce((a, p) => a + (p.include ? p.laborHours : 0), 0));

  write(KEYS.bikes, [demo]);
  // Don't notify during initial read — callers get the seeded list directly.
}
