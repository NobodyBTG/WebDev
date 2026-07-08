/**
 * GET /api/ebay?q=<term> — eBay Browse API hook (optional).
 *
 * With EBAY_CLIENT_ID + EBAY_CLIENT_SECRET in .env.local this returns live
 * active-listing counts and the lowest active price for a search term, so
 * part rows can be filled automatically. Without keys it returns
 * { available: false } and the app relies on the generated research links
 * plus manual count entry — which is the normal workflow anyway.
 */

import { NextRequest, NextResponse } from "next/server";

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(id: string, secret: string): Promise<string | null> {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const id = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;

  if (!q) return NextResponse.json({ available: false, error: "missing q" }, { status: 400 });
  if (!id || !secret) return NextResponse.json({ available: false });

  try {
    const token = await getToken(id, secret);
    if (!token) return NextResponse.json({ available: false });

    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&category_ids=6028&limit=50&sort=price`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return NextResponse.json({ available: false });

    const data = await res.json();
    const items = (data.itemSummaries ?? []) as { price?: { value?: string } }[];
    const prices = items
      .map((i) => parseFloat(i.price?.value ?? "0"))
      .filter((p) => p > 0)
      .sort((a, b) => a - b);

    return NextResponse.json({
      available: true,
      activeCount: data.total ?? items.length,
      lowestActive: prices[0] ?? 0,
      medianActive: prices[Math.floor(prices.length / 2)] ?? 0,
    });
  } catch {
    return NextResponse.json({ available: false });
  }
}
