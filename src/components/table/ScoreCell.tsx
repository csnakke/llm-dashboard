"use client"

import { SCORE_COLOR, SCORE_BAR_COLOR } from "@/lib/constants"

interface ScoreCellProps {
  score: number | null
  isActive?: boolean
  isCrown?: boolean
}

export function ScoreCell({ score, isActive, isCrown }: ScoreCellProps) {
  return (
    <div
      className={`flex flex-col items-end gap-0.5 min-w-[72px] ${
        isActive ? "opacity-100" : "opacity-85"
      }`}
    >
      <div className="flex items-center gap-1">
        {isCrown && <span className="text-xs">👑</span>}
        <span className={`text-sm font-semibold tabular-nums ${SCORE_COLOR(score)}`}>
          {score !== null ? score.toFixed(1) : "—"}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        {score !== null && (
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${score}%`,
              backgroundColor: SCORE_BAR_COLOR(score),
            }}
          />
        )}
      </div>
    </div>
  )
}
