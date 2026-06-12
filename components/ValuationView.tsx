"use client";

import { useState } from "react";
import { Company, ValMetric, VAL_META, valValue, fmtVal } from "@/lib/data";

const VAL_METRICS: ValMetric[] = ["perGW", "backlogMult", "ps", "coverage"];

export default function ValuationView({ companies }: { companies: Company[] }) {
  const [vm, setVm] = useState<ValMetric>("perGW");
  const meta = VAL_META[vm];

  // 매력 순 정렬 (lowerBetter면 오름차순)
  const ranked = [...companies].sort((a, b) => {
    const av = valValue(a, vm);
    const bv = valValue(b, vm);
    return meta.lowerBetter ? av - bv : bv - av;
  });
  const maxVal = Math.max(...companies.map((c) => valValue(c, vm)), 0.0001);

  return (
    <div>
      {/* 배수 선택 */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {VAL_METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setVm(m)}
            className={`press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
              vm === m
                ? "bg-toss-ink text-white"
                : "bg-toss-card text-toss-grayd shadow-card"
            }`}
          >
            {VAL_META[m].label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* 설명 */}
      <div className="mt-3 rounded-2xl bg-brand-light p-3.5">
        <p className="text-[13px] font-bold text-brand-dark">{meta.label}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-toss-grayd">
          {meta.desc}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-brand">
          {meta.lowerBetter ? "◀ 낮을수록 매력적" : "높을수록 매력적 ▶"}
        </p>
      </div>

      {/* 랭킹 */}
      <div className="mt-3 space-y-2.5 rounded-2xl bg-toss-card p-4 shadow-card">
        {ranked.map((c, i) => {
          const val = valValue(c, vm);
          const w = Math.max(6, (val / maxVal) * 100);
          const best = i === 0;
          return (
            <div key={c.symbol}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-toss-ink">
                  <span className="mr-1.5 text-toss-gray">{i + 1}</span>
                  {c.name}
                  {best && (
                    <span className="ml-1.5 rounded-md bg-up/10 px-1.5 py-0.5 text-[10px] font-bold text-up">
                      최상위
                    </span>
                  )}
                </span>
                <span className="tnum font-bold text-toss-ink">
                  {fmtVal(val, vm)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-toss-bg">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${w}%`,
                    background: best ? c.color : `${c.color}99`,
                  }}
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

      <p className="mt-3 px-1 text-[11px] leading-relaxed text-toss-gray">
        ※ 배수는 현재 시총/매출/수주잔고/확보전력으로 계산한 참고 지표입니다.
        비상장사는 밸류에이션을 시총 대용으로 사용합니다.
      </p>
    </div>
  );
}
