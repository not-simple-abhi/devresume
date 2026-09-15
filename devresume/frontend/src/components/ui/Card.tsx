import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const isInteractive = hover && onClick !== undefined

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!isInteractive) return
    if (e.key === 'Enter') {
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
    } else if (e.key === ' ') {
      e.preventDefault()
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={cn(
        'bg-white dark:bg-[var(--bg-surface)] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm',
        hover && 'transition-all hover:shadow-[0_8px_30px_rgba(109,40,217,0.12)] dark:hover:shadow-[0_8px_30px_rgba(109,40,217,0.25)] hover:border-violet-100 dark:hover:border-violet-800',
        isInteractive && 'cursor-pointer',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
