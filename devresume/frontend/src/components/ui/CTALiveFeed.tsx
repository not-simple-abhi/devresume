import { useEffect, useState } from 'react'
import { Activity, Cpu } from 'lucide-react'

const DEFAULT_STEPS = [
  'Parsing structure…',
  'Checking ATS…',
  'Scoring impact…',
  'Analyzing keywords…',
  'Evaluating tone…',
]

interface CTALiveFeedProps {
  steps?: string[]
}

export default function CTALiveFeed({ steps = DEFAULT_STEPS }: CTALiveFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % steps.length)
        setVisible(true)
      }, 200)
    }, 1800)

    return () => clearInterval(id)
  }, [steps.length])

  return (
    <div className="hidden sm:flex items-center gap-2.5 bg-white dark:bg-gray-900/80 border border-blue-200 dark:border-blue-800/80 rounded-xl px-3 py-2 backdrop-blur-sm shadow-sm">
      {/* Left accent bar */}
      <div className="w-0.5 self-stretch rounded-full bg-gradient-to-b from-blue-400 to-blue-600 animate-pulse-accent" />

      {/* Icon */}
      <div className="relative shrink-0">
        <Cpu size={13} className="text-blue-600 dark:text-blue-400" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-live-dot" />
      </div>

      {/* Label */}
      <span
        className="text-xs text-gray-600 dark:text-gray-300 font-medium transition-opacity duration-200 whitespace-nowrap"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {steps[currentIndex]}
      </span>

      {/* Right indicator */}
      <div className="flex gap-0.5 shrink-0 ml-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-600 animate-pulse-accent"
            style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}
