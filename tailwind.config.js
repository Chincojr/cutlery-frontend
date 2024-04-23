/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideToLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideToRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        toggleRight: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        toggleLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        ToLeft: 'slideToLeft 1s ease-in-out 1 ',
        ToRight: 'slideToRight 1s ease-in-out 1 ',
        toggleLeft: 'toggleLeft .4s ease-in-out 1 ',
        toggleRight: 'toggleRight .4s ease-in-out 1 ',
      }
    },
  },
  plugins: [],
}