import { apiClient, unwrap } from './client'
import type { CompanyAnalysis, CompanyBatchResult } from '@/types/company.types'

export const companyApi = {
  listCompanies: () =>
    apiClient.get<{ data: string[] }>('/company/list').then(unwrap),

  analyzeOne: (file: File, company: string) => {
    const fd = new FormData()
    fd.append('resume', file)
    fd.append('company', company)
    return apiClient
      .post<{ data: CompanyAnalysis }>('/company/analyze', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap)
  },

  analyzeBatch: (file: File, companies: string[]) => {
    const fd = new FormData()
    fd.append('resume', file)
    fd.append('companies', companies.join(','))
    return apiClient
      .post<{ data: CompanyBatchResult }>('/company/analyze/batch', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap)
  },
}
