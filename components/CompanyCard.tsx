"use client";

import Link from "next/link";
import { Company } from "@/lib/data";
import { LiveQuote } from "@/lib/useQuotes";
import { usd, pct, changeColor, usdB, gw } from "@/lib/format";
import Sparkline from "./Sparkline";
import WatchlistButton from "./WatchlistButton";

export default function CompanyCard({
  c,
  quote,
}: {
  c: Company;
  quote?: LiveQuote;
}) {
  const change = quote?.changePct ?? c.fallbackChangePct;
  const price = quote?.price ?? c.fallbackPrice;
  const spark = c.backlogHistory.map((p) => p.v);

  return (
    <Link
      href={`/company/${c.symbol}`}
      className="press block rounded-2xl bg-toss-card p-4 shadow-card"
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white"
          style={{ background: c.color }}
        >
          {c.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-bold text-toss-ink">
              {c.name}
            </p>
            <span className="shrink-0 text-[11px] font-medium text-toss-gray">
              {c.private ? "비상장" : c.symbol}
            </span>
            {!c.private && quote?.live && (
              <span className="ml-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-up" />
            )}
          </div>
          <p className="truncate text-xs text-toss-gray">{c.oneLiner}</p>
        </div>
        <WatchlistButton symbol={c.symbol} size="sm" />
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          {c.private ? (
            <>
              <p className="tnum text-[17px] font-bold text-toss-ink">
                {usdB(c.marketCap)}
              </p>
              <p className="text-[13px] font-semibold text-toss-gray">
                밸류에이션
              </p>
            </>
          ) : (
            <>
              <p className="tnum text-[17px] font-bold text-toss-ink">
                {usd(price)}
              </p>
              <p
                className={`tnum text-[13px] font-semibold ${changeColor(
                  change
                )}`}
              >
                {pct(change)}
              </p>
            </>
          )}
        </div>
        <Sparkline data={spark} color={c.color} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="수주잔고" value={usdB(c.backlog)} />
        <Metric label="확보 용량" value={gw(c.powerSecured)} />
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-toss-bg px-3 py-2">
      <p className="text-[11px] text-toss-gray">{label}</p>
      <p className="tnum text-sm font-bold text-toss-ink">{value}</p>
    </div>
  );
}
