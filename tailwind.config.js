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
      transitionTimingFunction: {
        basic: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        basic: "250ms",
      },
      colors: {
        primary: "#1F1C2C",
        secondary: "#A39CD0",
      },
      fontFamily: {
        sans: ["Outfit", ...defaultTheme.fontFamily.sans],
        montserrat: "Montserrat",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".transition-basic": {
          transitionProperty: "all",
          transitionDuration: theme("transitionDuration.basic"),
          transitionTimingFunction: theme("transitionTimingFunction.basic"),
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
