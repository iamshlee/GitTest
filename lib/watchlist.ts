"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "neocloud:watchlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// 관심종목 localStorage 훅 (탭/컴포넌트 간 동기화)
export function useWatchlist() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    setList(read());
    const onChange = () => setList(read());
    window.addEventListener("watchlist-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("watchlist-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((symbol: string) => {
    const cur = read();
    const next = cur.includes(symbol)
      ? cur.filter((s) => s !== symbol)
      : [...cur, symbol];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("watchlist-change"));
  }, []);

  const has = useCallback((symbol: string) => list.includes(symbol), [list]);

  return { list, toggle, has };
}
