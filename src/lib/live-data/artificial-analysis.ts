// Fetches tau2_bench and livecodebench scores from the Artificial Analysis API.
// Requires ARTIFICIAL_ANALYSIS_API_KEY in env. Rate limit: 1000 req/day.

const AA_BASE = "https://artificialanalysis.ai/api/v2/data/llms/models"

// Maps Artificial Analysis model slugs → our model IDs
const AA_SLUG_MAP: Record<string, string> = {
  // Direct slug matches
  "claude-opus-4-7":    "claude-opus-4-7",
  "claude-opus-4-6":    "claude-opus-4-6",
  "claude-sonnet-4-6":  "claude-sonnet-4-6",
  "gpt-5-5":            "gpt-5-5",
  "gpt-5-5-pro":        "gpt-5-5-pro",
  "grok-4":             "grok-4",
  "kimi-k2-6":          "kimi-k2-6",
  "glm-5-1":            "glm-5-1",
  "deepseek-v4-pro":    "deepseek-v4-pro",
  "deepseek-v3-2":      "deepseek-v3-2",
  "deepseek-r1":        "deepseek-r1",
  "devstral-2":         "devstral-2",
  "devstral-small-2":   "devstral-small-2",
  "minimax-m2-7":       "minimax-m2-7",
  "qwen3-7-max":        "qwen3-7-max",
  "gemma-4-31b":        "gemma-4-31b",
  "llama-4-maverick":   "llama-4-maverick",
  "llama-4-scout":      "llama-4-scout",
  "o3":                 "o3",
  "qwq-32b":            "qwq-32b",
  "mistral-medium-3-5": "mistral-medium-3-5",
  "mistral-large-2":    "mistral-large-2",
  "gpt-4o":             "gpt-4o",
  "gemini-3-5-flash":   "gemini-3-5-flash",
  // Near-match slugs
  "gemini-3-1-pro-preview":         "gemini-3-1-pro",
  "qwen3-coder-480b-a35b-instruct": "qwen3-coder-480b",
  "phi-4":                          "phi-4-14b",
  "gemma-3-27b":                    "gemma-3",
  "nova-pro":                       "amazon-nova-pro",
  "grok-4-1-fast":                  "grok-4-mini",
}

interface AAEvaluations {
  tau2: number | null
  livecodebench: number | null
}

interface AAModel {
  slug: string
  evaluations: AAEvaluations
}

export interface ArtificialAnalysisScores {
  tau2_bench?: number
  livecodebench?: number
}

export async function fetchArtificialAnalysisScores(): Promise<Map<string, ArtificialAnalysisScores>> {
  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY
  if (!apiKey) throw new Error("ARTIFICIAL_ANALYSIS_API_KEY not set")

  const res = await fetch(AA_BASE, {
    headers: { "x-api-key": apiKey },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Artificial Analysis API error: ${res.status}`)

  const data: { data: AAModel[] } = await res.json()

  const result = new Map<string, ArtificialAnalysisScores>()

  for (const model of data.data) {
    const ourId = AA_SLUG_MAP[model.slug]
    if (!ourId) continue

    const scores: ArtificialAnalysisScores = {}
    const { tau2, livecodebench } = model.evaluations

    if (tau2 != null && tau2 > 0) scores.tau2_bench    = Math.round(tau2 * 1000) / 10
    if (livecodebench != null)    scores.livecodebench = Math.round(livecodebench * 1000) / 10

    if (Object.keys(scores).length > 0) result.set(ourId, scores)
  }

  return result
}
