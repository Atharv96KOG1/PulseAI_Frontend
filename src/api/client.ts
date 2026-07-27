import type { AnalysisSummary, AnalyzeResponse, ApiError, QueryResponse } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class AnalyzeError extends Error {
  code: number

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'AnalyzeError'
    this.code = apiError.code
  }
}

export class QueryError extends Error {
  code: number

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'QueryError'
    this.code = apiError.code
  }
}

async function parseApiError(response: Response): Promise<ApiError> {
  let detail: ApiError = { code: response.status, message: response.statusText }
  try {
    const body = await response.json()
    if (typeof body?.detail === 'string') {
      detail = { code: response.status, message: body.detail }
    } else if (body?.detail?.message) {
      detail = body.detail
    }
  } catch {
    // response body wasn't JSON — fall back to the status line above
  }
  return detail
}

export async function analyzeFeedback(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new AnalyzeError(await parseApiError(response))
  }

  return response.json()
}

export async function askQuestion(analysisId: string, question: string): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis_id: analysisId, question }),
  })

  if (!response.ok) {
    throw new QueryError(await parseApiError(response))
  }

  return response.json()
}

export async function fetchReportPdf(analysisId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/report/${analysisId}`)
  if (!response.ok) {
    throw new QueryError(await parseApiError(response))
  }
  return response.blob()
}

export async function fetchHistory(): Promise<AnalysisSummary[]> {
  const response = await fetch(`${API_BASE_URL}/history`)
  if (!response.ok) throw new Error(`Could not load history (${response.status})`)
  return response.json()
}

export async function fetchHistoryDetail(id: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`)
  if (!response.ok) throw new Error(`Could not load analysis ${id} (${response.status})`)
  return response.json()
}
