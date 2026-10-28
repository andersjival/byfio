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
          300: '#E2C6FF',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#4C1D95',
          pink: '#EC4899',
          blue: '#38BDF8',
          yellow: '#FACC15',
        },
      },
      fontFamily: {
        bubble: ['Fredoka', 'Quicksand', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        clay: '0 12px 28px -6px rgba(107, 33, 168, 0.12), 0 8px 16px -8px rgba(107, 33, 168, 0.08), inset 0 2px 4px 0 rgba(255, 255, 255, 0.9)',
        claySm: '0 6px 14px -3px rgba(107, 33, 168, 0.1), inset 0 1px 2px 0 rgba(255, 255, 255, 0.8)',
        clayLg: '0 20px 35px -8px rgba(107, 33, 168, 0.16), 0 10px 20px -10px rgba(107, 33, 168, 0.1), inset 0 2px 6px 0 rgba(255, 255, 255, 0.95)',
        clayBtn: '0 8px 20px -4px rgba(147, 51, 234, 0.35), inset 0 2px 3px 0 rgba(255, 255, 255, 0.4)',
        clayPink: '0 8px 20px -4px rgba(236, 72, 153, 0.4), inset 0 2px 3px 0 rgba(255, 255, 255, 0.4)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
};
