/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        card:      "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
        "card-lg": "0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.5)",
        glow:      "0 0 28px rgba(34,197,94,0.2)",
        "glow-em": "0 0 28px rgba(34,197,94,0.15)",
        "glow-amber": "0 0 28px rgba(245,158,11,0.18)"
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":  "spin 2s linear infinite",
        "fade-in":    "fadeIn 0.4s ease-out"
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } }
      }
    }
  },
  plugins: []
};
