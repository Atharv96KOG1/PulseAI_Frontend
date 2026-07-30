import { CalendarRange } from 'lucide-react'
import { useState } from 'react'
import { fetchRangeSummary, RangeSummaryError } from '@/api/client'
import { CategoryDistributionChart } from '@/components/charts/CategoryDistributionChart'
import { SentimentBar } from '@/components/charts/SentimentBar'
import { ThemeFrequencyChart } from '@/components/charts/ThemeFrequencyChart'
import { UrgencyBreakdownChart } from '@/components/charts/UrgencyBreakdownChart'
import { ExecutiveSummaryCard } from '@/components/ExecutiveSummaryCard'
import { EmptyState } from '@/components/layout/EmptyState'
import { KpiGrid } from '@/components/KpiGrid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { RangeSummaryResponse } from '@/types/api'

type RangeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: RangeSummaryResponse }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string }

function isoDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

export function RangePage() {
  const [start, setStart] = useState(isoDate(7))
  const [end, setEnd] = useState(isoDate(0))
  const [state, setState] = useState<RangeState>({ status: 'idle' })

  async function handleGenerate() {
    setState({ status: 'loading' })
    try {
      const data = await fetchRangeSummary(start, end)
      setState({ status: 'success', data })
    } catch (error) {
      if (error instanceof RangeSummaryError && error.code === 404) {
        setState({ status: 'empty', message: error.message })
        return
      }
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not generate a combined summary.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Combine multiple saved analyses</CardTitle>
          <CardDescription>
            Pick a date range — every analysis saved in that window gets merged into one executive
            summary and one set of KPIs, instead of reading each upload separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-ink-muted)]">
            Start date
            <Input
              type="date"
              value={start}
              max={end}
              onChange={(event) => setStart(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-ink-muted)]">
            End date
            <Input type="date" value={end} min={start} onChange={(event) => setEnd(event.target.value)} />
          </label>
          <Button onClick={handleGenerate} disabled={state.status === 'loading'}>
            {state.status === 'loading' ? 'Generating…' : 'Generate summary'}
          </Button>
        </CardContent>
      </Card>

      {state.status === 'loading' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {state.status === 'empty' && (
        <EmptyState
          icon={CalendarRange}
          title="No analyses in that range"
          description={state.message}
          actionLabel="Adjust dates"
          onAction={() => setState({ status: 'idle' })}
        />
      )}

      {state.status === 'error' && (
        <EmptyState
          icon={CalendarRange}
          title="Could not generate summary"
          description={state.message}
          actionLabel="Try again"
          onAction={handleGenerate}
        />
      )}

      {state.status === 'success' && (
        <div className="flex flex-col gap-6">
          <p className="text-xs text-[var(--color-ink-muted)]">
            {state.data.analyses_included.length}{' '}
            {state.data.analyses_included.length === 1 ? 'saved analysis' : 'saved analyses'} combined,{' '}
            {state.data.start} to {state.data.end}
          </p>

          <KpiGrid analytics={state.data.analytics} validationReport={state.data.validation_report} />

          <ExecutiveSummaryCard summary={state.data.summary} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryDistributionChart data={state.data.analytics.top_categories} />
            <ThemeFrequencyChart data={state.data.analytics.top_themes} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SentimentBar
              positivePct={state.data.analytics.positive_pct}
              neutralPct={state.data.analytics.neutral_pct}
              negativePct={state.data.analytics.negative_pct}
            />
            <UrgencyBreakdownChart distribution={state.data.analytics.urgency_distribution} />
          </div>
        </div>
      )}
    </div>
  )
}
