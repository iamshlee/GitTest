"use client";

import Link from "next/link";
import { COMPANIES, PUBLIC_SYMBOLS } from "@/lib/data";
import { useWatchlist } from "@/lib/watchlist";
import { useQuotes } from "@/lib/useQuotes";
import CompanyCard from "@/components/CompanyCard";

export default function WatchlistPage() {
  const { list } = useWatchlist();
  const { quotes } = useQuotes(PUBLIC_SYMBOLS);

  const items = COMPANIES.filter((c) => list.includes(c.symbol));

  return (
    <main className="px-4 pt-3">
      <header className="py-2">
        <h1 className="text-[22px] font-extrabold text-toss-ink">관심종목</h1>
        <p className="text-xs text-toss-gray">
          별표로 담아둔 회사를 모아봤어요
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-card">
          <div className="mb-3 text-4xl">⭐️</div>
          <p className="text-sm font-semibold text-toss-ink">
            아직 관심종목이 없어요
          </p>
          <p className="mt-1 text-xs text-toss-gray">
            홈에서 별표를 눌러 회사를 담아보세요
          </p>
          <Link
            href="/"
            className="press mt-4 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white"
          >
            홈으로 가기
          </Link>
        </div>
      ) : (
        <section className="mt-3 space-y-2.5 pb-4">
          {items.map((c) => (
            <CompanyCard key={c.symbol} c={c} quote={quotes[c.symbol]} />
          ))}
        </section>
      )}
    </main>
  );
}
