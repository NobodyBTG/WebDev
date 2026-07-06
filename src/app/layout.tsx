import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity Radar — scan any industry for business opportunities",
  description:
    "An AI business scanner that helps you figure out what business is worth testing before you waste money building it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
