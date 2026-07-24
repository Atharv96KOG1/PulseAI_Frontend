import { History } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/layout/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/table'
import { fetchHistory, fetchHistoryDetail } from '@/api/client'
import type { AnalysisSummary, AnalyzeResponse } from '@/types/api'

interface HistoryPageProps {
  onLoadAnalysis: (data: AnalyzeResponse) => void
  onGoToNewAnalysis: () => void
}

type LoadState = 'loading' | 'error' | 'ready'

export function HistoryPage({ onLoadAnalysis, onGoToNewAnalysis }: HistoryPageProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [records, setRecords] = useState<AnalysisSummary[]>([])
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchHistory()
      .then((data) => {
        if (cancelled) return
        setRecords(data)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setErrorMessage(error instanceof Error ? error.message : 'Could not load history.')
        setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleOpen(id: string) {
    setOpeningId(id)
    try {
      const detail = await fetchHistoryDetail(id)
      onLoadAnalysis(detail)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : `Could not load analysis ${id}.`)
      setLoadState('error')
    } finally {
      setOpeningId(null)
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <EmptyState
        icon={History}
        title="Could not load history"
        description={errorMessage}
        actionLabel="Start new analysis"
        onAction={onGoToNewAnalysis}
      />
    )
  }

  if (records.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No past analyses yet"
        description="Every run is saved automatically. Run a new analysis to start building history."
        actionLabel="Start new analysis"
        onAction={onGoToNewAnalysis}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis history</CardTitle>
        <CardDescription>{records.length} past runs, most recent first</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Total rows</TableHeaderCell>
              <TableHeaderCell>Processed</TableHeaderCell>
              <TableHeaderCell>Skipped</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-[var(--color-ink-secondary)]">
                  {new Date(record.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{record.total_rows}</TableCell>
                <TableCell>{record.processed}</TableCell>
                <TableCell>{record.skipped}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" disabled={openingId === record.id} onClick={() => handleOpen(record.id)}>
                    {openingId === record.id ? 'Opening…' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
