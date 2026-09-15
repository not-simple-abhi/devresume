import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 ' +
    'hover:shadow-[0_4px_14px_rgba(109,40,217,0.35)] transition-shadow ' +
    'dark:bg-violet-600 dark:hover:bg-violet-500',
  secondary:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 ' +
    'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 ' +
    'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  danger:
    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 ' +
    'dark:bg-red-950 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900',
  outline:
    'border border-violet-200 text-violet-600 hover:bg-violet-50 ' +
    'dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950',
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      aria-label={loading && typeof children === 'string' ? `${children}, loading` : undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}
