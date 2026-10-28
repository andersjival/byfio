/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fio: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D4AEFA', // Exact start color
          400: '#E7B8F9', // Exact end color
          500: '#C084FC',
          600: '#A855F7',
          700: '#9333EA',
          800: '#6B21A8',
          900: '#4C1D95',
          dark: '#1E1035', // Exact dark purple
          pink: '#EC4899',
          blue: '#9BE4FF', // Exact cyan heart
          yellow: '#FFF07C', // Exact yellow star
        },
      },
      fontFamily: {
        bubble: ['Fredoka', 'Quicksand', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'fio-brand': 'linear-gradient(135deg, #D4AEFA 0%, #E7B8F9 100%)',
        'fio-cta': 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
        'fio-cyan-indigo': 'linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)',
      },
      boxShadow: {
        clay: '0 12px 28px -6px rgba(107, 33, 168, 0.12), 0 8px 16px -8px rgba(107, 33, 168, 0.08), inset 0 2px 4px 0 rgba(255, 255, 255, 0.9)',
        claySm: '0 6px 14px -3px rgba(107, 33, 168, 0.1), inset 0 1px 2px 0 rgba(255, 255, 255, 0.8)',
        clayLg: '0 20px 35px -8px rgba(107, 33, 168, 0.16), 0 10px 20px -10px rgba(107, 33, 168, 0.1), inset 0 2px 6px 0 rgba(255, 255, 255, 0.95)',
        clayBtn: '0 8px 20px -4px rgba(147, 51, 234, 0.35), inset 0 2px 3px 0 rgba(255, 255, 255, 0.4)',
        clayPink: '0 8px 20px -4px rgba(236, 72, 153, 0.4), inset 0 2px 3px 0 rgba(255, 255, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
