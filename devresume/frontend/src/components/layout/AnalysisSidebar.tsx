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

export default function AnalysisSidebar() {
  const { activeTab, setActiveTab } = useReviewStore()

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-0">
      {/* Section label */}
      <div className="px-5 pt-6 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Analysis Context
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
              activeTab === id
                ? 'bg-violet-50 text-violet-700 border border-violet-200/60'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon
              size={16}
              className={cn(
                activeTab === id ? 'text-violet-600' : 'text-gray-400'
              )}
            />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom spacer */}
      <div className="h-6" />
    </aside>
  )
}
