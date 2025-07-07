module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        ch: ["var(--font-ch)", "sans-serif"],
      },
      colors: {
        background1: "#1a1a1a", // Dark mode background
        background2: "#ffffff", // Light mode background
      },
      animation: {
        show_keyboard: "1s linear 0s 1 forwards show_keyboard",
      },
      keyframes: {
        show_keyboard: {
          "0%": {
            bottom: "-100%",
          },
          "100%": {
            bottom: "0",
          }
        },
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable class-based dark mode
};
