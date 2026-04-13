import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#040405', // Deep luxurious black
        surface: '#111113', // Slightly elevated surface
        surfaceHover: '#1c1c1f',
        primary: '#6366f1', // Indigo
        primaryGlow: 'rgba(99, 102, 241, 0.4)',
        borderBase: 'rgba(255, 255, 255, 0.08)',
        textMain: '#ffffff',
        textMuted: '#a1a1aa'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(110deg, #6366f1 0%, #a855f7 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(168, 85, 247, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
