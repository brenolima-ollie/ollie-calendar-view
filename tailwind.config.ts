import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ollie: {
          red: '#E7002A',
          orange: '#FF502C',
          purple: '#C9A0DC',
          pink: '#F8BBD9',
          green: '#27AE60',
        },
        noma: {
          nude: '#F5E6D3',
          gold: '#C9A86C',
          light: '#FAF7F2',
        },
        joomi: {
          pink: '#FFB6C1',
          purple: '#E6E6FA',
          yellow: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
