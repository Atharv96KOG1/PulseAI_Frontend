import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExecutiveSummaryCardProps {
  summary: string
}

export function ExecutiveSummaryCard({ summary }: ExecutiveSummaryCardProps) {
  return (
    <Card className="bg-[var(--color-accent)]/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
          <CardTitle>Executive summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-[var(--color-ink-secondary)]">{summary}</p>
      </CardContent>
    </Card>
  )
}
