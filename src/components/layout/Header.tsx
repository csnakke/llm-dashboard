"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Database } from "lucide-react"

interface RefreshSummary {
  bfclDate: string | null
  bfclMatched: number
  hfMatched: number
  llmStatsMatched: number
  aaMatched: number
  errors: string[]
}

interface HeaderProps {
  lastUpdated: string
  isRefreshing: boolean
  refreshSummary: RefreshSummary | null
  onRefresh: () => void
}

export function Header({ lastUpdated, isRefreshing, refreshSummary, onRefresh }: HeaderProps) {
  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">LLM Models Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track and compare leading AI models across programming, reasoning, and tool use
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Updated {formatted}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Fetching live data…" : "Refresh"}
          </Button>
        </div>
        {refreshSummary && !isRefreshing && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>
              Live:{" "}
              <span className="text-foreground font-medium">
                BFCL {refreshSummary.bfclDate ?? "n/a"} ({refreshSummary.bfclMatched} models)
              </span>
              {" · "}
              <span className="text-foreground font-medium">
                HF Leaderboard ({refreshSummary.hfMatched} models)
              </span>
              {" · "}
              <span className="text-foreground font-medium">
                LLM Stats ({refreshSummary.llmStatsMatched} models)
              </span>
              {" · "}
              <span className="text-foreground font-medium">
                Artificial Analysis ({refreshSummary.aaMatched} models)
              </span>
            </span>
            {refreshSummary.errors.length > 0 && (
              <span className="text-red-500">· {refreshSummary.errors.length} source error(s)</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
