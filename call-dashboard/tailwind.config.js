/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      backgroundColor: {
        glassLight: "rgba(255, 255, 255, 0.3)",
        glassDark: "rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};


