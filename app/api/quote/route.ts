import { NextRequest, NextResponse } from "next/server";

// 실시간 주가 — Yahoo Finance 비공식 차트 엔드포인트
// GET /api/quote?symbols=ORCL,CRWV
// 응답: { ok, quotes: { [symbol]: { price, prevClose, changePct, currency } }, errors }
//
// 참고: 이 빌드 샌드박스는 외부망이 차단되어 실패할 수 있으며, 그 경우
// 클라이언트가 lib/data.ts의 fallbackPrice로 대체 표시합니다.

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Quote = {
  price: number;
  prevClose: number;
  changePct: number;
  currency: string;
};

async function fetchOne(symbol: string): Promise<Quote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    const meta = r?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice ?? meta.previousClose;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
    return {
      price,
      prevClose,
      changePct,
      currency: meta.currency ?? "USD",
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("symbols") || "";
  const symbols = param
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 20);

  if (!symbols.length) {
    return NextResponse.json({ ok: false, error: "no symbols", quotes: {} });
  }

  const results = await Promise.all(symbols.map((s) => fetchOne(s)));
  const quotes: Record<string, Quote> = {};
  const errors: string[] = [];
  symbols.forEach((s, i) => {
    if (results[i]) quotes[s] = results[i]!;
    else errors.push(s);
  });

  return NextResponse.json({
    ok: errors.length < symbols.length,
    quotes,
    errors,
  });
}
