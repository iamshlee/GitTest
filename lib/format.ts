// 숫자/통화 포맷 헬퍼

// 10억 USD 단위 → 사람이 읽기 좋은 문자열 ($455B, $4.5B)
export function usdB(b: number): string {
  if (b >= 1000) return `$${(b / 1000).toFixed(b % 1000 === 0 ? 0 : 1)}T`;
  if (b >= 100) return `$${b.toFixed(0)}B`;
  if (b >= 10) return `$${b.toFixed(1)}B`;
  return `$${b.toFixed(1)}B`;
}

export function gw(v: number): string {
  return `${v.toFixed(v < 1 ? 2 : 1)}GW`;
}

// 단위(METRIC_META.unit) 기준 포맷
export function fmtByUnit(v: number, unit: "$B" | "GW"): string {
  return unit === "GW" ? gw(v) : usdB(v);
}

export function usd(v: number): string {
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function pct(v: number): string {
  const s = v >= 0 ? "+" : "";
  return `${s}${v.toFixed(2)}%`;
}

// 한국 증시 관례: 상승=빨강, 하락=파랑
export function changeColor(v: number): string {
  if (v > 0) return "text-up";
  if (v < 0) return "text-down";
  return "text-toss-gray";
}

export function changeBg(v: number): string {
  if (v > 0) return "bg-up/10 text-up";
  if (v < 0) return "bg-down/10 text-down";
  return "bg-toss-line text-toss-gray";
}

// 상대시간 (뉴스 발행시각)
export function timeAgo(dateStr: string): string {
  const d = new Date(dateStr).getTime();
  if (isNaN(d)) return "";
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(d).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
