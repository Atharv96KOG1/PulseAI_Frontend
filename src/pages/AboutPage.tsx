import { CheckCircle2, Cpu, GitBranch, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const PIPELINE_STAGES = [
  {
    title: 'Validate',
    description:
      'File- and row-level checks; empty or null feedback is skipped and reported separately, never silently dropped.',
  },
  {
    title: 'Normalize & redact',
    description: 'Strip HTML/Markdown, normalize whitespace, and redact PII before any model call.',
  },
  {
    title: 'Classify',
    description:
      'Each ticket is classified against a closed taxonomy at temperature 0, with a bounded validate → coerce → re-prompt → fallback repair contract.',
  },
  {
    title: 'Aggregate',
    description: 'Every number in analytics is computed in pure Python — the model never counts, sums, or averages.',
  },
  {
    title: 'Summarize',
    description: 'One grounded LLM call turns the Python-computed aggregates into a prioritized narrative.',
  },
  {
    title: 'Ask & report',
    description:
      'Each ticket is embedded and indexed in Postgres with pgvector — retrieval is a real SQL cosine-similarity search, not an in-memory scan. Questions are answered from the exact dashboard analytics plus the most relevant ticket excerpts — never invented. The same data renders as a downloadable PDF report on request.',
  },
]

const PRINCIPLES = [
  'The LLM classifies and phrases; Python computes every number.',
  'Closed vocabularies — categories, themes, sentiment, and urgency are fixed enums.',
  'A malformed ticket never fails the batch — it falls back to a valid, neutral shape.',
  'PII is redacted before any token reaches the model.',
  'The API is stateless — one request in, one JSON payload out, no server-side session state.',
]

export function AboutPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>What Loom does</CardTitle>
          <CardDescription>
            Converts a raw CSV of customer feedback into structured classification, deterministic analytics,
            and a grounded executive summary — in a single request.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>Pipeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.title} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-xs font-semibold text-[var(--color-accent)]">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">{stage.title}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{stage.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>Core principles</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {PRINCIPLES.map((principle) => (
            <div key={principle} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-good)]" />
              <p className="text-sm text-[var(--color-ink-secondary)]">{principle}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>Stack</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            FastAPI · Pydantic v2 · Pandas · OpenAI structured output & embeddings · SQLite · PostgreSQL +
            pgvector · Matplotlib · ReportLab · React 19 · TypeScript · Vite · Tailwind CSS · Recharts
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
