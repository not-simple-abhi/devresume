import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '@/api/review.api'
import { QUERY_KEYS } from '@/lib/constants'

export function useHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.history,
    queryFn: reviewApi.getHistory,
    staleTime: 1000 * 60 * 5,
  })
}

export function useReviewById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.review(id),
    queryFn: () => reviewApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  })
}

export function useAnalyzeGuest() {
  return useMutation({ mutationFn: reviewApi.analyzeGuest })
}

export function useAnalyzeAndSave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.analyzeAndSave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.history })
    },
  })
}

export function useDeleteReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.history })
      const prev = qc.getQueryData(QUERY_KEYS.history)
      qc.setQueryData(QUERY_KEYS.history, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.filter((r: { id: string }) => r.id !== id)
      })
      return { prev }
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        qc.setQueryData(QUERY_KEYS.history, context.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.history })
    },
  })
}
