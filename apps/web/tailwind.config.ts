import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Eco-Pulse Tactical Palette (Skill Agent 04)
        forest: {
          slate: '#07120E',
          panel: '#0C1E17',
          border: '#163529',
          muted: '#1E4637',
        },
        moss: {
          white: '#F3F8F5',
          soft: '#E2EFE8',
        },
        pulse: {
          emerald: '#10B981', // Status Aman
          amber: '#F59E0B',   // Status Waspada
          ember: '#F97316',   // Status Siaga
          crimson: '#EF4444', // Status Kritis / Bahaya
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'crimson-glow': '0 0 25px -2px rgba(239, 68, 68, 0.55)',
        'emerald-glow': '0 0 20px -4px rgba(16, 185, 129, 0.45)',
        'tactical-glass': '0 8px 32px 0 rgba(4, 15, 11, 0.65)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

