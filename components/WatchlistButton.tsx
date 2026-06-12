"use client";

import { useWatchlist } from "@/lib/watchlist";

export default function WatchlistButton({
  symbol,
  size = "md",
}: {
  symbol: string;
  size?: "sm" | "md";
}) {
  const { has, toggle } = useWatchlist();
  const active = has(symbol);
  const px = size === "sm" ? 20 : 26;
  return (
    <button
      aria-label="관심종목 토글"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(symbol);
      }}
      className="press grid place-items-center rounded-full p-1"
    >
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none">
        <path
          d="m12 4 2.5 5 5.5.8-4 3.9.95 5.5L12 16.5 7.05 19.2 8 13.7l-4-3.9 5.5-.8L12 4Z"
          stroke={active ? "#FFB400" : "#C4CAD2"}
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill={active ? "#FFB400" : "none"}
        />
      </svg>
    </button>
  );
}
