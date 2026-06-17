"use client"

import { useMemo } from "react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table"
import { LeaderboardRow } from "./LeaderboardRow"
import { SortableHeader } from "./SortableHeader"
import { useSort } from "@/hooks/useSort"
import type { Model, FilterState, SortKey } from "@/types/models"

interface LeaderboardTableProps {
  models: Model[]
  activeCategory: FilterState["category"]
  onSelectModel: (model: Model) => void
}

const SCORE_KEYS = ["sys_programming", "web_programming", "reasoning", "toolUse", "overall"] as const

function computeCrowns(models: Model[]): Set<string> {
  const crowns = new Set<string>()
  for (const key of SCORE_KEYS) {
    let best: Model | null = null
    for (const m of models) {
      const score = m.scores[key]
      if (score === null) continue
      if (!best || score > (best.scores[key] ?? -1)) best = m
    }
    if (best) crowns.add(`${key}:${best.id}`)
  }
  return crowns
}

export function LeaderboardTable({ models, activeCategory, onSelectModel }: LeaderboardTableProps) {
  const { sorted, sort, setSort } = useSort(models)

  // Crowns computed from filtered (visible) models
  const crownKeys = useMemo(() => computeCrowns(models), [models])

  const scored = sorted.filter((m) => m.status !== "upcoming")
  const upcoming = sorted.filter((m) => m.status === "upcoming")
  const rows = [...scored, ...upcoming]

  const col = (key: SortKey, label: string) => (
    <TableHead>
      <SortableHeader label={label} sortKey={key} sort={sort} onSort={setSort} />
    </TableHead>
  )

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 text-center text-xs text-muted-foreground">#</TableHead>
            {col("name", "Model")}
            {col("provider", "Provider")}
            <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Spec</TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Context</TableHead>
            {col("sys_programming", "Sys Prog")}
            {col("web_programming", "Web Prog")}
            {col("reasoning", "Reasoning")}
            {col("toolUse", "Tool Use")}
            {col("overall", "Overall")}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((model, idx) => (
            <LeaderboardRow
              key={model.id}
              rank={model.status === "upcoming" ? 0 : scored.indexOf(model) + 1}
              model={model}
              activeCategory={activeCategory}
              crownKeys={crownKeys}
              onClick={() => onSelectModel(model)}
            />
          ))}
          {rows.length === 0 && (
            <TableRow>
              <td colSpan={11} className="text-center py-12 text-muted-foreground text-sm">
                No models match the current filters.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
