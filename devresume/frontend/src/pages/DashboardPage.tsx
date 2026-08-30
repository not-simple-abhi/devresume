import { Link, useNavigate } from 'react-router-dom'
import { Trash2, FileText, Upload, GitCompare, Plus } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useReviewStore } from '@/store/review.store'
import { useHistory, useDeleteReview } from '@/hooks/useReview'
import Card from '@/components/ui/Card'
import ScoreRing from '@/components/ui/ScoreRing'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate, scoreLabel, scoreLabelColor } from '@/lib/utils'
import type { SavedReview } from '@/types/review.types'

function ReviewCard({ review }: { review: SavedReview }) {
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
    <Card hover className="cursor-pointer group" onClick={handleView}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-800 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-violet-500 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{review.resumeName}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Scores row */}
      <div className="flex items-center gap-4 mb-4">
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

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
        <Button variant="outline" size="sm" fullWidth onClick={handleView}>
          View Report
        </Button>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: reviews = [], isLoading, isError } = useHistory()

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
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load your review history. Please refresh the page.
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
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
