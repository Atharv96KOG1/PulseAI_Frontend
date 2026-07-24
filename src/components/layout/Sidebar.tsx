import { History, Info, LayoutDashboard, Table2, UploadCloud, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

export type Section = 'new' | 'dashboard' | 'explorer' | 'history' | 'about'

const NAV_ITEMS: { key: Section; label: string; icon: typeof UploadCloud }[] = [
  { key: 'new', label: 'New Analysis', icon: UploadCloud },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'explorer', label: 'Feedback Explorer', icon: Table2 },
  { key: 'history', label: 'History', icon: History },
  { key: 'about', label: 'About', icon: Info },
]

interface SidebarProps {
  section: Section
  onSectionChange: (section: Section) => void
  isOpen: boolean
  onClose: () => void
  hasData: boolean
}

export function Sidebar({ section, onSectionChange, isOpen, onClose, hasData }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 ease-out lg:relative lg:z-auto lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-semibold text-white">
              L
            </div>
            <span className="text-base font-semibold text-[var(--color-ink)]">Loom</span>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="text-[var(--color-ink-muted)] lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = section === item.key
            const showDot = hasData && (item.key === 'dashboard' || item.key === 'explorer')
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onSectionChange(item.key)
                  onClose()
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-border)]/30 hover:text-[var(--color-ink)]',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {showDot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-good)]" />}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-4">
          <p className="text-[11px] text-[var(--color-ink-muted)]">Every run is saved to history</p>
          <ThemeToggle />
        </div>
      </aside>
    </>
  )
}
