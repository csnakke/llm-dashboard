"use client"

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import type { SortKey, SortState } from "@/types/models"

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  sort: SortState
  onSort: (key: SortKey) => void
  className?: string
}

export function SortableHeader({ label, sortKey, sort, onSort, className }: SortableHeaderProps) {
  const isActive = sort.key === sortKey
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide hover:text-foreground transition-colors ${
        isActive ? "text-foreground" : "text-muted-foreground"
      } ${className ?? ""}`}
    >
      {label}
      {isActive ? (
        sort.direction === "desc" ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronUp className="h-3 w-3" />
        )
      ) : (
        <ChevronsUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  )
}
