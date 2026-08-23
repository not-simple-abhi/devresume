import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Building2, Upload, X, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { useCompanyList, useAnalyzeBatch } from '@/hooks/useCompany'
import { SUPPORTED_COMPANIES, MAX_COMPANY_SELECT } from '@/lib/constants'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { CompanyAnalysis } from '@/types/company.types'

function CompanyCard({ result, rank }: { result: CompanyAnalysis; rank: number }) {
  const score = result.readiness_score ?? 0
  const isBest = rank === 0

  const scoreColor =
    score >= 70 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'
  const barColor  =
    score >= 70 ? '#10b981'          : score >= 50 ? '#f59e0b'          : '#ef4444'

  return (
    <Card
      hover
      className={cn(
        'relative',
        isBest && 'border-violet-300 ring-1 ring-violet-200'
      )}
    >
      {isBest && (
        <div className="absolute top-3 right-3">
          <Badge variant="violet" size="sm">Best Match</Badge>
        </div>
      )}

      {/* Company icon + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Building2 size={18} className="text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{result.company}</p>
          <p className="text-[10px] text-gray-400">#{rank + 1} match</p>
        </div>
      </div>

      {/* Readiness score */}
      <div className="flex items-end justify-between mb-2">
        <span className="text-xs text-gray-500">Readiness Score</span>
        <span className={cn('text-2xl font-bold font-mono-data', scoreColor)}>
          {score}
          <span className="text-sm font-normal text-gray-400">%</span>
        </span>
      </div>
      <ProgressBar value={score} color={barColor} className="mb-4" />

      {/* Fit summary */}
      {result.fit_summary && (
        <p className="text-xs text-gray-600 leading-relaxed mb-3">{result.fit_summary}</p>
      )}

      {/* Matching skills */}
      {result.matching_skills && result.matching_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Matching Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matching_skills.slice(0, 5).map((s) => (
              <Badge key={s} variant="green" size="sm">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {result.missing_skills && result.missing_skills.length > 0 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.missing_skills.slice(0, 4).map((s) => (
              <Badge key={s} variant="red" size="sm">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function CompanyPage() {
  const { data: serverCompanies } = useCompanyList()
  const companies = serverCompanies ?? SUPPORTED_COMPANIES
  const analyzeMutation = useAnalyzeBatch()

  const [file, setFile]       = useState<File | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError]     = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setError('') }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => setError('File must be PDF or DOCX and under 5 MB.'),
  })

  const toggleCompany = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : prev.length < MAX_COMPANY_SELECT
        ? [...prev, name]
        : prev
    )
  }

  const handleAnalyze = () => {
    if (!file || selected.length === 0) return
    setError('')
    analyzeMutation.mutate({ file, companies: selected })
  }

  const results = analyzeMutation.data?.results ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
          <Building2 size={18} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Company Fit Analysis</h1>
          <p className="text-xs text-gray-500">
            See how your resume matches top tech companies — no account needed.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* ── Left panel: upload + company picker ── */}
        <div className="space-y-4">
          {/* Dropzone */}
          <Card padding="none">
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-xl m-4 p-8 text-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-violet-400 bg-violet-50'
                  : file
                  ? 'border-violet-300 bg-violet-50/40'
                  : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
              )}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 size={22} className="text-violet-500" />
                  <p className="text-sm font-medium text-gray-700 truncate max-w-full">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={22} className="text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">
                    {isDragActive ? 'Drop it here' : 'Drop resume or click to browse'}
                  </p>
                  <p className="text-xs text-gray-400">PDF · DOCX · Max 5 MB</p>
                </div>
              )}
            </div>
            {file && (
              <button
                onClick={() => setFile(null)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors pb-3"
              >
                <X size={12} /> Remove file
              </button>
            )}
          </Card>

          {/* Company selector */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Select Companies</h3>
              <span className="text-xs text-gray-400">{selected.length}/{MAX_COMPANY_SELECT}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {companies.map((c) => {
                const isSelected = selected.includes(c)
                const isDisabled = !isSelected && selected.length >= MAX_COMPANY_SELECT
                return (
                  <button
                    key={c}
                    onClick={() => toggleCompany(c)}
                    disabled={isDisabled}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-600'
                        : isDisabled
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'
                    )}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
            {selected.length >= MAX_COMPANY_SELECT && (
              <p className="text-[10px] text-amber-600 mt-2">Maximum {MAX_COMPANY_SELECT} companies per analysis.</p>
            )}
          </Card>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            fullWidth
            loading={analyzeMutation.isPending}
            disabled={!file || selected.length === 0}
            icon={<Sparkles size={14} />}
            onClick={handleAnalyze}
          >
            Analyze Fit
          </Button>
        </div>

        {/* ── Right panel: results ── */}
        <div>
          {analyzeMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
              <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Analyzing your resume against {selected.length} compan{selected.length === 1 ? 'y' : 'ies'}…</p>
            </div>
          )}

          {analyzeMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 text-center">
              Analysis failed. Please try again.
            </div>
          )}

          {!analyzeMutation.isPending && results.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-violet-500" />
                <p className="text-sm font-semibold text-gray-700">
                  Results for {results.length} compan{results.length === 1 ? 'y' : 'ies'}, sorted by readiness
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {results.map((r, i) => (
                  <CompanyCard key={r.company} result={r} rank={i} />
                ))}
              </div>
            </div>
          )}

          {!analyzeMutation.isPending && results.length === 0 && !analyzeMutation.isError && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Building2 size={40} className="text-gray-200 mb-4" />
              <p className="text-sm font-medium text-gray-500">Select companies and upload your resume</p>
              <p className="text-xs text-gray-400 mt-1">Results will appear here after analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
