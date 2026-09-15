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
  if (score >= 71) return '#7c3aed'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Work'
}

/** Returns Tailwind classes for score-coloured badges — includes dark variants */
export function scoreLabelColor(score: number): string {
  if (score >= 65) return 'text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-950'
  if (score >= 50) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950'
  return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
}

export function clampFileName(name: string, max = 28): string {
  if (name.length <= max) return name
  const ext = name.split('.').pop() ?? ''
  return name.slice(0, max - ext.length - 4) + '...' + ext
}

export function relativeTime(dateString: string): string {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)

  if (diff < 60) return 'just now'

  const minutes = Math.floor(diff / 60)
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`

  const hours = Math.floor(diff / 3600)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`

  if (diff < 172800) return 'yesterday'

  const days = Math.floor(diff / 86400)
  if (days < 7) return `${days} days ago`

  const weeks = Math.floor(days / 7)
  if (days < 30) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`

  const months = Math.floor(days / 30)
  return `${months} ${months === 1 ? 'month' : 'months'} ago`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1_048_576).toFixed(1)} MB`
}
