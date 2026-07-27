import { Menu, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useAnalyze } from '@/hooks/useAnalyze'
import { AboutPage } from '@/pages/AboutPage'
import { AskPage } from '@/pages/AskPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ExplorerPage } from '@/pages/ExplorerPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NewAnalysisPage } from '@/pages/NewAnalysisPage'
import { Sidebar, type Section } from './Sidebar'

const PAGE_META: Record<Section, { title: string; description: string }> = {
  new: { title: 'New Analysis', description: 'Upload a CSV or check a single piece of feedback.' },
  dashboard: { title: 'Dashboard', description: 'KPIs, distributions, and the executive summary.' },
  explorer: { title: 'Feedback Explorer', description: 'Search, filter, and inspect every processed ticket.' },
  ask: { title: 'Ask Feedback', description: 'Ask questions about this batch, answered from the tickets themselves.' },
  history: { title: 'History', description: 'Every past analysis, saved automatically.' },
  about: { title: 'About Loom', description: 'How the pipeline works, end to end.' },
}

export function AppShell() {
  const { state, analyze, reset, loadFromHistory } = useAnalyze()
  const [section, setSection] = useState<Section>('new')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (state.status === 'success') setSection('dashboard')
  }, [state.status])

  const meta = PAGE_META[section]

  function handleReset() {
    reset()
    setSection('new')
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar
        section={section}
        onSectionChange={setSection}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        hasData={state.status === 'success'}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              className="shrink-0 text-[var(--color-ink-muted)] lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-[var(--color-ink)] sm:text-base">
                {meta.title}
              </h1>
              <p className="hidden truncate text-xs text-[var(--color-ink-muted)] sm:block">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {state.status === 'success' && (
              <span className="hidden text-xs text-[var(--color-ink-muted)] md:inline">
                {state.data.validation_report.processed} processed · {state.data.validation_report.skipped} skipped
              </span>
            )}
            {section !== 'new' && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
                New upload
              </Button>
            )}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main key={section} className="page-transition flex-1 px-4 py-6 sm:px-6">
          {section === 'new' && <NewAnalysisPage state={state} onAnalyze={analyze} />}
          {section === 'dashboard' && (
            <DashboardPage state={state} onGoToNewAnalysis={() => setSection('new')} />
          )}
          {section === 'explorer' && (
            <ExplorerPage state={state} onGoToNewAnalysis={() => setSection('new')} />
          )}
          {section === 'ask' && <AskPage state={state} onGoToNewAnalysis={() => setSection('new')} />}
          {section === 'history' && (
            <HistoryPage
              onLoadAnalysis={(data) => {
                loadFromHistory(data)
                setSection('dashboard')
              }}
              onGoToNewAnalysis={() => setSection('new')}
            />
          )}
          {section === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  )
}
