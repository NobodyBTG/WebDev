/**
 * Core domain types for Part Bike Value.
 *
 * A Bike owns a list of Parts. Every dollar figure on a Part is editable by
 * the user; the calc layer (calc.ts) derives totals, sell-through, risk and
 * the purchase recommendation from whatever is currently stored.
 */

export type TitleStatus = "clean" | "salvage" | "rebuilt" | "bill-of-sale" | "none";

export type BikeCategory = "sportbike" | "cruiser" | "standard" | "adventure" | "dirt" | "touring";

export type PartCondition =
  | "good" // verified good — full value
  | "unknown" // untested — discounted
  | "damaged" // visibly damaged — heavy discount or zero
  | "missing" // not on the bike — zero value
  | "aftermarket"; // upgraded part, valued separately

export type StorageConcern = "low" | "medium" | "high";

export type ShipDifficulty = 1 | 2 | 3 | 4 | 5; // 1 = padded envelope, 5 = freight

export type BikeStatus = "evaluating" | "purchased" | "parting-out" | "sold" | "passed";

/** One sellable part line on a valuation. All prices are user-editable. */
export interface Part {
  id: string;
  name: string;
  group: string; // "Drivetrain", "Body", "Electronics", ...
  condition: PartCondition;
  isAftermarket: boolean;

  // Pricing (USD). low/avg come from comps or the estimate engine.
  priceLow: number;
  priceAvg: number;
  priceQuick: number; // price to move it in days, not weeks
  priceListing: number; // suggested list price (usually just under lowest competitor)

  /** Multiplier already applied for condition (kept visible so user sees why). */
  conditionMultiplier: number;

  // Market data — estimated by the engine, or hand-entered from eBay research.
  activeCount: number; // current competing listings
  soldCount90: number; // sold in last 90 days
  lowestActive: number; // lowest active competitor price ($0 = unknown)
  highestSold: number;
  avgSold: number;
  marketDataSource: "estimate" | "manual" | "api" | "csv";

  estDaysToSell: number;
  shipDifficulty: ShipDifficulty;
  laborHours: number; // hours to remove, clean, photograph, list
  worthListing: boolean;
  include: boolean; // include in totals (user can toggle off)
  notes: string;

  searchTerms: string[];
  avoidTerms: string[];
}

export interface Bike {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: BikeStatus;

  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  mileage: number | null;
  category: BikeCategory;

  titleStatus: TitleStatus;
  frameSellable: boolean; // can the frame/title be sold (varies by state)
  damageNotes: string;
  missingParts: string; // free text, comma separated
  aftermarketNotes: string;
  location: string;

  purchasePrice: number;
  estLaborHours: number; // total teardown estimate
  storageConcern: StorageConcern;

  /** Rough resale value as a running/titled project, for part-out vs flip compare. */
  projectResaleValue: number;

  // Per-bike cost overrides (fall back to Settings when 0/undefined)
  titleCost: number;
  transportCost: number;

  rawDescription: string; // what the user pasted, kept for reference
  parts: Part[];
}

export interface Settings {
  /** Total loss to eBay fees + payment + promoted + returns/shipping loss. Default 0.35 */
  feeRate: number;
  laborRatePerHour: number; // what your time is worth
  storageCostPerMonth: number;
  shippingMaterialsPerPart: number; // boxes, foam, tape average
  quickSaleDiscount: number; // quick price = avg * (1 - discount). Default 0.25
  businessName: string;
}

export const DEFAULT_SETTINGS: Settings = {
  feeRate: 0.35,
  laborRatePerHour: 30,
  storageCostPerMonth: 50,
  shippingMaterialsPerPart: 4,
  quickSaleDiscount: 0.25,
  businessName: "Blacktop Garage",
};

/** Manual comp a user logs from their own research. */
export interface MarketComp {
  id: string;
  bikeId: string;
  partId: string;
  source: string; // "ebay-sold", "ebay-active", "facebook", ...
  title: string;
  price: number;
  soldDate: string;
  url: string;
  notes: string;
}

export type Recommendation =
  | "Strong Buy"
  | "Buy Only Cheap"
  | "Borderline"
  | "Avoid"
  | "Better to Sell as Project"
  | "Better to Repair";
