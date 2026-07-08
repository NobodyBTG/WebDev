/**
 * AI abstraction (client side).
 *
 * The app never *requires* AI: parsing falls back to parser.ts and the
 * report falls back to report.ts. When ANTHROPIC_API_KEY or OPENAI_API_KEY
 * is set in .env.local, /api/ai/parse upgrades description parsing with a
 * real model. Adding keys is the ONLY step — no code changes needed.
 */

import { ParsedBike, parseDescription } from "./parser";

/** Parse a pasted description — AI first (if configured), local rules as fallback. */
export async function smartParse(text: string): Promise<{ parsed: ParsedBike; usedAi: boolean }> {
  try {
    const res = await fetch("/api/ai/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.available && data.parsed) {
        return { parsed: { ...parseDescription(text), ...data.parsed }, usedAi: true };
      }
    }
  } catch {
    // network/API failure → local parse below
  }
  return { parsed: parseDescription(text), usedAi: false };
}
