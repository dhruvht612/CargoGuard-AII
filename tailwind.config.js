export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1A3C5E", light: "#2a5a8e", dark: "#0f2440" },
        emerald: { DEFAULT: "#2ECC71", dark: "#27ae60" },
        amber: { DEFAULT: "#F39C12", dark: "#e67e22" },
        danger: { DEFAULT: "#E74C3C", dark: "#c0392b" },
        purple: { DEFAULT: "#7C3AED", dark: "#6d28d9" },
        surface: "#FFFFFF",
        bg: "#F0F4F8",
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
