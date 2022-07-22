const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/client/**/*.tsx"],
  theme: {
    extend: {
      backgroundImage: {
        "home-lg": `url("/public/images/background-large.jpg")`,
        caution: `repeating-linear-gradient(-45deg, ${colors.yellow["500"]}, ${colors.yellow["500"]} 20px, ${colors.black} 20px, ${colors.black} 40px)`,
      },
    },
  },
  plugins: [],
};
