/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monestra: {
          brunswick: '#0C4137',
          'brunswick-dark': '#072822',
          'brunswick-light': '#145A4D',
          emerald: '#06D6A0',
          'emerald-dark': '#05B385',
          'emerald-light': '#52E3BE',
          polar: '#E6FBF6',
          'polar-light': '#F2FDFB',
          canvas: '#FBFBFD',
          surface: '#FFFFFF',
          border: 'rgba(12, 65, 55, 0.08)',
        },
        makon: {
          bg: '#FBFBFD',
          card: '#FFFFFF',
          border: '#E5E9E7',
          elevated: '#FFFFFF',
          subtle: '#F4F7F6',
          muted: '#64748B',
          text: '#0C4137',
          emerald: '#06D6A0',
          brunswick: '#0C4137',
          polar: '#E6FBF6',
          cyan: '#0284C7',
          amber: '#D97706',
          rose: '#E11D48',
          indigo: '#4F46E5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
