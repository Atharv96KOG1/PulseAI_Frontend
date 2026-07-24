/** Mirrors backend/schemas/response.py and backend/schemas/ticket.py exactly. */

import type { Category, Sentiment, Urgency } from './taxonomy'

// Theme names are validated server-side against the category-owned lists in
// taxonomy.ts; kept as a plain string here since a theme's parent category
// is already carried alongside it on every object below.
export type Theme = string

export interface AdditionalIssue {
  category: Category
  theme: Theme
  urgency: Urgency
}

export interface TicketClassification {
  ticket_id: string
  feedback_text: string
  primary_category: Category
  primary_theme: Theme
  sentiment: Sentiment
  sentiment_score: number
  urgency: Urgency
  actionable: boolean
  additional_issues: AdditionalIssue[]
}

export interface ValidationReport {
  total_rows: number
  processed: number
  skipped: number
  skip_reasons: Record<string, number>
}

export interface RankedCount {
  name: string
  count: number
}

export interface AnalyticsResult {
  total_processed: number
  total_skipped: number
  category_distribution: Record<string, number>
  sentiment_distribution: Record<string, number>
  theme_frequency: Record<string, number>
  urgency_distribution: Record<string, number>
  urgency_distribution_with_additional: Record<string, number>
  actionable_count: number
  top_categories: RankedCount[]
  top_themes: RankedCount[]
  processing_success_rate: number
  positive_pct: number
  neutral_pct: number
  negative_pct: number
  average_sentiment_score: number
  high_urgency_count: number
}

export interface AnalyzeResponse {
  validation_report: ValidationReport
  items: TicketClassification[]
  analytics: AnalyticsResult
  summary: string
}

export interface AnalysisSummary {
  id: string
  created_at: string
  total_rows: number
  processed: number
  skipped: number
}

export interface ApiError {
  code: number
  message: string
}
