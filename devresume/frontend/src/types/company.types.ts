export interface CompanyAnalysis {
  company: string
  readiness_score: number
  fit_summary?: string
  matching_skills?: string[]
  missing_skills?: string[]
  recommendations?: string[]
}

export interface CompanyBatchResult {
  results: CompanyAnalysis[]
  total: number
}
