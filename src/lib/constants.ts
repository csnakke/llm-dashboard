import type { ModelStatus, ModelSpecialization } from "@/types/models"

export const STATUS_COLORS: Record<ModelStatus, string> = {
  latest: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  current: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  upcoming: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  deprecated: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
}

export const SPEC_COLORS: Record<ModelSpecialization, string> = {
  general: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  coding: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  reasoning: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  small: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
}

export const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: "bg-[#c96442]",
  OpenAI: "bg-[#10a37f]",
  Google: "bg-[#4285f4]",
  "Qwen / Alibaba": "bg-[#ff6a00]",
  Meta: "bg-[#0668e1]",
  Mistral: "bg-[#fa8232]",
  DeepSeek: "bg-[#4d6bfe]",
  xAI: "bg-[#1da1f2]",
  "Moonshot AI": "bg-[#7c3aed]",
  "Zhipu AI": "bg-[#059669]",
  MiniMax: "bg-[#db2777]",
  Microsoft: "bg-[#0078d4]",
  BigCode: "bg-[#6366f1]",
  HuggingFace: "bg-[#ff9d00]",
  Amazon: "bg-[#ff9900]",
  Cohere: "bg-[#39594d]",
}

export const BENCHMARK_LABELS: Record<string, { label: string; url?: string }> = {
  multipl_e: { label: "MultiPL-E (C++/Go/Rust/C#)" },
  humaneval_x: { label: "HumanEval-X (multi-lang)" },
  swebench_pro: { label: "SWE-bench Pro" },
  swebench: { label: "SWE-bench Verified" },
  livecodebench: { label: "LiveCodeBench" },
  humaneval: { label: "HumanEval (Python)" },
  gpqa_diamond: { label: "GPQA Diamond" },
  math_aime: { label: "MATH / AIME" },
  mmlu_pro: { label: "MMLU Pro" },
  bfcl_v3: { label: "BFCL v3" },
  mcp_bench: { label: "MCP-Bench" },
  tau2_bench: { label: "τ2-bench" },
}

export const SCORE_COLOR = (score: number | null): string => {
  if (score === null) return "text-muted-foreground"
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400"
  if (score >= 75) return "text-blue-600 dark:text-blue-400"
  if (score >= 60) return "text-yellow-600 dark:text-yellow-500"
  return "text-red-500 dark:text-red-400"
}

export const SCORE_BAR_COLOR = (score: number | null): string => {
  if (score === null) return "#e5e7eb"
  if (score >= 90) return "#10b981"
  if (score >= 75) return "#3b82f6"
  if (score >= 60) return "#eab308"
  return "#ef4444"
}

export const formatContext = (tokens: number | null): string => {
  if (tokens === null) return "—"
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`
  if (tokens >= 1_000) return `${tokens / 1_000}K`
  return String(tokens)
}
