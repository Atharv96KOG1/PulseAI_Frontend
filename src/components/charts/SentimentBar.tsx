import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SENTIMENT_COLOR } from '@/lib/colors'
import { SENTIMENTS } from '@/types/taxonomy'
import { ChartTooltip } from './ChartTooltip'

interface SentimentBarProps {
  positivePct: number
  neutralPct: number
  negativePct: number
}

function formatSegmentLabel(value: unknown): string {
  const n = Number(value)
  return Number.isFinite(n) && n >= 8 ? `${n}%` : ''
}

/** Part-to-whole for a 3-value status field: a single 100%-stacked bar,
 * segment order Negative → Neutral → Positive, colored by status (not a
 * generic categorical hue) since sentiment IS a status, not an arbitrary series. */
export function SentimentBar({ positivePct, neutralPct, negativePct }: SentimentBarProps) {
  const row = { name: 'Sentiment', Negative: negativePct, Neutral: neutralPct, Positive: positivePct }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment distribution</CardTitle>
        <CardDescription>Share of processed tickets</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-3 px-2 pb-5">
        <div style={{ height: 72 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[row]} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                cursor={{ fill: 'var(--color-border)', opacity: 0.3 }}
                content={({ active }) => (
                  <ChartTooltip
                    active={active}
                    rows={SENTIMENTS.map((s) => ({
                      label: s,
                      value: `${row[s]}%`,
                      color: SENTIMENT_COLOR[s],
                    }))}
                  />
                )}
              />
              <Bar
                dataKey="Negative"
                stackId="sentiment"
                fill={SENTIMENT_COLOR.Negative}
                stroke="var(--color-card)"
                strokeWidth={2}
                radius={[4, 0, 0, 4]}
                barSize={28}
              >
                <LabelList
                  dataKey="Negative"
                  position="center"
                  formatter={formatSegmentLabel}
                  style={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
              <Bar
                dataKey="Neutral"
                stackId="sentiment"
                fill={SENTIMENT_COLOR.Neutral}
                stroke="var(--color-card)"
                strokeWidth={2}
                barSize={28}
              >
                <LabelList
                  dataKey="Neutral"
                  position="center"
                  formatter={formatSegmentLabel}
                  style={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
              <Bar
                dataKey="Positive"
                stackId="sentiment"
                fill={SENTIMENT_COLOR.Positive}
                stroke="var(--color-card)"
                strokeWidth={2}
                radius={[0, 4, 4, 0]}
                barSize={28}
              >
                <LabelList
                  dataKey="Positive"
                  position="center"
                  formatter={formatSegmentLabel}
                  style={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4">
          {SENTIMENTS.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-[var(--color-ink-secondary)]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SENTIMENT_COLOR[s] }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
