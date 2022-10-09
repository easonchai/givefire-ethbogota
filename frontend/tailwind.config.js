/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EC5938",
        secondary: "#292218",
        offwhite: "#F4EDE3",
        profiles: "#2F482A",
      },
    },
  },
  plugins: [],
};
