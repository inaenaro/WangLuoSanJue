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
        test: "#f0f0f0",
        background1: "var(--background)",
        background2: "var(--background2)",
        background3: "var(--background3)",
        gray: "var(--gray)",
        text: "var(--text)",
        "white-text": "var(--white-text)", 
        "black-text": "var(--black-text)",
      },
      animation: {
        show_keyboard: "0.2s linear 0s 1 forwards show_keyboard",
      },
      keyframes: {
        show_keyboard: {
          "0%": {
            bottom: "-100%",
          },
          "100%": {
            bottom: "0",
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
