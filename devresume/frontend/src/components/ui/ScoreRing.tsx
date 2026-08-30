import { scoreColor, scoreLabel } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

const sizeMap = {
  sm: { r: 32, stroke: 5, cx: 40, viewBox: 80,  fontSize: 'text-xl',  labelSize: 'text-[10px]' },
  md: { r: 42, stroke: 6, cx: 52, viewBox: 104, fontSize: 'text-3xl', labelSize: 'text-xs' },
  lg: { r: 52, stroke: 7, cx: 64, viewBox: 128, fontSize: 'text-4xl', labelSize: 'text-sm' },
}

export default function ScoreRing({
  score,
  size = 'md',
  showLabel = true,
  label,
  className = '',
}: ScoreRingProps) {
  const { r, stroke, cx, viewBox, fontSize, labelSize } = sizeMap[size]
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)
  const displayLabel = label ?? scoreLabel(score)

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={viewBox}
          height={viewBox}
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="-rotate-90"
        >
          {/* Track — uses CSS variable so it adapts to dark mode */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="var(--ring-track)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono-data font-bold leading-none ${fontSize}`}
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`font-medium text-gray-500 dark:text-gray-400 ${labelSize}`}>
          {displayLabel}
        </span>
      )}
    </div>
  )
}
