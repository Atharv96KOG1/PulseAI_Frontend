import { useCallback, useState } from 'react'
import { AnalyzeError, analyzeFeedback } from '@/api/client'
import type { AnalyzeResponse } from '@/types/api'

type AnalyzeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AnalyzeResponse }
  | { status: 'error'; message: string }

/**
 * Holds the single active analysis result in memory, whether it came from a
 * fresh /analyze upload or was pulled back in from /history.
 */
export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({ status: 'idle' })

  const analyze = useCallback(async (file: File) => {
    setState({ status: 'loading' })
    try {
      const data = await analyzeFeedback(file)
      setState({ status: 'success', data })
    } catch (error) {
      const message =
        error instanceof AnalyzeError
          ? error.message
          : 'Could not reach the analysis service. Is the backend running?'
      setState({ status: 'error', message })
    }
  }, [])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  const loadFromHistory = useCallback((data: AnalyzeResponse) => {
    setState({ status: 'success', data })
  }, [])

  return { state, analyze, reset, loadFromHistory }
}
