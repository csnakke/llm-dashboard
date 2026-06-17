import { Badge } from "@/components/ui/badge"
import { STATUS_COLORS, SPEC_COLORS } from "@/lib/constants"
import type { ModelStatus, ModelSpecialization } from "@/types/models"

export function StatusBadge({ status }: { status: ModelStatus }) {
  return (
    <Badge className={`${STATUS_COLORS[status]} border-0 text-xs capitalize`}>
      {status}
    </Badge>
  )
}

export function SpecBadge({ spec }: { spec: ModelSpecialization }) {
  const labels: Record<ModelSpecialization, string> = {
    general: "General",
    coding: "Coding",
    reasoning: "Reasoning",
    small: "Small",
  }
  return (
    <Badge className={`${SPEC_COLORS[spec]} border-0 text-xs`}>
      {labels[spec]}
    </Badge>
  )
}
