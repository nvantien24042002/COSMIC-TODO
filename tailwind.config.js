/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#070b19',
          850: '#0b1129',
          800: '#111836',
          700: '#1a224a',
          600: '#263163',
        },
        nebula: {
          purple: '#9333ea',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          pink: '#ec4899',
          gold: '#eab308',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-glow': '0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 0 15px rgba(6, 182, 212, 0.15)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
        'glow-purple': '0 0 20px -3px rgba(147, 51, 234, 0.45)',
        'glow-pink': '0 0 20px -3px rgba(236, 72, 153, 0.45)',
        'glow-gold': '0 0 20px -3px rgba(234, 179, 8, 0.45)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
