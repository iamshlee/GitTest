import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Toss-style palette
        brand: {
          DEFAULT: "#3182F6",
          dark: "#1B64DA",
          light: "#E8F2FF",
        },
        // 한국 증시 관례: 상승=빨강, 하락=파랑
        up: "#F04452",
        down: "#3182F6",
        toss: {
          bg: "#F2F4F6",
          card: "#FFFFFF",
          line: "#EAECEF",
          gray: "#8B95A1",
          grayd: "#4E5968",
          ink: "#191F28",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        float: "0 6px 24px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
