import { useState } from 'react'
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useHistory } from '@/hooks/useReview'
import { useCompare } from '@/hooks/useCompare'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ScoreRing from '@/components/ui/ScoreRing'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate, cn } from '@/lib/utils'
import type { CompareResult } from '@/types/review.types'

function DeltaBadge({ value }: { value: number }) {
  if (value > 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
      <TrendingUp size={11} /> +{value}
    </span>
  )
  if (value < 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
      <TrendingDown size={11} /> {value}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
      <Minus size={11} /> 0
    </span>
  )
}

function CompareResult({ result }: { result: CompareResult }) {
  const r1Stronger = result.review1.overallScore > result.review2.overallScore
  const r2Stronger = result.review2.overallScore > result.review1.overallScore

  const breakdown1 = result.review1.detailedScores ?? {}
  const breakdown2 = result.review2.detailedScores ?? {}
  const allKeys = Array.from(new Set([...Object.keys(breakdown1), ...Object.keys(breakdown2)]))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Recommendation banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-violet-800">{result.recommendation}</p>
      </div>

      {/* Side-by-side score cards */}
      <div className="grid grid-cols-2 gap-4">
        {[result.review1, result.review2].map((r, i) => {
          const isWinner = i === 0 ? r1Stronger : r2Stronger
          return (
            <Card
              key={r.id}
              className={cn(isWinner && 'border-violet-300 ring-1 ring-violet-200')}
            >
              {isWinner && (
                <div className="text-[9px] font-bold uppercase tracking-widest text-violet-600 mb-2">
                  ✦ Stronger version
                </div>
              )}
              <p className="text-xs font-semibold text-gray-700 truncate mb-1">{r.resumeName}</p>
              <p className="text-[10px] text-gray-400 mb-4">{formatDate(r.date)}</p>

              <div className="flex justify-center mb-4">
                <ScoreRing score={r.overallScore} size="md" />
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>ATS Score</span>
                <span className="font-semibold font-mono-data text-gray-800">{r.atsScore}%</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Score deltas */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-50">
          Score Differences
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overall Score</span>
            <DeltaBadge value={result.differences.overallScore} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">ATS Score</span>
            <DeltaBadge value={result.differences.atsScore} />
          </div>
        </div>
      </Card>

      {/* Breakdown comparison */}
      {allKeys.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-50">
            Breakdown Comparison
          </h3>
          <div className="space-y-4">
            {allKeys.map((key) => {
              const v1 = (breakdown1[key] ?? 0) as number
              const v2 = (breakdown2[key] ?? 0) as number
              const label = key.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, c => c.toUpperCase()).trim()
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono-data font-semibold text-gray-700 w-8 text-right">{v1}</span>
                      <span className="text-[10px] text-gray-400">vs</span>
                      <span className="text-xs font-mono-data font-semibold text-gray-700 w-8">{v2}</span>
                      <DeltaBadge value={v2 - v1} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ProgressBar value={v1} max={100} color="#7c3aed" height="sm" />
                    <ProgressBar value={v2} max={100} color="#8b5cf6" height="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default function ComparePage() {
  const { data: reviews = [], isLoading } = useHistory()
  const compareMutation = useCompare()
  const [id1, setId1] = useState('')
  const [id2, setId2] = useState('')

  const canCompare = id1 && id2 && id1 !== id2

  const handleCompare = () => {
    if (!canCompare) return
    compareMutation.mutate({ id1, id2 })
  }

  if (!isLoading && reviews.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <EmptyState
          title="Not enough reviews to compare"
          description="You need at least 2 saved reviews to use the comparison tool. Upload another resume first."
          action={
            <a href="/analyze">
              <Button size="sm">Upload Resume</Button>
            </a>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
          <GitCompare size={18} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Compare Resumes</h1>
          <p className="text-xs text-gray-500">Select two saved reviews to see a side-by-side analysis.</p>
        </div>
      </div>

      {/* Selector */}
      <Card className="mb-5">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Version 1 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Version 1</label>
            <select
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-violet-400 outline-none"
            >
              <option value="">Select a review…</option>
              {reviews.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === id2}>
                  {r.resumeName} — {formatDate(r.createdAt)} ({r.overallScore}/100)
                </option>
              ))}
            </select>
          </div>

          {/* Version 2 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Version 2</label>
            <select
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-violet-400 outline-none"
            >
              <option value="">Select a review…</option>
              {reviews.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === id1}>
                  {r.resumeName} — {formatDate(r.createdAt)} ({r.overallScore}/100)
                </option>
              ))}
            </select>
          </div>
        </div>

        {id1 === id2 && id1 !== '' && (
          <p className="text-xs text-amber-600 mb-3">Select two different reviews to compare.</p>
        )}

        <Button
          onClick={handleCompare}
          loading={compareMutation.isPending}
          disabled={!canCompare}
          icon={<GitCompare size={13} />}
        >
          Compare
        </Button>
      </Card>

      {/* Error */}
      {compareMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
          Comparison failed. Please try again.
        </div>
      )}

      {/* Result */}
      {compareMutation.data && (
        <CompareResult result={compareMutation.data} />
      )}
    </div>
  )
}
