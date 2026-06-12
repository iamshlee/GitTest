"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

export default function NewsFeed({
  query,
  limit = 12,
}: {
  query: string;
  limit?: number;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "empty" | "error">(
    "loading"
  );

  useEffect(() => {
    let alive = true;
    setState("loading");
    fetch(`/api/news?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        if (json?.ok && json.items?.length) {
          setItems(json.items.slice(0, limit));
          setState("ok");
        } else {
          setState(json?.items?.length ? "ok" : json?.ok ? "empty" : "error");
          if (json?.items?.length) setItems(json.items.slice(0, limit));
        }
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [query, limit]);

  if (state === "loading") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/70" />
        ))}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-toss-gray shadow-card">
        실시간 뉴스를 불러오지 못했어요. 네트워크 환경(외부망 허용)을 확인해
        주세요. 로컬·배포 환경에서는 Google News에서 자동으로 검색됩니다.
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-toss-gray shadow-card">
        관련 뉴스를 찾지 못했어요.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((n, i) => (
        <li key={i}>
          <a
            href={n.link}
            target="_blank"
            rel="noreferrer"
            className="press block rounded-2xl bg-white p-3.5 shadow-card"
          >
            <p className="text-[14px] font-semibold leading-snug text-toss-ink">
              {n.title}
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-[12px] text-toss-gray">
              <span className="font-medium text-brand">{n.source}</span>
              {n.pubDate && (
                <>
                  <span>·</span>
                  <span>{timeAgo(n.pubDate)}</span>
                </>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
