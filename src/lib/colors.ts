/**
 * Color-by-job mapping (see dataviz skill): categorical hues are assigned
 * by fixed identity order (never cycled, never repainted by a filter), and
 * sentiment/urgency use the reserved status palette since they are literal
 * status fields, not arbitrary series.
 *
 * All values are CSS variable references so light/dark swap automatically
 * via the tokens defined in index.css.
 */

import { CATEGORIES, type Category, type Sentiment, type Urgency } from '@/types/taxonomy'

const CATEGORY_COLOR_VARS = [
  'var(--color-cat-1)',
  'var(--color-cat-2)',
  'var(--color-cat-3)',
  'var(--color-cat-4)',
  'var(--color-cat-5)',
  'var(--color-cat-6)',
  'var(--color-cat-7)',
  'var(--color-cat-8)',
] as const

export const CATEGORY_COLOR: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((category, index) => [category, CATEGORY_COLOR_VARS[index]]),
) as Record<Category, string>

export function getCategoryColor(category: string): string {
  return CATEGORY_COLOR[category as Category] ?? 'var(--color-ink-muted)'
}

export const SENTIMENT_COLOR: Record<Sentiment, string> = {
  Positive: 'var(--color-good)',
  Neutral: 'var(--color-ink-muted)',
  Negative: 'var(--color-critical)',
}

export function getSentimentColor(sentiment: string): string {
  return SENTIMENT_COLOR[sentiment as Sentiment] ?? 'var(--color-ink-muted)'
}

export const URGENCY_COLOR: Record<Urgency, string> = {
  High: 'var(--color-critical)',
  Medium: 'var(--color-warning)',
  Low: 'var(--color-good)',
}

export function getUrgencyColor(urgency: string): string {
  return URGENCY_COLOR[urgency as Urgency] ?? 'var(--color-ink-muted)'
}
