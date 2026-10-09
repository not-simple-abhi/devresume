import { Link, useNavigate } from 'react-router-dom'
import { Trash2, FileText, Upload, GitCompare, Plus, Loader2, TrendingUp, Award, Target, BarChart2 } from 'lucide-react'
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

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  )
}

function ReviewCard({ review, isBest }: { review: SavedReview; isBest?: boolean }) {
  const { setActiveReport } = useReviewStore()
  const deleteMutation = useDeleteReview()
  const navigate = useNavigate()

  const handleView = () => { setActiveReport(review.reportJson, review.resumeName); navigate('/analysis') }
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${review.resumeName}"?`)) deleteMutation.mutate(review.id)
  }

  const scoreColor = review.overallScore >= 65 ? '#2563eb' : review.overallScore >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div
      className="bg-white dark:bg-[var(--bg-surface)] rounded-2xl border border-gray-100 dark:border-[var(--border)] cursor-pointer group relative overflow-hidden card-hover-premium"
      onClick={handleView}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleView() } }}
      aria-label={`View report for ${review.resumeName}`}
    >
      {/* Best indicator top bar */}
      {isBest && (
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #2563eb, #3b82f6, #6366f1)' }} />
      )}

      {/* Delete overlay */}
      {deleteMutation.isPending && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-2xl flex flex-col items-center justify-center gap-2 z-10 backdrop-blur-sm">
          <Loader2 size={20} className="animate-spin text-blue-500" />
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Deleting…</p>
        </div>
      )}

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">{review.resumeName}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDate(review.createdAt)}
                <span className="ml-1.5 text-gray-300 dark:text-gray-600">· {relativeTime(review.createdAt)}</span>
              </p>
            </div>
          </div>
          {isBest && (
            <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full font-bold shrink-0">
              <Award size={8} /> BEST
            </span>
          )}
        </div>

        {/* Score display */}
        <div className="flex items-center gap-4 mb-4">
          <ScoreRing score={review.overallScore} size="sm" showLabel={false} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-black font-mono-data" style={{ color: scoreColor }}>{review.overallScore}</span>
              <span className="text-xs text-gray-400">/100</span>
              <Badge size="sm" className={`ml-1 ${scoreLabelColor(review.overallScore)}`}>
                {scoreLabel(review.overallScore)}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">ATS</span>
              <ScoreBar value={review.atsScore} color="#6366f1" />
              <span className="text-[10px] font-bold font-mono-data text-indigo-600 dark:text-indigo-400 shrink-0">{review.atsScore}%</span>
            </div>
          </div>
        </div>

        {/* Hover-revealed breakdown */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 mb-4 space-y-2 translate-y-1 group-hover:translate-y-0">
          {[
            { label: 'Overall', value: review.overallScore, color: scoreColor },
            { label: 'ATS',     value: review.atsScore,     color: '#6366f1' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 w-12 shrink-0">{label}</span>
              <ScoreBar value={value} color={color} />
              <span className="text-[10px] font-bold font-mono-data w-6 text-right shrink-0" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Delete error */}
        {deleteMutation.isError && (
          <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-950/50 rounded-lg px-2 py-1">Delete failed. Try again.</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
          <Button variant="outline" size="sm" fullWidth onClick={handleView}>
            View Report
          </Button>
          <button onClick={handleDelete} disabled={deleteMutation.isPending}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-all disabled:opacity-50"
            aria-label="Delete review">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat cell ────────────────────────────────────────────────────────────────
function StatCell({ icon: Icon, label, value, color, bg }: { icon: React.ComponentType<{size?: number; className?: string}>; label: string; value: React.ReactNode; color: string; bg: string }) {
  return (
    <div className={`flex-1 px-5 py-4 text-center relative overflow-hidden ${bg}`}>
      <div className="flex justify-center mb-1.5">
        <Icon size={14} className={color} />
      </div>
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-black font-mono-data ${color}`}>{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: reviews = [], isLoading, isError, refetch } = useHistory()

  const bestReviewId = getBestReviewId(reviews)
  const highestOverall = reviews.length > 0 ? Math.max(...reviews.map(r => r.overallScore)) : 0
  const highestAts     = reviews.length > 0 ? Math.max(...reviews.map(r => r.atsScore)) : 0
  const avgOverall     = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.overallScore, 0) / reviews.length) * 10) / 10
    : 0

  const chartData: ScoreChartDataPoint[] = [...reviews]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(r => ({ date: r.createdAt, resumeName: r.resumeName, overall: r.overallScore, ats: r.atsScore }))

  const overallColor = highestOverall >= 65 ? 'text-emerald-600 dark:text-emerald-400' : highestOverall >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-page-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {reviews.length > 0
              ? `${reviews.length} saved resume review${reviews.length !== 1 ? 's' : ''} · keep improving.`
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

      {/* ── Stats bar ── */}
      {(isLoading || reviews.length > 0) && (
        <Card className="mb-6 overflow-hidden !p-0">
          <div className="flex items-stretch divide-x divide-[var(--border)]">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="flex-1 px-5 py-4">
                  <ShimmerSkeleton height={12} className="mb-2 w-2/3 mx-auto" />
                  <ShimmerSkeleton height={26} className="w-1/2 mx-auto" />
                </div>
              ))
            ) : (
              <>
                <StatCell icon={BarChart2}  label="Total Reviews" value={reviews.length}  color="text-gray-700 dark:text-gray-200"          bg="" />
                <StatCell icon={Award}      label="Best Overall"  value={highestOverall}  color={overallColor}                               bg="" />
                <StatCell icon={Target}     label="Best ATS"      value={`${highestAts}%`} color="text-indigo-600 dark:text-indigo-400"       bg="" />
                <StatCell icon={TrendingUp} label="Avg Overall"   value={avgOverall}      color="text-blue-600 dark:text-blue-400"        bg="" />
              </>
            )}
          </div>
        </Card>
      )}

      {/* ── Score chart ── */}
      {isLoading && <ShimmerSkeleton height={220} className="mb-6 rounded-2xl" />}
      {!isLoading && reviews.length >= 2 && (
        <Card className="mb-6">
          <ScoreChart data={chartData} />
        </Card>
      )}
      {!isLoading && reviews.length === 1 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-sm text-blue-700 dark:text-blue-300 text-center">
          <TrendingUp size={14} className="inline mr-1.5 mb-0.5" />
          Upload one more resume to unlock your score history chart.
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[var(--bg-surface)] rounded-2xl border border-gray-100 dark:border-[var(--border)] p-5">
              <div className="flex gap-3 mb-4">
                <ShimmerSkeleton height={40} width={40} className="rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <ShimmerSkeleton height={12} className="w-3/4" />
                  <ShimmerSkeleton height={10} className="w-1/2" />
                </div>
              </div>
              <ShimmerSkeleton height={56} className="mb-3 rounded-xl" />
              <ShimmerSkeleton height={34} className="rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl p-5">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Failed to load your review history.</p>
          <button onClick={() => refetch()} className="text-xs text-red-600 dark:text-red-400 underline hover:no-underline transition-all">Retry</button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !isError && reviews.length === 0 && (
        <EmptyState
          title="No reviews yet"
          description="Upload your first resume to get an AI-powered analysis and start improving."
          action={<Link to="/analyze"><Button size="sm" icon={<Upload size={13} />}>Upload Resume</Button></Link>}
        />
      )}

      {/* ── Grid ── */}
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
