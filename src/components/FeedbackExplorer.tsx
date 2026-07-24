import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/table'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { getCategoryColor, getSentimentColor, getUrgencyColor } from '@/lib/colors'
import type { TicketClassification } from '@/types/api'
import { CATEGORIES, SENTIMENTS, URGENCIES } from '@/types/taxonomy'

interface FeedbackExplorerProps {
  items: TicketClassification[]
}

type SortKey = 'ticket_id' | 'primary_category' | 'primary_theme' | 'sentiment' | 'urgency'
type SortDirection = 'asc' | 'desc'

const ALL = 'All'

export function FeedbackExplorer({ items }: FeedbackExplorerProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 200)
  const [category, setCategory] = useState<string>(ALL)
  const [sentiment, setSentiment] = useState<string>(ALL)
  const [urgency, setUrgency] = useState<string>(ALL)
  const [actionableOnly, setActionableOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('urgency')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const urgencyRank: Record<string, number> = { High: 2, Medium: 1, Low: 0 }

  const filtered = useMemo(() => {
    const needle = debouncedSearch.trim().toLowerCase()
    return items.filter((item) => {
      if (category !== ALL && item.primary_category !== category) return false
      if (sentiment !== ALL && item.sentiment !== sentiment) return false
      if (urgency !== ALL && item.urgency !== urgency) return false
      if (actionableOnly && !item.actionable) return false
      if (!needle) return true
      return (
        item.feedback_text.toLowerCase().includes(needle) ||
        item.ticket_id.toLowerCase().includes(needle) ||
        item.primary_theme.toLowerCase().includes(needle) ||
        item.primary_category.toLowerCase().includes(needle)
      )
    })
  }, [items, debouncedSearch, category, sentiment, urgency, actionableOnly])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    const dir = sortDirection === 'asc' ? 1 : -1
    copy.sort((a, b) => {
      if (sortKey === 'urgency') return (urgencyRank[a.urgency] - urgencyRank[b.urgency]) * dir
      return a[sortKey].localeCompare(b[sortKey]) * dir
    })
    return copy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sortKey, sortDirection])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  function SortHeader({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) {
    const active = sortKey === sortKeyValue
    return (
      <button
        type="button"
        className="flex items-center gap-1 hover:text-[var(--color-ink)]"
        onClick={() => toggleSort(sortKeyValue)}
      >
        {label}
        {active &&
          (sortDirection === 'asc' ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          ))}
      </button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback explorer</CardTitle>
        <CardDescription>
          {sorted.length} of {items.length} processed tickets
        </CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback, theme, or category…"
            className="pl-8"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value={ALL}>All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={sentiment} onChange={(e) => setSentiment(e.target.value)} className="sm:w-36">
          <option value={ALL}>All sentiment</option>
          {SENTIMENTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="sm:w-32">
          <option value={ALL}>All urgency</option>
          {URGENCIES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
        <label className="flex shrink-0 items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
          <input
            type="checkbox"
            checked={actionableOnly}
            onChange={(e) => setActionableOnly(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
          />
          Actionable only
        </label>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <SortHeader label="Ticket" sortKeyValue="ticket_id" />
            </TableHeaderCell>
            <TableHeaderCell>Feedback</TableHeaderCell>
            <TableHeaderCell>
              <SortHeader label="Category" sortKeyValue="primary_category" />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortHeader label="Theme" sortKeyValue="primary_theme" />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortHeader label="Sentiment" sortKeyValue="sentiment" />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortHeader label="Urgency" sortKeyValue="urgency" />
            </TableHeaderCell>
            <TableHeaderCell>Actionable</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-[var(--color-ink-muted)]">
                No tickets match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((item) => (
              <TableRow key={item.ticket_id}>
                <TableCell className="font-mono text-xs text-[var(--color-ink-muted)]">{item.ticket_id}</TableCell>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-[var(--color-ink-secondary)]">{item.feedback_text || '—'}</p>
                  {item.additional_issues.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.additional_issues.map((issue, i) => (
                        <Badge key={i} dotColor={getCategoryColor(issue.category)}>
                          {issue.theme}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge dotColor={getCategoryColor(item.primary_category)}>{item.primary_category}</Badge>
                </TableCell>
                <TableCell className="text-[var(--color-ink-secondary)]">{item.primary_theme}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Badge dotColor={getSentimentColor(item.sentiment)}>{item.sentiment}</Badge>
                    <span className="pl-0.5 text-xs tabular-nums text-[var(--color-ink-muted)]">
                      {item.sentiment_score > 0 ? '+' : ''}
                      {item.sentiment_score.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge dotColor={getUrgencyColor(item.urgency)}>{item.urgency}</Badge>
                </TableCell>
                <TableCell>{item.actionable ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
