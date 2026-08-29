import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Star, Flag, RefreshCw, Sparkles } from 'lucide-react'
import { useReviewStore } from '@/store/review.store'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

// ─── Interview Readiness Banner ───────────────────────────────────────────────
function ReadinessBanner({ status }: { status: string }) {
  const config = {
    ready: {
      icon: CheckCircle2,
      label: 'Interview Ready',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      iconColor: 'text-emerald-500',
      desc: 'Your resume demonstrates strong qualifications and is likely to pass initial HR screening.',
    },
    needs_work: {
      icon: AlertTriangle,
      label: 'Interview Readiness: Needs Work',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      iconColor: 'text-red-400',
      desc: "Based on standard recruiter screening patterns, your resume lacks quantifiable metrics in the most recent role. This significantly reduces the likelihood of passing initial HR filters.",
    },
    not_ready: {
      icon: Flag,
      label: 'Not Ready for Interviews',
      bg: 'bg-red-50 border-red-300',
      text: 'text-red-700',
      iconColor: 'text-red-500',
      desc: 'Significant improvements needed before submitting to roles.',
    },
  }

  const c = config[status as keyof typeof config] ?? config.needs_work
  const Icon = c.icon

  return (
    <div className={cn('flex items-start gap-3 border rounded-xl px-4 py-4', c.bg)}>
      <Icon size={18} className={cn('mt-0.5 shrink-0', c.iconColor)} />
      <div>
        <p className={cn('text-base font-bold', c.text)}>{c.label}</p>
        <p className="text-sm font-medium text-gray-600 mt-1 leading-relaxed">{c.desc}</p>
      </div>
    </div>
  )
}

// ─── Recruiter Tab ────────────────────────────────────────────────────────────
function RecruiterTab() {
  const { activeReport } = useReviewStore()
  if (!activeReport) return null
  const { recruiter } = activeReport.aiAnalysis

  return (
    <div className="space-y-4 pt-4 animate-fade-in">
      {/* Readiness banner */}
      <ReadinessBanner status={recruiter.interviewReadiness} />

      {/* Executive Summary */}
      <Card className="border-l-2 border-l-violet-400">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Executive Summary</h3>
        <p className="text-sm font-medium text-gray-700 leading-relaxed">{recruiter.summary}</p>
      </Card>

      {/* Strengths + Weaknesses side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card>
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
            <CheckCircle2 size={15} className="text-violet-500" />
            <h3 className="text-base font-semibold text-gray-800">Key Strengths</h3>
          </div>
          {recruiter.strengths.length > 0 ? (
            <ul className="space-y-3">
              {recruiter.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-gray-300 text-sm shrink-0 mt-0.5 font-mono">›</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.split(/[.,:]/)[0]}</p>
                    {s.includes('.') && (
                      <p className="text-sm font-medium text-gray-600 mt-0.5">{s.split(/[.:]/)[1]?.trim()}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">No strengths identified.</p>
          )}
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
            <AlertTriangle size={15} className="text-red-400" />
            <h3 className="text-base font-semibold text-gray-800">Areas for Improvement</h3>
          </div>
          {recruiter.weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {recruiter.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-gray-300 text-sm shrink-0 mt-0.5 font-mono">›</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{w.split(/[.,:]/)[0]}</p>
                    {w.includes('.') && (
                      <p className="text-sm font-medium text-gray-600 mt-0.5">{w.split(/[.:]/)[1]?.trim()}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">No areas for improvement identified.</p>
          )}
        </Card>
      </div>

      {/* Standout Points */}
      {recruiter.standoutPoints.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
            <Star size={15} className="text-amber-400" />
            <h3 className="text-base font-semibold text-gray-800">Standout Points</h3>
          </div>
          <ul className="space-y-2.5">
            {recruiter.standoutPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                <Star size={13} className="text-amber-400 mt-0.5 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Red Flags */}
      {recruiter.redFlags.length > 0 && (
        <Card className="border-red-100">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-red-50">
            <Flag size={15} className="text-red-400" />
            <h3 className="text-base font-semibold text-gray-800">Red Flags</h3>
            <Badge variant="red" size="sm">{recruiter.redFlags.length}</Badge>
          </div>
          <ul className="space-y-2.5">
            {recruiter.redFlags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700 bg-red-50 rounded-lg px-3 py-2.5">
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

// ─── Grammar Tab ──────────────────────────────────────────────────────────────
function GrammarTab() {
  const { activeReport } = useReviewStore()
  if (!activeReport) return null
  const { grammar } = activeReport.aiAnalysis

  const qualityColor = {
    excellent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    good:      'text-violet-600 bg-violet-50 border-violet-200',
    average:   'text-amber-600 bg-amber-50 border-amber-200',
    poor:      'text-red-600 bg-red-50 border-red-200',
  }

  return (
    <div className="space-y-4 pt-4 animate-fade-in">
      {/* Quality header badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Writing Quality</span>
          <Badge
            variant="default"
            className={cn('capitalize font-semibold', qualityColor[grammar.writingQuality ?? 'average'])}
          >
            {grammar.writingQuality ?? 'average'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Tone</span>
          <Badge variant="gray">{grammar.tone}</Badge>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Tense Consistent</span>
          {grammar.tenseConsistent ? (
            <Badge variant="green">✓ Yes</Badge>
          ) : (
            <Badge variant="red">✗ No</Badge>
          )}
        </div>
      </div>

      {/* Errors */}
      {grammar.errors.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <AlertTriangle size={15} className="text-red-400" />
            <h3 className="text-base font-semibold text-gray-800">Grammar Errors</h3>
            <Badge variant="red" size="sm">{grammar.errors.length}</Badge>
          </div>
          <div className="space-y-3">
            {grammar.errors.map((err, i) => {
              const original   = err.original   ?? err.text    ?? ''
              const suggestion = err.suggestion  ?? err.message ?? ''
              return (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {original && (
                    <p className="text-sm font-medium text-red-500 line-through mb-1.5">{original}</p>
                  )}
                  {suggestion && (
                    <p className="text-sm font-medium text-gray-700">{suggestion}</p>
                  )}
                  {!original && !suggestion && (
                    <p className="text-sm font-medium text-gray-600">{JSON.stringify(err)}</p>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Suggestions */}
      {grammar.suggestions.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <RefreshCw size={15} className="text-violet-400" />
            <h3 className="text-base font-semibold text-gray-800">Writing Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {grammar.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {grammar.errors.length === 0 && grammar.suggestions.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-base font-bold text-emerald-700">No grammar issues found</p>
          <p className="text-sm font-medium text-emerald-600 mt-1">Your writing is clean and professional.</p>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const [tab, setTab] = useState('recruiter')
  const { activeReport } = useReviewStore()

  if (!activeReport) {
    return <EmptyState title="No analysis loaded" description="Upload a resume to see AI insights." />
  }

  return (
    <div className="space-y-0 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-violet-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-sm font-medium text-gray-500">
              Deep analysis and actionable feedback generated for{' '}
              <span className="text-gray-700 font-semibold">'Senior Frontend Engineer'</span> role.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />}>
          Re-run Analysis
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Tabs
          tabs={[
            { id: 'recruiter', label: 'Recruiter Perspective' },
            { id: 'grammar',   label: 'Grammar & Tone' },
          ]}
          active={tab}
          onChange={setTab}
          className="px-4"
        />
        <div className="px-5 pb-5">
          {tab === 'recruiter' && <RecruiterTab />}
          {tab === 'grammar'   && <GrammarTab />}
        </div>
      </div>
    </div>
  )
}
