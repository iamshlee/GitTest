"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "neocloud:notes";

export type Note = { memo: string; target: number | null };

type Store = Record<string, Note>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

// 종목별 투자 메모·목표가 (localStorage)
export function useNote(symbol: string) {
  const [note, setNote] = useState<Note>({ memo: "", target: null });

  useEffect(() => {
    const all = read();
    setNote(all[symbol] || { memo: "", target: null });
  }, [symbol]);

  const save = useCallback(
    (patch: Partial<Note>) => {
      setNote((prev) => {
        const next = { ...prev, ...patch };
        const all = read();
        if (!next.memo && next.target == null) {
          delete all[symbol];
        } else {
          all[symbol] = next;
        }
        localStorage.setItem(KEY, JSON.stringify(all));
        return next;
      });
    },
    [symbol]
  );

  return { note, save };
}
