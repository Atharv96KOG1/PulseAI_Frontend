import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { AnalyticsResult, ValidationReport } from '@/types/api'

interface KpiGridProps {
  analytics: AnalyticsResult
  validationReport: ValidationReport
}

interface KpiTileProps {
  label: string
  value: string
  icon: ReactNode
  tone?: 'default' | 'good' | 'critical'
}

function KpiTile({ label, value, icon, tone = 'default' }: KpiTileProps) {
  const toneClass =
    tone === 'good' ? 'text-[var(--color-good)]' : tone === 'critical' ? 'text-[var(--color-critical)]' : 'text-[var(--color-ink)]'

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">{label}</span>
        <span className="text-[var(--color-ink-muted)]">{icon}</span>
      </div>
      <span className={`text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</span>
    </Card>
  )
}

export function KpiGrid({ analytics, validationReport }: KpiGridProps) {
  const topCategory = analytics.top_categories[0]?.name ?? 'N/A'
  const topTheme = analytics.top_themes[0]?.name ?? 'N/A'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <KpiTile label="Total Feedback" value={String(analytics.total_processed)} icon={<MessageSquare className="h-4 w-4" />} />
      <KpiTile label="Skipped Rows" value={String(validationReport.skipped)} icon={<ListChecks className="h-4 w-4" />} />
      <KpiTile
        label="Processing Success"
        value={`${analytics.processing_success_rate}%`}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KpiTile
        label="Positive"
        value={`${analytics.positive_pct}%`}
        icon={<ThumbsUp className="h-4 w-4" />}
        tone="good"
      />
      <KpiTile
        label="Negative"
        value={`${analytics.negative_pct}%`}
        icon={<ThumbsDown className="h-4 w-4" />}
        tone="critical"
      />
      <KpiTile
        label="Avg Sentiment Score"
        value={`${analytics.average_sentiment_score > 0 ? '+' : ''}${analytics.average_sentiment_score.toFixed(2)}`}
        icon={<Activity className="h-4 w-4" />}
        tone={
          analytics.average_sentiment_score > 0.1
            ? 'good'
            : analytics.average_sentiment_score < -0.1
              ? 'critical'
              : 'default'
        }
      />
      <KpiTile label="Top Category" value={topCategory} icon={<CheckCircle2 className="h-4 w-4" />} />
      <KpiTile label="Top Theme" value={topTheme} icon={<CheckCircle2 className="h-4 w-4" />} />
      <KpiTile
        label="High Urgency"
        value={String(analytics.high_urgency_count)}
        icon={<AlertTriangle className="h-4 w-4" />}
        tone={analytics.high_urgency_count > 0 ? 'critical' : 'default'}
      />
      <KpiTile label="Actionable" value={String(analytics.actionable_count)} icon={<ListChecks className="h-4 w-4" />} />
    </div>
  )
}
