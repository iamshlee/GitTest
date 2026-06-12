"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCompany,
  Metric,
  METRIC_META,
  ValMetric,
  VAL_META,
  valValue,
  fmtVal,
} from "@/lib/data";
import { useQuotes } from "@/lib/useQuotes";
import { usd, pct, changeColor, usdB, gw } from "@/lib/format";
import CompareChart from "@/components/charts/CompareChart";
import NewsFeed from "@/components/NewsFeed";
import WatchlistButton from "@/components/WatchlistButton";
import NotesCard from "@/components/NotesCard";

const METRICS: Metric[] = ["backlog", "capacity", "revenue"];

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = String(params.symbol || "").toUpperCase();
  const c = getCompany(symbol);
  const { quotes } = useQuotes(c && !c.private ? [c.symbol] : []);
  const [metric, setMetric] = useState<Metric>("backlog");

  if (!c) {
    return (
      <main className="px-4 pt-10 text-center">
        <p className="text-toss-gray">존재하지 않는 종목이에요.</p>
        <button
          onClick={() => router.push("/")}
          className="press mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white"
        >
          홈으로
        </button>
      </main>
    );
  }

  const q = quotes[c.symbol];
  const price = q?.price ?? c.fallbackPrice;
  const change = q?.changePct ?? c.fallbackChangePct;

  return (
    <main className="pb-6">
      {/* 상단바 */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-toss-bg/90 px-2 py-2 backdrop-blur">
        <button
          onClick={() => router.back()}
          className="press grid h-9 w-9 place-items-center rounded-full text-toss-ink"
          aria-label="뒤로"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-sm font-bold text-toss-ink">
          {c.private ? "비상장" : c.symbol}
        </span>
        <WatchlistButton symbol={c.symbol} />
      </div>

      <div className="px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 pt-1">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-bold text-white"
            style={{ background: c.color }}
          >
            {c.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h1 className="text-[20px] font-extrabold text-toss-ink">
              {c.name}
            </h1>
            <p className="truncate text-xs text-toss-gray">{c.legalName}</p>
          </div>
        </div>

        {/* 가격 / 밸류에이션 */}
        <div className="mt-3 flex items-end gap-2">
          {c.private ? (
            <>
              <span className="tnum text-[28px] font-extrabold text-toss-ink">
                {usdB(c.marketCap)}
              </span>
              <span className="mb-1 text-[15px] font-bold text-toss-gray">
                밸류에이션
              </span>
              <span className="mb-1.5 rounded-full bg-toss-line px-2 py-0.5 text-[10px] font-semibold text-toss-grayd">
                비상장
              </span>
            </>
          ) : (
            <>
              <span className="tnum text-[28px] font-extrabold text-toss-ink">
                {usd(price)}
              </span>
              <span
                className={`tnum mb-1 text-[15px] font-bold ${changeColor(
                  change
                )}`}
              >
                {pct(change)}
              </span>
              {q?.live && (
                <span className="mb-1.5 rounded-full bg-up/10 px-2 py-0.5 text-[10px] font-semibold text-up">
                  실시간
                </span>
              )}
            </>
          )}
        </div>

        {/* 태그 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-toss-card px-2.5 py-1 text-[11px] font-medium text-toss-grayd shadow-card"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* 핵심 지표 (확장) */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat
            label={c.private ? "밸류에이션" : "시가총액"}
            value={usdB(c.marketCap)}
          />
          <Stat
            label="매출(TTM)"
            value={usdB(c.revenueTTM)}
            sub={`YoY ${pct(c.revenueGrowthYoY)}`}
            subColor={changeColor(c.revenueGrowthYoY)}
          />
          <Stat label="수주잔고" value={usdB(c.backlog)} highlight />
          <Stat
            label="확보 용량"
            value={gw(c.powerSecured)}
            sub={`파이프라인 ${gw(c.powerPipeline)}`}
            highlight
          />
        </div>

        {/* 가동률 게이지 */}
        <div className="mt-3 rounded-2xl bg-toss-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-toss-grayd">
              용량 가동률
            </span>
            <span className="tnum text-[15px] font-extrabold text-toss-ink">
              {c.utilization}%
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-toss-bg">
            <div
              className="h-full rounded-full"
              style={{ width: `${c.utilization}%`, background: c.color }}
            />
          </div>
          {c.arrNote && (
            <p className="mt-2 text-[12px] text-toss-gray">💡 {c.arrNote}</p>
          )}
        </div>

        {/* 밸류에이션 배수 */}
        <section className="mt-5">
          <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
            밸류에이션 배수
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {(["perGW", "backlogMult", "ps", "coverage"] as ValMetric[]).map(
              (m) => (
                <div
                  key={m}
                  className="rounded-2xl bg-toss-card p-3.5 shadow-card"
                >
                  <p className="text-[11px] text-toss-gray">
                    {VAL_META[m].label}
                  </p>
                  <p className="tnum mt-0.5 text-[17px] font-extrabold text-toss-ink">
                    {fmtVal(valValue(c, m), m)}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* 내 투자 노트 */}
        <section className="mt-5">
          <NotesCard symbol={c.symbol} price={price} isPrivate={c.private} />
        </section>

        {/* 소개 */}
        <section className="mt-5 rounded-2xl bg-toss-card p-4 shadow-card">
          <h2 className="mb-1.5 text-sm font-bold text-toss-grayd">회사 소개</h2>
          <p className="text-[13px] leading-relaxed text-toss-grayd">
            {c.about}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
            <Info label="본사" value={c.hq} />
            <Info label="설립" value={`${c.founded}년`} />
          </div>
        </section>

        {/* 개별 추이 차트 (3종 토글) */}
        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-toss-grayd">분기별 추이</h2>
            <div className="flex gap-1 rounded-full bg-toss-card p-0.5 shadow-card">
              {METRICS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`press rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                    metric === m ? "bg-brand text-white" : "text-toss-gray"
                  }`}
                >
                  {METRIC_META[m].short}
                </button>
              ))}
            </div>
          </div>
          <CompareChart companies={[c]} metric={metric} />
        </section>

        {/* 투자 포인트 */}
        <section className="mt-5 space-y-3">
          <PointCard title="📈 주가 촉매" items={c.catalysts} color="#F04452" />
          <PointCard title="⚠️ 리스크" items={c.risks} color="#3182F6" />
        </section>

        {/* 주요 고객 */}
        <section className="mt-5">
          <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
            주요 고객·파트너
          </h2>
          <div className="flex flex-wrap gap-2">
            {c.keyCustomers.map((k) => (
              <span
                key={k}
                className="rounded-xl bg-toss-card px-3 py-1.5 text-[13px] font-semibold text-toss-ink shadow-card"
              >
                {k}
              </span>
            ))}
          </div>
        </section>

        {/* 출처 */}
        <section className="mt-5">
          <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
            데이터 출처
          </h2>
          <div className="space-y-2 rounded-2xl bg-toss-card p-3.5 shadow-card">
            {c.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="press flex items-center gap-2 text-[13px] text-brand"
              >
                <span>🔗</span>
                <span className="truncate">{s.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* 관련 뉴스 */}
        <section className="mt-6">
          <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
            {c.name} 실시간 뉴스
          </h2>
          <NewsFeed query={c.legalName} limit={10} />
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  subColor,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3.5 shadow-card ${
        highlight ? "bg-brand-light" : "bg-toss-card"
      }`}
    >
      <p className="text-[12px] text-toss-gray">{label}</p>
      <p className="tnum mt-0.5 text-[18px] font-extrabold text-toss-ink">
        {value}
      </p>
      {sub && (
        <p className={`tnum text-[11px] font-semibold ${subColor || "text-toss-gray"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-toss-line py-1.5">
      <span className="text-toss-gray">{label}</span>
      <span className="font-medium text-toss-grayd">{value}</span>
    </div>
  );
}

function PointCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-toss-card p-4 shadow-card">
      <h3 className="mb-2 text-sm font-bold text-toss-ink">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-toss-grayd">
            <span style={{ color }} className="font-bold">
              ·
            </span>
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
