// Fetches the latest BFCL overall accuracy scores from the HuanzhiMao/BFCL-Result GitHub repo.
// Returns a map of our model ID → bfcl_v3 score (0–100).

const REPO_CONTENTS_URL =
  "https://api.github.com/repos/HuanzhiMao/BFCL-Result/contents/"

// Maps our model IDs to substrings to match against BFCL model names (case-insensitive)
const BFCL_NAME_MAP: Record<string, string[]> = {
  "claude-opus-4-7":       ["claude-opus-4"],
  "claude-opus-4-6":       ["claude-opus-4"],
  "claude-sonnet-4-6":     ["claude-sonnet-4"],
  "claude-haiku-4-5":      ["claude-haiku-4"],
  "gpt-5-5-pro":           ["gpt-5.5", "gpt-5.2"],
  "gpt-5-5":               ["gpt-5.2", "gpt-5.5"],
  "o3":                    ["o3-2025", "o3-04"],
  "gemini-3-1-pro":        ["gemini-3-pro", "gemini-3.1-pro"],
  "gemini-3-1-flash":      ["gemini-3-flash", "gemini-2.5-flash"],
  "grok-4":                ["grok-4-0709", "grok-4-1"],
  "grok-4-mini":           ["grok-4-mini", "grok-4-1-fast"],
  "glm-5-1":               ["glm-4.6", "glm-5"],
  "kimi-k2-6":             ["kimi-k2"],
  "llama-4-maverick":      ["llama-4-maverick"],
  "llama-4-scout":         ["llama-4-scout"],
  "llama-3-3-70b":         ["llama-3.3-70b"],
  "mistral-medium-3-5":    ["mistral-medium-2505", "mistral-medium-3"],
  "mistral-large-2":       ["mistral-large-2411"],
  "qwq-32b":               ["qwen3-32b", "qwq-32b"],
  "qwen-3-7-max":          ["qwen3-235b"],
  "qwen-3-5-72b":          ["qwen3-72b"],
  "deepseek-v4-pro":       ["deepseek-v3.2"],
  "deepseek-v3-2":         ["deepseek-v3.2", "deepseek-v3"],
  "amazon-nova-pro":       ["nova-pro"],
  "cohere-command-r-plus": ["command-a", "command-r"],
  "phi-4-14b":             ["phi-4"],
  "gemma-4-31b":           ["gemma-3-27b"],
  "gemma-3":               ["gemma-3-27b", "gemma-3-12b"],
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()]))
  })
}

async function getLatestResultFolder(): Promise<string> {
  const res = await fetch(REPO_CONTENTS_URL, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const files: Array<{ name: string; type: string }> = await res.json()
  // Date folders look like "2025-12-16" — take the latest
  const dateFolders = files
    .filter((f) => f.type === "dir" && /^\d{4}-\d{2}-\d{2}$/.test(f.name))
    .map((f) => f.name)
    .sort()
  if (dateFolders.length === 0) throw new Error("No BFCL date folders found")
  return dateFolders[dateFolders.length - 1]
}

export async function fetchBFCLScores(): Promise<{
  scores: Map<string, number>
  sourceDate: string
}> {
  const latestFolder = await getLatestResultFolder()
  const csvUrl = `https://raw.githubusercontent.com/HuanzhiMao/BFCL-Result/main/${latestFolder}/score/data_overall.csv`

  const res = await fetch(csvUrl, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`Failed to fetch BFCL CSV: ${res.status}`)
  const text = await res.text()
  const rows = parseCsv(text)

  // Build a lookup: lowercased model name → overall accuracy
  const bfclLookup = new Map<string, number>()
  for (const row of rows) {
    const modelName = (row["Model"] ?? "").toLowerCase()
    const accStr = row["Overall Acc"] ?? ""
    const acc = parseFloat(accStr.replace("%", ""))
    if (modelName && !isNaN(acc)) {
      bfclLookup.set(modelName, acc)
    }
  }

  // Match our model IDs to BFCL entries
  const scores = new Map<string, number>()
  for (const [modelId, patterns] of Object.entries(BFCL_NAME_MAP)) {
    for (const [bfclName, score] of bfclLookup) {
      if (patterns.some((p) => bfclName.includes(p.toLowerCase()))) {
        // Prefer FC variants when available
        const existingScore = scores.get(modelId)
        if (existingScore === undefined || bfclName.includes("fc")) {
          scores.set(modelId, score)
        }
        break
      }
    }
  }

  return { scores, sourceDate: latestFolder }
}
