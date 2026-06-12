"use client";

import { useEffect, useState } from "react";

const KEY = "neocloud:theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      className="press grid h-9 w-9 place-items-center rounded-full bg-toss-card shadow-card"
    >
      {dark ? (
        // sun
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="#FFB400" strokeWidth="1.8" fill="#FFB400" />
          <path
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
            stroke="#FFB400"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // moon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
            stroke="#4E5968"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="#4E5968"
            fillOpacity="0.12"
          />
        </svg>
      )}
    </button>
  );
}
