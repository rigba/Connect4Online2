/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
      },
      animation: {
        bounce2: "bounce2 1s ease 0s infinite normal forwards"
      },
    },
  },
  plugins: [],
};
