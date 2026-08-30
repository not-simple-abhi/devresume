import { CheckCircle2, AlertTriangle, Zap, Sparkles } from 'lucide-react'
import { useReviewStore } from '@/store/review.store'
import ScoreRing from '@/components/ui/ScoreRing'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'
import { scoreColor } from '@/lib/utils'

export default function OverviewPage() {
  const { activeReport } = useReviewStore()

  if (!activeReport) {
    return <EmptyState title="No analysis loaded" description="Upload a resume to see the overview." />
  }

  const { deterministicAnalysis: det, aiAnalysis } = activeReport
  const { overall, atsScore, breakdown, maxBreakdown, intelligence, actionableSteps } = det
  const { recruiter } = aiAnalysis

  const breakdownRows = Object.entries(breakdown).map(([key, val]) => {
    const max = maxBreakdown[key] ?? 100
    const pct = Math.round((val / max) * 100)
    const label = key
      .replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()).trim()
    return { label, pct }
  })

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5 animate-fade-in">
      {/* ── Left column ── */}
      <div className="space-y-5">
        {/* Score cards */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-4 h-4 text-gray-400">⚖</span>
            Deterministic Analysis
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="flex flex-col items-center py-6 gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Overall Match
              </p>
              <ScoreRing score={overall} size="lg" />
            </Card>
            <Card className="flex flex-col items-center py-6 gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                ATS Parsing
              </p>
              <ScoreRing score={atsScore} size="lg" />
            </Card>
          </div>
        </div>

        {/* Score Breakdown */}
        <Card>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            Score Breakdown
          </h3>
          <div className="space-y-4">
            {breakdownRows.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  <span className="text-sm font-bold font-mono-data" style={{ color: scoreColor(pct) }}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar value={pct} />
              </div>
            ))}
            {breakdownRows.length === 0 && (
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500 text-center py-4">
                No breakdown data available.
              </p>
            )}
          </div>
        </Card>

        {/* Quick Wins */}
        {actionableSteps.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Zap size={15} className="text-amber-500" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Quick Wins</h3>
            </div>
            <ol className="space-y-3">
              {actionableSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>

      {/* ── Right column ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-violet-500" />
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">AI Generated Insights</h2>
        </div>

        {/* Recruiter Summary */}
        <Card>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Recruiter Summary</h3>
            <span className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-full font-semibold shrink-0 ml-2">
              ✦ AI
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{recruiter.summary}</p>
        </Card>

        {/* Strengths */}
        {recruiter.strengths.length > 0 && (
          <Card padding="sm">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              Identified Strengths
            </p>
            <ul className="space-y-2">
              {recruiter.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={14} className="text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Gaps */}
        {recruiter.weaknesses.length > 0 && (
          <Card padding="sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Identified Gaps
            </p>
            <ul className="space-y-2">
              {recruiter.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Quick Wins from AI */}
        {aiAnalysis.ats.quickWins.length > 0 && (
          <Card padding="sm">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Wins</p>
            <ol className="space-y-2">
              {aiAnalysis.ats.quickWins.slice(0, 3).map((w, i) => (
                <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                  {i + 1}. {w}
                </li>
              ))}
            </ol>
          </Card>
        )}

        {/* Keyword stats */}
        <Card padding="sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Keyword Intelligence
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Domain</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{intelligence.domain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Coverage</span>
              <span className="font-bold text-violet-600 dark:text-violet-400">{intelligence.keywordCoverage.toFixed(0)}%</span>
            </div>
            <ProgressBar value={intelligence.keywordCoverage} />
            <div className="flex justify-between text-sm pt-1">
              <span className="font-medium text-gray-500 dark:text-gray-400">Skills Found</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{intelligence.totalSkills}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Projects</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{intelligence.totalProjects}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
