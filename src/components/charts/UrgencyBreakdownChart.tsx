import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUrgencyColor } from '@/lib/colors'
import { URGENCIES } from '@/types/taxonomy'
import { ChartTooltip } from './ChartTooltip'

interface UrgencyBreakdownChartProps {
  distribution: Record<string, number>
}

/** Urgency is an ordinal severity field, not an identity set — status colors
 * (good/warning/critical), ordered High → Low, one bar per level. */
export function UrgencyBreakdownChart({ distribution }: UrgencyBreakdownChartProps) {
  const data = URGENCIES.map((urgency) => ({ name: urgency, count: distribution[urgency] ?? 0 }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Urgency breakdown</CardTitle>
        <CardDescription>Primary issue, by impact level</CardDescription>
      </CardHeader>
      <div className="px-2 pb-4" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={72}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-border)', opacity: 0.3 }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as { name: string; count: number } | undefined
                if (!point) return null
                return (
                  <ChartTooltip
                    active={active}
                    rows={[{ label: point.name, value: String(point.count), color: getUrgencyColor(point.name) }]}
                  />
                )
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} maxBarSize={24}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={getUrgencyColor(entry.name)} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
