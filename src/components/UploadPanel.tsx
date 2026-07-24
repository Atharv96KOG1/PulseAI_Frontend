import { AlertCircle, Loader2, UploadCloud } from 'lucide-react'
import { type DragEvent, useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface UploadPanelProps {
  status: 'idle' | 'loading' | 'error'
  errorMessage?: string
  onFileSelected: (file: File) => void
}

function singleTicketCsv(text: string): File {
  const escaped = text.trim().replace(/"/g, '""')
  const csvContent = `feedback\n"${escaped}"\n`
  return new File([csvContent], 'single-ticket.csv', { type: 'text/csv' })
}

export function UploadPanel({ status, errorMessage, onFileSelected }: UploadPanelProps) {
  const [mode, setMode] = useState<'file' | 'text'>('file')
  const [isDragging, setIsDragging] = useState(false)
  const [ticketText, setTicketText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      const file = event.dataTransfer.files?.[0]
      if (file) onFileSelected(file)
    },
    [onFileSelected],
  )

  const isLoading = status === 'loading'

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-24 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Loom</h1>
        <p className="text-sm text-[var(--color-ink-secondary)]">
          Upload a CSV of customer feedback — or check a single ticket — to get structured
          classification, analytics, and a grounded executive summary.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border border-[var(--color-border)] p-1">
        <Button
          type="button"
          variant={mode === 'file' ? 'default' : 'ghost'}
          size="sm"
          disabled={isLoading}
          onClick={() => setMode('file')}
        >
          Upload CSV
        </Button>
        <Button
          type="button"
          variant={mode === 'text' ? 'default' : 'ghost'}
          size="sm"
          disabled={isLoading}
          onClick={() => setMode('text')}
        >
          Check single feedback
        </Button>
      </div>

      {mode === 'file' ? (
        <Card
          className={`w-full border-2 border-dashed transition-colors ${
            isDragging ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--color-border)]'
          }`}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center gap-4 p-10">
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
                <p className="text-sm text-[var(--color-ink-secondary)]">
                  Running validation, classification, and analytics…
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-[var(--color-ink-muted)]" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-[var(--color-ink)]">Drag & drop your CSV here</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    Requires a <code className="rounded bg-[var(--color-border)]/40 px-1">feedback</code> column
                  </p>
                </div>
                <Button onClick={() => inputRef.current?.click()}>Browse file</Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) onFileSelected(file)
                    event.target.value = ''
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
                <p className="text-sm text-[var(--color-ink-secondary)]">
                  Running validation, classification, and analytics…
                </p>
              </>
            ) : (
              <>
                <Textarea
                  rows={5}
                  placeholder="Paste or type a single piece of customer feedback…"
                  value={ticketText}
                  onChange={(event) => setTicketText(event.target.value)}
                />
                <Button
                  className="self-end"
                  disabled={!ticketText.trim()}
                  onClick={() => onFileSelected(singleTicketCsv(ticketText))}
                >
                  Analyze
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {status === 'error' && errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-critical)]/30 bg-[var(--color-critical)]/5 px-4 py-2.5 text-sm text-[var(--color-critical)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
