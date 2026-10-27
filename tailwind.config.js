/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0f",
        darker: "#05050a",
        accent: "#14f195",
        accentDim: "#14f19520",
        card: "#1a1a24",
        border: "#2a2a3a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["DM Sans", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(.1) infinite",
      },
    },
  },
  plugins: [],
};