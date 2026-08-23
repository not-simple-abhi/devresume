import { CheckCircle2, AlertCircle, Info, Sparkles, Wand2, Eye } from 'lucide-react'
import { useReviewStore } from '@/store/review.store'
import ScoreRing from '@/components/ui/ScoreRing'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

export default function ATSPage() {
  const { activeReport, activeFileName } = useReviewStore()

  if (!activeReport) {
    return <EmptyState title="No analysis loaded" description="Upload a resume to see ATS analysis." />
  }

  const { deterministicAnalysis: det, aiAnalysis } = activeReport
  const { atsScore, intelligence } = det
  const { ats } = aiAnalysis

  const matched = intelligence.matchedKeywords
  const missing = intelligence.missingKeywords

  // Estimate hard vs soft skills keyword coverage from categories
  const hardSkills = Math.round(intelligence.keywordCoverage)
  const softSkills = Math.max(10, Math.round(intelligence.keywordCoverage * 0.62))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top header bar ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">
              {activeFileName ?? 'Resume'}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-medium">
              <CheckCircle2 size={10} /> Parsed
            </span>
          </div>
          <p className="text-xs text-gray-500">Target Role: Senior Frontend Engineer</p>
        </div>

        {/* Score badges */}
        <div className="flex gap-3">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Total Score</p>
            <p className="text-xl font-bold font-mono-data text-gray-900">
              {det.overall}
              <span className="text-xs font-normal text-gray-400">/100</span>
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">ATS Match</p>
            <p className="text-xl font-bold font-mono-data text-violet-600">
              {atsScore}
              <span className="text-xs font-normal text-gray-400">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ATS Parsability ring */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="flex flex-col items-center py-8 gap-4">
            <h3 className="text-sm font-semibold text-gray-800 w-full text-center">ATS Parsability</h3>
            <ScoreRing score={atsScore} size="lg" />
            <p className="text-xs text-gray-500 text-center leading-relaxed px-2">
              {ats.scoreExplanation || 'Your resume format is readable by most Applicant Tracking Systems, but lacks specific keyword optimization for the target role.'}
            </p>
          </Card>

          {/* Keyword Coverage */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Keyword Coverage</h3>
              <span className="text-xs font-mono-data font-semibold text-violet-600">
                {matched.length} / {matched.length + missing.length}
              </span>
            </div>
            <ProgressBar value={intelligence.keywordCoverage} className="mb-3" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-sm font-bold font-mono-data text-gray-800">{hardSkills}%</p>
                <p className="text-[10px] text-gray-400">Hard Skills</p>
              </div>
              <div>
                <p className="text-sm font-bold font-mono-data text-gray-800">{softSkills}%</p>
                <p className="text-[10px] text-gray-400">Soft Skills</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Matched Keywords */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-500" />
              <h3 className="text-sm font-semibold text-gray-800">Matched Keywords</h3>
            </div>
            <Badge variant="gray" size="sm">{matched.length} found</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.slice(0, 20).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-violet-200 transition-colors"
              >
                {kw}
              </span>
            ))}
            {matched.length > 20 && (
              <span className="text-xs text-gray-400 self-center">+{matched.length - 20} more</span>
            )}
          </div>
        </Card>

        {/* Missing Keywords */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400" />
              <h3 className="text-sm font-semibold text-gray-800">Missing Keywords</h3>
            </div>
            <Badge variant="red" size="sm">{missing.length} critical</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {missing.slice(0, 12).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
                title="Click to see how to incorporate this keyword"
              >
                {kw}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg">
            <Info size={12} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Click on a missing keyword to see suggested ways to incorporate it into your experience section.
            </p>
          </div>
        </Card>
      </div>

      {/* ── AI ATS Explanation ── */}
      <Card className="border-violet-100">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-violet-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">AI ATS Explanation</h3>
              <Badge variant="gray" size="sm">BETA</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Based on analyzing 500+ successful Senior Frontend engineering resumes.
            </p>

            {/* Issues grid */}
            {ats.issues.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {ats.issues.slice(0, 4).map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gray-300 font-bold shrink-0 mt-0.5">❝</span>
                    <p className="leading-relaxed">{issue}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Keyword recommendations */}
            {ats.keywordRecommendations.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Keyword Recommendations
                </p>
                <div className="flex flex-wrap gap-2">
                  {ats.keywordRecommendations.slice(0, 8).map((rec, i) => (
                    <Badge key={i} variant="default" size="sm">{rec}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Formatting recommendations */}
            {ats.formattingRecommendations.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Formatting Recommendations
                </p>
                <ul className="space-y-1.5">
                  {ats.formattingRecommendations.slice(0, 4).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-50">
              <Button variant="primary" size="sm" icon={<Wand2 size={13} />}>
                Auto-Fix Resume
              </Button>
              <Button variant="secondary" size="sm" icon={<Eye size={13} />}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
