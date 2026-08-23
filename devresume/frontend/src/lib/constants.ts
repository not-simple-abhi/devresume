export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export const QUERY_KEYS = {
  history:   ['history']   as const,
  review:    (id: string) => ['review', id] as const,
  companies: ['companies'] as const,
}

export const SUPPORTED_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
  'Netflix', 'Stripe', 'Airbnb',
]

export const MAX_COMPANY_SELECT = 5
export const MAX_FILE_SIZE_MB   = 5
