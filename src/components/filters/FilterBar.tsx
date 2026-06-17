"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { FilterState, ModelStatus, ModelSpecialization } from "@/types/models"

interface FilterBarProps {
  filter: FilterState
  onChange: (update: Partial<FilterState>) => void
  counts: {
    status: Record<string, number>
    specialization: Record<string, number>
    results: number
    total: number
  }
}

const STATUS_TABS: Array<{ value: ModelStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "latest", label: "Latest" },
  { value: "current", label: "Current" },
  { value: "upcoming", label: "Upcoming" },
  { value: "deprecated", label: "Deprecated" },
]

const SPEC_TABS: Array<{ value: ModelSpecialization | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "coding", label: "Coding" },
  { value: "reasoning", label: "Reasoning" },
  { value: "small", label: "Small" },
]

const CATEGORY_TABS: Array<{ value: FilterState["category"]; label: string }> = [
  { value: "all", label: "Overall" },
  { value: "sys_programming", label: "Sys Programming" },
  { value: "web_programming", label: "Web Programming" },
  { value: "reasoning", label: "Reasoning" },
  { value: "toolUse", label: "Tool Use" },
]

export function FilterBar({ filter, onChange, counts }: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Status tabs + open source toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={filter.status} onValueChange={(v) => onChange({ status: v as FilterState["status"] })}>
          <TabsList className="h-8">
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs px-3 h-6">
                {t.label}
                {counts.status[t.value] !== undefined && (
                  <span className="ml-1.5 text-[10px] bg-muted-foreground/20 rounded-full px-1.5">
                    {counts.status[t.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          variant={filter.openSourceOnly ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => onChange({ openSourceOnly: !filter.openSourceOnly })}
        >
          Open Source Only
        </Button>
      </div>

      {/* Row 2: Specialization + category + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Type:</span>
          {SPEC_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ specialization: t.value as FilterState["specialization"] })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filter.specialization === t.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
              }`}
            >
              {t.label}
              {counts.specialization[t.value] !== undefined && (
                <span className="ml-1 opacity-60">{counts.specialization[t.value]}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ category: t.value })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filter.category === t.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={filter.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search models…"
              className="pl-8 h-8 text-sm w-52"
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {counts.results} / {counts.total}
          </span>
        </div>
      </div>
    </div>
  )
}
