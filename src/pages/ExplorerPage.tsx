import { Table2 } from 'lucide-react'
import { FeedbackExplorer } from '@/components/FeedbackExplorer'
import { EmptyState } from '@/components/layout/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { useAnalyze } from '@/hooks/useAnalyze'

type AnalyzeState = ReturnType<typeof useAnalyze>['state']

interface ExplorerPageProps {
  state: AnalyzeState
  onGoToNewAnalysis: () => void
}

export function ExplorerPage({ state, onGoToNewAnalysis }: ExplorerPageProps) {
  if (state.status === 'loading') {
    return <Skeleton className="h-96 w-full" />
  }

  if (state.status !== 'success') {
    return (
      <EmptyState
        icon={Table2}
        title="No feedback to explore"
        description="Run a new analysis to search, filter, and inspect processed tickets."
        actionLabel="Start new analysis"
        onAction={onGoToNewAnalysis}
      />
    )
  }

  return <FeedbackExplorer items={state.data.items} />
}
