import { NextRequest, NextResponse } from "next/server";

// 실시간 뉴스 검색 — Google News RSS (API 키 불필요)
// GET /api/news?q=CoreWeave  또는  ?symbol=CRWV
// 응답: { ok, items: [{ title, link, source, pubDate }], error? }
//
// 참고: 이 빌드 샌드박스는 외부망이 차단되어 실패할 수 있으며, 그 경우
// 클라이언트가 안내 메시지를 표시합니다. 로컬/배포 런타임에서는 정상 동작.

export const revalidate = 0;
export const dynamic = "force-dynamic";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function parseRss(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.split(/<item>/i).slice(1);
  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0];
    let title = tag(block, "title");
    const link = tag(block, "link");
    const pubDate = tag(block, "pubDate");
    let source = tag(block, "source");
    // Google News 제목은 "헤드라인 - 매체" 형태가 많음
    if (!source && title.includes(" - ")) {
      const parts = title.split(" - ");
      source = parts[parts.length - 1];
      title = parts.slice(0, -1).join(" - ");
    }
    if (title && link) {
      items.push({ title, link, source: source || "뉴스", pubDate });
    }
  }
  return items.slice(0, 20);
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") || sp.get("symbol") || "").trim();
  if (!q) {
    return NextResponse.json({ ok: false, error: "no query", items: [] });
  }
  // 네오클라우드 맥락 강화 + 영문 헤드라인 위주
  const query = `${q} (cloud OR AI OR datacenter OR GPU)`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: `upstream ${res.status}`,
        items: [],
      });
    }
    const xml = await res.text();
    const items = parseRss(xml);
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e?.message || "fetch failed",
      items: [],
    });
  }
}
