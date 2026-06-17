import type { Model } from "@/types/models"
import { computeScores } from "@/lib/scoring"
import { fetchBFCLScores } from "./bfcl"
import { fetchHFScores } from "./huggingface"
import { fetchLLMStatsScores } from "./llm-stats"
import { fetchArtificialAnalysisScores } from "./artificial-analysis"

export interface LiveUpdateResult {
  models: Model[]
  updatedCount: number
  sources: {
    bfcl: { date: string; matched: number } | null
    huggingface: { matched: number } | null
    llmStats: { matched: number } | null
    artificialAnalysis: { matched: number } | null
  }
  errors: string[]
}

export async function applyLiveUpdates(models: Model[]): Promise<LiveUpdateResult> {
  const errors: string[] = []
  const sources: LiveUpdateResult["sources"] = {
    bfcl: null,
    huggingface: null,
    llmStats: null,
    artificialAnalysis: null,
  }

  const [bfclResult, hfResult, llmStatsResult, aaResult] = await Promise.allSettled([
    fetchBFCLScores(),
    fetchHFScores(),
    fetchLLMStatsScores(),
    fetchArtificialAnalysisScores(),
  ])

  const bfclScores = bfclResult.status === "fulfilled" ? bfclResult.value.scores : null
  const bfclDate   = bfclResult.status === "fulfilled" ? bfclResult.value.sourceDate : null
  if (bfclResult.status === "rejected") errors.push(`BFCL: ${String(bfclResult.reason)}`)

  const hfScores = hfResult.status === "fulfilled" ? hfResult.value : null
  if (hfResult.status === "rejected") errors.push(`OpenEvals/HF: ${String(hfResult.reason)}`)

  const llmStatsScores = llmStatsResult.status === "fulfilled" ? llmStatsResult.value : null
  if (llmStatsResult.status === "rejected") errors.push(`LLM Stats: ${String(llmStatsResult.reason)}`)

  const aaScores = aaResult.status === "fulfilled" ? aaResult.value : null
  if (aaResult.status === "rejected") errors.push(`Artificial Analysis: ${String(aaResult.reason)}`)

  let updatedCount = 0
  let bfclMatched = 0
  let hfMatched = 0
  let llmStatsMatched = 0
  let aaMatched = 0

  const updated = models.map((model) => {
    const benchmarks = { ...model.benchmarks }
    let changed = false

    if (bfclScores?.has(model.id)) {
      benchmarks.bfcl_v3 = Math.round(bfclScores.get(model.id)! * 10) / 10
      changed = true
      bfclMatched++
    }

    const hf = hfScores?.get(model.id)
    if (hf) {
      if (hf.swebench != null)     benchmarks.swebench     = hf.swebench
      if (hf.swebench_pro != null) benchmarks.swebench_pro = hf.swebench_pro
      if (hf.gpqa_diamond != null) benchmarks.gpqa_diamond = hf.gpqa_diamond
      if (hf.mmlu_pro != null)     benchmarks.mmlu_pro     = hf.mmlu_pro
      if (hf.math_aime != null)    benchmarks.math_aime    = hf.math_aime
      changed = true
      hfMatched++
    }

    const ls = llmStatsScores?.get(model.id)
    if (ls) {
      if (ls.livecodebench != null) benchmarks.livecodebench = ls.livecodebench
      changed = true
      llmStatsMatched++
    }

    // AA runs after LLM Stats so its livecodebench overwrites where both have data
    const aa = aaScores?.get(model.id)
    if (aa) {
      if (aa.tau2_bench != null)    benchmarks.tau2_bench    = aa.tau2_bench
      if (aa.livecodebench != null) benchmarks.livecodebench = aa.livecodebench
      changed = true
      aaMatched++
    }

    if (!changed) return model

    updatedCount++
    const scores = computeScores(benchmarks)
    return { ...model, benchmarks, scores, lastUpdated: new Date().toISOString() }
  })

  if (bfclDate !== null)    sources.bfcl               = { date: bfclDate, matched: bfclMatched }
  if (hfScores !== null)    sources.huggingface         = { matched: hfMatched }
  if (llmStatsScores !== null) sources.llmStats         = { matched: llmStatsMatched }
  if (aaScores !== null)    sources.artificialAnalysis  = { matched: aaMatched }

  return { models: updated, updatedCount, sources, errors }
}
