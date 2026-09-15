import { LayoutDashboard, ScanText, Brain, Layers, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReviewStore } from '@/store/review.store'

type Tab = 'overview' | 'ats' | 'skills' | 'projects' | 'insights'

const navItems: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview',  label: 'Overview',    icon: LayoutDashboard },
  { id: 'ats',       label: 'ATS',         icon: ScanText },
  { id: 'skills',    label: 'Skills',      icon: Brain },
  { id: 'projects',  label: 'Projects',    icon: Layers },
  { id: 'insights',  label: 'AI Insights', icon: Sparkles },
]

export default function BottomTabBar() {
  const { activeTab, setActiveTab } = useReviewStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex md:hidden">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          aria-label={label}
          aria-current={activeTab === id ? 'page' : undefined}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
            activeTab === id
              ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          )}
        >
          <Icon size={18} />
          <span className="text-[9px] truncate max-w-full px-1">{label}</span>
        </button>
      ))}
    </nav>
  )
}
