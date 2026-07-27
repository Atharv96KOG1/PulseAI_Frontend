import { AlertCircle, FileDown, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useRagQuery } from '@/hooks/useRagQuery'
import { getCategoryColor } from '@/lib/colors'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'What are the most common complaints?',
  'What are users saying about performance issues?',
  'Summarize the negative feedback about billing.',
  'Give me a weekly PDF report',
]

interface AskPanelProps {
  analysisId: string
}

export function AskPanel({ analysisId }: AskPanelProps) {
  const { turns, state, ask, reset } = useRagQuery(analysisId)
  const [question, setQuestion] = useState('')

  function handleSubmit(text: string) {
    if (state.status === 'loading') return
    void ask(text)
    setQuestion('')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <p className="text-xs text-[var(--color-ink-secondary)]">
            Ask a question in plain language and get an answer grounded in the retrieved feedback tickets
            below it. This is qualitative Q&A, not stats — for exact counts and percentages, use the
            Dashboard.
          </p>
        </CardContent>
      </Card>

      {turns.length === 0 && state.status !== 'error' && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSubmit(s)}
              className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-border)]/30 hover:text-[var(--color-ink)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {turns.map((turn, i) => (
          <div key={i} className="flex flex-col gap-2">
            <p className="self-end rounded-lg bg-[var(--color-accent)]/10 px-3 py-2 text-sm font-medium text-[var(--color-ink)]">
              {turn.question}
            </p>

            {turn.type === 'report' ? (
              <Card className="bg-[var(--color-accent)]/[0.04]">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      Your weekly feedback report is ready
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      KPIs, distribution charts, and highlighted tickets for this batch
                    </p>
                  </div>
                  <a
                    href={turn.downloadUrl}
                    download={turn.filename}
                    className={cn(buttonVariants({ size: 'sm' }))}
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Download PDF
                  </a>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col gap-3 p-4">
                  <p className="whitespace-pre-wrap text-sm text-[var(--color-ink-secondary)]">{turn.answer}</p>

                  {turn.retrievedTickets.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
                      <p className="text-xs font-medium text-[var(--color-ink-muted)]">
                        Sources ({turn.retrievedTickets.length})
                      </p>
                      <div className="flex flex-col gap-2">
                        {turn.retrievedTickets.map((source) => (
                          <div
                            key={source.ticket_id}
                            className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs text-[var(--color-ink-muted)]">
                                  {source.ticket_id}
                                </span>
                                <Badge dotColor={getCategoryColor(source.primary_category)}>
                                  {source.primary_theme}
                                </Badge>
                              </div>
                              <span className="text-xs tabular-nums text-[var(--color-ink-muted)]">
                                {Math.round(source.score * 100)}% match
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs text-[var(--color-ink-secondary)]">
                              {source.feedback_text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ))}

        {state.status === 'loading' && (
          <Card>
            <CardContent className="p-4 text-sm text-[var(--color-ink-muted)]">Thinking…</CardContent>
          </Card>
        )}

        {state.status === 'error' && (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--color-critical)]/30 bg-[var(--color-critical)]/5 p-3 text-xs text-[var(--color-critical)]">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {state.message}
          </div>
        )}
      </div>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(question)
        }}
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(question)
            }
          }}
          placeholder="Ask about this batch of feedback…"
          rows={2}
          className="flex-1 resize-none"
        />
        <Button type="submit" disabled={state.status === 'loading' || !question.trim()}>
          <Send className="h-3.5 w-3.5" />
          Ask
        </Button>
      </form>

      {turns.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="self-start text-xs text-[var(--color-ink-muted)] underline-offset-2 hover:underline"
        >
          Clear conversation
        </button>
      )}
    </div>
  )
}
