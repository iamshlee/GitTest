"use client";

import { useNote } from "@/lib/notes";
import { usd, pct, changeColor } from "@/lib/format";

export default function NotesCard({
  symbol,
  price,
  isPrivate,
}: {
  symbol: string;
  price: number;
  isPrivate?: boolean;
}) {
  const { note, save } = useNote(symbol);

  const upside =
    note.target != null && price > 0 ? (note.target / price - 1) * 100 : null;

  return (
    <div className="rounded-2xl bg-toss-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-toss-ink">📝 내 투자 노트</h3>
        <span className="text-[11px] text-toss-gray">자동 저장</span>
      </div>

      {/* 목표가 */}
      {!isPrivate && (
        <div className="mb-3 rounded-xl bg-toss-bg p-3">
          <label className="text-[12px] font-medium text-toss-grayd">
            목표가 (USD)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-toss-gray">$</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="예: 250"
              value={note.target ?? ""}
              onChange={(e) =>
                save({
                  target: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="tnum w-full bg-transparent text-[16px] font-bold text-toss-ink outline-none placeholder:font-normal placeholder:text-toss-gray"
            />
          </div>
          {upside != null && (
            <div className="mt-2 flex items-center justify-between border-t border-toss-line pt-2 text-[13px]">
              <span className="text-toss-gray">
                현재가 {usd(price)} 대비 상승여력
              </span>
              <span className={`tnum font-bold ${changeColor(upside)}`}>
                {pct(upside)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 메모 */}
      <textarea
        placeholder="투자 아이디어, 매수 근거, 체크포인트를 적어두세요."
        value={note.memo}
        onChange={(e) => save({ memo: e.target.value })}
        rows={4}
        className="w-full resize-none rounded-xl bg-toss-bg p-3 text-[13px] leading-relaxed text-toss-ink outline-none placeholder:text-toss-gray"
      />
      <p className="mt-2 text-[11px] text-toss-gray">
        🔒 메모는 이 기기(브라우저)에만 저장됩니다.
      </p>
    </div>
  );
}
