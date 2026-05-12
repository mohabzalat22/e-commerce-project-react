module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 50px -25px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        "hero-texture":
          "radial-gradient(circle at top left, rgba(255,255,255,0.45), transparent 32%), linear-gradient(135deg, rgba(15,23,42,0.94), rgba(15,23,42,0.72))",
      },
      fontFamily: {
        "maison-neue": [
          '"Maison Neue"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
