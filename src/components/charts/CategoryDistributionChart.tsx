import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoryColor } from '@/lib/colors'
import type { RankedCount } from '@/types/api'
import { ChartTooltip } from './ChartTooltip'

interface CategoryDistributionChartProps {
  data: RankedCount[]
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const height = Math.max(220, sorted.length * 36)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category distribution</CardTitle>
        <CardDescription>Primary category, by ticket count</CardDescription>
      </CardHeader>
      <div className="px-2 pb-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
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
                    rows={[{ label: point.name, value: String(point.count), color: getCategoryColor(point.name) }]}
                  />
                )
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} maxBarSize={20}>
              {sorted.map((entry) => (
                <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                style={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
