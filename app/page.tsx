"use client";

import { useMemo, useState } from "react";
import { COMPANIES, PUBLIC_SYMBOLS, DATA_AS_OF } from "@/lib/data";
import { useQuotes } from "@/lib/useQuotes";
import { usdB, gw, pct } from "@/lib/format";
import CompanyCard from "@/components/CompanyCard";
import MoverAlerts from "@/components/MoverAlerts";
import ThemeToggle from "@/components/ThemeToggle";

type Sort = "change" | "backlog" | "capacity";

const SORTS: { key: Sort; label: string }[] = [
  { key: "change", label: "등락률순" },
  { key: "backlog", label: "수주잔고순" },
  { key: "capacity", label: "확보용량순" },
];

export default function HomePage() {
  const { quotes, live } = useQuotes(PUBLIC_SYMBOLS);
  const [sort, setSort] = useState<Sort>("backlog");

  const totalBacklog = COMPANIES.reduce((s, c) => s + c.backlog, 0);
  const totalGW = COMPANIES.reduce((s, c) => s + c.powerSecured, 0);
  const avgChange =
    PUBLIC_SYMBOLS.reduce((s, sym) => s + (quotes[sym]?.changePct ?? 0), 0) /
    PUBLIC_SYMBOLS.length;

  const sorted = useMemo(() => {
    const arr = [...COMPANIES];
    arr.sort((a, b) => {
      if (sort === "change")
        return (
          (quotes[b.symbol]?.changePct ?? b.fallbackChangePct) -
          (quotes[a.symbol]?.changePct ?? a.fallbackChangePct)
        );
      if (sort === "capacity") return b.powerSecured - a.powerSecured;
      return b.backlog - a.backlog;
    });
    return arr;
  }, [sort, quotes]);

  return (
    <main className="px-4 pt-3">
      {/* 헤더 */}
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-[22px] font-extrabold text-toss-ink">
            네오클라우드 <span className="text-brand">인사이트</span>
          </h1>
          <p className="text-xs text-toss-gray">
            AI 인프라 투자, 한눈에 · {DATA_AS_OF} 기준
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              live ? "bg-up/10 text-up" : "bg-toss-line text-toss-gray"
            }`}
          >
            {live ? "● 실시간" : "○ 샘플가"}
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* 섹터 요약 히어로 */}
      <section className="mt-2 rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-float fade-up">
        <p className="text-[13px] font-medium text-white/80">
          네오클라우드 섹터 합산
        </p>
        <div className="mt-2 flex items-end gap-1">
          <span className="tnum text-[34px] font-extrabold leading-none">
            {usdB(totalBacklog)}
          </span>
          <span className="mb-1 text-sm font-medium text-white/80">
            총 수주잔고
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <HeroStat label="확보 용량" value={gw(totalGW)} />
          <HeroStat label="추종 기업" value={`${COMPANIES.length}개`} />
          <HeroStat
            label="평균 등락"
            value={pct(avgChange)}
            tone={avgChange >= 0 ? "up" : "down"}
          />
        </div>
      </section>

      {/* 급등락 알림 */}
      <MoverAlerts quotes={quotes} />

      {/* 정렬 칩 */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
              sort === s.key
                ? "bg-toss-ink text-white"
                : "bg-toss-card text-toss-grayd shadow-card"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 회사 카드 리스트 */}
      <section className="mt-3 space-y-2.5 pb-4">
        {sorted.map((c, i) => (
          <div key={c.symbol} className="fade-up" style={{ animationDelay: `${i * 30}ms` }}>
            <CompanyCard c={c} quote={quotes[c.symbol]} />
          </div>
        ))}
      </section>

      <p className="px-1 pb-2 text-[11px] leading-relaxed text-toss-gray">
        ※ 수주잔고·확보용량은 실적발표·공시 기반 큐레이션 값(참고용)입니다. 주가·뉴스는
        실시간 조회되며, 본 화면은 투자 권유가 아닙니다.
      </p>
    </main>
  );
}

function HeroStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur">
      <p className="text-[11px] text-white/75">{label}</p>
      <p
        className={`tnum text-[15px] font-bold ${
          tone === "up"
            ? "text-white"
            : tone === "down"
            ? "text-white"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
