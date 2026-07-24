import type { AnalysisSummary, AnalyzeResponse, ApiError } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class AnalyzeError extends Error {
  code: number

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'AnalyzeError'
    this.code = apiError.code
  }
}

export async function analyzeFeedback(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let detail: ApiError = { code: response.status, message: response.statusText }
    try {
      const body = await response.json()
      if (body?.detail) detail = body.detail
    } catch {
      // response body wasn't JSON — fall back to the status line above
    }
    throw new AnalyzeError(detail)
  }

  return response.json()
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
