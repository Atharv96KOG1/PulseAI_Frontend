import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] px-6 py-20 text-center">
      <Icon className="h-8 w-8 text-[var(--color-ink-muted)]" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
        <p className="text-xs text-[var(--color-ink-muted)]">{description}</p>
      </div>
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  )
}
