"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { ScoreCell } from "./ScoreCell"
import { StatusBadge, SpecBadge } from "./StatusBadge"
import { PROVIDER_COLORS, formatContext } from "@/lib/constants"
import type { Model, FilterState } from "@/types/models"

interface LeaderboardRowProps {
  rank: number
  model: Model
  activeCategory: FilterState["category"]
  crownKeys: Set<string>
  onClick: () => void
}

export function LeaderboardRow({ rank, model, activeCategory, crownKeys, onClick }: LeaderboardRowProps) {
  const providerColor = PROVIDER_COLORS[model.provider] ?? "bg-gray-400"
  const isUpcoming = model.status === "upcoming"

  return (
    <TableRow
      onClick={onClick}
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
        isUpcoming ? "opacity-60 italic" : ""
      }`}
    >
      <TableCell className="w-10 text-center text-sm font-mono text-muted-foreground">
        {isUpcoming ? "—" : rank}
      </TableCell>
      <TableCell className="min-w-[180px]">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${providerColor}`}
          >
            {model.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sm leading-tight">{model.name}</div>
            {model.parameterCount && (
              <div className="text-xs text-muted-foreground">{model.parameterCount}</div>
            )}
          </div>
          {model.isOpenSource && (
            <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
              OS
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
        {model.provider}
      </TableCell>
      <TableCell>
        <StatusBadge status={model.status} />
      </TableCell>
      <TableCell>
        <SpecBadge spec={model.specialization} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground text-right font-mono">
        {formatContext(model.contextWindow)}
      </TableCell>
      <TableCell className="pr-4">
        <ScoreCell
          score={model.scores.sys_programming}
          isActive={activeCategory === "sys_programming"}
          isCrown={crownKeys.has(`sys_programming:${model.id}`)}
        />
      </TableCell>
      <TableCell className="pr-4">
        <ScoreCell
          score={model.scores.web_programming}
          isActive={activeCategory === "web_programming"}
          isCrown={crownKeys.has(`web_programming:${model.id}`)}
        />
      </TableCell>
      <TableCell className="pr-4">
        <ScoreCell
          score={model.scores.reasoning}
          isActive={activeCategory === "reasoning"}
          isCrown={crownKeys.has(`reasoning:${model.id}`)}
        />
      </TableCell>
      <TableCell className="pr-4">
        <ScoreCell
          score={model.scores.toolUse}
          isActive={activeCategory === "toolUse"}
          isCrown={crownKeys.has(`toolUse:${model.id}`)}
        />
      </TableCell>
      <TableCell className="pr-4">
        <ScoreCell
          score={model.scores.overall}
          isActive={activeCategory === "all"}
          isCrown={crownKeys.has(`overall:${model.id}`)}
        />
      </TableCell>
    </TableRow>
  )
}
