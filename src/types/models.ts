export type ModelStatus = "latest" | "current" | "upcoming" | "deprecated"
export type ModelSpecialization = "general" | "coding" | "reasoning" | "small"

export interface BenchmarkScores {
  // System Programming (Python, Go, C++, C#, Rust)
  multipl_e: number | null
  humaneval_x: number | null
  swebench_pro: number | null

  // Web Programming (JS/TS, web frameworks)
  swebench: number | null
  livecodebench: number | null
  humaneval: number | null

  // Reasoning
  gpqa_diamond: number | null
  math_aime: number | null
  mmlu_pro: number | null

  // Tool Use
  bfcl_v3: number | null
  mcp_bench: number | null
  tau2_bench: number | null
}

export interface CategoryScores {
  sys_programming: number | null
  web_programming: number | null
  programming: number | null
  reasoning: number | null
  toolUse: number | null
  overall: number | null
}

export interface Model {
  id: string
  name: string
  provider: string
  status: ModelStatus
  specialization: ModelSpecialization
  releaseDate: string | null
  contextWindow: number | null
  isOpenSource: boolean
  parameterCount: string | null
  description: string
  link: string
  scores: CategoryScores
  benchmarks: BenchmarkScores
  lastUpdated: string
}

export interface FilterState {
  status: ModelStatus | "all"
  specialization: ModelSpecialization | "all"
  category: "all" | "sys_programming" | "web_programming" | "reasoning" | "toolUse"
  openSourceOnly: boolean
  search: string
}

export type SortKey =
  | "name"
  | "provider"
  | "sys_programming"
  | "web_programming"
  | "programming"
  | "reasoning"
  | "toolUse"
  | "overall"

export interface SortState {
  key: SortKey
  direction: "asc" | "desc"
}

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
