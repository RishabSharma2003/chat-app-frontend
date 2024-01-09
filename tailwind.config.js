/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#1476ff',
        'light':'#f9faff',
        'secondary':'#f3f5ff',
      }
    },
  },
  plugins: [],
}