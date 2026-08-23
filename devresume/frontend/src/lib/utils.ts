import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function scoreColor(score: number): string {
  if (score >= 71) return '#7c3aed'   // purple / good (matches design)
  if (score >= 50) return '#f59e0b'   // amber
  return '#ef4444'                     // red
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Work'
}

export function scoreLabelColor(score: number): string {
  if (score >= 65) return 'text-violet-600 bg-violet-50'
  if (score >= 50) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export function clampFileName(name: string, max = 28): string {
  if (name.length <= max) return name
  const ext = name.split('.').pop() ?? ''
  return name.slice(0, max - ext.length - 4) + '...' + ext
}
