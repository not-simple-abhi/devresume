import { Link, useNavigate } from 'react-router-dom'
import { Trash2, FileText, Upload, GitCompare, Plus, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useReviewStore } from '@/store/review.store'
import { useHistory, useDeleteReview } from '@/hooks/useReview'
import Card from '@/components/ui/Card'
import ScoreRing from '@/components/ui/ScoreRing'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ShimmerSkeleton from '@/components/ui/ShimmerSkeleton'
import ScoreChart, { ScoreChartDataPoint } from '@/components/ui/ScoreChart'
import { formatDate, scoreLabel, scoreLabelColor, relativeTime } from '@/lib/utils'
import type { SavedReview } from '@/types/review.types'

function getBestReviewId(reviews: SavedReview[]): string | undefined {
  if (reviews.length === 0) return undefined
  return reviews.reduce((best, r) => {
    if (r.overallScore > best.overallScore) return r
    if (r.overallScore === best.overallScore && r.createdAt > best.createdAt) return r
    return best
  }).id
}

function ReviewCard({ review, isBest }: { review: SavedReview; isBest?: boolean }) {
  const { setActiveReport } = useReviewStore()
  const deleteMutation = useDeleteReview()
  const navigate = useNavigate()

  const handleView = () => {
    setActiveReport(review.reportJson, review.resumeName)
    navigate('/analysis')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${review.resumeName}"?`)) {
      deleteMutation.mutate(review.id)
    }
  }

  return (
    <Card hover className="cursor-pointer group relative overflow-hidden" onClick={handleView}>
      {/* Delete pending overlay */}
      {deleteMutation.isPending && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-xl flex flex-col items-center justify-center gap-2 z-10">
          <Loader2 size={20} className="animate-spin text-violet-500" />
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Deleting…</p>
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-800 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-violet-500 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{review.resumeName}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {formatDate(review.createdAt)}
              <span className="ml-1 text-[10px] text-gray-300 dark:text-gray-600">· {relativeTime(review.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Best badge */}
          {isBest && (
            <span className="text-[9px] px-2 py-0.5 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-full font-semibold shrink-0">
              ★ BEST
            </span>
          )}
        </div>
      </div>

      {/* Scores row */}
      <div className="flex items-center gap-4 mb-3">
        <ScoreRing score={review.overallScore} size="sm" showLabel={false} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Overall</span>
            <span className="text-sm font-bold font-mono-data text-gray-800 dark:text-gray-200">
              {review.overallScore}
            </span>
            <Badge size="sm" className={scoreLabelColor(review.overallScore)}>
              {scoreLabel(review.overallScore)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">ATS</span>
            <span className="text-sm font-bold font-mono-data text-gray-800 dark:text-gray-200">
              {review.atsScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Score breakdown (hover-revealed) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-3 space-y-1.5">
        {[
          { label: 'ATS Score', value: review.atsScore },
          { label: 'Overall', value: review.overallScore },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 w-16 shrink-0">{label}</span>
            <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${value}%`, backgroundColor: value >= 65 ? '#7c3aed' : value >= 50 ? '#f59e0b' : '#ef4444' }}
              />
            </div>
            <span className="text-[10px] font-mono-data font-medium text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ))}
      </div>

      {/* Delete error */}
      {deleteMutation.isError && (
        <p className="text-xs text-red-500 mb-2">Delete failed. Try again.</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
        <Button variant="outline" size="sm" fullWidth onClick={handleView}>
          View Report
        </Button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-all disabled:opacity-50"
          aria-label="Delete review"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: reviews = [], isLoading, isError, refetch } = useHistory()

  const bestReviewId = getBestReviewId(reviews)
  const highestOverall = reviews.length > 0 ? Math.max(...reviews.map(r => r.overallScore)) : 0
  const highestAts = reviews.length > 0 ? Math.max(...reviews.map(r => r.atsScore)) : 0
  const avgOverall = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.overallScore, 0) / reviews.length) * 10) / 10
    : 0

  const chartData: ScoreChartDataPoint[] = [...reviews]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(r => ({
      date: r.createdAt,
      resumeName: r.resumeName,
      overall: r.overallScore,
      ats: r.atsScore,
    }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {reviews.length > 0
              ? `You have ${reviews.length} saved resume review${reviews.length !== 1 ? 's' : ''}.`
              : 'Upload your first resume to get started.'}
          </p>
        </div>
        <div className="flex gap-2">
          {reviews.length >= 2 && (
            <Link to="/compare">
              <Button variant="secondary" size="sm" icon={<GitCompare size={13} />}>Compare</Button>
            </Link>
          )}
          <Link to="/analyze">
            <Button size="sm" icon={<Plus size={13} />}>New Analysis</Button>
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      {(isLoading || reviews.length > 0) && (
        <Card className="mb-6 overflow-hidden">
          <div className="flex items-stretch divide-x divide-[var(--border)] -m-5">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="flex-1 px-5 py-4">
                  <ShimmerSkeleton height={12} className="mb-2 w-2/3" />
                  <ShimmerSkeleton height={22} className="w-1/2" />
                </div>
              ))
            ) : (
              <>
                <div className="flex-1 px-5 py-4 text-center">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Total Reviews</p>
                  <p className="text-2xl font-bold font-mono-data text-gray-800 dark:text-gray-200">{reviews.length}</p>
                </div>
                <div className="flex-1 px-5 py-4 text-center">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Best Overall</p>
                  <p className={`text-2xl font-bold font-mono-data ${scoreLabelColor(highestOverall).split(' ').slice(0, 2).join(' ')}`}>
                    {highestOverall}
                  </p>
                </div>
                <div className="flex-1 px-5 py-4 text-center">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Best ATS</p>
                  <p className="text-2xl font-bold font-mono-data text-blue-600 dark:text-blue-400">{highestAts}</p>
                </div>
                <div className="flex-1 px-5 py-4 text-center">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Avg Overall</p>
                  <p className="text-2xl font-bold font-mono-data text-gray-800 dark:text-gray-200">{avgOverall}</p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Score history chart */}
      {isLoading && <ShimmerSkeleton height={220} className="mb-6 rounded-xl" />}
      {!isLoading && reviews.length >= 2 && (
        <Card className="mb-6">
          <ScoreChart data={chartData} />
        </Card>
      )}
      {!isLoading && reviews.length === 1 && (
        <div className="mb-6 bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-sm text-violet-700 dark:text-violet-300 text-center">
          Upload one more resume to unlock your score history chart.
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3" />
              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load your review history.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs text-red-600 dark:text-red-400 underline hover:no-underline transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && reviews.length === 0 && (
        <EmptyState
          title="No reviews yet"
          description="Upload your first resume to get an AI-powered analysis and start improving."
          action={
            <Link to="/analyze">
              <Button size="sm" icon={<Upload size={13} />}>Upload Resume</Button>
            </Link>
          }
        />
      )}

      {/* Grid */}
      {!isLoading && reviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {reviews.map((review) => (
            <div key={review.id} className="animate-slide-up">
              <ReviewCard review={review} isBest={review.id === bestReviewId} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
