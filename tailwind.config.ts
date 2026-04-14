import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#040405',
        surface: '#111113',
        surfaceHover: '#1c1c1f',
        primary: '#6366f1',
        primaryGlow: 'rgba(99,102,241,0.4)',
        border: 'rgba(255,255,255,0.08)',
        textMain: '#ffffff',
        textMuted: '#a1a1aa',
        textFaint: '#71717a',
        green: '#10b981',
        yellow: '#f59e0b',
        red: '#ef4444',
        blue: '#3b82f6',
        purple: '#a855f7',
        pink: '#ec4899',
        orange: '#f97316',
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(110deg, #6366f1 0%, #a855f7 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(99,102,241,0.25)',
        'glow': '0 0 30px rgba(99,102,241,0.35)',
        'glow-lg': '0 0 50px rgba(99,102,241,0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-lg': '0 24px 80px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shine': 'shine 4s linear infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(168,85,247,0.6)' },
        },
        shine: {
          from: { backgroundPosition: '0% center' },
          to: { backgroundPosition: '200% center' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
