import { useCallback, useEffect, useRef, useState } from 'react'
import { askQuestion, fetchReportPdf, QueryError } from '@/api/client'
import type { RetrievedTicket } from '@/types/api'

export type RagTurn =
  | { type: 'answer'; question: string; answer: string; retrievedTickets: RetrievedTicket[] }
  | { type: 'report'; question: string; downloadUrl: string; filename: string }

type AskState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }

/** "give me a weekly report" / "export this as pdf" etc. — routed to the PDF
 * endpoint instead of the text Q&A endpoint, since a chat answer can't render
 * a document. Requires both a report noun and an action/cadence word so a
 * question like "did customers report any crashes?" isn't misrouted. */
function isReportRequest(question: string): boolean {
  const text = question.toLowerCase()
  if (text.includes('pdf')) return true
  return /\breport\b/.test(text) && /(weekly|generate|download|export|create|build|give me|make me)/.test(text)
}

/**
 * Runs Q&A (or PDF report generation) against a single analysis. Keeps every
 * turn in this session so the conversation reads top-to-bottom like a chat.
 */
export function useRagQuery(analysisId: string | null) {
  const [turns, setTurns] = useState<RagTurn[]>([])
  const [state, setState] = useState<AskState>({ status: 'idle' })
  const downloadUrls = useRef<string[]>([])

  useEffect(() => {
    const urls = downloadUrls.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!analysisId || !trimmed) return

      setState({ status: 'loading' })
      try {
        if (isReportRequest(trimmed)) {
          const blob = await fetchReportPdf(analysisId)
          const downloadUrl = URL.createObjectURL(blob)
          downloadUrls.current.push(downloadUrl)
          const filename = `loom-weekly-report-${analysisId.slice(0, 8)}.pdf`
          setTurns((prev) => [...prev, { type: 'report', question: trimmed, downloadUrl, filename }])
        } else {
          const result = await askQuestion(analysisId, trimmed)
          setTurns((prev) => [
            ...prev,
            {
              type: 'answer',
              question: trimmed,
              answer: result.answer,
              retrievedTickets: result.retrieved_tickets,
            },
          ])
        }
        setState({ status: 'idle' })
      } catch (error) {
        const message =
          error instanceof QueryError
            ? error.message
            : 'Could not reach the Q&A service. Is the backend running?'
        setState({ status: 'error', message })
      }
    },
    [analysisId],
  )

  const reset = useCallback(() => {
    downloadUrls.current.forEach((url) => URL.revokeObjectURL(url))
    downloadUrls.current = []
    setTurns([])
    setState({ status: 'idle' })
  }, [])

  return { turns, state, ask, reset }
}
