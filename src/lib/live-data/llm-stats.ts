// Fetches LiveCodeBench Pro scores from the LLM Stats API (api.llm-stats.com).
// Updates livecodebench for matching models. Requires LLM_STATS_API_KEY in env.

const LLM_STATS_BASE = "https://api.llm-stats.com"

// Maps our model IDs to substrings to match against LLM Stats model_id (case-insensitive)
const LLM_STATS_MAP: Record<string, string[]> = {
  "gemini-3-1-pro":   ["gemini-3.1-pro"],
  "gemini-3-1-flash": ["gemini-3-flash-preview", "gemini-3.1-flash"],
}

interface ScoreEntry {
  model_id: string
  benchmark_id: string
  normalized_score: number | null
}

export interface LLMStatsScores {
  livecodebench?: number
}

export async function fetchLLMStatsScores(): Promise<Map<string, LLMStatsScores>> {
  const apiKey = process.env.LLM_STATS_API_KEY
  if (!apiKey) throw new Error("LLM_STATS_API_KEY not set")

  const res = await fetch(`${LLM_STATS_BASE}/stats/v1/scores`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`LLM Stats API error: ${res.status}`)

  const data: { scores: ScoreEntry[] } = await res.json()

  // Deduplicate: keep first occurrence of each model_id + benchmark_id pair
  const seen = new Set<string>()
  const unique: ScoreEntry[] = []
  for (const s of data.scores) {
    const key = `${s.model_id}::${s.benchmark_id}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(s)
    }
  }

  // Build lookup: lowercased model_id → normalized score for livecodebench-pro
  const lcbLookup = new Map<string, number>()
  for (const s of unique) {
    if (s.benchmark_id === "livecodebench-pro" && s.normalized_score != null) {
      lcbLookup.set(s.model_id.toLowerCase(), s.normalized_score)
    }
  }

  const result = new Map<string, LLMStatsScores>()

  for (const [modelId, patterns] of Object.entries(LLM_STATS_MAP)) {
    for (const [llmStatsId, score] of lcbLookup) {
      if (patterns.some((p) => llmStatsId.includes(p.toLowerCase()))) {
        // normalized_score is 0–1; convert to 0–100 with one decimal
        result.set(modelId, { livecodebench: Math.round(score * 1000) / 10 })
        break
      }
    }
  }

  return result
}
