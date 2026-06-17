"use client"

import { useMemo } from "react"
import type { Model, FilterState } from "@/types/models"

export function useFilter(models: Model[], filter: FilterState): Model[] {
  return useMemo(() => {
    return models.filter((m) => {
      if (filter.status !== "all" && m.status !== filter.status) return false
      if (filter.specialization !== "all" && m.specialization !== filter.specialization) return false
      if (filter.openSourceOnly && !m.isOpenSource) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        const match =
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          (m.parameterCount?.toLowerCase().includes(q) ?? false)
        if (!match) return false
      }
      return true
    })
  }, [models, filter])
}
