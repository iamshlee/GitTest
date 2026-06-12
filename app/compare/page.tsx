"use client";

import { useState } from "react";
import {
  COMPANIES,
  Metric,
  METRIC_META,
  metricValue,
} from "@/lib/data";
import { fmtByUnit } from "@/lib/format";
import CompareChart from "@/components/charts/CompareChart";
import ValuationView from "@/components/ValuationView";

const METRICS: Metric[] = ["backlog", "capacity", "revenue"];
type Mode = "trend" | "valuation";

export default function ComparePage() {
  const [mode, setMode] = useState<Mode>("trend");
  const [metric, setMetric] = useState<Metric>("backlog");
  const [selected, setSelected] = useState<string[]>(
    COMPANIES.map((c) => c.symbol)
  );

  const chosen = COMPANIES.filter((c) => selected.includes(c.symbol));
  const meta = METRIC_META[metric];

  const toggle = (sym: string) =>
    setSelected((cur) =>
      cur.includes(sym) ? cur.filter((s) => s !== sym) : [...cur, sym]
    );

  return (
    <main className="px-4 pt-3">
      <header className="py-2">
        <h1 className="text-[22px] font-extrabold text-toss-ink">비교</h1>
        <p className="text-xs text-toss-gray">
          {mode === "trend"
            ? `시간(X) 대비 ${meta.label}(Y) 추이를 겹쳐 보기`
            : "회사별 밸류에이션 배수를 한눈에"}
        </p>
      </header>

      {/* 모드 토글 (추이 / 밸류에이션) */}
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-toss-line/60 p-1">
        {(["trend", "valuation"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`press rounded-full py-2 text-[13px] font-bold transition ${
              mode === m ? "bg-white text-toss-ink shadow-card" : "text-toss-gray"
            }`}
          >
            {m === "trend" ? "📈 추이" : "💰 밸류에이션"}
          </button>
        ))}
      </div>

      {/* 회사 선택 칩 (공통) */}
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
              {c.name}
            </button>
          );
        })}
      </div>

      {mode === "valuation" ? (
        <div className="mt-3 fade-up">
          <ValuationView companies={chosen} />
        </div>
      ) : (
        <TrendView
          metric={metric}
          setMetric={setMetric}
          chosen={chosen}
          meta={meta}
        />
      )}
    </main>
  );
}

function TrendView({
  metric,
  setMetric,
  chosen,
  meta,
}: {
  metric: Metric;
  setMetric: (m: Metric) => void;
  chosen: typeof COMPANIES;
  meta: (typeof METRIC_META)[Metric];
}) {
  const ranked = [...chosen].sort(
    (a, b) => metricValue(b, metric) - metricValue(a, metric)
  );
  const maxVal = ranked.length ? metricValue(ranked[0], metric) : 1;

  return (
    <div className="fade-up">
      {/* 지표 토글 (3종) */}
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-card">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`press rounded-xl py-2.5 text-[13px] font-bold transition ${
              metric === m ? "bg-brand text-white" : "text-toss-gray"
            }`}
          >
            {METRIC_META[m].label.replace("(TTM)", "")}
            <span className="ml-1 text-[10px] opacity-70">
              {METRIC_META[m].unit}
            </span>
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div className="mt-3">
        <CompareChart companies={chosen} metric={metric} />
      </div>

      {/* 랭킹 바 */}
      <section className="mt-5">
        <h2 className="mb-2 px-1 text-sm font-bold text-toss-grayd">
          현재 {meta.label} 랭킹
        </h2>
        <div className="space-y-2.5 rounded-2xl bg-white p-4 shadow-card">
          {ranked.map((c, i) => {
            const val = metricValue(c, metric);
            const w = Math.max(6, (val / maxVal) * 100);
            return (
              <div key={c.symbol}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-toss-ink">
                    <span className="mr-1.5 text-toss-gray">{i + 1}</span>
                    {c.name}
                    {c.private && (
                      <span className="ml-1.5 text-[10px] text-toss-gray">
                        비상장
                      </span>
                    )}
                  </span>
                  <span className="tnum font-bold text-toss-ink">
                    {fmtByUnit(val, meta.unit)}
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
        ※ 분기별 수주잔고·용량·매출은 실적발표/공시 기반 큐레이션 값으로, 실제와
        차이가 있을 수 있습니다.
      </p>
    </div>
  );
}
