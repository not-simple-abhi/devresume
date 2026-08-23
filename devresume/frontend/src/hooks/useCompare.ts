import { useMutation } from '@tanstack/react-query'
import { compareApi } from '@/api/compare.api'

export function useCompare() {
  return useMutation({
    mutationFn: ({ id1, id2 }: { id1: string; id2: string }) =>
      compareApi.compare(id1, id2),
  })
}
