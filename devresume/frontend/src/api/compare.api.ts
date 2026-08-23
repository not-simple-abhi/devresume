import { apiClient, unwrap } from './client'
import type { CompareResult } from '@/types/review.types'

export const compareApi = {
  compare: (reviewId1: string, reviewId2: string) =>
    apiClient
      .post<{ data: CompareResult }>('/compare', { reviewId1, reviewId2 })
      .then(unwrap),
}
