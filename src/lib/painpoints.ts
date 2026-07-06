import type { PainCategory, PainPointAnalysis, PainPointMatch } from "./types";
import { PAIN_CATEGORY_LABELS } from "./types";

/**
 * Pain Point Analyzer — rule-based keyword classifier (v1).
 *
 * // Future AI route: cheap model
 * // Replace the keyword matcher with a cheap classification call that tags
 * // each pasted line with categories + sentiment + severity. Keep this
 * // keyword version as an instant fallback while the API call is in flight.
 */

const KEYWORDS: Record<PainCategory, string[]> = {
  price: [
    "expensive", "overpriced", "too much", "cost a fortune", "rip off", "ripoff",
    "price", "pricing", "cheap", "hidden fee", "charged", "quote was", "upcharge",
  ],
  speed: [
    "slow", "took forever", "waited", "waiting", "days to", "weeks to", "late",
    "never showed", "no show", "response time", "took hours", "delayed", "fast",
  ],
  quality: [
    "poor quality", "bad job", "sloppy", "broke again", "didn't fix", "did not fix",
    "redo", "shoddy", "leaks again", "wrong part", "defective", "low quality", "mess",
  ],
  trust: [
    "scam", "dishonest", "lied", "shady", "don't trust", "do not trust", "sketchy",
    "unlicensed", "no insurance", "took my money", "fraud", "con ",
  ],
  convenience: [
    "hard to book", "inconvenient", "hassle", "complicated process", "had to call",
    "no online booking", "couldn't schedule", "could not schedule", "paperwork",
  ],
  availability: [
    "never available", "booked out", "no availability", "couldn't get anyone",
    "could not get anyone", "no one answers", "nobody answers", "weeks out",
    "after hours", "emergency", "unavailable", "closed",
  ],
  customerService: [
    "rude", "unprofessional", "never called back", "no call back", "ignored",
    "customer service", "didn't listen", "did not listen", "attitude",
    "never responded", "no response", "ghosted", "won't return", "wont return",
  ],
  technology: [
    "website is broken", "site doesn't work", "site does not work", "no website",
    "can't pay online", "cannot pay online", "outdated system", "no app",
    "online quote", "no tracking", "manual process", "spreadsheet",
  ],
  branding: [
    "unprofessional look", "looks sketchy", "old logo", "outdated website",
    "couldn't find them", "could not find them", "no reviews", "hard to find",
    "no online presence", "looks like a scam",
  ],
  transparency: [
    "no upfront price", "wouldn't give a price", "would not give a price",
    "surprise charge", "confusing pricing", "unclear", "no estimate", "vague",
    "fine print", "didn't explain", "did not explain", "no breakdown",
  ],
};

function splitLines(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?])\s{2,}/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);
}

export function analyzePainPoints(text: string): PainPointAnalysis {
  const lines = splitLines(text);
  const matches: PainPointMatch[] = [];
  const counts = Object.fromEntries(
    (Object.keys(KEYWORDS) as PainCategory[]).map((c) => [c, 0])
  ) as Record<PainCategory, number>;

  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const [category, words] of Object.entries(KEYWORDS) as [PainCategory, string[]][]) {
      const hit = words.find((w) => lower.includes(w));
      if (hit) {
        matches.push({
          category,
          keyword: hit,
          snippet: line.length > 140 ? line.slice(0, 140) + "…" : line,
        });
        counts[category] += 1;
      }
    }
  }

  const repeatedPatterns = (Object.keys(counts) as PainCategory[])
    .filter((c) => counts[c] >= 2)
    .sort((a, b) => counts[b] - counts[a]);

  return {
    totalLines: lines.length,
    matches,
    counts,
    repeatedPatterns,
    summary: buildSummary(counts, repeatedPatterns, matches.length),
  };
}

const OPPORTUNITY_HINTS: Record<PainCategory, string> = {
  price: "clear flat-rate or upfront pricing",
  speed: "a faster, guaranteed-response version of this service",
  quality: "a quality-guaranteed offer with photos and warranties",
  trust: "a licensed, insured, review-backed trust play",
  convenience: "online booking and a friction-free process",
  availability: "after-hours or same-day availability",
  customerService: "reliable communication and real follow-up",
  technology: "modern tooling — booking, payments, and status tracking",
  branding: "a professional brand in a market full of amateurs",
  transparency: "transparent quotes and itemized pricing",
};

function buildSummary(
  counts: Record<PainCategory, number>,
  repeated: PainCategory[],
  totalMatches: number
): string {
  if (totalMatches === 0) {
    return "No recognizable pain-point keywords found. Paste raw reviews, complaints, or Reddit comments — the messier the better.";
  }
  const top = repeated.length > 0
    ? repeated.slice(0, 3)
    : (Object.keys(counts) as PainCategory[]).filter((c) => counts[c] > 0).slice(0, 3);

  const problemList = top
    .map((c) => PAIN_CATEGORY_LABELS[c].replace(" problem", "").toLowerCase())
    .join(", ");
  const hint = OPPORTUNITY_HINTS[top[0]];

  if (repeated.length > 0) {
    return `Customers repeatedly complain about ${problemList} issues. This suggests a possible opportunity for ${hint}.`;
  }
  return `Scattered complaints about ${problemList} issues. Not a strong pattern yet — paste more reviews to confirm before treating this as demand evidence.`;
}
