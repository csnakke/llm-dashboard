import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import type { Model } from "@/types/models"
import { applyLiveUpdates } from "@/lib/live-data"

export interface ModelsApiResponse {
  models: Model[]
  lastUpdated: string
  count: number
  sources?: {
    bfcl: { date: string; matched: number } | null
    huggingface: { matched: number } | null
    llmStats: { matched: number } | null
    artificialAnalysis: { matched: number } | null
  }
  errors?: string[]
}

function loadModels(): Model[] {
  const filePath = join(process.cwd(), "src", "data", "models.json")
  return JSON.parse(readFileSync(filePath, "utf-8")) as Model[]
}

export async function GET(): Promise<NextResponse<ModelsApiResponse>> {
  const models = loadModels()
  const lastUpdated = models.reduce(
    (latest, m) => (m.lastUpdated > latest ? m.lastUpdated : latest),
    ""
  )
  return NextResponse.json({ models, lastUpdated, count: models.length })
}

export async function POST(): Promise<NextResponse<ModelsApiResponse>> {
  const snapshot = loadModels()
  const { models, updatedCount, sources, errors } = await applyLiveUpdates(snapshot)

  console.log(
    `[Refresh] Updated ${updatedCount} models — BFCL: ${sources.bfcl?.matched ?? 0} matched (${sources.bfcl?.date ?? "n/a"}), HF: ${sources.huggingface?.matched ?? 0} matched, LLM Stats: ${sources.llmStats?.matched ?? 0} matched, AA: ${sources.artificialAnalysis?.matched ?? 0} matched`
  )
  if (errors.length) console.warn("[Refresh] Errors:", errors)

  return NextResponse.json({
    models,
    lastUpdated: new Date().toISOString(),
    count: models.length,
    sources,
    errors: errors.length ? errors : undefined,
  })
}
