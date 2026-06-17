import type { BenchmarkScores, CategoryScores } from "@/types/models"

interface WeightedValue {
  score: number | null
  weight: number
}

function weightedAverage(values: WeightedValue[]): number | null {
  const available = values.filter((v) => v.score !== null)
  if (available.length === 0) return null
  const totalWeight = available.reduce((sum, v) => sum + v.weight, 0)
  const weightedSum = available.reduce((sum, v) => sum + v.score! * v.weight, 0)
  return Math.round((weightedSum / totalWeight) * 10) / 10
}

export function computeScores(b: BenchmarkScores): CategoryScores {
  const sys_programming = weightedAverage([
    { score: b.multipl_e, weight: 0.5 },
    { score: b.humaneval_x, weight: 0.3 },
    { score: b.swebench_pro, weight: 0.2 },
  ])

  const web_programming = weightedAverage([
    { score: b.swebench, weight: 0.55 },
    { score: b.livecodebench, weight: 0.3 },
    { score: b.humaneval, weight: 0.15 },
  ])

  const programming = weightedAverage([
    { score: sys_programming, weight: 0.45 },
    { score: web_programming, weight: 0.55 },
  ])

  const reasoning = weightedAverage([
    { score: b.gpqa_diamond, weight: 0.4 },
    { score: b.math_aime, weight: 0.35 },
    { score: b.mmlu_pro, weight: 0.25 },
  ])

  const toolUse = weightedAverage([
    { score: b.bfcl_v3, weight: 0.45 },
    { score: b.mcp_bench, weight: 0.35 },
    { score: b.tau2_bench, weight: 0.2 },
  ])

  const overall = weightedAverage([
    { score: programming, weight: 0.35 },
    { score: reasoning, weight: 0.35 },
    { score: toolUse, weight: 0.3 },
  ])

  return { sys_programming, web_programming, programming, reasoning, toolUse, overall }
}
