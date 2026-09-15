import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const id = setInterval(() => {
      setCurrentIndex(i => (i + 1) % steps.length)
    }, 1800)

    return () => clearInterval(id)
  }, [steps.length])

  return (
    <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-900 border border-violet-200 dark:border-violet-800 rounded-xl px-3 py-2">
      {/* Left accent bar */}
      <div className="w-1 self-stretch rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse-accent" />
      {/* Activity icon */}
      <Activity size={13} className="text-violet-600 dark:text-violet-400 shrink-0" />
      {/* Animated label — key change forces remount to retrigger animate-cta-enter */}
      <span key={currentIndex} className="text-xs text-gray-600 dark:text-gray-400 animate-cta-enter">
        {steps[currentIndex]}
      </span>
    </div>
  )
}
