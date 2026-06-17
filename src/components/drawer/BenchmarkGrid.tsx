import { BenchmarkItem } from "./BenchmarkItem"
import { ScoreCell } from "@/components/table/ScoreCell"
import { BENCHMARK_LABELS } from "@/lib/constants"
import type { BenchmarkScores, CategoryScores } from "@/types/models"

interface BenchmarkGridProps {
  benchmarks: BenchmarkScores
  scores: CategoryScores
}

export function BenchmarkGrid({ benchmarks, scores }: BenchmarkGridProps) {
  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: "sys_programming", label: "Sys Programming" },
            { key: "web_programming", label: "Web Programming" },
            { key: "reasoning", label: "Reasoning" },
            { key: "toolUse", label: "Tool Use" },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="rounded-lg border p-3 space-y-1">
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
            <ScoreCell score={scores[key]} />
          </div>
        ))}
      </div>

      {/* Sys Programming */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">System Programming</h4>
          <span className="text-xs text-muted-foreground">Python · Go · C++ · C# · Rust</span>
        </div>
        <div className="space-y-3">
          <BenchmarkItem label={BENCHMARK_LABELS.multipl_e.label} score={benchmarks.multipl_e} weight={0.5} />
          <BenchmarkItem label={BENCHMARK_LABELS.humaneval_x.label} score={benchmarks.humaneval_x} weight={0.3} />
          <BenchmarkItem label={BENCHMARK_LABELS.swebench_pro.label} score={benchmarks.swebench_pro} weight={0.2} />
        </div>
      </div>

      {/* Web Programming */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Web Programming</h4>
          <span className="text-xs text-muted-foreground">JavaScript · TypeScript · Web Frameworks</span>
        </div>
        <div className="space-y-3">
          <BenchmarkItem label={BENCHMARK_LABELS.swebench.label} score={benchmarks.swebench} weight={0.55} />
          <BenchmarkItem label={BENCHMARK_LABELS.livecodebench.label} score={benchmarks.livecodebench} weight={0.3} />
          <BenchmarkItem label={BENCHMARK_LABELS.humaneval.label} score={benchmarks.humaneval} weight={0.15} />
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Reasoning</h4>
        <div className="space-y-3">
          <BenchmarkItem label={BENCHMARK_LABELS.gpqa_diamond.label} score={benchmarks.gpqa_diamond} weight={0.4} />
          <BenchmarkItem label={BENCHMARK_LABELS.math_aime.label} score={benchmarks.math_aime} weight={0.35} />
          <BenchmarkItem label={BENCHMARK_LABELS.mmlu_pro.label} score={benchmarks.mmlu_pro} weight={0.25} />
        </div>
      </div>

      {/* Tool Use */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Tool Use</h4>
        <div className="space-y-3">
          <BenchmarkItem label={BENCHMARK_LABELS.bfcl_v3.label} score={benchmarks.bfcl_v3} weight={0.45} />
          <BenchmarkItem label={BENCHMARK_LABELS.mcp_bench.label} score={benchmarks.mcp_bench} weight={0.35} />
          <BenchmarkItem label={BENCHMARK_LABELS.tau2_bench.label} score={benchmarks.tau2_bench} weight={0.2} />
        </div>
      </div>
    </div>
  )
}
