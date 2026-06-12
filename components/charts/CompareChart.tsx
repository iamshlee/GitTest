"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Company, Metric, metricHistory, METRIC_META } from "@/lib/data";

export default function CompareChart({
  companies,
  metric,
}: {
  companies: Company[];
  metric: Metric;
}) {
  if (!companies.length) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl bg-toss-card text-sm text-toss-gray shadow-card">
        비교할 회사를 선택해 주세요
      </div>
    );
  }

  const unit = METRIC_META[metric].unit;
  const labels = metricHistory(companies[0], metric).map((p) => p.t);

  const rows = labels.map((t, i) => {
    const row: Record<string, number | string> = { t };
    for (const c of companies) {
      row[c.symbol] = metricHistory(c, metric)[i]?.v ?? 0;
    }
    return row;
  });

  return (
    <div className="rounded-2xl bg-toss-card p-3 pt-4 shadow-card">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={rows} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          {/* 테마 중립 색상 (라이트/다크 공용) */}
          <CartesianGrid stroke="rgba(139,149,161,0.22)" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "#8B95A1" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(139,149,161,0.3)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#8B95A1" }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: "rgba(139,149,161,0.3)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(139,149,161,0.25)",
              background: "var(--card)",
              fontSize: 12,
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            }}
            labelStyle={{ color: "var(--ink)", fontWeight: 700 }}
            itemStyle={{ color: "var(--ink)" }}
            formatter={(value: any, name: any) => [`${value}${unit}`, name]}
          />
          {companies.map((c) => (
            <Line
              key={c.symbol}
              type="monotone"
              dataKey={c.symbol}
              stroke={c.color}
              strokeWidth={2.4}
              dot={{ r: 2.5, fill: c.color }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
