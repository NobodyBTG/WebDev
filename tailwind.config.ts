import type { Config } from "tailwindcss";

/**
 * Blacktop Garage theme: near-black backgrounds, gray panels,
 * safety-orange highlights. Profit = green, loss/warnings = red.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        garage: {
          950: "#0a0a0b",
          900: "#111113",
          850: "#17171a",
          800: "#1d1d21",
          700: "#2a2a30",
          600: "#3a3a42",
          500: "#55555f",
          400: "#8a8a95",
          300: "#b3b3bd",
        },
        accent: {
          DEFAULT: "#ff6b1a", // safety orange
          hover: "#ff8240",
          dim: "#c2500f",
        },
        profit: "#33d17a",
        loss: "#f0483e",
        caution: "#f5c211",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
