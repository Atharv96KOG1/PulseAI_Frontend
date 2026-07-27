import { MessageCircleQuestion } from 'lucide-react'
import { AskPanel } from '@/components/AskPanel'
import { EmptyState } from '@/components/layout/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { useAnalyze } from '@/hooks/useAnalyze'

type AnalyzeState = ReturnType<typeof useAnalyze>['state']

interface AskPageProps {
  state: AnalyzeState
  onGoToNewAnalysis: () => void
}

export function AskPage({ state, onGoToNewAnalysis }: AskPageProps) {
  if (state.status === 'loading') {
    return <Skeleton className="h-96 w-full" />
  }

  if (state.status !== 'success') {
    return (
      <EmptyState
        icon={MessageCircleQuestion}
        title="Nothing to ask yet"
        description="Run a new analysis, then ask questions about the feedback in plain language."
        actionLabel="Start new analysis"
        onAction={onGoToNewAnalysis}
      />
    )
  }

  return <AskPanel analysisId={state.data.analysis_id} />
}
