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
          light: "var(--brand-light)",
        },
        // 한국 증시 관례: 상승=빨강, 하락=파랑
        up: "#F04452",
        down: "#3182F6",
        // CSS 변수 기반 → 다크모드 자동 전환
        toss: {
          bg: "var(--bg)",
          card: "var(--card)",
          line: "var(--line)",
          gray: "var(--gray)",
          grayd: "var(--grayd)",
          ink: "var(--ink)",
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
