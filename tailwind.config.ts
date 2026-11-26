import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0f2648",
          blue: "#1a447a",
          lightBlue: "#e8eff9",
          orange: "#ea580c",
          gold: "#f59e0b",
          green: "#059669",
          darkGreen: "#064e3b",
          red: "#dc2626",
          slate: "#334155"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
