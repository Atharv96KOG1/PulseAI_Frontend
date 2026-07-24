import { UploadPanel } from '@/components/UploadPanel'
import type { useAnalyze } from '@/hooks/useAnalyze'

type AnalyzeState = ReturnType<typeof useAnalyze>['state']

interface NewAnalysisPageProps {
  state: AnalyzeState
  onAnalyze: (file: File) => void
}

export function NewAnalysisPage({ state, onAnalyze }: NewAnalysisPageProps) {
  return (
    <UploadPanel
      status={state.status === 'error' ? 'error' : state.status === 'loading' ? 'loading' : 'idle'}
      errorMessage={state.status === 'error' ? state.message : undefined}
      onFileSelected={onAnalyze}
    />
  )
}
