/**
 * POST /api/ai/parse — AI-assisted description parsing.
 *
 * Reads ANTHROPIC_API_KEY (preferred) or OPENAI_API_KEY from the server env.
 * With no key configured it responds { available: false } and the client
 * uses the built-in rule parser. Responses are strict JSON matching the
 * ParsedBike shape (see src/lib/parser.ts).
 */

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an experienced motorcycle salvage buyer's assistant.
Parse the user's rough bike description into strict JSON with these keys:
year (number|null), make (string), model (string), trim (string),
category ("sportbike"|"cruiser"|"standard"|"adventure"|"dirt"|"touring"),
mileage (number|null), titleStatus ("clean"|"salvage"|"rebuilt"|"bill-of-sale"|"none"|null),
purchasePrice (number|null), damageNotes (string), missingParts (string, comma separated),
aftermarketNotes (string, comma separated brand parts).
Be conservative; leave fields null/empty when unsure. Output ONLY the JSON object.`;

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ available: false, error: "no text" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  try {
    if (anthropicKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: text }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = extractJson(data.content?.[0]?.text ?? "");
        if (parsed) return NextResponse.json({ available: true, parsed, provider: "anthropic" });
      }
    } else if (openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = extractJson(data.choices?.[0]?.message?.content ?? "");
        if (parsed) return NextResponse.json({ available: true, parsed, provider: "openai" });
      }
    }
  } catch {
    // fall through to unavailable — client uses the local parser
  }

  return NextResponse.json({ available: false });
}

function extractJson(text: string): Record<string, unknown> | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}
