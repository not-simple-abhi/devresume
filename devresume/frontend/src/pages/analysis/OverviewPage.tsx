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
    return (
      <EmptyState
        title="No analysis loaded"
        description="Upload a resume to see the overview."
      />
    )
  }

  const { deterministicAnalysis: det, aiAnalysis } = activeReport
  const { overall, atsScore, breakdown, maxBreakdown, intelligence, actionableSteps } = det
  const { recruiter } = aiAnalysis

  // Build score rows from breakdown
  const breakdownRows = Object.entries(breakdown).map(([key, val]) => {
    const max = maxBreakdown[key] ?? 100
    const pct = Math.round((val / max) * 100)
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()
    return { label, pct }
  })

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5 animate-fade-in">
      {/* ── Left column ── */}
      <div className="space-y-5">
        {/* Score cards */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-4 h-4 text-gray-400">⚖</span>
            Deterministic Analysis
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Overall */}
            <Card className="flex flex-col items-center py-6 gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Overall Match
              </p>
              <ScoreRing score={overall} size="lg" />
            </Card>

            {/* ATS */}
            <Card className="flex flex-col items-center py-6 gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                ATS Parsing
              </p>
              <ScoreRing score={atsScore} size="lg" />
            </Card>
          </div>
        </div>

        {/* Score Breakdown */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-50">
            Score Breakdown
          </h3>
          <div className="space-y-3.5">
            {breakdownRows.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span
                    className="text-sm font-semibold font-mono-data"
                    style={{ color: scoreColor(pct) }}
                  >
                    {pct}%
                  </span>
                </div>
                <ProgressBar value={pct} />
              </div>
            ))}

            {/* Fallback if no breakdown */}
            {breakdownRows.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No breakdown data available.
              </p>
            )}
          </div>
        </Card>

        {/* Quick Wins */}
        {actionableSteps.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <Zap size={14} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-800">Quick Wins</h3>
            </div>
            <ol className="space-y-2.5">
              {actionableSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>

      {/* ── Right column — AI Insights ── */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-700">AI Generated Insights</h2>
        </div>

        {/* Recruiter Summary */}
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Recruiter Summary</h3>
            <span className="text-[9px] px-2 py-0.5 bg-violet-50 text-violet-600 border border-violet-200 rounded-full font-medium shrink-0 ml-2">
              ✦ AI
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{recruiter.summary}</p>
        </Card>

        {/* Identified Strengths */}
        {recruiter.strengths.length > 0 && (
          <Card padding="sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mb-2.5">
              Identified Strengths
            </p>
            <ul className="space-y-1.5">
              {recruiter.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={13} className="text-violet-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Identified Gaps */}
        {recruiter.weaknesses.length > 0 && (
          <Card padding="sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Identified Gaps
            </p>
            <ul className="space-y-1.5">
              {recruiter.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Quick Wins from AI */}
        {aiAnalysis.ats.quickWins.length > 0 && (
          <Card padding="sm">
            <p className="text-sm font-semibold text-gray-800 mb-2.5">Quick Wins</p>
            <ol className="space-y-2">
              {aiAnalysis.ats.quickWins.slice(0, 3).map((w, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 border border-gray-100"
                >
                  {i + 1}. {w}
                </li>
              ))}
            </ol>
          </Card>
        )}

        {/* Domain + Keyword stats */}
        <Card padding="sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Keyword Intelligence
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Domain</span>
              <span className="font-medium text-gray-800 capitalize">{intelligence.domain}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Coverage</span>
              <span className="font-semibold text-violet-600">{intelligence.keywordCoverage.toFixed(0)}%</span>
            </div>
            <ProgressBar value={intelligence.keywordCoverage} />
            <div className="flex justify-between text-xs pt-1">
              <span className="text-gray-500">Skills Found</span>
              <span className="font-medium text-gray-800">{intelligence.totalSkills}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Projects</span>
              <span className="font-medium text-gray-800">{intelligence.totalProjects}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
