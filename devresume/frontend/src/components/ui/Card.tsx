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
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm',
        hover && 'transition-all hover:shadow-md hover:border-violet-100 dark:hover:border-violet-800',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
