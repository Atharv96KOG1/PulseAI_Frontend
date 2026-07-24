import { AlertTriangle } from 'lucide-react'
import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
          <Card className="w-full">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <AlertTriangle className="h-8 w-8 text-[var(--color-critical)]" />
              <p className="text-sm font-medium text-[var(--color-ink)]">Something went wrong</p>
              <p className="text-xs text-[var(--color-ink-muted)]">{this.state.error.message}</p>
              <Button size="sm" onClick={() => window.location.reload()}>
                Reload
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}
