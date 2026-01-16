/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#121212",
        primary: "#FDE047", // Hyrox Yellow
        success: "#22C55E", // Neon Green
        surface: "#1E1E1E",
        text: "#FFFFFF",
        textDim: "#AAAAAA",
      },
    },
  },
  plugins: [],
}
