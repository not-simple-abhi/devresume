import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number       // 0-100
  max?: number
  color?: string      // tailwind bg class or hex
  className?: string
  animated?: boolean
  height?: 'sm' | 'md'
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  className,
  animated = true,
  height = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  // Determine color from value if not explicitly given
  const barColor =
    color ??
    (pct >= 70 ? '#7c3aed' : pct >= 50 ? '#f59e0b' : '#ef4444')

  return (
    <div
      className={cn(
        'w-full bg-gray-100 rounded-full overflow-hidden',
        height === 'sm' ? 'h-1.5' : 'h-2',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full', animated && 'bar-animate')}
        style={{ width: `${pct}%`, backgroundColor: barColor }}
      />
    </div>
  )
}
