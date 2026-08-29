import { useQuery } from '@tanstack/react-query'
import { apiClient, unwrap } from '@/api/client'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () =>
      apiClient
        .get<{ data: { totalReviews: number } }>('/review/stats')
        .then(unwrap),
    staleTime: 1000 * 60 * 5, // refresh every 5 minutes
    refetchOnWindowFocus: false,
  })
}
