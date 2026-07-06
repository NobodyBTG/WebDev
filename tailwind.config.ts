import type { Config } from "tailwindcss";

/**
 * Opportunity Radar — dark-mode SaaS dashboard theme.
 *
 * Color roles:
 *  - surface/page: deep navy backgrounds
 *  - accent (cyan) + accent2 (violet): brand / interactive
 *  - category colors: CVD-validated 7-slot palette for opportunity categories
 *  - status colors: score bands (good / warning / serious / critical)
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#0a0e1a",
        surface: {
          DEFAULT: "#111827",
          raised: "#151d30",
          overlay: "#1a2440",
        },
        line: "#233150",
        ink: {
          DEFAULT: "#f1f5fd",
          secondary: "#a8b3cc",
          muted: "#6b7793",
        },
        accent: {
          DEFAULT: "#22d3ee",
          soft: "#0e7490",
          glow: "#67e8f9",
        },
        accent2: {
          DEFAULT: "#a78bfa",
          soft: "#6d28d9",
        },
        // Score band colors (status — never used as series colors)
        good: "#0ca30c",
        warning: "#fab219",
        serious: "#ec835a",
        critical: "#d03b3b",
        // Categorical palette (validated: CVD ΔE 23.7, all >= 3:1 on #111827)
        cat: {
          direct: "#3987e5",
          niche: "#199e70",
          support: "#c98500",
          software: "#9085e9",
          marketplace: "#e66767",
          product: "#d55181",
          education: "#d95926",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 211, 238, 0.15)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "scan-pulse": "scan-pulse 2s ease-in-out infinite",
        sweep: "sweep 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
