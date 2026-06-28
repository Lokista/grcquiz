/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // GRC / audit platform palette (dark)
        ink: {
          950: '#0a0e14',
          900: '#0d1320',
          850: '#111a2b',
          800: '#162033',
          700: '#1c2840',
          600: '#27374f',
        },
        accent: {
          DEFAULT: '#3b82f6',
          soft: '#60a5fa',
          deep: '#2563eb',
        },
        good: '#22c55e',
        warn: '#f59e0b',
        bad: '#ef4444',
        gold: '#eab308',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(59,130,246,0.25), 0 8px 30px -8px rgba(59,130,246,0.35)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slidein: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
      animation: {
        pop: 'pop 160ms ease-out',
        slidein: 'slidein 220ms ease-out',
      },
    },
  },
  plugins: [],
};
