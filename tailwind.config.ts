import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        content: {
          1: "var(--content-1)",
          2: "var(--content-2)",
          3: "var(--content-3)",
          4: "var(--content-4)",
        },
        
        // Primary colors (white with varying opacity in dark mode, black in light mode)
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        
        // Background overlays
        overlay: {
          light: "var(--overlay-light)",
          medium: "var(--overlay-medium)",
          dark: "var(--overlay-dark)",
        },
        
        // Status colors
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          danger: "var(--status-danger)",
          info: "var(--status-info)",
        },
        
        // Accent colors
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
          4: "var(--accent-4)",
        },

        // UI Elements
        ui: {
          scrollbar: {
            track: "var(--scrollbar-track)",
            thumb: "var(--scrollbar-thumb)",
            thumbHover: "var(--scrollbar-thumb-hover)",
          }
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px var(--primary-100)',
        'glow-md': '0 0 15px var(--primary-200)', 
        'glow-lg': '0 0 20px var(--primary-300)',
      },
      animation: {
        "glow-purple": "glow-purple 2s ease-in-out infinite",
        "glow-red": "glow-red 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "grow": "grow 2s ease-in-out infinite",
        "interface-reveal": "interface-reveal 0.5s ease-out forwards",
        "text-shimmer": "text-shimmer 2s linear infinite",
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
        "grow": {
          "0%, 100%": { width: "0%" },
          "50%": { width: "100%" },
        },
        "interface-reveal": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      fontFamily: {
        silkscreen: ["var(--font-silkscreen)"],
        sans: ["Aboreto", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'scanlines': 'linear-gradient(to bottom, transparent 50%, var(--scanlines) 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
