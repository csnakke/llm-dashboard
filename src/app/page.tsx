"use client"

import { useState, useMemo } from "react"
import { useModels } from "@/hooks/useModels"
import { useFilter } from "@/hooks/useFilter"
import { Header } from "@/components/layout/Header"
import { FilterBar } from "@/components/filters/FilterBar"
import { LeaderboardTable } from "@/components/table/LeaderboardTable"
import { ModelDrawer } from "@/components/drawer/ModelDrawer"
import { Skeleton } from "@/components/ui/skeleton"
import type { FilterState, Model } from "@/types/models"

const DEFAULT_FILTER: FilterState = {
  status: "all",
  specialization: "all",
  category: "all",
  openSourceOnly: false,
  search: "",
}

export default function HomePage() {
  const { models, lastUpdated, isLoading, isRefreshing, refreshSummary, refresh } = useModels()
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const filtered = useFilter(models, filter)

  const counts = useMemo(() => {
    const status: Record<string, number> = { all: models.length }
    const specialization: Record<string, number> = { all: models.length }

    for (const m of models) {
      status[m.status] = (status[m.status] ?? 0) + 1
      specialization[m.specialization] = (specialization[m.specialization] ?? 0) + 1
    }

    return { status, specialization, results: filtered.length, total: models.length }
  }, [models, filtered])

  const handleFilterChange = (update: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...update }))
  }

  if (isLoading) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </main>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
      <Header lastUpdated={lastUpdated} isRefreshing={isRefreshing} refreshSummary={refreshSummary} onRefresh={refresh} />
      <FilterBar filter={filter} onChange={handleFilterChange} counts={counts} />
      <LeaderboardTable
        models={filtered}
        activeCategory={filter.category}
        onSelectModel={setSelectedModel}
      />
      <ModelDrawer model={selectedModel} onClose={() => setSelectedModel(null)} />
    </main>
  )
}
