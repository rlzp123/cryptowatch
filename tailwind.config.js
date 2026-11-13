/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1120',
          900: '#111827',
          800: '#1E293B',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        }
      }
    },
  },
  plugins: [],
};
