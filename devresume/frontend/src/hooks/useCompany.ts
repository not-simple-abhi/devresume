import { useMutation, useQuery } from '@tanstack/react-query'
import { companyApi } from '@/api/company.api'
import { QUERY_KEYS } from '@/lib/constants'

export function useCompanyList() {
  return useQuery({
    queryKey: QUERY_KEYS.companies,
    queryFn: companyApi.listCompanies,
    staleTime: Infinity,
  })
}

export function useAnalyzeBatch() {
  return useMutation({
    mutationFn: ({ file, companies }: { file: File; companies: string[] }) =>
      companyApi.analyzeBatch(file, companies),
  })
}
