import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Part Bike Value — Blacktop Garage",
  description:
    "Part-out valuation tool for motorcycle salvage buyers: part values, sell-through, competition, fees and max bid.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <header className="no-print sticky top-0 z-40 border-b border-garage-700 bg-garage-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-sm font-black text-black">PBV</span>
              <span className="hidden text-sm font-bold uppercase tracking-widest text-white sm:block">
                Part Bike Value
              </span>
              <span className="hidden text-[10px] uppercase tracking-widest text-garage-500 md:block">
                Blacktop Garage
              </span>
            </Link>
            <nav className="ml-auto flex items-center gap-1 text-sm">
              <Link href="/" className="rounded px-3 py-1.5 text-garage-400 hover:bg-garage-800 hover:text-white">
                Dashboard
              </Link>
              <Link
                href="/bikes/new"
                className="rounded bg-accent px-3 py-1.5 font-semibold text-black hover:bg-accent-hover"
              >
                + New Bike
              </Link>
              <Link href="/settings" className="rounded px-3 py-1.5 text-garage-400 hover:bg-garage-800 hover:text-white">
                Settings
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="no-print mx-auto max-w-7xl px-4 py-8 text-center text-xs text-garage-600">
          Estimates only — always verify with the sold-listing links before bidding. Default fee loss: 35%.
        </footer>
      </body>
    </html>
  );
}
