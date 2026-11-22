import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // QuBite / MessMate Brand Tokens
        brand: {
          red: "#A91D32",
          orange: "#EF6A32",
          peach: "#FFBFA5",
          warm: "#FFF5EF",
          ink: "#241D1B",
          mutedInk: "#71645F",
          softBorder: "#EADCD6",
          yellow: "#FFC83D",
          yellowHover: "#F5BC2E",
          yellowLight: "#FFD66B",
          black: "#151515",
          dark: "#171717",
          cream: "#FFF9F3",
          card: "#FFFFFF",
          border: "#EEE8E0",
          textSecondary: "#777777",
          success: "#43B978",
          error: "#EF6464",
          softPurple: "#E9E2FF",
          softGreen: "#DDF5E8",
          softOrange: "#FFE9CC",
          softRed: "#FDE8E8",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "landing-card": "20px",
        "landing-button": "12px",
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "landing-soft": "0 18px 45px -24px rgba(169, 29, 50, 0.24)",
        "landing-card": "0 24px 55px -34px rgba(36, 29, 27, 0.32)",
        subtle: "0 2px 10px rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -2px rgba(21, 21, 21, 0.05)",
        floating: "0 10px 30px -4px rgba(21, 21, 21, 0.08)",
        neubrutal: "3px 3px 0px #151515",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
