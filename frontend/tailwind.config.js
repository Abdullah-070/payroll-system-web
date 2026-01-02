/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#00ff88',
        dark: '#1e1e2e',
        darker: '#0f0f1e',
      },
    },
  },
  plugins: [],
};
