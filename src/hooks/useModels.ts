"use client"

import { useState, useEffect, useCallback } from "react"
import type { Model, ModelsApiResponse } from "@/types/models"

interface RefreshSummary {
  bfclDate: string | null
  bfclMatched: number
  hfMatched: number
  llmStatsMatched: number
  aaMatched: number
  errors: string[]
}

interface UseModelsResult {
  models: Model[]
  lastUpdated: string
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  refreshSummary: RefreshSummary | null
  refresh: () => Promise<void>
}

export function useModels(): UseModelsResult {
  const [models, setModels] = useState<Model[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshSummary, setRefreshSummary] = useState<RefreshSummary | null>(null)

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json() as Promise<ModelsApiResponse>)
      .then((data) => {
        setModels(data.models)
        setLastUpdated(data.lastUpdated)
      })
      .catch(() => setError("Failed to load models"))
      .finally(() => setIsLoading(false))
  }, [])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setRefreshSummary(null)
    try {
      const res = await fetch("/api/models", { method: "POST" })
      const data = (await res.json()) as ModelsApiResponse
      setModels(data.models)
      setLastUpdated(data.lastUpdated)
      setRefreshSummary({
        bfclDate: data.sources?.bfcl?.date ?? null,
        bfclMatched: data.sources?.bfcl?.matched ?? 0,
        hfMatched: data.sources?.huggingface?.matched ?? 0,
        llmStatsMatched: data.sources?.llmStats?.matched ?? 0,
        aaMatched: data.sources?.artificialAnalysis?.matched ?? 0,
        errors: data.errors ?? [],
      })
    } catch {
      setError("Refresh failed")
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  return { models, lastUpdated, isLoading, isRefreshing, error, refreshSummary, refresh }
}
