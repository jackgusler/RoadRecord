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
        dark: "#503D42", // Deep Brown
      },
    },
    fontFamily: {
      athin: ["Archivo-Thin", "sans-serif"],
      aextralight: ["Archivo-ExtraLight", "sans-serif"],
      alight: ["Archivo-Light", "sans-serif"],
      aregular: ["Archivo-Regular", "sans-serif"],
      amedium: ["Archivo-Medium", "sans-serif"],
      asemibold: ["Archivo-SemiBold", "sans-serif"],
      abold: ["Archivo-Bold", "sans-serif"],
      aextrabold: ["Archivo-ExtraBold", "sans-serif"],
      ablack: ["Archivo-Black", "sans-serif"],
    },
  },
  plugins: [],
};
