"use client";

import { useState } from "react";
import { COMPANIES } from "@/lib/data";
import NewsFeed from "@/components/NewsFeed";

// 전체 섹터 + 회사별 필터
const ALL = { symbol: "ALL", name: "전체", query: "neocloud OR CoreWeave OR Nebius OR Oracle cloud OR AI datacenter" };

export default function NewsPage() {
  const [active, setActive] = useState<string>("ALL");

  const current =
    active === "ALL"
      ? ALL
      : (() => {
          const c = COMPANIES.find((x) => x.symbol === active)!;
          return { symbol: c.symbol, name: c.name, query: c.legalName };
        })();

  return (
    <main className="px-4 pt-3">
      <header className="py-2">
        <h1 className="text-[22px] font-extrabold text-toss-ink">실시간 뉴스</h1>
        <p className="text-xs text-toss-gray">
          네오클라우드 관련 최신 헤드라인을 빠르게
        </p>
      </header>

      {/* 필터 칩 */}
      <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
        <FilterChip
          label="전체"
          active={active === "ALL"}
          onClick={() => setActive("ALL")}
        />
        {COMPANIES.map((c) => (
          <FilterChip
            key={c.symbol}
            label={c.name}
            color={c.color}
            active={active === c.symbol}
            onClick={() => setActive(c.symbol)}
          />
        ))}
      </div>

      <div className="mt-3 pb-4">
        <NewsFeed key={current.symbol} query={current.query} limit={15} />
      </div>
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
        active ? "text-white" : "bg-toss-card text-toss-grayd shadow-card"
      }`}
      style={active ? { background: color || "#191F28" } : undefined}
    >
      {label}
    </button>
  );
}
