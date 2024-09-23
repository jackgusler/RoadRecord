/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B3142", // Dark Blue
        secondary: "#92AD94", // Soft Green
        accent: "#F5FBEF", // Light Beige
        muted: "#748B75", // Muted Olive
        mutedLight: "#859986", // Soft Green
        dark: "#503D42", // Deep Brown

        // primary: "#839788",
        // secondary: "#eee0cb",
        // accent: "#bfd7ea",
        // muted: "#baa898",
        // dark: "#000000",

      },
    },
    fontFamily: {
      uthin: ["Urbanist-Thin", "sans-serif"],
      uextralight: ["Urbanist-ExtraLight", "sans-serif"],
      ulight: ["Urbanist-Light", "sans-serif"],
      uregular: ["Urbanist-Regular", "sans-serif"],
      umedium: ["Urbanist-Medium", "sans-serif"],
      usemibold: ["Urbanist-SemiBold", "sans-serif"],
      ubold: ["Urbanist-Bold", "sans-serif"],
      uextrabold: ["Urbanist-ExtraBold", "sans-serif"],
      ublack: ["Urbanist-Black", "sans-serif"],
    },
  },
  plugins: [],
};
