import type { IndustryDataset } from "@/lib/types";
import { cleaning } from "./industries/cleaning";
import { hvac } from "./industries/hvac";
import { motorcycleParts } from "./industries/motorcycleParts";
import { plumber } from "./industries/plumber";
import { restaurant } from "./industries/restaurant";
import { generateGenericDataset } from "./generic";

export const CURATED_INDUSTRIES: IndustryDataset[] = [
  plumber,
  motorcycleParts,
  restaurant,
  cleaning,
  hvac,
];

/**
 * Resolve raw user input to a dataset.
 *
 * // Future AI route: cheap model — classifyUserIntent would fuzzy-match input
 * // to known industries ("pipes guy" -> plumbing) and detect intent hints in
 * // free text. v1: alias substring matching + generic fallback.
 */
export function resolveIndustry(rawInput: string): IndustryDataset {
  const input = rawInput.trim().toLowerCase();
  if (!input) return generateGenericDataset("your industry");

  for (const dataset of CURATED_INDUSTRIES) {
    if (
      dataset.aliases.some((a) => input === a || input.includes(a) || a.includes(input)) &&
      input.length >= 3
    ) {
      return dataset;
    }
  }
  return generateGenericDataset(rawInput);
}
