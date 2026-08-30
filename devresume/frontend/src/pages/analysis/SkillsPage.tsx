import { Lightbulb, Target, Rocket, Flag } from 'lucide-react'
import { useReviewStore } from '@/store/review.store'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'

function normalizeMissingSkill(s: unknown): { skill: string; reason?: string; priority?: string } {
  if (typeof s === 'string') return { skill: s }
  if (typeof s === 'object' && s !== null && 'skill' in s)
    return s as { skill: string; reason?: string; priority?: string }
  return { skill: String(s) }
}

function normalizeString(s: unknown): string {
  if (typeof s === 'string') return s
  if (typeof s === 'object' && s !== null) {
    const obj = s as Record<string, unknown>
    return String(obj.skill ?? obj.step ?? obj.goal ?? obj.text ?? JSON.stringify(s))
  }
  return String(s)
}

export default function SkillsPage() {
  const { activeReport } = useReviewStore()

  if (!activeReport) {
    return <EmptyState title="No analysis loaded" description="Upload a resume to see skills analysis." />
  }

  const { skills } = activeReport.aiAnalysis
  const { skillCategories } = activeReport.deterministicAnalysis.intelligence

  const missingSkills   = (skills.missingSkills   ?? []).map(normalizeMissingSkill)
  const quickWins       = (skills.quickWins       ?? []).map(normalizeString)
  const learningRoadmap = (skills.learningRoadmap ?? []).map(normalizeString)
  const longTermGoals   = (skills.longTermGoals   ?? []).map(normalizeString)

  const priorityColor: Record<string, string> = {
    high:   'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-400',
    medium: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400',
    low:    'text-gray-500 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Skills Analysis</h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Identified {activeReport.deterministicAnalysis.intelligence.totalSkills} skills across your resume.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Missing Skills */}
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Target size={15} className="text-red-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Missing Skills</h3>
            <Badge variant="red" size="sm">{missingSkills.length}</Badge>
          </div>
          {missingSkills.length > 0 ? (
            <div className="space-y-3.5">
              {missingSkills.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${priorityColor[s.priority ?? 'medium']}`}>
                    {(s.priority ?? 'medium').toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{s.skill}</span>
                    {s.reason && (
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{s.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 py-4 text-center">No critical skills missing!</p>
          )}
        </Card>

        {/* Quick Wins */}
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Lightbulb size={15} className="text-amber-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Quick Wins</h3>
          </div>
          {quickWins.length > 0 ? (
            <ul className="space-y-3">
              {quickWins.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 py-4 text-center">No quick wins identified.</p>
          )}
        </Card>

        {/* Learning Roadmap */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Rocket size={15} className="text-violet-500 dark:text-violet-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Learning Roadmap</h3>
          </div>
          {learningRoadmap.length > 0 ? (
            <ol className="space-y-3.5">
              {learningRoadmap.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-violet-600 dark:bg-violet-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    {i < learningRoadmap.length - 1 && <div className="w-px h-4 bg-violet-100 dark:bg-violet-900" />}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 py-4 text-center">No roadmap generated.</p>
          )}
        </Card>

        {/* Long-term Goals */}
        {longTermGoals.length > 0 && (
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Flag size={15} className="text-blue-400" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Long-Term Goals</h3>
            </div>
            <ul className="space-y-3">
              {longTermGoals.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Skill Categories */}
        {Object.keys(skillCategories).length > 0 && (
          <Card className="lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              Skill Categories
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(skillCategories).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5 capitalize">
                    {cat.replace(/_/g, ' ')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(items as string[]).map((skill) => (
                      <Badge key={skill} variant="gray" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
