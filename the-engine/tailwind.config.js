/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#0A0A0A",
                surface: "#1A1A1A",
                primary: "#FF6B35",      // Engine Orange
                secondary: "#00D4FF",    // Electric Blue
                accent: "#22C55E",       // Success Green
                textDim: "#666666",
                race: "#FF3366",         // Race mode indicator
                fun: "#00FF88",          // Fun mode indicator
            },
        },
    },
    plugins: [],
};
