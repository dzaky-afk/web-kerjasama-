/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gk: {
          gold: '#FCE029',
          amber: '#F59E0B',
          orange: '#E87722',
          blue: '#00A3E0',
          green: '#00875A',
          dark: '#0A0F1D'
        }
      }
    },
  },
  plugins: [],
}
