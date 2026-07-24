import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RankedCount } from '@/types/api'
import { ChartTooltip } from './ChartTooltip'

interface ThemeFrequencyChartProps {
  data: RankedCount[]
  topN?: number
}

/** Magnitude comparison across many possible themes — sequential single hue
 * (this is a "which is bigger" job, not an identity job), top-N with an
 * explicit truncation note so coverage is never silently implied. */
export function ThemeFrequencyChart({ data, topN = 8 }: ThemeFrequencyChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const shown = sorted.slice(0, topN)
  const hiddenCount = sorted.length - shown.length
  const height = Math.max(220, shown.length * 36)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top recurring themes</CardTitle>
        <CardDescription>
          {hiddenCount > 0 ? `Top ${topN} of ${sorted.length} themes with at least one ticket` : 'Primary theme, by ticket count'}
        </CardDescription>
      </CardHeader>
      <div className="px-2 pb-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shown} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={168}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-border)', opacity: 0.3 }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as RankedCount | undefined
                if (!point) return null
                return (
                  <ChartTooltip
                    active={active}
                    rows={[{ label: point.name, value: String(point.count), color: 'var(--color-cat-1)' }]}
                  />
                )
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} maxBarSize={20} fill="var(--color-cat-1)">
              <LabelList dataKey="count" position="right" style={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
