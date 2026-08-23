import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { Upload, File, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useReviewStore } from '@/store/review.store'
import { useAnalyzeGuest, useAnalyzeAndSave } from '@/hooks/useReview'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const ANALYSIS_STEPS = [
  'Parsing resume',
  'Running ATS analysis',
  'Recruiter perspective',
  'Grammar check',
  'Skills gap analysis',
  'Project review',
]

function AnalysisProgress({ step }: { step: number }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700">Analyzing your resume…</p>
        <span className="text-xs text-gray-400">{step}/{ANALYSIS_STEPS.length}</span>
      </div>

      {/* Top progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${(step / ANALYSIS_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Steps list */}
      <div className="space-y-3">
        {ANALYSIS_STEPS.map((s, i) => {
          const done    = i < step
          const active  = i === step - 1 && step < ANALYSIS_STEPS.length
          const pending = i >= step

          return (
            <div
              key={s}
              className={cn(
                'flex items-center gap-3 text-sm transition-opacity',
                pending ? 'opacity-40' : 'opacity-100'
              )}
            >
              {done ? (
                <CheckCircle2 size={16} className="text-violet-600 shrink-0" />
              ) : active ? (
                <Loader2 size={16} className="text-violet-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
              )}
              <span className={cn(
                done   ? 'text-gray-700 font-medium' :
                active ? 'text-violet-600 font-medium' :
                         'text-gray-400'
              )}>
                {s}
              </span>
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

  const [file, setFile] = useState<File | null>(null)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const guestMutation = useAnalyzeGuest()
  const saveMutation  = useAnalyzeAndSave()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setError('')
    }
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

  const handleAnalyze = async () => {
    if (!file) return
    setError('')
    setIsAnalyzing(true)

    // Simulate step progress while API runs
    const interval = setInterval(() => {
      setAnalysisStep((s) => (s < ANALYSIS_STEPS.length - 1 ? s + 1 : s))
    }, 900)

    try {
      let report
      if (isAuthenticated) {
        report = await saveMutation.mutateAsync(file)
      } else {
        report = await guestMutation.mutateAsync(file)
      }

      clearInterval(interval)
      setAnalysisStep(ANALYSIS_STEPS.length)

      // Small pause so last step shows green
      await new Promise((r) => setTimeout(r, 400))

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
      <div className="w-full max-w-lg">
        {/* Header */}
        {!isAnalyzing && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 mb-4">
              <Sparkles size={11} />
              AI-Powered Resume Analysis
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isAuthenticated ? 'Analyze your resume' : 'Try it free — no account needed'}
            </h1>
            <p className="text-sm text-gray-500">
              {isAuthenticated
                ? 'Upload your resume and get a full AI-powered report in seconds.'
                : "Upload your resume and get instant feedback. Sign up to save results."}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {isAnalyzing ? (
            <AnalysisProgress step={analysisStep} />
          ) : (
            <>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
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
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <File size={22} className="text-violet-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Upload size={22} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {isDragActive ? 'Drop it here' : 'Drop your resume here or click to browse'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF · DOCX · DOC · Max 5 MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear file */}
              {file && (
                <button
                  onClick={() => setFile(null)}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors py-1"
                >
                  <X size={12} /> Remove file
                </button>
              )}

              {/* Error */}
              {error && (
                <p className="mt-3 text-xs text-center text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Auth note */}
              <div className={cn(
                'mt-4 text-xs text-center rounded-lg px-3 py-2',
                isAuthenticated
                  ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                  : 'text-gray-500 bg-gray-50 border border-gray-100'
              )}>
                {isAuthenticated ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={12} />
                    Your result will be saved to your dashboard
                  </span>
                ) : (
                  <>
                    Analyzing as guest — results won't be saved.{' '}
                    <a href="/signup" className="text-violet-600 font-medium hover:underline">
                      Sign up to save.
                    </a>
                  </>
                )}
              </div>

              {/* CTA */}
              <Button
                fullWidth
                size="lg"
                className="mt-4"
                disabled={!file}
                icon={<Sparkles size={14} />}
                onClick={handleAnalyze}
              >
                Analyze Resume
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
