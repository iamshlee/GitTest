"use client";

import { useEffect, useState } from "react";
import { COMPANIES } from "./data";

export type LiveQuote = {
  price: number;
  changePct: number;
  live: boolean; // true=실시간, false=폴백
};

// 폴백 기본값 (data.ts 기반)
function fallbackMap(): Record<string, LiveQuote> {
  const m: Record<string, LiveQuote> = {};
  for (const c of COMPANIES) {
    m[c.symbol] = {
      price: c.fallbackPrice,
      changePct: c.fallbackChangePct,
      live: false,
    };
  }
  return m;
}

// 실시간 시세 훅 — 실패 시 폴백 유지, 60초마다 갱신
export function useQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>(fallbackMap);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!symbols.length) return;
    let alive = true;

    async function load() {
      try {
        const res = await fetch(`/api/quote?symbols=${symbols.join(",")}`);
        const json = await res.json();
        if (!alive) return;
        if (json?.quotes && Object.keys(json.quotes).length) {
          setQuotes((prev) => {
            const next = { ...prev };
            for (const [sym, q] of Object.entries<any>(json.quotes)) {
              next[sym] = {
                price: q.price,
                changePct: q.changePct,
                live: true,
              };
            }
            return next;
          });
          setLive(true);
        }
      } catch {
        // 폴백 유지
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(",")]);

  return { quotes, loading, live };
}
