import { BarChart3 } from 'lucide-react'
import { CategoryDistributionChart } from '@/components/charts/CategoryDistributionChart'
import { SentimentBar } from '@/components/charts/SentimentBar'
import { ThemeFrequencyChart } from '@/components/charts/ThemeFrequencyChart'
import { UrgencyBreakdownChart } from '@/components/charts/UrgencyBreakdownChart'
import { ExecutiveSummaryCard } from '@/components/ExecutiveSummaryCard'
import { EmptyState } from '@/components/layout/EmptyState'
import { KpiGrid } from '@/components/KpiGrid'
import { Skeleton } from '@/components/ui/skeleton'
import type { useAnalyze } from '@/hooks/useAnalyze'

type AnalyzeState = ReturnType<typeof useAnalyze>['state']

interface DashboardPageProps {
  state: AnalyzeState
  onGoToNewAnalysis: () => void
}

export function DashboardPage({ state, onGoToNewAnalysis }: DashboardPageProps) {
  if (state.status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  if (state.status !== 'success') {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analysis yet"
        description="Run a new analysis to see KPIs, distributions, and an executive summary."
        actionLabel="Start new analysis"
        onAction={onGoToNewAnalysis}
      />
    )
  }

  const { validation_report, analytics, summary } = state.data

  return (
    <div className="flex flex-col gap-6">
      <KpiGrid analytics={analytics} validationReport={validation_report} />

      <ExecutiveSummaryCard summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDistributionChart data={analytics.top_categories} />
        <ThemeFrequencyChart data={analytics.top_themes} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SentimentBar
          positivePct={analytics.positive_pct}
          neutralPct={analytics.neutral_pct}
          negativePct={analytics.negative_pct}
        />
        <UrgencyBreakdownChart distribution={analytics.urgency_distribution} />
      </div>
    </div>
  )
}
