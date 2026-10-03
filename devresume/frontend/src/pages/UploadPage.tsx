import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { Upload, File, FileText, X, CheckCircle2, Loader2, Sparkles, CloudUpload, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useReviewStore } from '@/store/review.store'
import { useAnalyzeGuest, useAnalyzeAndSave } from '@/hooks/useReview'
import Button from '@/components/ui/Button'
import { cn, formatFileSize } from '@/lib/utils'

const ANALYSIS_STEPS = [
  { label: 'Parsing structure',     desc: 'Extracting sections, dates, and metadata' },
  { label: 'Running ATS analysis',  desc: 'Checking keyword density and parse-ability' },
  { label: 'Recruiter perspective', desc: 'Evaluating impact and narrative clarity' },
  { label: 'Grammar & clarity',     desc: 'Reviewing tone, voice, and grammar' },
  { label: 'Skills gap analysis',   desc: 'Benchmarking against target role requirements' },
  { label: 'Project review',        desc: 'Assessing technical depth and metrics' },
]

function AnalysisProgress({ step }: { step: number }) {
  const isComplete = step >= ANALYSIS_STEPS.length
  const progress = Math.round((step / ANALYSIS_STEPS.length) * 100)

  if (isComplete) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center animate-bounce-in">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">Analysis Complete!</p>
          <p className="text-xs text-gray-400 mt-1">Redirecting to your report…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-violet-500" />
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Analyzing your resume…</p>
        </div>
        <span className="text-xs font-bold font-mono-data text-violet-600 dark:text-violet-400">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {ANALYSIS_STEPS.map((s, i) => {
          const done    = i < step
          const active  = i === step - 1 && !isComplete
          const pending = i >= step
          return (
            <div key={s.label}
              className={cn(
                'flex items-start gap-3 rounded-xl px-3 py-2 transition-all duration-300',
                done    ? 'bg-emerald-50 dark:bg-emerald-950/40' : '',
                active  ? 'bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200 dark:ring-violet-800' : '',
                pending ? 'opacity-35' : ''
              )}>
              <div className="shrink-0 mt-0.5">
                {done ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : active ? (
                  <Loader2 size={15} className="text-violet-500 animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                )}
              </div>
              <div className="min-w-0">
                <p className={cn('text-xs font-semibold leading-tight',
                  done    ? 'text-emerald-700 dark:text-emerald-400' :
                  active  ? 'text-violet-700 dark:text-violet-300' :
                            'text-gray-400 dark:text-gray-600'
                )}>{s.label}</p>
                {(done || active) && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{s.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UploadPage() {
  const { isAuthenticated } = useAuthStore()
  const { setActiveReport } = useReviewStore()
  const navigate = useNavigate()

  const [file, setFile]                   = useState<File | null>(null)
  const [analysisStep, setAnalysisStep]   = useState(0)
  const [isAnalyzing, setIsAnalyzing]     = useState(false)
  const [error, setError]                 = useState('')

  const guestMutation = useAnalyzeGuest()
  const saveMutation  = useAnalyzeAndSave()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setError('') }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
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

  const handleAnalyze = async () => {
    if (!file) return
    setError('')
    setIsAnalyzing(true)
    const interval = setInterval(() => {
      setAnalysisStep((s) => (s < ANALYSIS_STEPS.length - 1 ? s + 1 : s))
    }, 900)
    try {
      const report = isAuthenticated
        ? await saveMutation.mutateAsync(file)
        : await guestMutation.mutateAsync(file)
      clearInterval(interval)
      setAnalysisStep(ANALYSIS_STEPS.length)
      await new Promise((r) => setTimeout(r, 500))
      setActiveReport(report, file.name)
      navigate('/analysis')
    } catch (e: unknown) {
      clearInterval(interval)
      setIsAnalyzing(false)
      setAnalysisStep(0)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Analysis failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] page-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-page-in">

        {/* Header */}
        {!isAnalyzing && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/80 border border-violet-200 dark:border-violet-800 rounded-full px-3.5 py-1.5 mb-5 backdrop-blur-sm">
              <Sparkles size={11} />
              AI-Powered Resume Analysis
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {isAuthenticated ? 'Analyze your resume' : 'Try it free'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAuthenticated
                ? 'Drop your resume and get a comprehensive AI report in seconds.'
                : 'No account needed. Upload and get instant AI feedback.'}
            </p>
          </div>
        )}

        {/* Card */}
        <div className={cn(
          'rounded-2xl shadow-[var(--shadow-card)] p-6',
          isAnalyzing
            ? 'animate-dashed-border bg-white dark:bg-[var(--bg-surface)]'
            : 'bg-white dark:bg-[var(--bg-surface)] border border-gray-100 dark:border-[var(--border)]'
        )}>
          {isAnalyzing ? (
            <AnalysisProgress step={analysisStep} />
          ) : (
            <>
              {/* Dropzone */}
              <div {...getRootProps()}
                className={cn(
                  'rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 select-none',
                  isDragReject
                    ? 'border-2 border-dashed border-red-400 bg-red-50 dark:bg-red-950/30'
                    : isDragActive
                    ? 'animate-dashed-border bg-violet-50 dark:bg-violet-950/40 scale-[1.01]'
                    : file
                    ? 'border-2 border-dashed border-violet-400 dark:border-violet-600 bg-violet-50/50 dark:bg-violet-950/20'
                    : 'border-2 border-dashed border-violet-200 dark:border-violet-800/60 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:scale-[1.005]'
                )}>
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-950 dark:to-violet-900 border border-violet-200 dark:border-violet-800 flex items-center justify-center animate-bounce-in">
                      {file.type === 'application/pdf'
                        ? <FileText size={24} className="text-violet-600 dark:text-violet-400" />
                        : <File size={24} className="text-violet-600 dark:text-violet-400" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{file.name}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-mono">{formatFileSize(file.size)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center transition-all', isDragActive ? 'bg-violet-100 dark:bg-violet-900 scale-110' : 'bg-gray-100 dark:bg-gray-800')}>
                      <CloudUpload size={26} className={isDragActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {isDragActive ? 'Drop it right here!' : 'Drop your resume or click to browse'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">PDF · DOCX · DOC · Max 5 MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear file */}
              {file && (
                <button onClick={() => setFile(null)}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors py-1">
                  <X size={12} /> Remove file
                </button>
              )}

              {/* Error */}
              {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl px-3 py-2">
                  <X size={12} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Auth note */}
              <div className={cn(
                'mt-4 text-xs text-center rounded-xl px-3 py-2.5 flex items-center justify-center gap-1.5',
                isAuthenticated
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900'
                  : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'
              )}>
                {isAuthenticated ? (
                  <><CheckCircle2 size={12} /> Your result will be saved to your dashboard</>
                ) : (
                  <>
                    Analyzing as guest — results won't be saved.{' '}
                    <a href="/signup" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">Sign up to save.</a>
                  </>
                )}
              </div>

              <Button fullWidth size="lg" className="mt-4" disabled={!file} icon={<Sparkles size={14} />} onClick={handleAnalyze}>
                Analyze Resume
              </Button>
            </>
          )}
        </div>

        {/* Trust badges below card */}
        {!isAnalyzing && (
          <div className="flex items-center justify-center gap-6 mt-6">
            {['SOC2 Type II', 'No Data Storage', 'Free Forever'].map(t => (
              <span key={t} className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                <CheckCircle2 size={10} className="text-emerald-400 shrink-0" /> {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
