/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      content: {
        warning: '"⚠"', // Adding a custom content property
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.before-warning': {
          content: '"⚠ "',
        },
      }, ['before']);
    },
  ],
}