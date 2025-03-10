import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Main dark theme colors
        dark: {
          900: "#0A0A0B", // Nearly black
          800: "#121214", // Dark background
          700: "#18181B", // Card background
          600: "#1F1F23", // Elevated components
          500: "#26262B", // Hover states
          400: "#2D2D33", // Borders
        },
        // Neon purple accents
        neon: {
          900: "#2D1F6E",
          800: "#4A2B9E",
          700: "#6236CF",
          600: "#7B4FFF", // Primary accent
          500: "#9373FF",
          400: "#AB96FF",
          300: "#C3B9FF",
        },
        // Blood red accents
        blood: {
          900: "#650012",
          800: "#8A0018",
          700: "#AF001E",
          600: "#D40024", // Secondary accent
          500: "#FF2E56",
          400: "#FF5C7A",
          300: "#FF8A9E",
        },
        // Override default colors
        amber: {
          500: "#FF2E56", // Redirect amber to blood red
        },
        blue: {
          500: "#7B4FFF", // Redirect blue to neon purple
        },
        gray: {
          50: "#F7F7F8",
          100: "#E9E9EB",
          200: "#C6C6C9",
          300: "#A3A3A7",
          400: "#808085",
          500: "#5D5D63",
          600: "#3A3A3F",
          700: "#26262B",
          800: "#18181B",
          900: "#0A0A0B",
        },
      },
      boxShadow: {
        neon: "0 0 15px rgba(123, 79, 255, 0.5)",
        blood: "0 0 15px rgba(255, 46, 86, 0.5)",
        emerald: "0 0 15px rgba(16, 185, 129, 0.5)",
        amber: "0 0 15px rgba(251, 191, 36, 0.5)",
      },
      animation: {
        "glow-purple": "glow-purple 2s ease-in-out infinite",
        "glow-red": "glow-red 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        "glow-purple": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(123, 79, 255, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(123, 79, 255, 0.7)" },
        },
        "glow-red": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(255, 46, 86, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 46, 86, 0.7)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100vh)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      fontFamily: {
        silkscreen: ["var(--font-silkscreen)"],
        sans: ["Aboreto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
