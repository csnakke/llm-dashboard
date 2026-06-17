"use client"

import { useState, useMemo } from "react"
import type { Model, SortKey, SortState } from "@/types/models"

export function useSort(models: Model[]) {
  const [sort, setSort] = useState<SortState>({ key: "overall", direction: "desc" })

  const sorted = useMemo(() => {
    return [...models].sort((a, b) => {
      let aVal: string | number | null
      let bVal: string | number | null

      if (sort.key === "name" || sort.key === "provider") {
        aVal = a[sort.key]
        bVal = b[sort.key]
      } else {
        aVal = a.scores[sort.key]
        bVal = b.scores[sort.key]
      }

      // Nulls always last regardless of direction
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return 1
      if (bVal === null) return -1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sort.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      const diff = (aVal as number) - (bVal as number)
      return sort.direction === "asc" ? diff : -diff
    })
  }, [models, sort])

  const setSort_ = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "desc" ? "asc" : "desc" }
        : { key, direction: "desc" }
    )
  }

  return { sorted, sort, setSort: setSort_ }
}
