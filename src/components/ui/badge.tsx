import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** A hex or CSS-var color used as a small leading dot — identity is never carried by color alone. */
  dotColor?: string
}

export function Badge({ className, dotColor, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-ink-secondary)]',
        className,
      )}
      {...props}
    >
      {dotColor && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden />
      )}
      {children}
    </span>
  )
}
