import type { TooltipProps } from 'recharts'

interface Row {
  label: string
  value: string
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  rows?: Row[]
}

/** Shared tooltip shell — plain Recharts TooltipProps are adapted per-chart into `rows`. */
export function ChartTooltip({ active, rows }: ChartTooltipProps) {
  if (!active || !rows?.length) return null
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs shadow-md">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2 py-0.5">
          {row.color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />}
          <span className="text-[var(--color-ink-secondary)]">{row.label}</span>
          <span className="ml-auto font-medium tabular-nums text-[var(--color-ink)]">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

export type { TooltipProps }
