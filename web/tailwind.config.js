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
      fontWeight: {
        "public-sm": 300,
        "public-md": 400,
        "public-lg": 700,
        "public-xl": 800,
      }
    },
  },
  plugins: [],
};
