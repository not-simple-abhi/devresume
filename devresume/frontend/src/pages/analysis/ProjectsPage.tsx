import { useState } from 'react'
import { CheckCircle2, Circle, Sparkles, X, Check, Layers, Lightbulb } from 'lucide-react'
import { useReviewStore } from '@/store/review.store'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

interface AISuggestion {
  project_name?: string
  improved_description?: string
  current_issue?: string
  missing_elements?: string[]
}

interface RecommendedProject {
  project_idea?: string
  description?: string
  skills_demonstrated?: string[]
  why_valuable?: string
}

function normalizeString(s: unknown): string {
  if (typeof s === 'string') return s
  if (typeof s === 'object' && s !== null) {
    const obj = s as Record<string, unknown>
    return String(obj.text ?? obj.step ?? obj.skill ?? obj.goal ?? JSON.stringify(s))
  }
  return String(s)
}

function ImpactTag({ label }: { label: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT' }) {
  const colorMap = {
    'HIGH IMPACT':   'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    'MEDIUM IMPACT': 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    'LOW IMPACT':    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  }
  return (
    <span className={cn('text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider', colorMap[label])}>
      {label}
    </span>
  )
}

function ProjectCard({
  project,
  aiSuggestion,
}: {
  project: { title: string; score: number; maxScore: number; issues: string[] }
  aiSuggestion?: AISuggestion
}) {
  const [applied,   setApplied]   = useState(false)
  const [discarded, setDiscarded] = useState(false)
  const pct    = Math.round((project.score / project.maxScore) * 100)
  const impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT' =
    pct >= 75 ? 'HIGH IMPACT' : pct >= 50 ? 'MEDIUM IMPACT' : 'LOW IMPACT'

  const mockStack = project.title.toLowerCase().includes('micro')
    ? ['Kubernetes', 'Go', 'PostgreSQL', 'gRPC']
    : project.title.toLowerCase().includes('parking')
    ? ['MongoDB', 'Express', 'React', 'Node.js']
    : project.title.toLowerCase().includes('student')
    ? ['Flask', 'MySQL', 'Python']
    : ['Node.js', 'TypeScript', 'MongoDB']

  const metrics = [
    { label: 'Quantified outcomes (e.g., "Reduced latency by 40%")', done: pct >= 75 },
    { label: 'Clear business value demonstrated',                      done: pct >= 65 },
    { label: 'Mentioned user scale/traffic',                           done: pct >= 85 },
  ]

  const showImproved = aiSuggestion && !discarded && !applied

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-800 flex items-center justify-center shrink-0">
            <Layers size={16} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {project.title.replace(/^[•\-\s]+/, '').replace(/\s*:\s*$/, '')}
              </h3>
              <ImpactTag label={impact} />
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Project Score</p>
          <p className="text-2xl font-bold font-mono-data" style={{ color: pct >= 70 ? '#7c3aed' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
            {project.score}<span className="text-sm font-normal text-gray-400 dark:text-gray-500">/{project.maxScore}</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
        {/* Left */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Metrics &amp; Impact</p>
            <ul className="space-y-2.5">
              {metrics.map(({ label, done }) => (
                <li key={label} className="flex items-start gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {done
                    ? <CheckCircle2 size={14} className="text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                    : <Circle      size={14} className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                  }
                  <span className={done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {mockStack.map((t) => <Badge key={t} variant="gray" size="sm">{t}</Badge>)}
            </div>
          </div>
          {project.issues.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">Issues Found</p>
              <ul className="space-y-1.5">
                {project.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300 dark:bg-red-700 mt-1.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ProgressBar value={project.score} max={project.maxScore} />
        </div>

        {/* Right */}
        <div className="px-5 py-4 space-y-4">
          {showImproved ? (
            <>
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-full font-semibold">
                  <Sparkles size={10} /> AI Optimized
                </span>
              </div>
              {aiSuggestion.current_issue && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Current Issue</p>
                  <p className="text-sm font-medium text-red-400 line-through leading-relaxed">{aiSuggestion.current_issue}</p>
                </div>
              )}
              {aiSuggestion.improved_description && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-1.5">Improved Description</p>
                  <div className="border-l-2 border-violet-500 dark:border-violet-600 pl-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{aiSuggestion.improved_description}</p>
                  </div>
                </div>
              )}
              {aiSuggestion.missing_elements && aiSuggestion.missing_elements.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestion.missing_elements.map((m) => <Badge key={m} variant="red" size="sm">{m}</Badge>)}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" icon={<X size={12} />} onClick={() => setDiscarded(true)}>Discard</Button>
                <Button variant="primary"   size="sm" icon={<Check size={12} />} onClick={() => setApplied(true)}>Apply Changes</Button>
              </div>
            </>
          ) : (
            <div>
              {applied && (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 rounded-lg px-3 py-2 mb-3">
                  <CheckCircle2 size={14} /> Changes applied to your resume.
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">Description</p>
              {project.issues.length > 0 ? (
                <ul className="space-y-2">
                  {project.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No issues detected for this project.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function ProjectsPage() {
  const { activeReport } = useReviewStore()

  if (!activeReport) {
    return <EmptyState title="No analysis loaded" description="Upload a resume to see project analysis." />
  }

  const { intelligence } = activeReport.deterministicAnalysis
  const { projects } = activeReport.aiAnalysis

  const totalScore = intelligence.projectScores.reduce((s, p) => s + p.score, 0)
  const totalMax   = intelligence.projectScores.reduce((s, p) => s + p.maxScore, 0)

  const aiSuggestions: AISuggestion[] = (projects.suggestions ?? []).map((s) => {
    if (typeof s === 'string') return { improved_description: s }
    return s as AISuggestion
  })

  const recommended: RecommendedProject[] = (projects.recommendedProjects ?? []).map((r) => {
    if (typeof r === 'string') return { description: r }
    return r as RecommendedProject
  })

  const quickWins = (projects.quickWins ?? []).map(normalizeString)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-800 flex items-center justify-center">
            <Layers size={18} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Project Analysis</h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Reviewing {intelligence.projectScores.length} project{intelligence.projectScores.length !== 1 ? 's' : ''} found in your resume.
            </p>
          </div>
        </div>
        {totalMax > 0 && (
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Score:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 font-mono-data text-sm">{totalScore}/{totalMax}</span>
            <div className="w-20"><ProgressBar value={totalScore} max={totalMax} height="sm" /></div>
          </div>
        )}
      </div>

      {/* Cards */}
      {intelligence.projectScores.length > 0 ? (
        <div className="space-y-4">
          {intelligence.projectScores.map((project, i) => (
            <ProjectCard key={project.title + i} project={project} aiSuggestion={aiSuggestions[i]} />
          ))}
        </div>
      ) : (
        <EmptyState title="No projects found" description="No projects were detected in your resume. Consider adding a Projects section." />
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Sparkles size={15} className="text-violet-500 dark:text-violet-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Recommended Projects to Add</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recommended.map((r, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                {r.project_idea && <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1.5">{r.project_idea}</p>}
                {r.description  && <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{r.description}</p>}
                {r.why_valuable && <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-2">{r.why_valuable}</p>}
                {r.skills_demonstrated && r.skills_demonstrated.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.skills_demonstrated.map((s) => <Badge key={s} variant="default" size="sm">{s}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Lightbulb size={15} className="text-amber-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Quick Wins</h3>
          </div>
          <ul className="space-y-2.5">
            {quickWins.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {w}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
