/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        ink: "#2C2C2C",
        rose: {
          DEFAULT: "#853953",
          light: "#A85273",
          dark: "#6B2D42",
        },
        plum: {
          DEFAULT: "#612D53",
          light: "#7A3B69",
          dark: "#3D1A34",
        },
        mist: "#F3F4F4",
        blossom: "#FFD6E0",
        petal: "#FFF4F4",
      },
      backgroundImage: {
        "rose-gradient": "linear-gradient(135deg, #A85273 0%, #853953 55%, #612D53 100%)",
        "plum-section-dark": "linear-gradient(160deg, #3D1A34 0%, #612D53 55%, #4A2140 100%)",
        "plum-section-light": "linear-gradient(160deg, #FFD6E0 0%, #FFE3EA 55%, #FFD0DC 100%)",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(133,57,83,0.55)",
        card: "0 8px 30px -10px rgba(0,0,0,0.35)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "orbit-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        orbit: "orbit 48s linear infinite",
        "orbit-reverse": "orbit-reverse 48s linear infinite",
      },
    },
  },
  plugins: [],
};
