import { apiClient, unwrap } from './client'
import type { ReviewReport, SavedReview } from '@/types/review.types'

function toFormData(file: File): FormData {
  const fd = new FormData()
  fd.append('resume', file)
  return fd
}

export const reviewApi = {
  analyzeGuest: (file: File) =>
    apiClient
      .post<{ data: ReviewReport }>('/review/analyze', toFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap),

  analyzeAndSave: (file: File) =>
    apiClient
      .post<{ data: ReviewReport }>('/review/analyze/save', toFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap),

  getHistory: () =>
    apiClient.get<{ data: SavedReview[] }>('/review/history').then(unwrap),

  getById: (id: string) =>
    apiClient.get<{ data: SavedReview }>(`/review/${id}`).then(unwrap),

  delete: (id: string) =>
    apiClient.delete(`/review/${id}`).then((r) => r.data),
}
