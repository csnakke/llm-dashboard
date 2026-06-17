// Fetches benchmark scores from the OpenEvals/leaderboard-data dataset on HuggingFace.
// Covers: SWE-bench Verified, SWE-bench Pro, GPQA, MMLU Pro, AIME 2026 — no API key needed.

const OPENEVALS_URL =
  "https://datasets-server.huggingface.co/rows?dataset=OpenEvals%2Fleaderboard-data&config=default&split=train"

interface OpenEvalsRow {
  model_id: string
  model_name: string
  provider: string
  sweVerified_score: number | null
  swePro_score: number | null
  gpqa_score: number | null
  mmluPro_score: number | null
  aime2026_score: number | null
}

// Maps our model IDs to substrings to match against OpenEvals model_name (case-insensitive)
const OPENEVALS_MAP: Record<string, string[]> = {
  "kimi-k2-6":          ["kimi-k2"],
  "minimax-m2-7":       ["minimax-m2"],
  "glm-5-1":            ["glm-4.7", "glm-5"],
  "deepseek-v4-pro":    ["deepseek-v3.2", "deepseek-v4"],
  "deepseek-v3-2":      ["deepseek-v3.2"],
  "deepseek-r1":        ["deepseek-r1"],
  "qwen-3-7-max":       ["qwen3.5-397b", "qwen3.5-27b"],
  "qwen-3-5-72b":       ["qwen3.5-122b", "qwen3.5-72b"],
  "llama-4-maverick":   ["llama-4-maverick"],
  "llama-4-scout":      ["llama-4-scout"],
  "gemma-4-31b":        ["gemma-4-31b", "gemma-3-27b"],
  "gemma-4-26b-moe":    ["gemma-4-26b"],
  "gemma-3":            ["gemma-3-27b"],
  "phi-4-14b":          ["phi-4"],
  "starcoder2-15b":     ["starcoder2"],
  "qwq-32b":            ["qwen3-32b", "qwq-32b"],
}

async function fetchAllRows(): Promise<OpenEvalsRow[]> {
  const rows: OpenEvalsRow[] = []
  // Dataset has ~105 rows; fetch in two pages
  const pages = [
    `${OPENEVALS_URL}&offset=0&length=100`,
    `${OPENEVALS_URL}&offset=100&length=10`,
  ]
  for (const url of pages) {
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) continue
    const data: { rows: Array<{ row: OpenEvalsRow }> } = await res.json()
    if (data.rows) rows.push(...data.rows.map((r) => r.row))
  }
  return rows
}

export interface HFBenchmarkScores {
  swebench?: number
  swebench_pro?: number
  gpqa_diamond?: number
  mmlu_pro?: number
  math_aime?: number
}

export async function fetchHFScores(): Promise<Map<string, HFBenchmarkScores>> {
  const allRows = await fetchAllRows()

  // Build lookup: lowercased model_name → row
  const lookup = new Map<string, OpenEvalsRow>()
  for (const row of allRows) {
    lookup.set(row.model_name.toLowerCase(), row)
  }

  const result = new Map<string, HFBenchmarkScores>()

  for (const [modelId, patterns] of Object.entries(OPENEVALS_MAP)) {
    for (const [name, row] of lookup) {
      if (patterns.some((p) => name.includes(p.toLowerCase()))) {
        const scores: HFBenchmarkScores = {}
        if (row.sweVerified_score != null) scores.swebench = row.sweVerified_score
        if (row.swePro_score != null)      scores.swebench_pro = row.swePro_score
        if (row.gpqa_score != null)        scores.gpqa_diamond = row.gpqa_score
        if (row.mmluPro_score != null)     scores.mmlu_pro = row.mmluPro_score
        if (row.aime2026_score != null)    scores.math_aime = row.aime2026_score
        if (Object.keys(scores).length > 0) result.set(modelId, scores)
        break
      }
    }
  }

  return result
}
