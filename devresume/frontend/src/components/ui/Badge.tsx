import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'violet' | 'green' | 'red' | 'amber' | 'gray' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  size?: 'sm' | 'md'
}

const variantMap: Record<BadgeVariant, string> = {
  default:
    'bg-violet-50 text-violet-700 border border-violet-200 ' +
    'dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700/60',
  violet:
    'bg-violet-600 text-white dark:bg-violet-700',
  green:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 ' +
    'dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  red:
    'bg-red-50 text-red-600 border border-red-200 ' +
    'dark:bg-red-950 dark:text-red-400 dark:border-red-900',
  amber:
    'bg-amber-50 text-amber-700 border border-amber-200 ' +
    'dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  gray:
    'bg-gray-100 text-gray-600 ' +
    'dark:bg-gray-800 dark:text-gray-300',
  outline:
    'bg-transparent border border-gray-200 text-gray-600 ' +
    'dark:border-gray-700 dark:text-gray-400',
}

const sizeMap = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export default function Badge({
  children,
  variant = 'default',
  className,
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  )
}
