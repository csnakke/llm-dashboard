import { SCORE_BAR_COLOR, SCORE_COLOR } from "@/lib/constants"

interface BenchmarkItemProps {
  label: string
  score: number | null
  weight: number
}

export function BenchmarkItem({ label, score, weight }: BenchmarkItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">({Math.round(weight * 100)}% weight)</span>
        </div>
        <span className={`text-sm font-semibold tabular-nums ${SCORE_COLOR(score)}`}>
          {score !== null ? `${score}%` : "N/A"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        {score !== null && (
          <div
            className="h-full rounded-full"
            style={{ width: `${score}%`, backgroundColor: SCORE_BAR_COLOR(score) }}
          />
        )}
      </div>
    </div>
  )
}
