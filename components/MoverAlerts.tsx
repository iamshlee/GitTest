"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPANIES } from "@/lib/data";
import { LiveQuote } from "@/lib/useQuotes";
import { pct, changeColor, changeBg } from "@/lib/format";
import { useWatchlist } from "@/lib/watchlist";

const KEY = "neocloud:alertThreshold";
const OPTIONS = [3, 5, 10];

// 관심종목 우선 + 임계치 이상 급등락 알림
export default function MoverAlerts({
  quotes,
}: {
  quotes: Record<string, LiveQuote>;
}) {
  const { list } = useWatchlist();
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    const saved = Number(localStorage.getItem(KEY));
    if (saved && OPTIONS.includes(saved)) setThreshold(saved);
  }, []);

  const setT = (v: number) => {
    setThreshold(v);
    localStorage.setItem(KEY, String(v));
  };

  const movers = COMPANIES.filter((c) => !c.private)
    .map((c) => ({ c, ch: quotes[c.symbol]?.changePct ?? c.fallbackChangePct }))
    .filter((x) => Math.abs(x.ch) >= threshold)
    .sort((a, b) => {
      // 관심종목 우선, 그다음 변동폭
      const aw = list.includes(a.c.symbol) ? 1 : 0;
      const bw = list.includes(b.c.symbol) ? 1 : 0;
      if (aw !== bw) return bw - aw;
      return Math.abs(b.ch) - Math.abs(a.ch);
    });

  return (
    <section className="mt-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-toss-grayd">
          🔔 급등락 알림
          {movers.length > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-up px-1 text-[11px] font-bold text-white">
              {movers.length}
            </span>
          )}
        </h2>
        <div className="flex gap-1 rounded-full bg-white p-0.5 shadow-card">
          {OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setT(v)}
              className={`press rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                threshold === v ? "bg-toss-ink text-white" : "text-toss-gray"
              }`}
            >
              ±{v}%
            </button>
          ))}
        </div>
      </div>

      {movers.length === 0 ? (
        <div className="rounded-2xl bg-white p-3.5 text-[13px] text-toss-gray shadow-card">
          ±{threshold}% 이상 움직인 종목이 없어요. 조용한 장세입니다.
        </div>
      ) : (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {movers.map(({ c, ch }) => (
            <Link
              key={c.symbol}
              href={`/company/${c.symbol}`}
              className="press flex w-[140px] shrink-0 flex-col gap-1 rounded-2xl bg-white p-3 shadow-card"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-lg text-[10px] font-bold text-white"
                  style={{ background: c.color }}
                >
                  {c.symbol.slice(0, 2)}
                </span>
                <span className="truncate text-[13px] font-bold text-toss-ink">
                  {c.name}
                </span>
                {list.includes(c.symbol) && (
                  <span className="ml-auto text-[12px]">⭐️</span>
                )}
              </div>
              <span
                className={`inline-block w-fit rounded-md px-1.5 py-0.5 text-[13px] font-bold ${changeBg(
                  ch
                )}`}
              >
                {pct(ch)}
              </span>
              <span className={`text-[11px] font-medium ${changeColor(ch)}`}>
                {ch > 0 ? "급등 ▲" : "급락 ▼"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
