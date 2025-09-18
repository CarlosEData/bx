/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bx-black': '#000000',
        'bx-blue': '#3533cd',
        'bx-gradient-start': '#000000',
        'bx-gradient-end': '#3533cd',
      },
      backgroundImage: {
        'bx-gradient': 'linear-gradient(135deg, #000000 0%, #3533cd 100%)',
        'bx-gradient-reverse': 'linear-gradient(135deg, #3533cd 0%, #000000 100%)',
        'bx-gradient-light': 'linear-gradient(135deg, #1a1a1a 0%, #4a47d1 100%)',
      }
    },
  },
  plugins: [],
};
