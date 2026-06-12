"use client";

import { useState } from "react";
import { COMPANIES } from "@/lib/data";
import { usdB, gw } from "@/lib/format";
import CompareChart from "@/components/charts/CompareChart";

type Metric = "backlog" | "capacity";

export default function ComparePage() {
  const [metric, setMetric] = useState<Metric>("backlog");
  const [selected, setSelected] = useState<string[]>(
    COMPANIES.map((c) => c.symbol)
  );

  const chosen = COMPANIES.filter((c) => selected.includes(c.symbol));

  const toggle = (sym: string) =>
    setSelected((cur) =>
      cur.includes(sym) ? cur.filter((s) => s !== sym) : [...cur, sym]
    );

  // 현재값 기준 랭킹
  const ranked = [...chosen].sort((a, b) =>
    metric === "backlog"
      ? b.backlog - a.backlog
      : b.powerSecured - a.powerSecured
  );
  const maxVal =
    ranked.length > 0
      ? metric === "backlog"
        ? ranked[0].backlog
        : ranked[0].powerSecured
      : 1;

  return (
    <main className="px-4 pt-3">
      <header className="py-2">
        <h1 className="text-[22px] font-extrabold text-toss-ink">비교</h1>
        <p className="text-xs text-toss-gray">
          시간(X) 대비 {metric === "backlog" ? "수주잔고" : "확보 용량"}(Y) 추이
        </p>
      </header>

      {/* 지표 토글 */}
      <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-card">
        <ToggleBtn
          active={metric === "backlog"}
          onClick={() => setMetric("backlog")}
          label="수주잔고 ($B)"
        />
        <ToggleBtn
          active={metric === "capacity"}
          onClick={() => setMetric("capacity")}
          label="확보 용량 (GW)"
        />
      </div>

      {/* 회사 선택 칩 */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {COMPANIES.map((c) => {
          const on = selected.includes(c.symbol);
          return (
            <button
              key={c.symbol}
              onClick={() => toggle(c.symbol)}
              className={`press flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
                on ? "text-white" : "bg-white text-toss-gray shadow-card"
              }`}
              style={on ? { background: c.color } : undefined}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: on ? "#fff" : c.color }}
              />
              {c.symbol}
            </button>
          );
        })}
      </div>

      {/* 차트 */}
      <div className="mt-3 fade-up">
        <CompareChart companies={chosen} metric={metric} />
      </div>

      {/* 랭킹 바 */}
      <section className="mt-5">
        <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
          현재 {metric === "backlog" ? "수주잔고" : "확보 용량"} 랭킹
        </h2>
        <div className="space-y-2.5 rounded-2xl bg-white p-4 shadow-card">
          {ranked.map((c, i) => {
            const val = metric === "backlog" ? c.backlog : c.powerSecured;
            const w = Math.max(6, (val / maxVal) * 100);
            return (
              <div key={c.symbol}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-toss-ink">
                    <span className="mr-1.5 text-toss-gray">{i + 1}</span>
                    {c.name}
                  </span>
                  <span className="tnum font-bold text-toss-ink">
                    {metric === "backlog" ? usdB(val) : gw(val)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-toss-bg">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${w}%`, background: c.color }}
                  />
                </div>
              </div>
            );
          })}
          {!ranked.length && (
            <p className="py-4 text-center text-sm text-toss-gray">
              회사를 선택해 주세요
            </p>
          )}
        </div>
      </section>

      <p className="mt-4 px-1 pb-2 text-[11px] leading-relaxed text-toss-gray">
        ※ 분기별 수주잔고·확보용량은 실적발표/공시 기반 큐레이션 값으로, 실제와
        차이가 있을 수 있습니다.
      </p>
    </main>
  );
}

function ToggleBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press rounded-xl py-2.5 text-[13px] font-bold transition ${
        active ? "bg-brand text-white" : "text-toss-gray"
      }`}
    >
      {label}
    </button>
  );
}
