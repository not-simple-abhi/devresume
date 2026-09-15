import { Link } from 'react-router-dom'
import { ChevronRight, Download, Share2, Sun, Moon } from 'lucide-react'
import AnalysisSidebar from '@/components/layout/AnalysisSidebar'
import BottomTabBar from '@/components/layout/BottomTabBar'
import { useReviewStore } from '@/store/review.store'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import Button from '@/components/ui/Button'
import { clampFileName } from '@/lib/utils'

interface AnalysisLayoutProps {
  children: React.ReactNode
}

export default function AnalysisLayout({ children }: AnalysisLayoutProps) {
  const { activeFileName, activeReport } = useReviewStore()
  const { isAuthenticated } = useAuthStore()
  const { isDark, toggle } = useThemeStore()

  const overall = activeReport?.deterministicAnalysis?.overall
  const ats     = activeReport?.deterministicAnalysis?.atsScore
  const domain  = activeReport?.deterministicAnalysis?.intelligence?.domain
  const candidateName = activeReport?.deterministicAnalysis?.candidate?.name?.trim()

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar — desktop only */}
      <div className="hidden md:block">
        <AnalysisSidebar />
      </div>
      <BottomTabBar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-[var(--bg-surface)] dark:bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 py-3 flex items-center justify-between shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 min-w-0">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors shrink-0"
              >
                Dashboard
              </Link>
            ) : (
              <span className="shrink-0">Home</span>
            )}
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            <span className="shrink-0">Analysis</span>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />

            {/* File + meta */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                {candidateName
                  ? `${candidateName} · ${activeFileName ? clampFileName(activeFileName) : 'Resume'}`
                  : activeFileName ? clampFileName(activeFileName) : 'Resume'}
              </span>
              {domain && (
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-medium border border-violet-200 dark:border-violet-800">
                  {domain} domain
                </span>
              )}
              {overall !== undefined && (
                <span className="shrink-0 text-[10px] text-gray-500 dark:text-gray-400">
                  Score: <strong className="font-mono-data text-violet-600 dark:text-violet-400">{overall}/100</strong>
                </span>
              )}
              {ats !== undefined && (
                <span className="shrink-0 text-[10px] text-gray-500 dark:text-gray-400">
                  · ATS: <strong className="font-mono-data text-violet-600 dark:text-violet-400">{ats}/100</strong>
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative group">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={13} />}
                disabled
                aria-label="Export PDF, coming soon"
                className="opacity-50 cursor-not-allowed"
                onClick={undefined}
              >
                Export PDF
              </Button>
              <div className="absolute bottom-full mb-1.5 right-0 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                PDF export coming soon
              </div>
            </div>
            <Button variant="primary" size="sm" icon={<Share2 size={13} />}>
              Share Report
            </Button>
          </div>
        </div>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto page-bg pb-16 md:pb-0">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
