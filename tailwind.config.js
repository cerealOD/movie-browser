/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{html,ts}", //scan angular contents
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "2rem",
          sm: "3rem",
          xl: "4rem",
        },
      },
      colors: {
        primary: "#1F1C2C",
        secondary: "#A39CD0",
      },
      fontFamily: {
        sans: ["Outfit", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
