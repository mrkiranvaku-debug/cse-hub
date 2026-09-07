/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // Base dark surfaces
        night: {
          950: '#050B14', // page background
          900: '#07111F', // page background alt
          800: '#0B1624', // card / surface
          700: '#0D1B2A', // surface alt / panels
          600: '#13233A', // hover surface
          500: '#1B2E47', // borders (lighter)
          400: '#28405F', // borders (accent-ish)
        },
        ink: '#F5F8FC', // near-white primary text
        muted: {
          300: '#B4C2D6',
          400: '#94A6C0',
          500: '#7E90AA', // secondary muted blue-gray text
          600: '#5E7089',
        },
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        rust: '#F87171',
        moss: '#34D399',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.35)',
        cardHover: '0 0 0 1px rgba(34, 211, 238, 0.25), 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 24px rgba(34, 211, 238, 0.12)',
        glow: '0 0 0 1px rgba(34, 211, 238, 0.4), 0 0 20px rgba(34, 211, 238, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(34,211,238,0.06), transparent 35%)',
      },
    },
  },
  plugins: [],
}
