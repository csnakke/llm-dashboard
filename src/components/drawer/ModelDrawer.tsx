"use client"

import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { StatusBadge, SpecBadge } from "@/components/table/StatusBadge"
import { BenchmarkGrid } from "./BenchmarkGrid"
import { PROVIDER_COLORS, formatContext } from "@/lib/constants"
import { ExternalLink, Calendar, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Model } from "@/types/models"

interface ModelDrawerProps {
  model: Model | null
  onClose: () => void
}

export function ModelDrawer({ model, onClose }: ModelDrawerProps) {
  if (!model) return null

  const providerColor = PROVIDER_COLORS[model.provider] ?? "bg-gray-400"

  return (
    <Sheet open={!!model} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0 ${providerColor}`}
            >
              {model.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold leading-tight">{model.name}</h2>
              <div className="flex items-center flex-wrap gap-1.5 mt-1">
                <StatusBadge status={model.status} />
                <SpecBadge spec={model.specialization} />
                {model.isOpenSource && (
                  <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                    Open Source
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4 space-y-5">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Provider</div>
            <div className="font-medium">{model.provider}</div>
            {model.releaseDate && (
              <>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Release
                </div>
                <div className="font-medium">
                  {new Date(model.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </>
            )}
            {model.contextWindow && (
              <>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" /> Context
                </div>
                <div className="font-medium">{formatContext(model.contextWindow)} tokens</div>
              </>
            )}
            {model.parameterCount && (
              <>
                <div className="text-muted-foreground">Parameters</div>
                <div className="font-medium">{model.parameterCount}</div>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{model.description}</p>

          <a
            href={model.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Provider Site
          </a>

          {/* Benchmark breakdown */}
          <div className="border-t pt-5">
            <h3 className="text-sm font-semibold mb-4">Benchmark Breakdown</h3>
            <BenchmarkGrid benchmarks={model.benchmarks} scores={model.scores} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
