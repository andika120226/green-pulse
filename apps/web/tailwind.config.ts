import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Eco-Fresh Botanical & Clean Emerald Palette
        botanical: {
          bg: '#F0F7F4',
          surface: '#FFFFFF',
          mint: '#E6F4EE',
          border: '#BBF7D0',
          header: '#064E3B',
          text: '#0F172A',
          muted: '#475569',
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
        'eco-card': '0 4px 20px -2px rgba(6, 78, 59, 0.07), 0 1px 4px -1px rgba(6, 78, 59, 0.04)',
        'eco-hover': '0 10px 28px -4px rgba(16, 185, 129, 0.14)',
        'crimson-glow': '0 4px 20px -2px rgba(239, 68, 68, 0.35)',
        'emerald-glow': '0 4px 18px -2px rgba(16, 185, 129, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
